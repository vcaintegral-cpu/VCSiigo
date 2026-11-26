-- Crea la primera empresa y la deja a usted como administrador.
-- Ejecutar en Supabase > SQL Editor DESPUÉS de schema.sql y de crear su usuario en Authentication > Users.
-- Reemplace los tres valores marcados.
with nueva as (
  insert into organizaciones (nombre, nit) values ('REEMPLAZAR nombre de la empresa', 'REEMPLAZAR nit sin dv') returning id
), m as (
  insert into miembros (org_id, user_id, rol)
  select nueva.id, u.id, 'admin' from nueva, auth.users u where u.email = 'REEMPLAZAR su-correo@ejemplo.com'
  returning org_id
)
insert into empresa_config (org_id) select id from nueva;   -- modo 'sombra' y piloto apagado por defecto

select id as org_id, nombre from organizaciones order by creada_en desc limit 1;   -- copie este org_id
