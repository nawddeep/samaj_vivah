/* ==========================================================================
   PROFILES.JS - Profile Management Controller, Filters, Pagination & Actions
   ========================================================================== */

let currentPage = 1;
const itemsPerPage = 10;
let filteredProfiles = [];

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  renderProfiles();
});

function initFilters() {
  const searchInput = document.getElementById('search-input');
  const statusSelect = document.getElementById('filter-status');
  const genderSelect = document.getElementById('filter-gender');
  const ageSelect = document.getElementById('filter-age');
  const sortSelect = document.getElementById('filter-sort');

  const triggerRender = () => {
    currentPage = 1;
    renderProfiles();
  };

  if (searchInput) searchInput.addEventListener('input', triggerRender);
  if (statusSelect) statusSelect.addEventListener('change', triggerRender);
  if (genderSelect) genderSelect.addEventListener('change', triggerRender);
  if (ageSelect) ageSelect.addEventListener('change', triggerRender);
  if (sortSelect) sortSelect.addEventListener('change', triggerRender);
}

function getFilteredAndSortedProfiles() {
  let list = typeof getProfiles === 'function' ? getProfiles() : [];

  const search = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
  const status = document.getElementById('filter-status')?.value || 'all';
  const gender = document.getElementById('filter-gender')?.value || 'all';
  const age = document.getElementById('filter-age')?.value || 'all';
  const sort = document.getElementById('filter-sort')?.value || 'newest';

  // Search filter
  if (search) {
    list = list.filter(p => 
      (p.name && p.name.toLowerCase().includes(search)) ||
      (p.city && p.city.toLowerCase().includes(search)) ||
      (p.contactNumber && p.contactNumber.includes(search)) ||
      (p.profession && p.profession.toLowerCase().includes(search))
    );
  }

  // Status filter
  if (status !== 'all') {
    list = list.filter(p => p.status === status);
  }

  // Gender filter
  if (gender !== 'all') {
    list = list.filter(p => p.gender === gender);
  }

  // Age filter
  if (age !== 'all') {
    if (age === '18-25') list = list.filter(p => p.age >= 18 && p.age <= 25);
    else if (age === '26-30') list = list.filter(p => p.age >= 26 && p.age <= 30);
    else if (age === '31-35') list = list.filter(p => p.age >= 31 && p.age <= 35);
    else if (age === '36+') list = list.filter(p => p.age >= 36);
  }

  // Sorting
  list.sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt).getTime();
    return sort === 'newest' ? timeB - timeA : timeA - timeB;
  });

  return list;
}

function renderProfiles() {
  filteredProfiles = getFilteredAndSortedProfiles();

  const tbody = document.getElementById('profiles-tbody');
  const mobileList = document.getElementById('profiles-mobile-list');
  const table = document.getElementById('profiles-table');
  const emptyContainer = document.getElementById('profiles-empty-container');
  const paginationBar = document.getElementById('pagination-bar');

  if (filteredProfiles.length === 0) {
    if (tbody) tbody.innerHTML = '';
    if (mobileList) mobileList.innerHTML = '';
    if (table) table.style.display = 'none';
    if (paginationBar) paginationBar.style.display = 'none';

    emptyContainer.innerHTML = renderEmptyState(
      'No profiles found',
      'Try changing your search terms or filters to find what you are looking for.',
      'search'
    );
    return;
  }

  if (table) table.style.display = 'table';
  emptyContainer.innerHTML = '';
  if (paginationBar) paginationBar.style.display = 'flex';

  // Pagination Slice
  const totalItems = filteredProfiles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const pageProfiles = filteredProfiles.slice(startIndex, endIndex);

  renderDesktopTable(pageProfiles);
  renderMobileCards(pageProfiles);
  renderPaginationControls(totalItems, totalPages, startIndex + 1, endIndex);
}

