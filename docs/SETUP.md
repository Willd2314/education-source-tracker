# Finish setup and submit

## 1. Supabase

1. Sign in at https://supabase.com and create a free project. Store your database password privately.
2. Open the SQL Editor. Paste `supabase/schema.sql` and run it once in a new project.
3. Find the project URL and publishable key in the project's API settings / Connect panel.
4. Edit `dist/config.js` with those two public values. Do not use a database password, secret key, or service-role key.
5. Enable email/password authentication. Keep email confirmation enabled and confirm your test account before logging in.
6. Under Authentication URL configuration, set Site URL to your final public app URL and add that URL to the allowed redirect URLs. Add `http://localhost:8000` for local testing.

## 2. GitHub and honest progress

Create a new PUBLIC GitHub repository named `education-source-tracker`. Do not initialize it with a README. Extract this project ZIP and open a terminal in its folder:

```sh
git init
git add .
git commit -m "Add AI-assisted source tracker and Supabase schema"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/education-source-tracker.git
git push -u origin main
```

As you actually complete configuration, testing fixes, and the README links, make and push further meaningful commits. Do not fabricate past dates or claim an extended development history. If your checkout already has Git history, retain it rather than reinitializing a different project over it.

## 3. Public deployment

Use Netlify as recommended by the assignment. Import the public GitHub repository. No build command is needed. Set publish directory to `dist`. Deploy after configuring the database. Alternatively upload the `dist` folder with Netlify's manual deployment option.

Configure the deployed URL in Supabase Auth, then replace the README deployed-application placeholder. Avoid unnecessary deployments to stay within free limits. The supplied private preview is for inspecting the interface, not the grader-facing submission.

## 4. Required live checks

- Register account A, confirm its email, log in, and log out.
- Confirm wrong credentials show an error.
- Add a source and inspect its row in the Supabase Table Editor.
- Reload and verify the same source persists.
- Edit its title, notes, and review status; check the database changes.
- Try searching and filtering; verify the counts.
- Cancel deletion, then confirm deletion; check that the database row disappears.
- Create another source in A. In an incognito window register account B. Verify B cannot view or modify A's source. Inspect row-level policies and, if comfortable, test a direct API request for A's record while authenticated as B: it must return no accessible record and must not change it.
- Log out and verify the source library is inaccessible.
- Try a narrow phone-sized window and keyboard navigation.
- Check the deployed URL in an incognito window without a hosting account. It must be public.

Record actual results before calling the project complete. No live backend tests were performed in the generated package because account configuration was unavailable.

## 5. Submission

Watch all assigned Hootcamp recordings. Review the source until you can explain it. Record a 3-5 minute video of the DEPLOYED app following DEMO.md. Upload it to YouTube as unlisted. Add the video URL and final app URL to README.md and push the update. Submit the public GitHub repository URL in Canvas.
