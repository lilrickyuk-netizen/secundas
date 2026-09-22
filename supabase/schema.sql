CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT,
  total_attempts INTEGER DEFAULT 0,
  levels_completed INTEGER DEFAULT 0,
  pro_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.attempts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  level_number INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  pattern JSONB,
  time_to_complete_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.challenges (
  id BIGSERIAL PRIMARY KEY,
  challenger_id UUID REFERENCES auth.users NOT NULL,
  challenged_id UUID REFERENCES auth.users,
  level INTEGER NOT NULL,
  seed TEXT,
  challenger_score INTEGER NOT NULL,
  challenged_score INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.daily_scores (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  level_completed INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.attempts
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.challenges
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.daily_scores
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own attempts"
ON public.attempts
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.uid()) = user_id
);

CREATE POLICY "Users can read all attempts"
ON public.attempts
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create challenges"
ON public.challenges
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.uid()) = challenger_id
);

CREATE POLICY "Users can read relevant challenges"
ON public.challenges
FOR SELECT
TO authenticated
USING (
  (SELECT auth.uid()) = challenger_id
  OR
  (SELECT auth.uid()) = challenged_id
  OR
  challenged_id IS NULL
);

CREATE POLICY "Users can update relevant challenges"
ON public.challenges
FOR UPDATE
TO authenticated
USING (
  (SELECT auth.uid()) = challenger_id
  OR
  (SELECT auth.uid()) = challenged_id
)
WITH CHECK (
  (SELECT auth.uid()) = challenger_id
  OR
  (SELECT auth.uid()) = challenged_id
);

CREATE POLICY "Anyone can read daily scores"
ON public.daily_scores
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert own daily scores"
ON public.daily_scores
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.uid()) = user_id
);