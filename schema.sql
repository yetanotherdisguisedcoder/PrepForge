-- Run once against your Postgres database before first deploy:
--   node scripts/init-db.mjs

create table if not exists topic_progress (
  topic_id text primary key,
  status text not null default 'not-started',
  confidence int not null default 0,
  review_count int not null default 0,
  last_reviewed date,
  next_review date,
  quiz_score int,
  checked_items int[] not null default '{}'
);

create table if not exists activity_log (
  day date primary key,
  events int not null default 0
);

create table if not exists notes (
  slug text primary key,
  title text not null default 'Untitled note',
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists interview_logs (
  id serial primary key,
  company text not null,
  role text not null default '',
  round text not null default '',
  interview_date date,
  interview_type text not null default 'technical',
  outcome text not null default 'pending',
  rating int,
  questions text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists designs (
  id serial primary key,
  title text not null default 'Untitled design',
  nodes jsonb not null default '[]',
  edges jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists design_versions (
  id serial primary key,
  design_id int not null references designs(id) on delete cascade,
  label text not null default '',
  nodes jsonb not null,
  edges jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists mock_interview_attempts (
  id serial primary key,
  topic_id text,
  question text not null,
  transcript text not null default '',
  duration_seconds int not null default 0,
  score int not null default 0,
  matched_concepts text[] not null default '{}',
  missing_concepts text[] not null default '{}',
  created_at timestamptz not null default now()
);
