-- =====================================================
-- VidyaSetu — Supabase Database Schema
-- HOW TO USE: Supabase dashboard → SQL Editor → New query
-- → paste this whole file → click Run
-- =====================================================

create table colleges (
  id bigint generated always as identity primary key,
  name text not null,
  district text not null,
  students text,
  verified boolean default false
);

create table students (
  id bigint generated always as identity primary key,
  name text not null,
  college_id bigint references colleges(id),
  email text unique,
  joined_at timestamp default now()
);

create table resources (
  id bigint generated always as identity primary key,
  college_id bigint references colleges(id),
  tag text,
  title text not null,
  sub text,
  file_url text,
  created_at timestamp default now()
);

create table announcements (
  id bigint generated always as identity primary key,
  college_id bigint references colleges(id), -- null = university-wide
  date text,
  title text not null,
  sub text
);

create table scholarship_requests (
  id bigint generated always as identity primary key,
  name text not null,
  college text not null,
  need text not null,
  story text not null,
  raised int default 0,
  supported boolean default false,
  status text default 'open',
  created_at timestamp default now()
);

create table support_pledges (
  id bigint generated always as identity primary key,
  request_id bigint references scholarship_requests(id),
  donor_name text,
  amount numeric,
  message text,
  created_at timestamp default now()
);

-- =====================================================
-- Seed a few starter colleges so the site isn't empty on first load
-- =====================================================
insert into colleges (name, district, students, verified) values
('Science College, Nanded', 'Nanded', '2,400+', true),
('Yeshwant Mahavidyalaya, Nanded', 'Nanded', '1,800+', true),
('Rajarshi Shahu Mahavidyalaya, Latur', 'Latur', '2,100+', true),
('Balbhim College, Beed', 'Beed', '1,900+', true);

-- =====================================================
-- Row Level Security (RLS) — required by Supabase for public access
-- This allows anyone to READ data (needed for a public site),
-- but only allows INSERT for new rows (no public edit/delete).
-- =====================================================
alter table colleges enable row level security;
alter table resources enable row level security;
alter table announcements enable row level security;
alter table scholarship_requests enable row level security;
alter table support_pledges enable row level security;

create policy "Public read colleges" on colleges for select using (true);
create policy "Public read resources" on resources for select using (true);
create policy "Public read announcements" on announcements for select using (true);
create policy "Public read requests" on scholarship_requests for select using (true);
create policy "Public insert requests" on scholarship_requests for insert with check (true);
create policy "Public read pledges" on support_pledges for select using (true);
create policy "Public insert pledges" on support_pledges for insert with check (true);
