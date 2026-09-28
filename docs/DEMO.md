# Demo outline: approximately 4 minutes

Use your public deployed URL, not localhost. Use test research entries without private student information. This is a recording plan, not a claim that a demo has been made.

## 0:00-0:30: Purpose

Explain in your own words: “I built Education Source Tracker to organize articles, datasets, and discussions about AI in education. It is a small prototype for keeping research sources and notes together.” Show the deployed URL.

## 0:30-1:15: Authentication

Register a test account. Show the email confirmation process if enabled; avoid showing unrelated email. Log in and explain that each account has its own library. Show logout and log back in.

## 1:15-2:30: Database and CRUD

Create an article using a real source URL you have reviewed. Add a publisher and a short note. Show its matching row in the Supabase Table Editor without exposing API secrets. Reload the deployed page to demonstrate persistence. Edit the note and change status to Reviewed. Show search and filtering. Delete the entry and show that its database row is gone.

## 2:30-3:30: Code walkthrough

Show index.html for the page, styles.css for responsiveness, and app.js for authentication and CRUD. Point to `db.from('sources')` and explain that these calls communicate with Supabase. Open schema.sql and explain the sources table and why `auth.uid() = user_id` prevents access to another account's data. Show the repository's actual commits.

## 3:30-4:00: AI workflow and wrap-up

Describe what you actually asked ChatGPT to generate and what you personally configured, reviewed, and tested. Relate your work to the Hootcamp tools after watching the recordings. Explain one real issue you encountered and how you fixed it. Do not invent an issue or claim to have used tools you did not use.

Upload as unlisted on YouTube. Check that the link plays in an incognito window and add it to the README.
