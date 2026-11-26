-- =====================================================================
-- ERP Contable + Piloto Automático sobre Siigo Nube  ·  schema.sql
-- Ejecutar completo en Supabase > SQL Editor (es idempotente en lo posible).
-- Modelo multi-empresa: un usuario puede pertenecer a varias organizaciones
-- (clientes del despacho contable) con un rol distinto en cada una.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- Tipos ----------
do $$ begin
  create type rol_usuario as enum ('admin', 'contador', 'auxiliar');
exception when duplicate_object then null; end $$;

-- ---------- Organizaciones (empresas cliente) ----------
create table if not exists organizaciones (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  nit         text,                       -- sin DV, solo dígitos
  creada_en   timestamptz not null default now()
);

-- ---------- Perfiles (1:1 con auth.users) ----------
create table if not exists perfiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombre      text,
  email       text,
  creado_en   timestamptz not null default now()
);

-- ---------- Membresías y roles por organización ----------
create table if not exists miembros (
  org_id      uuid not null references organizaciones(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  rol         rol_usuario not null default 'auxiliar',
  creado_en   timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index if not exists miembros_user_idx on miembros(user_id);

-- ---------- Funciones de autorización (usadas por RLS) ----------
create or replace function es_miembro(p_org uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from miembros m where m.org_id = p_org and m.user_id = auth.uid());
$$;

create or replace function tiene_rol(p_org uuid, p_roles rol_usuario[]) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from miembros m
                 where m.org_id = p_org and m.user_id = auth.uid() and m.rol = any(p_roles));
$$;

-- Crea perfil automáticamente al registrarse un usuario
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into perfiles (id, email, nombre)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'nombre', new.email))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- Quien crea una organización queda como admin
create or replace function crear_organizacion(p_nombre text, p_nit text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'No autenticado'; end if;
  insert into organizaciones (nombre, nit) values (p_nombre, p_nit) returning id into v_id;
  insert into miembros (org_id, user_id, rol) values (v_id, auth.uid(), 'admin');
  return v_id;
end $$;

-- ---------- Credenciales Siigo (cifradas desde la app con AES-256-GCM) ----------
create table if not exists siigo_credenciales (
  org_id            uuid primary key references organizaciones(id) on delete cascade,
  base_url          text not null default 'https://api.siigo.com',
  username_cifrado  text not null,
  access_key_cifrada text not null,
  partner_id        text not null,
  ultima_prueba_ok  timestamptz,
  actualizado_en    timestamptz not null default now()
);

-- ---------- Auditoría (solo inserción; nadie edita ni borra) ----------
create table if not exists auditoria_log (
  id          bigint generated always as identity primary key,
  org_id      uuid references organizaciones(id) on delete set null,
  user_id     uuid,
  accion      text not null,              -- p.ej. 'siigo.probar', 'entrenamiento.iniciar'
  entidad     text,
  entidad_id  text,
  detalle     jsonb not null default '{}',
  ip          text,
  creado_en   timestamptz not null default now()
);
create index if not exists auditoria_org_fecha_idx on auditoria_log(org_id, creado_en desc);

-- =====================================================================
-- ESPEJO DE MAESTROS DE SIIGO (se sincronizan desde la API)
-- Cada tabla guarda también el JSON crudo para no perder campos.
-- =====================================================================
create table if not exists siigo_puc (               -- plan de cuentas
  org_id uuid not null references organizaciones(id) on delete cascade,
  codigo text not null,
  nombre text,
  naturaleza text,                                   -- 'D' | 'C'
  activa boolean default true,
  crudo jsonb,
  sincronizado_en timestamptz not null default now(),
  primary key (org_id, codigo)
);

create table if not exists siigo_terceros (
  org_id uuid not null references organizaciones(id) on delete cascade,
  siigo_id text not null,
  nit text,                                          -- identificación sin DV
  dv text,
  nombre text,
  tipo text,                                         -- Customer | Supplier | Other
  ciudad text,
  email text,
  responsabilidades jsonb,
  crudo jsonb,
  sincronizado_en timestamptz not null default now(),
  primary key (org_id, siigo_id)
);
create index if not exists siigo_terceros_nit_idx on siigo_terceros(org_id, nit);

create table if not exists siigo_productos (
  org_id uuid not null references organizaciones(id) on delete cascade,
  siigo_id text not null,
  codigo text,
  nombre text,
  grupo_cuentas text,
  crudo jsonb,
  sincronizado_en timestamptz not null default now(),
  primary key (org_id, siigo_id)
);

create table if not exists siigo_impuestos (          -- IVA, retenciones, ICA, etc.
  org_id uuid not null references organizaciones(id) on delete cascade,
  siigo_id text not null,
  nombre text,
  tipo text,                                         -- IVA | Retefuente | ReteICA | ReteIVA | Impoconsumo ...
  porcentaje numeric(9,4),
  activo boolean default true,
  crudo jsonb,
  sincronizado_en timestamptz not null default now(),
  primary key (org_id, siigo_id)
);

create table if not exists siigo_centros_costo (
  org_id uuid not null references organizaciones(id) on delete cascade,
  siigo_id text not null,
  codigo text,
  nombre text,
  activo boolean default true,
  crudo jsonb,
  sincronizado_en timestamptz not null default now(),
  primary key (org_id, siigo_id)
);

create table if not exists siigo_tipos_comprobante (
  org_id uuid not null references organizaciones(id) on delete cascade,
  siigo_id text not null,
  codigo text,
  nombre text,
  tipo text,                                         -- FV, FC, CC, RC, RP, NC, DS ...
  consecutivo_automatico boolean,
  crudo jsonb,
  sincronizado_en timestamptz not null default now(),
  primary key (org_id, siigo_id)
);

-- ---------- Histórico de documentos descargados (base del aprendizaje) ----------
create table if not exists siigo_documentos (
  org_id uuid not null references organizaciones(id) on delete cascade,
  tipo text not null,                                -- compra | venta | documento_soporte | comprobante | recibo_caja | recibo_pago | nota_credito
  siigo_id text not null,
  nombre text,                                       -- p.ej. FC-1-123
  fecha date,
  tercero_nit text,
  total numeric(18,2),
  crudo jsonb not null,
  descargado_en timestamptz not null default now(),
  primary key (org_id, tipo, siigo_id)
);
create index if not exists siigo_documentos_tercero_idx on siigo_documentos(org_id, tercero_nit);
create index if not exists siigo_documentos_fecha_idx on siigo_documentos(org_id, fecha);

-- Cursor de sincronización reanudable (evita cortes de tiempo en serverless)
create table if not exists sync_estado (
  org_id uuid not null references organizaciones(id) on delete cascade,
  recurso text not null,                             -- 'compra', 'venta', 'terceros', ...
  pagina_siguiente int not null default 1,
  desde date,                                        -- ventana histórica solicitada
  completado boolean not null default false,
  total_descargado int not null default 0,
  actualizado_en timestamptz not null default now(),
  error text,
  primary key (org_id, recurso)
);

-- =====================================================================
-- MEMORIA CONTABLE
-- Una regla = "para este tercero, en este tipo de documento, la línea de
-- rol X se ha contabilizado en la cuenta Y con tarifa Z".
-- =====================================================================
create table if not exists reglas_contables (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references organizaciones(id) on delete cascade,
  tercero_nit     text not null,
  tipo_documento  text not null,                     -- compra | venta | documento_soporte | comprobante ...
  rol_linea       text not null,                     -- gasto_costo | ingreso | iva | retefuente | reteica | reteiva | contrapartida_cxp | contrapartida_cxc | banco_caja | otro
  concepto        text not null default '',          -- descripción normalizada (puede ir vacía = regla general del tercero)
  cuenta_puc      text not null,
  naturaleza      text not null check (naturaleza in ('D','C')),
  tarifa          numeric(9,4),                      -- % observado (IVA/retención) cuando aplica
  impuesto_id     text not null default '',          -- ID del impuesto en Siigo (hay varios IVA 19 % distintos)
  centro_costo    text,
  evidencia_n     int not null,                      -- veces que este patrón aparece
  total_n         int not null,                      -- veces que el grupo (tercero+tipo+rol) aparece
  confianza       numeric(5,4) not null,             -- 0..1
  primera_vez     date,
  ultima_vez      date,
  origen          text not null default 'historico', -- historico | manual | auxiliar_csv
  bloqueada       boolean not null default false,    -- true = el contador la fijó; el aprendizaje no la sobreescribe
  actualizada_en  timestamptz not null default now(),
  constraint reglas_unicas unique (org_id, tercero_nit, tipo_documento, rol_linea, concepto, cuenta_puc, naturaleza, impuesto_id)
);
create index if not exists reglas_busqueda_idx on reglas_contables(org_id, tercero_nit, tipo_documento);

create table if not exists entrenamiento_corridas (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references organizaciones(id) on delete cascade,
  iniciado_por  uuid,
  iniciada_en   timestamptz not null default now(),
  finalizada_en timestamptz,
  documentos_leidos int not null default 0,
  lineas_analizadas int not null default 0,
  reglas_generadas  int not null default 0,
  estado        text not null default 'en_curso',    -- en_curso | completada | error
  detalle       jsonb not null default '{}'
);

-- =====================================================================
-- RLS
-- =====================================================================
alter table organizaciones          enable row level security;
alter table perfiles                enable row level security;
alter table miembros                enable row level security;
alter table siigo_credenciales      enable row level security;
alter table auditoria_log           enable row level security;
alter table siigo_puc               enable row level security;
alter table siigo_terceros          enable row level security;
alter table siigo_productos         enable row level security;
alter table siigo_impuestos         enable row level security;
alter table siigo_centros_costo     enable row level security;
alter table siigo_tipos_comprobante enable row level security;
alter table siigo_documentos        enable row level security;
alter table sync_estado             enable row level security;
alter table reglas_contables        enable row level security;
alter table entrenamiento_corridas  enable row level security;

-- Organizaciones / perfiles / miembros
drop policy if exists org_select on organizaciones;
create policy org_select on organizaciones for select using (es_miembro(id));
drop policy if exists org_update on organizaciones;
create policy org_update on organizaciones for update using (tiene_rol(id, array['admin']::rol_usuario[]));

drop policy if exists perfil_select on perfiles;
create policy perfil_select on perfiles for select using (
  id = auth.uid() or exists (select 1 from miembros a join miembros b on a.org_id = b.org_id
                              where a.user_id = auth.uid() and b.user_id = perfiles.id));
drop policy if exists perfil_update on perfiles;
create policy perfil_update on perfiles for update using (id = auth.uid());

drop policy if exists miembros_select on miembros;
create policy miembros_select on miembros for select using (es_miembro(org_id));
drop policy if exists miembros_admin on miembros;
create policy miembros_admin on miembros for all
  using (tiene_rol(org_id, array['admin']::rol_usuario[]))
  with check (tiene_rol(org_id, array['admin']::rol_usuario[]));

-- Credenciales Siigo: ni siquiera se leen desde el navegador; solo service_role (servidor).
-- (sin políticas = nadie con anon/authenticated puede leerlas)

-- Auditoría: lectura para admin y contador; inserción solo desde servidor (service_role). Sin update/delete.
drop policy if exists audit_select on auditoria_log;
create policy audit_select on auditoria_log for select
  using (tiene_rol(org_id, array['admin','contador']::rol_usuario[]));

-- Maestros, documentos y reglas: lectura para miembros; escritura vía servidor (service_role).
do $$
declare t text;
begin
  foreach t in array array['siigo_puc','siigo_terceros','siigo_productos','siigo_impuestos',
                           'siigo_centros_costo','siigo_tipos_comprobante','siigo_documentos',
                           'sync_estado','entrenamiento_corridas'] loop
    execute format('drop policy if exists %I on %I', t || '_select', t);
    execute format('create policy %I on %I for select using (es_miembro(org_id))', t || '_select', t);
  end loop;
end $$;

drop policy if exists reglas_select on reglas_contables;
create policy reglas_select on reglas_contables for select using (es_miembro(org_id));
-- El contador/admin puede ajustar o bloquear reglas manualmente desde la UI
drop policy if exists reglas_update on reglas_contables;
create policy reglas_update on reglas_contables for update
  using (tiene_rol(org_id, array['admin','contador']::rol_usuario[]));
drop policy if exists reglas_insert on reglas_contables;
create policy reglas_insert on reglas_contables for insert
  with check (tiene_rol(org_id, array['admin','contador']::rol_usuario[]));
drop policy if exists reglas_delete on reglas_contables;
create policy reglas_delete on reglas_contables for delete
  using (tiene_rol(org_id, array['admin','contador']::rol_usuario[]));

-- =====================================================================
-- NÚCLEO 24/7: cola de trabajos, documentos con identidad remota, excepciones, configuración
-- =====================================================================

-- Configuración por empresa (declarativa: nada de NITs ni "if empresa" en el código)
create table if not exists empresa_config (
  org_id uuid primary key references organizaciones(id) on delete cascade,
  piloto_activo boolean not null default false,          -- interruptor de emergencia
  modo text not null default 'sombra' check (modo in ('sombra','real')),
  umbral_confianza numeric(4,3) not null default 0.900,
  min_evidencia int not null default 5,
  ventana_dias_ds int not null default 10,
  cuenta_cxp_defecto text,
  cuenta_banco_defecto text,
  tipo_comprobante_rp int,
  tipo_comprobante_fc int,
  tipo_comprobante_ds int,
  hora_inicio time default '18:00',
  hora_fin time default '07:00',
  actualizado_en timestamptz not null default now()
);

-- Cola de trabajos (Postgres como cola; el worker reclama con SKIP LOCKED)
create table if not exists jobs (
  id bigint generated always as identity primary key,
  org_id uuid references organizaciones(id) on delete cascade,
  tipo text not null,
  payload jsonb not null default '{}',
  estado text not null default 'pendiente' check (estado in ('pendiente','en_curso','ok','error','muerto')),
  intentos int not null default 0,
  max_intentos int not null default 5,
  ejecutar_en timestamptz not null default now(),
  bloqueado_en timestamptz,
  bloqueado_por text,
  ultimo_error text,
  clave_unica text,                                      -- evita encolar dos veces lo mismo
  creado_en timestamptz not null default now(),
  terminado_en timestamptz
);
create unique index if not exists jobs_clave_unica_idx on jobs(clave_unica) where clave_unica is not null and estado in ('pendiente','en_curso');
create index if not exists jobs_cola_idx on jobs(estado, ejecutar_en);

create or replace function reclamar_jobs(p_worker text, p_limite int default 5, p_tipos text[] default null)
returns setof jobs language plpgsql security definer set search_path = public as $$
begin
  return query
  with c as (
    select id from jobs
    where (estado = 'pendiente' and ejecutar_en <= now()
           or estado = 'en_curso' and bloqueado_en < now() - interval '10 minutes')   -- recupera jobs de un worker caído
      and (p_tipos is null or tipo = any(p_tipos))
    order by ejecutar_en
    limit p_limite
    for update skip locked)
  update jobs j set estado = 'en_curso', bloqueado_en = now(), bloqueado_por = p_worker, intentos = j.intentos + 1
  from c where j.id = c.id
  returning j.*;
end $$;

create or replace function terminar_job(p_id bigint, p_ok boolean, p_error text default null, p_reintentar_seg int default 60)
returns void language plpgsql security definer set search_path = public as $$
declare j jobs;
begin
  select * into j from jobs where id = p_id for update;
  if p_ok then
    update jobs set estado = 'ok', terminado_en = now(), bloqueado_en = null, ultimo_error = null where id = p_id;
  elsif j.intentos >= j.max_intentos then
    update jobs set estado = 'muerto', terminado_en = now(), ultimo_error = p_error where id = p_id;
  else
    update jobs set estado = 'pendiente', bloqueado_en = null, ultimo_error = p_error,
      ejecutar_en = now() + make_interval(secs => p_reintentar_seg * power(2, j.intentos - 1)) where id = p_id;
  end if;
end $$;

-- Documentos a causar/enviar (compras, DS, egresos, comprobantes...) con identidad remota inmutable
create table if not exists documentos_causacion (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizaciones(id) on delete cascade,
  tipo text not null,                                    -- compra | documento_soporte | egreso | recibo_caja | comprobante | venta | nomina
  origen text not null,                                  -- carga_manual | drive | onedrive | token_dian | conciliacion
  huella text not null,                                  -- hash del contenido / CUFE / clave natural para evitar duplicados
  tercero_nit text,
  fecha date,
  total numeric(18,2),
  estado text not null default 'borrador'
    check (estado in ('borrador','propuesto','listo','enviando','enviado','verificado','diferencia','excepcion','descartado')),
  confianza numeric(5,4),
  propuesta jsonb not null default '{}',                 -- asiento/payload propuesto
  payload_enviado jsonb,
  respuesta_siigo jsonb,
  siigo_id text,                                         -- identidad remota
  siigo_nombre text,                                     -- p. ej. RP-1-45
  verificacion jsonb,
  error text,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (org_id, tipo, huella)
);
create index if not exists doc_estado_idx on documentos_causacion(org_id, estado);

-- Una vez que existe siigo_id no se puede borrar ni cambiar a "enviar de nuevo" ni borrar la identidad
create or replace function proteger_identidad_remota() returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE' then
    if old.siigo_id is not null then raise exception 'Documento con identidad en Siigo: no se puede eliminar'; end if;
    return old;
  end if;
  if old.siigo_id is not null and (new.siigo_id is distinct from old.siigo_id) then
    raise exception 'La identidad remota de Siigo es inmutable';
  end if;
  if old.siigo_id is not null and new.estado in ('borrador','propuesto','listo','enviando') then
    raise exception 'Un documento ya creado en Siigo no puede volver a envío';
  end if;
  new.actualizado_en = now();
  return new;
end $$;
drop trigger if exists doc_identidad_trg on documentos_causacion;
create trigger doc_identidad_trg before update or delete on documentos_causacion
  for each row execute function proteger_identidad_remota();

-- Bandeja de excepciones: lo que el piloto NO decidió solo
create table if not exists excepciones (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizaciones(id) on delete cascade,
  documento_id uuid references documentos_causacion(id) on delete cascade,
  motivo text not null,                                  -- sin_precedente | baja_confianza | tercero_inexistente | descuadre | duplicado | siigo_error ...
  detalle jsonb not null default '{}',
  opciones jsonb,                                        -- respuestas posibles de 1 clic
  estado text not null default 'abierta' check (estado in ('abierta','resuelta','descartada')),
  resuelta_por uuid,
  resolucion jsonb,
  creada_en timestamptz not null default now(),
  resuelta_en timestamptz
);

-- Latidos del worker (alerta si deja de latir)
create table if not exists worker_latidos (
  worker text primary key,
  ultimo_latido timestamptz not null default now(),
  info jsonb not null default '{}'
);

alter table empresa_config        enable row level security;
alter table jobs                  enable row level security;
alter table documentos_causacion  enable row level security;
alter table excepciones           enable row level security;
alter table worker_latidos        enable row level security;

drop policy if exists empresa_config_select on empresa_config;
create policy empresa_config_select on empresa_config for select using (es_miembro(org_id));
drop policy if exists empresa_config_update on empresa_config;
create policy empresa_config_update on empresa_config for update using (tiene_rol(org_id, array['admin','contador']::rol_usuario[]));
drop policy if exists documentos_select on documentos_causacion;
create policy documentos_select on documentos_causacion for select using (es_miembro(org_id));
drop policy if exists excepciones_select on excepciones;
create policy excepciones_select on excepciones for select using (es_miembro(org_id));
drop policy if exists jobs_select on jobs;
create policy jobs_select on jobs for select using (org_id is not null and es_miembro(org_id));
-- escrituras: solo servidor/worker (service_role)

-- ---------------------------------------------------------------------
-- MIGRACIÓN (solo si ya había ejecutado una versión anterior de este archivo): impuesto_id en reglas
-- ---------------------------------------------------------------------
alter table reglas_contables add column if not exists impuesto_id text not null default '';
do $$ declare c record; begin
  for c in select conname from pg_constraint where conrelid = 'reglas_contables'::regclass and contype = 'u' and conname <> 'reglas_unicas' loop
    execute format('alter table reglas_contables drop constraint %I', c.conname);
  end loop;
  if not exists (select 1 from pg_constraint where conname = 'reglas_unicas') then
    alter table reglas_contables add constraint reglas_unicas unique (org_id, tercero_nit, tipo_documento, rol_linea, concepto, cuenta_puc, naturaleza, impuesto_id);
  end if;
end $$;
