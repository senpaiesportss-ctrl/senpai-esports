SENPAI ESPORTS — ADMIN CMS SETUP

What this adds
- /admin.html: password-protected Supabase admin panel
- Roster, Teams, Tournaments, News, Owner & Contact, Hero/Site Settings
- Public site reads the same content from Supabase, so saved changes can appear across devices
- Owner photo included at assets/owner-aditya-sinha.jpg

One-time setup
1. Create a free Supabase project.
2. In Supabase > SQL Editor, run supabase-schema.sql.
3. In Supabase > Authentication > Users, create your admin user (email + password).
4. In Supabase > Project Settings > API, copy the Project URL and the Publishable/anon key.
5. Copy supabase-config.js.example to supabase-config.js and replace the placeholders.
6. Upload supabase-config.js, admin.html, admin.css, admin.js, supabase-schema.sql, default-content.json and the assets folder to GitHub/Vercel.
7. Open /admin.html and sign in with the Supabase admin user.
8. Edit content and click SAVE CHANGES.

Security
- Do NOT use the Supabase service-role key in browser files.
- The publishable/anon key is intended for browser use and is protected by RLS.
- Keep the admin email/password private.

Current contact details
Email: senpaiesprotss@gmail.com
Phone: 9693157295
Owner: Aditya Sinha — Founder & Owner — Established 2023

The current public HTML still contains fallback content, so the site remains functional before Supabase is configured. After configuration, the CMS becomes the source of truth for editable content.
