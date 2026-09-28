# Education Source Tracker

An individual Engineering Design 2 project for organizing research about AI in education. Users can register, log in, and maintain a private library of articles, datasets, and discussions. This is a source-management prototype, not an AI analysis or scraping system.

## Submission status

The application code and database migration are implemented. A Supabase project still needs to be connected and live end-to-end testing completed. A public GitHub repository and an unlisted demo video must also be added before submission. Do not submit this as finished while these items remain open.

- Deployed application: see `docs/HANDOFF.md` for the current preview; replace this line with your public Netlify URL after deployment.
- Demo video: https://youtu.be/r7oYwKbGLck

## Features

- Email/password registration, login, logout, and session management through Supabase Auth.
- Create, read, update, and delete research sources in PostgreSQL.
- Source title, link, type, review status, publisher, and notes.
- Search, status filtering, and live counts.
- Row-level security restricts each user to their own records.
- Responsive layout, keyboard-accessible forms, and delete confirmation.

## Technologies and structure

Plain HTML, CSS, JavaScript, Supabase JavaScript SDK v2 (CDN), Supabase Auth, PostgreSQL, Git, and static hosting. No build tooling is required.

```
dist/
  index.html       Page structure and dialogs
  styles.css       Responsive styling
  app.js           Authentication, CRUD, filtering, UI state
  config.js        Public Supabase browser settings
supabase/schema.sql  Table, validation, index, and security policies
docs/SETUP.md      Database, GitHub, deployment, and verification steps
docs/DEMO.md       3-5 minute recording outline
docs/AI_LOG.md     Actual AI assistance and remaining lecture review
```

## Setup

1. Create a free Supabase project and run `supabase/schema.sql` in its SQL Editor.
2. Copy your project URL and publishable (or legacy anon) key into `dist/config.js`. Never use a service-role or secret key in browser code.
3. From this project folder run `python -m http.server 8000 --directory dist`.
4. Open `http://localhost:8000`, register, confirm the email if required, and log in.
5. Follow `docs/SETUP.md` to deploy and configure authentication redirect URLs.

The initial connection form offers a browser-only setup convenience. For a submission that works for other users, fill in config.js before deploying. Source records always use Supabase; there is no local-only database fallback.

## Data and access

The browser calls Supabase over HTTPS using the SDK. Supabase Auth supplies a user session. Database policies compare `auth.uid()` to the record's `user_id` for every CRUD operation. Unauthenticated users have no table privileges. Do not collect personal student data in this prototype.

## Validation

JavaScript syntax was checked during generation. Live authentication, email delivery, PostgreSQL constraints, persistence, and two-account isolation must be tested against the configured Supabase project using the checklist in `docs/SETUP.md`.

## References

- https://supabase.com/docs/reference/javascript/auth-signup
- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/database/postgres/row-level-security

AI assistance: ChatGPT generated the initial implementation, database schema, and documentation. See docs/AI_LOG.md. The student must review and understand the code and complete the assigned Hootcamp recordings.
