/* ==========================================================================
   USERS.JS - User Account Management Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initUserFilters();
  renderUsers();
});

function initUserFilters() {
  const searchInput = document.getElementById('user-search-input');
  const statusFilter = document.getElementById('user-status-filter');

  if (searchInput) searchInput.addEventListener('input', renderUsers);
  if (statusFilter) statusFilter.addEventListener('change', renderUsers);
}

function getFilteredUsers() {
  let list = typeof getUsers === 'function' ? getUsers() : [];

  const search = (document.getElementById('user-search-input')?.value || '').toLowerCase().trim();
  const status = document.getElementById('user-status-filter')?.value || 'all';

  if (search) {
    list = list.filter(u => 
      (u.name && u.name.toLowerCase().includes(search)) ||
      (u.phone && u.phone.includes(search)) ||
      (u.city && u.city.toLowerCase().includes(search))
    );
  }

  if (status !== 'all') {
    list = list.filter(u => u.status === status);
  }

  return list;
}

function renderUsers() {
  const filtered = getFilteredUsers();

  const tbody = document.getElementById('users-tbody');
  const table = document.getElementById('users-table');
  const emptyContainer = document.getElementById('users-empty-container');

  if (!tbody || !emptyContainer) return;

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    table.style.display = 'none';

    emptyContainer.innerHTML = renderEmptyState(
      'No users found',
      'No user records match your search criteria or filter.',
      'users'
    );
    return;
  }

  table.style.display = 'table';
  emptyContainer.innerHTML = '';

  let html = '';
  filtered.forEach(user => {
    let badgeClass = 'badge-pending';
    if (user.status === 'approved') badgeClass = 'badge-approved';
    if (user.status === 'rejected') badgeClass = 'badge-rejected';
    if (user.status === 'blocked') badgeClass = 'badge-blocked';

    const isBlocked = user.status === 'blocked';

    html += `
      <tr>
        <td style="font-weight: 600; color: var(--text);">
          ${escapeHtml(user.name)}
        </td>
        <td>
          <code style="background: rgba(123,30,43,0.06); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 500;">
            ${escapeHtml(maskPhoneNumber(user.phone))}
          </code>
        </td>
        <td>${escapeHtml(user.city)}</td>
        <td style="text-transform: capitalize;">${escapeHtml(user.relation)}</td>
        <td><span class="badge ${badgeClass}">${escapeHtml(user.status)}</span></td>
        <td style="font-size: 0.85rem; color: var(--text-soft);">${formatDate(user.createdAt)}</td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
            <button type="button" class="btn btn-outline btn-sm view-user-btn" data-id="${user.id}" title="View Details">
              ${getSvgIcon('eye')} View
            </button>
            <button type="button" class="btn ${isBlocked ? 'btn-success' : 'btn-outline'} btn-sm toggle-block-btn" data-id="${user.id}" title="${isBlocked ? 'Unblock User' : 'Block User'}">
              ${isBlocked ? getSvgIcon('unblock') + ' Unblock' : getSvgIcon('block') + ' Block'}
            </button>
            <button type="button" class="btn btn-danger btn-sm remove-user-btn" data-id="${user.id}" title="Remove User">
              ${getSvgIcon('trash')} Remove
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;

  // Bind Event Listeners
  tbody.querySelectorAll('.view-user-btn').forEach(btn => {
    btn.addEventListener('click', () => openUserDetails(btn.getAttribute('data-id')));
  });

  tbody.querySelectorAll('.toggle-block-btn').forEach(btn => {
    btn.addEventListener('click', () => handleToggleBlock(btn.getAttribute('data-id')));
  });

  tbody.querySelectorAll('.remove-user-btn').forEach(btn => {
    btn.addEventListener('click', () => handleRemoveUser(btn.getAttribute('data-id')));
  });
}

// VIEW USER DETAILS MODAL
function openUserDetails(userId) {
  const users = typeof getUsers === 'function' ? getUsers() : [];
  const user = users.find(u => u.id === userId);
  if (!user) return;

  let badgeClass = 'badge-pending';
  if (user.status === 'approved') badgeClass = 'badge-approved';
  if (user.status === 'rejected') badgeClass = 'badge-rejected';
  if (user.status === 'blocked') badgeClass = 'badge-blocked';

  const bodyHtml = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="color: var(--maroon); font-size: 1.3rem;">${escapeHtml(user.name)}</h3>
        <span class="badge ${badgeClass}">${escapeHtml(user.status)}</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; font-size: 0.9rem; background: var(--cream); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
        <div>
          <span style="color: var(--text-soft); font-size: 0.8rem; display: block;">Full Contact Number</span>
          <strong style="color: var(--maroon); font-size: 1.1rem; display: flex; align-items: center; gap: 0.35rem;">
            ${getSvgIcon('phone')} ${escapeHtml(user.phone)}
          </strong>
        </div>
        <div>
          <span style="color: var(--text-soft); font-size: 0.8rem; display: block;">City</span>
          <strong style="color: var(--text);">${escapeHtml(user.city)}</strong>
        </div>
        <div>
          <span style="color: var(--text-soft); font-size: 0.8rem; display: block;">Relationship to Candidate</span>
          <strong style="color: var(--text); text-transform: capitalize;">${escapeHtml(user.relation)}</strong>
        </div>
        <div>
          <span style="color: var(--text-soft); font-size: 0.8rem; display: block;">Registration Date</span>
          <strong style="color: var(--text);">${formatDate(user.createdAt)}</strong>
        </div>
      </div>

      ${user.rejectReason ? `
        <div style="background: var(--danger-bg); border: 1px solid rgba(179,38,30,0.3); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.875rem;">
          <strong style="color: var(--danger);">Rejection Reason:</strong>
          <p style="margin-top: 0.2rem; color: var(--text);">${escapeHtml(user.rejectReason)}</p>
        </div>
      ` : ''}
    </div>
  `;

  const footerHtml = `<button type="button" class="btn btn-outline modal-close-btn">Close</button>`;

  showModal({
    title: `User Account - ${user.name}`,
    bodyHtml,
    footerHtml
  });
}

// BLOCK / UNBLOCK USER HANDLER
function handleToggleBlock(userId) {
  const users = typeof getUsers === 'function' ? getUsers() : [];
  const user = users.find(u => u.id === userId);
  if (!user) return;

  const isBlocked = user.status === 'blocked';

  showConfirmModal({
    title: isBlocked ? `Unblock ${user.name}?` : `Block ${user.name}?`,
    message: isBlocked 
      ? `This will restore ${user.name}'s account status to approved, granting access to view profiles.`
      : `Blocking ${user.name} will prevent them from accessing profiles and contact details.`,
    confirmText: isBlocked ? 'Unblock Account' : 'Block Account',
    confirmClass: isBlocked ? 'btn-success' : 'btn-danger',
    onConfirm: () => {
      user.status = isBlocked ? 'approved' : 'blocked';
      if (typeof saveUser === 'function') saveUser(user);
      if (typeof logActivity === 'function') logActivity(user.status, `User: ${user.name}`);

      showToast(`User ${user.name} has been ${user.status}.`, isBlocked ? 'success' : 'warning');
      renderUsers();
    }
  });
}

// REMOVE USER HANDLER
function handleRemoveUser(userId) {
  const users = typeof getUsers === 'function' ? getUsers() : [];
  const user = users.find(u => u.id === userId);
  if (!user) return;

  showConfirmModal({
    title: `Remove User Record?`,
    message: `Are you sure you want to permanently remove ${user.name} from the user registry?`,
    confirmText: 'Remove User',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      if (typeof deleteUser === 'function') {
        deleteUser(user.id);
        if (typeof logActivity === 'function') logActivity('deleted user', `User: ${user.name}`);

        showToast(`User ${user.name} removed.`, 'danger');
        renderUsers();
      }
    }
  });
}
