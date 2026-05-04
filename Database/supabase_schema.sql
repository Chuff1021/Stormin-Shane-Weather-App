-- Stormin' Shane Creator Mode starter schema

create table if not exists shane_videos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  description text,
  storage_path text not null,
  thumbnail_path text,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  event_type text,
  latitude double precision,
  longitude double precision,
  location_label text,
  recorded_conditions jsonb,
  radar_snapshot_path text,
  published_at timestamptz,
  scheduled_for timestamptz
);

create table if not exists video_analytics_daily (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references shane_videos(id) on delete cascade,
  day date not null,
  region text,
  views integer not null default 0,
  watch_seconds integer not null default 0,
  unique (video_id, day, region)
);
