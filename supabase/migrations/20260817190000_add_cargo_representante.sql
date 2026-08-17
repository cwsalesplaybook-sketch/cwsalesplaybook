-- Frente dentro do papel Representante: "Aquisição de Canal" ou "PSM" — cada
-- uma acompanha funis diferentes do Pipedrive na Meta do Mês (ver
-- api/reps-metas.js). Escolhida no onboarding quando papel = Representante.
alter table public.sdr_profiles add column if not exists cargo_representante text;
comment on column public.sdr_profiles.cargo_representante is 'Frente dentro do papel Representante: "Aquisição de Canal" ou "PSM" — define quais funis do Pipedrive alimentam a Meta do Mês de cada pessoa.';
