-- SkillSwap Supabase schema
-- Run this in the Supabase SQL editor to switch the app from demo mode
-- (localStorage) to live mode (real auth + Postgres). Also set
-- VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env — see .env.example.

create extension if not exists "uuid-ossp";

-- Profiles (1:1 with auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  university text not null,
  faculty text not null,
  bio text default '',
  avatar_url text,
  skillcoin_balance integer not null default 50,
  rating numeric(2,1) not null default 0,
  sessions_completed integer not null default 0,
  students_helped integer not null default 0,
  created_at timestamptz not null default now()
);

create table skills (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null
);

create table user_teaching_skills (
  user_id uuid references profiles(id) on delete cascade,
  skill_id uuid references skills(id) on delete cascade,
  primary key (user_id, skill_id)
);

create table user_learning_skills (
  user_id uuid references profiles(id) on delete cascade,
  skill_id uuid references skills(id) on delete cascade,
  primary key (user_id, skill_id)
);

create table matches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  matched_user_id uuid references profiles(id) on delete cascade,
  compatibility_score integer not null,
  status text not null default 'suggested',
  created_at timestamptz not null default now()
);

create table conversations (
  id uuid primary key default uuid_generate_v4(),
  user1_id uuid references profiles(id) on delete cascade,
  user2_id uuid references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user1_id, user2_id)
);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create table sessions (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid references profiles(id) on delete cascade,
  learner_id uuid references profiles(id) on delete cascade,
  skill text not null,
  duration integer default 60,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table ratings (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references sessions(id) on delete cascade,
  from_user_id uuid references profiles(id) on delete cascade,
  to_user_id uuid references profiles(id) on delete cascade,
  rating integer check (rating between 1 and 5),
  review text,
  created_at timestamptz not null default now()
);

create table skillcoin_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  amount integer not null,
  type text not null check (type in ('earn', 'spend')),
  description text,
  created_at timestamptz not null default now()
);

-- Row Level Security ----------------------------------------------------
alter table profiles enable row level security;
alter table user_teaching_skills enable row level security;
alter table user_learning_skills enable row level security;
alter table matches enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table sessions enable row level security;
alter table ratings enable row level security;
alter table skillcoin_transactions enable row level security;

-- Profiles: anyone signed in can read all profiles (needed for matching/browse),
-- but users can only edit their own.
create policy "Profiles are viewable by authenticated users"
  on profiles for select using (auth.role() = 'authenticated');
create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

create policy "Teaching skills viewable by authenticated users"
  on user_teaching_skills for select using (auth.role() = 'authenticated');
create policy "Users manage their own teaching skills"
  on user_teaching_skills for all using (auth.uid() = user_id);

create policy "Learning skills viewable by authenticated users"
  on user_learning_skills for select using (auth.role() = 'authenticated');
create policy "Users manage their own learning skills"
  on user_learning_skills for all using (auth.uid() = user_id);

create policy "Users see matches involving them"
  on matches for select using (auth.uid() = user_id or auth.uid() = matched_user_id);
create policy "Users create their own match rows"
  on matches for insert with check (auth.uid() = user_id);

create policy "Users see their own conversations"
  on conversations for select using (auth.uid() = user1_id or auth.uid() = user2_id);
create policy "Users create conversations they're part of"
  on conversations for insert with check (auth.uid() = user1_id or auth.uid() = user2_id);

create policy "Users see messages in their conversations"
  on messages for select using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.user1_id = auth.uid() or c.user2_id = auth.uid())
    )
  );
create policy "Users send messages as themselves"
  on messages for insert with check (auth.uid() = sender_id);

create policy "Users see their own sessions"
  on sessions for select using (auth.uid() = teacher_id or auth.uid() = learner_id);
create policy "Users create sessions they're part of"
  on sessions for insert with check (auth.uid() = teacher_id or auth.uid() = learner_id);
create policy "Participants update their session"
  on sessions for update using (auth.uid() = teacher_id or auth.uid() = learner_id);

create policy "Users see ratings about themselves or given by themselves"
  on ratings for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);
create policy "Users create ratings as themselves"
  on ratings for insert with check (auth.uid() = from_user_id);

create policy "Users see their own transactions"
  on skillcoin_transactions for select using (auth.uid() = user_id);
create policy "System inserts transactions for the user"
  on skillcoin_transactions for insert with check (auth.uid() = user_id);
