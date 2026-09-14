SENPAI ESPORTS — ADMIN CMS

Admin URL: /admin.html
Public URL: /

Supabase is configured in supabase-config.js using the browser-safe publishable key.
Never add a Supabase service-role/secret key to this repository.

One-time database setup:
Run supabase-schema.sql in Supabase SQL Editor.

Admin login:
Create the admin user in Supabase Authentication > Users.

The public website reads site_content from Supabase. The admin panel writes to the same row.
Changes made in the admin panel can therefore appear on the public site without editing HTML.
