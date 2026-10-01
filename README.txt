SAMAJ VIVAH DEMO: MEMBER APP + ADMIN PANEL
index.html   landing page with links to both apps and the test numbers
user/        the mobile member app (plain HTML, CSS, JavaScript)
admin/       the admin panel (built separately, unchanged)

HOW THEY ARE CONNECTED
Both apps run in the browser and share one set of localStorage keys, so they must be opened from the same address (the same origin).
  mm_users           members. The admin approves, rejects or blocks them. The member app reads the status.
  mm_profiles        profiles. Only "published" ones are shown to members.
  mm_activity        the admin's activity feed. Member actions are logged here.
  mm_user_session    which member is logged in on this device (member app only)
  mm_shortlist       saved profiles per member (member app only)
  mm_contact_views   every "Show contact" confirmation (member app only)
The member app loads admin/js/store.js, so there is one data layer. user/js/bridge.js converts between the two profile shapes.

HOW TO RUN
Computer:  serve this folder (VS Code Live Server, or "python3 -m http.server" in this folder) and open http://localhost:PORT/
           Opening the files by double-click can work in Chrome, but Safari keeps each folder's data separate. Use a server.
Vercel:    deploy this folder as a static site (Framework: Other, Root Directory: the repo root, no build command).
Admin login: admin@demo.com / Admin@123