function renderDesktopTable(profiles) {
  const tbody = document.getElementById('profiles-tbody');
  if (!tbody) return;

  let html = '';
  profiles.forEach(p => {
    const mainPhoto = (p.photos && p.photos.length > 0) 
      ? p.photos[0] 
      : generateSvgAvatar(p.name, p.gender, '#7B1E2B');

    let badgeClass = 'badge-published';
    if (p.status === 'hidden') badgeClass = 'badge-hidden';
    if (p.status === 'draft') badgeClass = 'badge-draft';

    html += `
      <tr>
        <td>
          <img src="${mainPhoto}" alt="${escapeHtml(p.name)}" class="avatar-thumb">
        </td>
        <td style="font-weight: 600; color: var(--text);">
          ${escapeHtml(p.name)}
        </td>
        <td style="text-transform: capitalize;">
          ${p.age ? p.age + ' Yrs' : 'N/A'} • ${escapeHtml(p.gender || '')}
        </td>
        <td>${escapeHtml(p.city || 'N/A')}</td>
        <td>${escapeHtml(p.profession || 'N/A')}</td>
        <td>
          <code style="background: rgba(123,30,43,0.06); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 500;">
            ${escapeHtml(maskPhoneNumber(p.contactNumber))}
          </code>
        </td>
        <td><span class="badge ${badgeClass}">${escapeHtml(p.status)}</span></td>
        <td style="font-size: 0.85rem; color: var(--text-soft);">${formatDate(p.updatedAt || p.createdAt)}</td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end; flex-wrap: wrap;">
            <button type="button" class="btn btn-outline btn-sm view-profile-btn" data-id="${p.id}" title="View Full Details">${getSvgIcon('eye')} View</button>
            <a href="add-profile.html?id=${p.id}" class="btn btn-outline btn-sm" title="Edit Profile">${getSvgIcon('edit')} Edit</a>
            <button type="button" class="btn btn-outline btn-sm toggle-hide-btn" data-id="${p.id}" title="${p.status === 'hidden' ? 'Unhide' : 'Hide'}">
              ${p.status === 'hidden' ? getSvgIcon('eye') + ' Unhide' : getSvgIcon('eyeOff') + ' Hide'}
            </button>
            <button type="button" class="btn btn-danger btn-sm delete-profile-btn" data-id="${p.id}" title="Delete Profile">${getSvgIcon('trash')}</button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  bindActionListeners(tbody);
}

function renderMobileCards(profiles) {
  const mobileList = document.getElementById('profiles-mobile-list');
  if (!mobileList) return;

  let html = '';
  profiles.forEach(p => {
    const mainPhoto = (p.photos && p.photos.length > 0) 
      ? p.photos[0] 
      : generateSvgAvatar(p.name, p.gender, '#7B1E2B');

    let badgeClass = 'badge-published';
    if (p.status === 'hidden') badgeClass = 'badge-hidden';
    if (p.status === 'draft') badgeClass = 'badge-draft';

    html += `
      <div class="profile-mobile-card">
        <div style="display: flex; gap: 0.85rem; align-items: center;">
          <img src="${mainPhoto}" alt="${escapeHtml(p.name)}" class="avatar-thumb" style="width: 52px; height: 52px;">
          <div>
            <div style="font-weight: 700; font-size: 1.05rem; color: var(--text);">${escapeHtml(p.name)}</div>
            <div style="font-size: 0.85rem; color: var(--text-soft);">${p.age} Yrs • ${escapeHtml(p.city)}</div>
            <span class="badge ${badgeClass}" style="margin-top: 0.2rem; font-size: 0.7rem;">${escapeHtml(p.status)}</span>
          </div>
        </div>

        <div style="font-size: 0.85rem; padding: 0.5rem 0; border-top: 1px dashed var(--border); border-bottom: 1px dashed var(--border);">
          <div><strong>Profession:</strong> ${escapeHtml(p.profession || 'N/A')}</div>
          <div><strong>Contact:</strong> <code>${escapeHtml(maskPhoneNumber(p.contactNumber))}</code></div>
        </div>

        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; flex-wrap: wrap;">
          <button type="button" class="btn btn-outline btn-sm view-profile-btn" data-id="${p.id}">${getSvgIcon('eye')} View</button>
          <a href="add-profile.html?id=${p.id}" class="btn btn-outline btn-sm">${getSvgIcon('edit')} Edit</a>
          <button type="button" class="btn btn-outline btn-sm toggle-hide-btn" data-id="${p.id}">
            ${p.status === 'hidden' ? 'Unhide' : 'Hide'}
          </button>
          <button type="button" class="btn btn-danger btn-sm delete-profile-btn" data-id="${p.id}">${getSvgIcon('trash')}</button>
        </div>
      </div>
    `;
  });

  mobileList.innerHTML = html;
  bindActionListeners(mobileList);
}

function bindActionListeners(container) {
  container.querySelectorAll('.view-profile-btn').forEach(btn => {
    btn.addEventListener('click', () => openViewModal(btn.getAttribute('data-id')));
  });

  container.querySelectorAll('.toggle-hide-btn').forEach(btn => {
    btn.addEventListener('click', () => handleToggleHide(btn.getAttribute('data-id')));
  });

  container.querySelectorAll('.delete-profile-btn').forEach(btn => {
    btn.addEventListener('click', () => handleDeleteProfile(btn.getAttribute('data-id')));
  });
}

function renderPaginationControls(totalItems, totalPages, start, end) {
  const info = document.getElementById('pagination-info');
  const controls = document.getElementById('pagination-controls');

  if (info) info.textContent = `Showing ${start}-${end} of ${totalItems} profiles`;
  if (!controls) return;

  let html = `<button type="button" class="page-btn" id="prev-page-btn" ${currentPage === 1 ? 'disabled' : ''}>&laquo; Prev</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button type="button" class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }

  html += `<button type="button" class="page-btn" id="next-page-btn" ${currentPage === totalPages ? 'disabled' : ''}>Next &raquo;</button>`;

  controls.innerHTML = html;

  const prevBtn = document.getElementById('prev-page-btn');
  const nextBtn = document.getElementById('next-page-btn');

  if (prevBtn) prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderProfiles(); } });
  if (nextBtn) nextBtn.addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; renderProfiles(); } });

  controls.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.getAttribute('data-page'), 10);
      renderProfiles();
    });
  });
}

