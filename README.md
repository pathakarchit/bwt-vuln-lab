# bwt-vuln-lab: intentionally vulnerable test lab (BuildWithThis)

**Don't use this code. It's insecure on purpose.**

A tiny notes app in the shape AI app builders generate (Vite + React + supabase-js + one Supabase Edge Function), with 10 planted security issues. It's the fixture for the BuildWithThis test "Security check for a vibe-coded app" ([test script](https://github.com/pathakarchit/buildwiththis/blob/main/docs/tests/security-check-vibe-coded-app.md)).

- **No real secrets.** Every key-looking value (Supabase anon and service-role JWTs, Stripe and OpenAI keys in `.env`) is a **dummy**: correctly formatted, signed with a random throwaway secret or generated at random, and valid for nothing.
- The Supabase project it names is a throwaway test project with fake data only, and is paused or deleted after testing.
- Planted issues: RLS off, an "any logged-in user" policy, a service-role key in client code, a committed `.env`, a public bucket open to listing and upload, an unprotected Edge Function, a view exposing `auth.users`, XSS via `dangerouslySetInnerHTML`, a vulnerable `lodash`, and an anon-callable `SECURITY DEFINER` function.

This repository is archived after testing.
