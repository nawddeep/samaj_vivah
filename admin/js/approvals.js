/* ==========================================================================
   APPROVALS.JS - User Approval Request Controller & Modal Workflows
   ========================================================================== */

let currentTab = 'pending';

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  renderApprovals();
});

function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.getAttribute('data-tab');
      renderApprovals();
    });
  });
}

function updateTabCounts() {
  const users = typeof getUsers === 'function' ? getUsers() : [];
  const pendingCount = users.filter(u => u.status === 'pending').length;
  const approvedCount = users.filter(u => u.status === 'approved').length;
  const rejectedCount = users.filter(u => u.status === 'rejected').length;

  const pEl = document.getElementById('count-pending');
  const aEl = document.getElementById('count-approved');
  const rEl = document.getElementById('count-rejected');

  if (pEl) pEl.textContent = pendingCount;
  if (aEl) aEl.textContent = approvedCount;
  if (rEl) rEl.textContent = rejectedCount;

  if (typeof updateSidebarPendingBadge === 'function') {
    updateSidebarPendingBadge();
  }
}

function renderApprovals() {
  updateTabCounts();

  const users = typeof getUsers === 'function' ? getUsers() : [];
  const filtered = users.filter(u => u.status === currentTab);

  const tbody = document.getElementById('approvals-tbody');
  const table = id => document.getElementById(id);
  const emptyContainer = document.getElementById('approvals-empty-container');

  if (!tbody || !emptyContainer) return;

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    table('approvals-table').style.display = 'none';

    let emptyTitle = "No pending requests";
    let emptyDesc = "You're all caught up! There are no user approval requests waiting for review.";

    if (currentTab === 'approved') {
      emptyTitle = "No approved users";
      emptyDesc = "There are currently no approved user accounts in the system.";
    } else if (currentTab === 'rejected') {
      emptyTitle = "No rejected requests";
      emptyDesc = "No registration requests have been rejected.";
    }

    emptyContainer.innerHTML = renderEmptyState(emptyTitle, emptyDesc, 'approvals');
    return;
  }

  table('approvals-table').style.display = 'table';
  emptyContainer.innerHTML = '';

  let html = '';
  filtered.forEach(user => {
    let badgeClass = 'badge-pending';
    if (user.status === 'approved') badgeClass = 'badge-approved';
    if (user.status === 'rejected') badgeClass = 'badge-rejected';

    html += `
      <tr style="cursor: pointer;" data-user-id="${user.id}" class="user-row">
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
        <td>${formatDate(user.createdAt)}</td>
        <td>
          <span class="badge ${badgeClass}">${escapeHtml(user.status)}</span>
        </td>
        <td style="text-align: right;" onclick="event.stopPropagation();">
          <div style="display: flex; gap: 0.4rem; justify-content: flex-end;">
            <button type="button" class="btn btn-outline btn-sm view-btn" data-id="${user.id}" title="View Details">
              ${getSvgIcon('eye')} View
            </button>
            ${user.status === 'pending' ? `
              <button type="button" class="btn btn-success btn-sm approve-btn" data-id="${user.id}">
                ${getSvgIcon('check')} Approve
              </button>
              <button type="button" class="btn btn-danger btn-sm reject-btn" data-id="${user.id}">
                ${getSvgIcon('cross')} Reject
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;

  // Bind Event Listeners
  tbody.querySelectorAll('.user-row').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.getAttribute('data-user-id');
      openUserDetailsModal(id);
    });
  });

  tbody.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openUserDetailsModal(btn.getAttribute('data-id'));
    });
  });

  tbody.querySelectorAll('.approve-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleApproveUser(btn.getAttribute('data-id'));
    });
  });

  tbody.querySelectorAll('.reject-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openRejectModal(btn.getAttribute('data-id'));
    });
  });
}

// APPROVE USER HANDLER
function handleApproveUser(userId) {
  const users = typeof getUsers === 'function' ? getUsers() : [];
  const user = users.find(u => u.id === userId);
  if (!user) return;

  user.status = 'approved';
  user.rejectReason = '';
  
  if (typeof saveUser === 'function') {
    saveUser(user);
  }
  if (typeof logActivity === 'function') {
    logActivity('approved', `User: ${user.name}`);
  }

  showToast(`Approved registration for ${user.name}.`, 'success');
  renderApprovals();
}