// VIEW FULL PROFILE DETAIL MODAL (SHOWS UNMASKED FULL PHONE NUMBER & LIGHTBOX GALLERY)
function openViewModal(profileId) {
  const profile = typeof getProfileById === 'function' ? getProfileById(profileId) : null;
  if (!profile) return;

  let photosHtml = '';
  if (profile.photos && profile.photos.length > 0) {
    photosHtml = `
      <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1rem;">
        ${profile.photos.map((src, i) => `
          <img src="${src}" alt="Photo ${i+1}" class="gallery-photo-thumb" data-idx="${i}" style="height: 120px; border-radius: var(--radius-md); object-fit: cover; border: 1px solid var(--border); cursor: pointer;" title="Click to open full view">
        `).join('')}
      </div>
    `;
  }

  const bodyHtml = `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      ${photosHtml}

      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <h3 style="color: var(--maroon); font-size: 1.4rem;">${escapeHtml(profile.name)}</h3>
          <span style="color: var(--text-soft); font-size: 0.9rem;">
            ${profile.age} Yrs • ${escapeHtml(profile.gender)} • ${escapeHtml(profile.maritalStatus)}
          </span>
        </div>
        <span class="badge badge-${profile.status}">${escapeHtml(profile.status)}</span>
      </div>

      <!-- Full Contact Box (Unmasked) -->
      <div style="background: var(--gold-light); border: 1px solid var(--gold); padding: 1rem; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <span style="font-size: 0.8rem; color: #5C4100; font-weight: 600; text-transform: uppercase;">Verified Contact Number (Full)</span>
          <div style="font-size: 1.3rem; font-weight: bold; color: var(--maroon); letter-spacing: 0.05em; margin-top: 0.1rem; display: flex; align-items: center; gap: 0.4rem;">
            ${getSvgIcon('phone')} ${escapeHtml(profile.contactNumber)}
          </div>
        </div>
        <a href="tel:${profile.contactNumber}" class="btn btn-secondary btn-sm">Call Now</a>
      </div>

      <!-- Info Grids -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;">
        <div>
          <strong style="color: var(--maroon); display: block; margin-bottom: 0.3rem;">Personal & Location</strong>
          <div><strong>City:</strong> ${escapeHtml(profile.city || 'N/A')}</div>
          <div><strong>Height:</strong> ${escapeHtml(profile.height || 'N/A')}</div>
          <div><strong>Sub-Community / Gotra:</strong> ${escapeHtml(profile.religionDetails || 'N/A')}</div>
        </div>

        <div>
          <strong style="color: var(--maroon); display: block; margin-bottom: 0.3rem;">Career & Education</strong>
          <div><strong>Education:</strong> ${escapeHtml(profile.education || 'N/A')}</div>
          <div><strong>Profession:</strong> ${escapeHtml(profile.profession || 'N/A')}</div>
          <div><strong>Annual Income:</strong> ${escapeHtml(profile.income || 'N/A')}</div>
        </div>
      </div>

      <div style="padding-top: 0.75rem; border-top: 1px dashed var(--border); font-size: 0.9rem;">
        <strong style="color: var(--maroon); display: block; margin-bottom: 0.3rem;">Family Overview</strong>
        <div><strong>Father:</strong> ${escapeHtml(profile.fatherName || 'N/A')} (${escapeHtml(profile.fatherOccupation || 'N/A')})</div>
        <div><strong>Mother:</strong> ${escapeHtml(profile.motherName || 'N/A')}</div>
        <div><strong>Siblings:</strong> ${escapeHtml(profile.siblings || 'N/A')}</div>
        <div><strong>Family Type:</strong> ${escapeHtml(profile.familyType || 'N/A')}</div>
      </div>

      ${profile.expectations ? `
        <div style="padding-top: 0.75rem; border-top: 1px dashed var(--border); font-size: 0.9rem;">
          <strong style="color: var(--maroon); display: block; margin-bottom: 0.3rem;">Partner Expectations</strong>
          <p style="color: var(--text); background: var(--cream); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
            ${escapeHtml(profile.expectations)}
          </p>
        </div>
      ` : ''}

      ${profile.biodataFile ? `
        <div style="padding-top: 0.75rem; border-top: 1px dashed var(--border);">
          <strong style="color: var(--maroon); display: block; margin-bottom: 0.3rem;">Attached Biodata Document</strong>
          <a href="${profile.biodataFile.data}" download="${profile.biodataFile.name}" class="btn btn-outline btn-sm">
            ${getSvgIcon('file')} Download ${escapeHtml(profile.biodataFile.name)}
          </a>
        </div>
      ` : ''}
    </div>
  `;

  const footerHtml = `
    <a href="add-profile.html?id=${profile.id}" class="btn btn-primary">${getSvgIcon('edit')} Edit Profile</a>
    <button type="button" class="btn btn-outline modal-close-btn">Close</button>
  `;

  const { backdrop } = showModal({
    title: `Profile Details - ${profile.name}`,
    bodyHtml,
    footerHtml,
    maxWidth: '650px'
  });

  // Attach Lightbox click handlers to photo gallery thumbnails
  if (profile.photos && profile.photos.length > 0) {
    backdrop.querySelectorAll('.gallery-photo-thumb').forEach(img => {
      img.addEventListener('click', () => {
        const idx = parseInt(img.getAttribute('data-idx'), 10);
        if (typeof openLightbox === 'function') openLightbox(profile.photos, idx);
      });
    });
  }
}

