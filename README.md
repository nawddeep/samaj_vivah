# 💍 Samaj Vivah - Community Matrimonial Admin Panel

A premium, lightweight web dashboard prototype built for a single-community matrimonial application. Designed as a **Demo Prototype** that runs 100% offline in the browser using HTML5, Vanilla CSS3, JavaScript (ES6), and `localStorage`.

---

## 🚀 Quick Start & How to Run

### Option 1: Direct Double-Click (No Server Needed)
1. Open the project folder `admin/`.
2. Double-click `admin/index.html` in any web browser (Chrome, Firefox, Safari, Edge).

### Option 2: Local Development Server
```bash
# Navigate to project root
cd /path/to/samaj_vivah

# Start a simple HTTP server
python3 -m http.server 8080
```
Open your browser and visit: **[http://localhost:8080/admin/index.html](http://localhost:8080/admin/index.html)**

---

## 🔑 Demo Login Credentials

* **Email:** `admin@demo.com`
* **Password:** `Admin@123`

---

## 📌 Project Overview & Architecture

### Key Features
* **🔐 Admin Authentication:** Login screen with session guard, password visibility toggle, and error handling.
* **📊 Analytics Dashboard:** Live dynamic stat cards (Total Users, Total Profiles, Pending Approvals, New This Week) and real-time activity log feed.
* **⏳ User Registration Approvals:** Tabbed queue (Pending, Approved, Rejected) with candidate details modal, one-click approval, and rejection reason requirements (min 5 chars).
* **➕ Candidate Profile Management:**
  * Multi-section card form (Personal, Education, Family, Community/Gotra, Expectations, Contact).
  * Client-side Canvas Base64 photo compressor (max 800px width).
  * Biodata PDF / Image attachment uploader.
  * Validation rules (age limits 18-70, 10-digit phone start 6-9, duplicate contact detection).
  * Edit mode activated dynamically via `?id=prf_xxx`.
* **👤 Profiles Management:** Responsive table and mobile card layout with live search, multi-filters (Status, Gender, Age), sorting, pagination, hide/unhide with reason, and full unmasked contact details modal.
* **👥 User Account Controls:** User list with phone number masking, status filter, detail inspection modal, block/unblock controls, and deletion popup confirmation.
* **🔄 Reset Demo Data:** Restores all seed data back to initial state from the sidebar footer.

---

## 📁 File Structure

```text
samaj_vivah/
├── README.md
├── .gitignore
└── admin/
    ├── index.html          # Admin login screen
    ├── dashboard.html      # Dashboard overview & analytics
    ├── approvals.html      # User registration approval queue
    ├── add-profile.html    # Profile addition & editing form
    ├── profiles.html       # Profile management & contact viewer
    ├── users.html          # Registered user accounts manager
    ├── README.txt          # Quick text manual
    ├── css/
    │   ├── theme.css       # Design system tokens, buttons, cards, forms, SVG icons
    │   └── layout.css      # Sidebar drawer, header, grid system, responsive rules
    └── js/
        ├── store.js        # ALL localStorage operations & seed data (Single Source of Truth)
        ├── auth.js         # Route guard & session manager
        ├── ui.js           # Toast system, custom modals, SVG icon dictionary
        ├── validators.js   # Form input validation rules
        ├── dashboard.js    # Dashboard analytics & activity controller
        ├── approvals.js    # Approvals page controller
        ├── add-profile.js  # Add/Edit profile form controller & image compressor
        ├── profiles.js     # Profiles list search, filters, pagination controller
        └── users.js        # User management controller
```

---

## 🛠️ Data Store Keys (`localStorage`)

* `mm_users` — Registered user accounts array
* `mm_profiles` — Candidate matrimonial profiles array
* `mm_admin_session` — Admin authentication session token
* `mm_activity` — Audit log of recent admin operations

---

## 🔗 Repository Info

* **GitHub Repository:** [https://github.com/nawddeep/samaj_vivah.git](https://github.com/nawddeep/samaj_vivah.git)
* **Tech Stack:** HTML5, Vanilla CSS3, Vanilla JavaScript (ES6)
