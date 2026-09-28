# Client website checks

`.github/workflows/uptime-check.yml` checks active clients every 15 minutes.
It follows redirects, tries HEAD then GET, and records HTTP success (2xx),
response time and errors in Supabase. Paused and cancelled clients are skipped.
The admin Clients page displays results and history. This checks HTTP availability;
it does not test page contents or send outage notifications.

## Activate

1. Apply `app/supabase/migrations/0001_admin.sql` if the admin tables are missing.
2. In the GitHub repository's Settings → Secrets and variables → Actions, set
   repository variable `NEXT_PUBLIC_SUPABASE_URL` to the project's Supabase URL
   and repository secret `SUPABASE_SERVICE_ROLE_KEY` to its service-role key.
   Never use a public/anon key for the checker or expose the service key in the browser.
3. Push the workflow and checker files to the default branch. Enable Actions if needed.
4. Add client website URLs in `/admin/clients` and mark them active.
5. In Actions → Client uptime check → Run workflow, run once and verify the job
   succeeds and the Clients page's last-check timestamp updates.

GitHub schedules can be delayed and public repository schedules are disabled
after 60 days without repository activity. A green run means checks were stored;
a website being down is recorded in the dashboard, not treated as a job failure.
Database or configuration errors fail the job so they cannot pass silently.

Run probe tests with `node --test scripts/uptime-probe.test.mjs` from `app/`.