// HIDE / UNHIDE PROFILE HANDLER WITH OPTIONAL REASON
function handleToggleHide(profileId) {
  const profile = typeof getProfileById === 'function' ? getProfileById(profileId) : null;
  if (!profile) return;

  const isHiding = profile.status !== 'hidden';

  if (isHiding) {
    const bodyHtml = `
      <p style="font-size: 0.95rem; margin-bottom: 1rem;">
        You are hiding the profile of <strong>${escapeHtml(profile.name)}</strong>. Hidden profiles are invisible to regular users.
      </p>
      <div class="form-group">
        <label for="hide-reason-input" class="form-label">Optional Reason (e.g. Marriage fixed, On hold)</label>
        <input type="text" id="hide-reason-input" class="form-control" placeholder="e.g. Marriage fixed">
      </div>
    `;

    const footerHtml = `
      <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
      <button type="button" class="btn btn-warning submit-hide-btn">Confirm Hide</button>
    `;

    const { closeModal, backdrop } = showModal({
      title: `Hide Profile - ${profile.name}`,
      bodyHtml,
      footerHtml
    });

    backdrop.querySelector('.submit-hide-btn').addEventListener('click', () => {
      const reason = backdrop.querySelector('#hide-reason-input').value.trim();
      profile.status = 'hidden';

      if (typeof saveProfile === 'function') saveProfile(profile);
      const targetLabel = reason ? `Profile: ${profile.name} (${reason})` : `Profile: ${profile.name}`;
      if (typeof logActivity === 'function') logActivity('hidden', targetLabel);

      closeModal();
      showToast(`Profile ${profile.name} is now hidden.`, 'info');
      renderProfiles();
    });
  } else {
    // Unhide Profile
    showConfirmModal({
      title: 'Unhide Profile',
      message: `Make profile for ${profile.name} published and visible to approved users again?`,
      confirmText: 'Unhide Profile',
      confirmClass: 'btn-primary',
      onConfirm: () => {
        profile.status = 'published';
        if (typeof saveProfile === 'function') saveProfile(profile);
        if (typeof logActivity === 'function') logActivity('published', `Profile: ${profile.name}`);

        showToast(`Profile ${profile.name} is now published.`, 'success');
        renderProfiles();
      }
    });
  }
}

// DELETE PROFILE HANDLER
function handleDeleteProfile(profileId) {
  const profile = typeof getProfileById === 'function' ? getProfileById(profileId) : null;
  if (!profile) return;

  showConfirmModal({
    title: 'Delete Profile Permanently?',
    message: `Are you sure you want to delete ${profile.name}'s profile? This action cannot be undone.`,
    confirmText: 'Delete Permanently',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      if (typeof deleteProfile === 'function') {
        deleteProfile(profile.id);
        if (typeof logActivity === 'function') logActivity('deleted', `Profile: ${profile.name}`);

        showToast(`Deleted profile for ${profile.name}.`, 'danger');
        renderProfiles();
      }
    }
  });
}
