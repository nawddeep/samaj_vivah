SAMAJ VIVAH - MEMBER APP (demo, integrated with the admin panel)
1. Open the REPO ROOT index.html (or serve the repo folder with VS Code Live Server) and use its two buttons. Both apps must be opened from the same address so they share data.
2. The member app reads and writes the admin panel's own browser data (mm_users, mm_profiles, mm_activity) through ../admin/js/store.js and js/bridge.js. Nothing in the admin panel was changed.
3. New numbers go through onboarding and appear in the admin's User Approvals. Approve, reject or block them there and the member app updates by itself. Hidden or draft profiles never show to members.
4. The OTP is hardcoded (1234) and fills in by itself. Ready-made members: 9000000005 approved, 9000000001 pending, 9000000009 rejected, 9000000011 blocked.
5. Real screenshot blocking needs the Flutter app on Android; iOS can only show a watermark.
