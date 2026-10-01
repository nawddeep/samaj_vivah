========================================================================
COMMUNITY MATRIMONY ADMIN PANEL - DEMO VERSION
========================================================================

ABOUT THE APPLICATION:
This is the Admin Web Dashboard prototype for a single-community (Sindhi) Matrimonial
Application. It runs 100% offline in the browser using HTML5, CSS3, Vanilla
JavaScript (ES6), and browser localStorage. No server, database, or build tools
are required.

------------------------------------------------------------------------
HOW TO OPEN & RUN THE DEMO:
------------------------------------------------------------------------
1. Locate the file `admin/index.html` in your file explorer.
2. Double-click `index.html` to open it directly in any web browser 
   (Chrome, Firefox, Safari, Edge).
3. No local web server or `npm start` needed.

------------------------------------------------------------------------
DEMO LOGIN CREDENTIALS:
------------------------------------------------------------------------
- Email:    admin@demo.com
- Password: Admin@123

------------------------------------------------------------------------
ADMIN PANEL FEATURES & SCREENS:
------------------------------------------------------------------------
1. LOGIN (index.html):
   - Secure authentication simulation with demo credentials banner.
   - Field-level validation and show/hide password toggle.

2. DASHBOARD (dashboard.html):
   - 4 Dynamic analytical stat cards: Total Users, Total Profiles,
     Pending Approvals, and New Created This Week.
   - Real-time Recent Activity feed showing the last 8 system actions.
   - Quick action shortcuts for Profile Creation and User Approvals.

3. USER APPROVALS (approvals.html):
   - Tabbed view: Pending Requests, Approved Users, and Rejected Users.
   - Detailed user verification modal.
   - Approval workflow & Rejection modal requiring mandatory reason (min 5 chars).
   - Phone numbers are masked for security.

4. ADD / EDIT PROFILE (add-profile.html):
   - Comprehensive multi-card form: Personal, Education/Career, Family, 
     Religion details, Partner Expectations, and Contact Info.
   - Multi-photo upload (up to 5 images) with automatic client-side canvas 
     compression to Base64 (max 800px width).
   - Biodata PDF/Image attachment upload (up to 3MB).
   - Full form validation (draft vs publish rules, age limits, 10-digit 
     contact start 6-9, duplicate contact detection across profiles).
   - Edit mode activated automatically via URL query string (`?id=prf_xxx`).
   - Unsaved changes warning alert (`beforeunload`).

5. MANAGE PROFILES (profiles.html):
   - Desktop table view and responsive card view for mobile devices.
   - Real-time search across Name, City, Phone, and Profession.
   - Multi-select filters by Status (Published/Hidden/Draft), Gender, Age range.
   - Sort by Newest or Oldest.
   - Full Detail View Modal revealing unmasked verified contact numbers.
   - Hide / Unhide modal with optional reason (e.g. "Marriage fixed").
   - Pagination control (10 items per page).

6. MANAGE USERS (users.html):
   - User account search and status filtering.
   - Block / Unblock workflows (retains user history with 'blocked' status).
   - User detail inspection & permanent removal confirmation modals.

------------------------------------------------------------------------
HOW TO RESET DEMO DATA:
------------------------------------------------------------------------
- At any time, click the "Reset Demo Data" button in the bottom of the left 
  sidebar navigation.
- Confirm the popup prompt. All `localStorage` keys (`mm_users`, `mm_profiles`, 
  `mm_activity`) will be reset to their original initial seed data.

------------------------------------------------------------------------
DATA STORE KEYS (localStorage):
------------------------------------------------------------------------
- `mm_users`          -> Array of User objects
- `mm_profiles`       -> Array of Profile objects
- `mm_admin_session`  -> Admin session token & metadata
- `mm_activity`       -> System activity log entries

========================================================================
