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
  centro_costo    text,
  evidencia_n     int not null,                      -- veces que este patrón aparece
  total_n         int not null,                      -- veces que el grupo (tercero+tipo+rol) aparece
  confianza       numeric(5,4) not null,             -- 0..1
  primera_vez     date,
  ultima_vez      date,
  origen          text not null default 'historico', -- historico | manual | auxiliar_csv
  bloqueada       boolean not null default false,    -- true = el contador la fijó; el aprendizaje no la sobreescribe
  actualizada_en  timestamptz not null default now(),
  unique (org_id, tercero_nit, tipo_documento, rol_linea, concepto, cuenta_puc, naturaleza)
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
