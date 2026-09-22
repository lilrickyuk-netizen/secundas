# Secundas Supabase Setup

Supabase is an optional cloud-sync layer.

Core Secundas gameplay must continue to work if Supabase is not configured, offline, unavailable, or over its service limits.

## Create the Supabase project

Create a Supabase project for Secundas.

## Enable anonymous authentication

Enable Anonymous Sign-Ins in Supabase Authentication settings.

Secundas does not require a name, email address, or phone number for core gameplay.

## Install the schema

Open the Supabase SQL Editor.

Run:

supabase/schema.sql

This creates:

- profiles
- attempts
- challenges
- daily_scores

and the required Row Level Security policies.

## Client configuration

Obtain:

- Project URL
- Publishable key

Never put a Supabase service-role key or secret key inside the mobile application.

## Local environment

Create `.env.local` in the repository root.

Add:

EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_KEY

Legacy anon-key configuration is also supported:

EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

Do not commit `.env.local`.

Restart Metro after changing environment variables:

npx expo start --dev-client --clear

## Offline behaviour

Without Supabase configuration:

- the game launches normally;
- standard levels work;
- Daily Challenge works;
- local challenges work;
- local statistics work;
- sharing works;
- no cloud connection is required.

When configured, Secundas:

1. restores an existing Supabase session when available;
2. otherwise creates an anonymous Supabase user;
3. stores the anonymous user ID locally;
4. uploads unsynced level results;
5. uploads completed unsynced Daily Challenge scores;
6. updates anonymous profile statistics.

Leaderboard and world-average caching are implemented in Phase 36.