// REJECT USER MODAL WITH REQUIRED REASON
function openRejectModal(userId) {
  const users = typeof getUsers === 'function' ? getUsers() : [];
  const user = users.find(u => u.id === userId);
  if (!user) return;

  const bodyHtml = `
    <p style="font-size: 0.95rem; margin-bottom: 1rem;">
      You are rejecting the registration request for <strong>${escapeHtml(user.name)}</strong>. Please state a valid reason.
    </p>
    <div class="form-group" id="reject-group">
      <label for="reject-reason-input" class="form-label">Rejection Reason <span class="required">*</span></label>
      <textarea id="reject-reason-input" class="form-control" placeholder="Enter reason (minimum 5 characters)..."></textarea>
      <div class="invalid-feedback">Reason must be at least 5 characters.</div>
    </div>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
    <button type="button" class="btn btn-danger submit-reject-btn">Reject Registration</button>
  `;

  const { closeModal, backdrop } = showModal({
    title: `Reject Request - ${user.name}`,
    bodyHtml,
    footerHtml
  });

  const submitBtn = backdrop.querySelector('.submit-reject-btn');
  const textarea = backdrop.querySelector('#reject-reason-input');
  const group = backdrop.querySelector('#reject-group');

  submitBtn.addEventListener('click', () => {
    group.classList.remove('has-error');
    textarea.classList.remove('is-invalid');

    const validation = Validators.validateRejectReason(textarea.value);
    if (!validation.isValid) {
      group.classList.add('has-error');
      textarea.classList.add('is-invalid');
      return;
    }

    const reason = textarea.value.trim();

    // Confirm popup before reject
    showConfirmModal({
      title: 'Confirm Rejection',
      message: `Are you sure you want to reject ${user.name}? This decision will be logged.`,
      confirmText: 'Yes, Reject',
      confirmClass: 'btn-danger',
      onConfirm: () => {
        user.status = 'rejected';
        user.rejectReason = reason;

        if (typeof saveUser === 'function') saveUser(user);
        if (typeof logActivity === 'function') logActivity('rejected', `User: ${user.name}`);

        closeModal();
        showToast(`Rejected request for ${user.name}.`, 'info');
        renderApprovals();
      }
    });
  });
}

// USER DETAILS MODAL
function openUserDetailsModal(userId) {
  const users = typeof getUsers === 'function' ? getUsers() : [];
  const user = users.find(u => u.id === userId);
  if (!user) return;

  let statusBadge = 'badge-pending';
  if (user.status === 'approved') statusBadge = 'badge-approved';
  if (user.status === 'rejected') statusBadge = 'badge-rejected';
  if (user.status === 'blocked') statusBadge = 'badge-blocked';

  const bodyHtml = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size: 1.2rem; color: var(--maroon);">${escapeHtml(user.name)}</h4>
        <span class="badge ${statusBadge}">${escapeHtml(user.status)}</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; font-size: 0.9rem; background: var(--cream); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
        <div>
          <span style="color: var(--text-soft); font-size: 0.8rem; display: block;">Phone Number</span>
          <strong style="color: var(--text);">${escapeHtml(user.phone)}</strong>
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
          <p style="margin-top: 0.25rem; color: var(--text);">${escapeHtml(user.rejectReason)}</p>
        </div>
      ` : ''}
    </div>
  `;

  let footerHtml = `<button type="button" class="btn btn-outline modal-close-btn">Close</button>`;
  if (user.status === 'pending') {
    footerHtml = `
      <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
      <button type="button" class="btn btn-danger detail-reject-btn">${getSvgIcon('cross')} Reject</button>
      <button type="button" class="btn btn-success detail-approve-btn">${getSvgIcon('check')} Approve</button>
    `;
  }

  const { closeModal, backdrop } = showModal({
    title: 'User Registration Details',
    bodyHtml,
    footerHtml
  });

  const detailApprove = backdrop.querySelector('.detail-approve-btn');
  const detailReject = backdrop.querySelector('.detail-reject-btn');

  if (detailApprove) {
    detailApprove.addEventListener('click', () => {
      closeModal();
      handleApproveUser(user.id);
    });
  }

  if (detailReject) {
    detailReject.addEventListener('click', () => {
      closeModal();
      openRejectModal(user.id);
    });
  }
}
