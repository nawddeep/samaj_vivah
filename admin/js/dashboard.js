/* ==========================================================================
   DASHBOARD.JS - Dashboard Controller & Dynamic Canvas Analytics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderDashboardMetrics();
  renderDashboardCharts();
  renderRecentActivity();

  // Re-render charts on window resize
  window.addEventListener('resize', () => {
    renderDashboardCharts();
  });
});

function renderDashboardMetrics() {
  const users = typeof getUsers === 'function' ? getUsers() : [];
  const profiles = typeof getProfiles === 'function' ? getProfiles() : [];

  const totalUsers = users.length;
  const totalProfiles = profiles.length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  // New in last 7 days calculation
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const newUsersCount = users.filter(u => new Date(u.createdAt).getTime() >= sevenDaysAgo).length;
  const newProfilesCount = profiles.filter(p => new Date(p.createdAt).getTime() >= sevenDaysAgo).length;
  const newThisWeek = newUsersCount + newProfilesCount;

  // Additional summaries
  const approvedUsers = users.filter(u => u.status === 'approved').length;
  const publishedProfiles = profiles.filter(p => p.status === 'published').length;
  const hiddenProfiles = profiles.filter(p => p.status === 'hidden').length;
  const draftProfiles = profiles.filter(p => p.status === 'draft').length;

  // Populate UI
  const totalUsersEl = document.getElementById('stat-total-users');
  const totalProfilesEl = document.getElementById('stat-total-profiles');
  const pendingApprovalsEl = document.getElementById('stat-pending-approvals');
  const newThisWeekEl = document.getElementById('stat-new-this-week');

  if (totalUsersEl) totalUsersEl.textContent = totalUsers;
  if (totalProfilesEl) totalProfilesEl.textContent = totalProfiles;
  if (pendingApprovalsEl) pendingApprovalsEl.textContent = pendingUsers;
  if (newThisWeekEl) newThisWeekEl.textContent = newThisWeek;

  const approvedUsersEl = document.getElementById('summary-approved-users');
  const publishedProfilesEl = document.getElementById('summary-published-profiles');
  const hiddenProfilesEl = document.getElementById('summary-hidden-profiles');
  const draftProfilesEl = document.getElementById('summary-draft-profiles');

  if (approvedUsersEl) approvedUsersEl.textContent = approvedUsers;
  if (publishedProfilesEl) publishedProfilesEl.textContent = publishedProfiles;
  if (hiddenProfilesEl) hiddenProfilesEl.textContent = hiddenProfiles;
  if (draftProfilesEl) draftProfilesEl.textContent = draftProfiles;
}

function renderDashboardCharts() {
  const users = typeof getUsers === 'function' ? getUsers() : [];
  const profiles = typeof getProfiles === 'function' ? getProfiles() : [];

  // Profile Breakdown Donut Chart
  const publishedCount = profiles.filter(p => p.status === 'published').length;
  const hiddenCount = profiles.filter(p => p.status === 'hidden').length;
  const draftCount = profiles.filter(p => p.status === 'draft').length;

  if (typeof drawCanvasDonutChart === 'function') {
    drawCanvasDonutChart(
      'profile-donut-canvas',
      ['Published', 'Hidden', 'Draft'],
      [publishedCount, hiddenCount, draftCount],
      ['#7B1E2B', '#1976D2', '#B7791F']
    );
  }

  // User Status Breakdown Bar Chart
  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const approvedUsers = users.filter(u => u.status === 'approved').length;
  const rejectedUsers = users.filter(u => u.status === 'rejected').length;
  const blockedUsers = users.filter(u => u.status === 'blocked').length;

  if (typeof drawCanvasBarChart === 'function') {
    drawCanvasBarChart(
      'user-bar-canvas',
      ['Pending', 'Approved', 'Rejected', 'Blocked'],
      [pendingUsers, approvedUsers, rejectedUsers, blockedUsers],
      ['#B7791F', '#2E7D4F', '#B3261E', '#5A1220']
    );
  }
}

function renderRecentActivity() {
  const container = document.getElementById('activity-list-container');
  if (!container) return;

  const activities = typeof getActivity === 'function' ? getActivity() : [];
  const recent8 = activities.slice(0, 8);

  if (recent8.length === 0) {
    container.innerHTML = renderEmptyState('No Activity Recorded', 'Activity log is currently empty.', 'activity');
    return;
  }

  let html = `<ul style="list-style: none; display: flex; flex-direction: column; gap: 0.85rem;">`;

  recent8.forEach(act => {
    let actionBadgeClass = 'badge-demo';
    let iconSvg = getSvgIcon('activity');

    const actionLower = (act.action || '').toLowerCase();
    if (actionLower.includes('approved')) {
      actionBadgeClass = 'badge-approved';
      iconSvg = getSvgIcon('check');
    } else if (actionLower.includes('rejected') || actionLower.includes('blocked') || actionLower.includes('deleted')) {
      actionBadgeClass = 'badge-rejected';
      iconSvg = getSvgIcon('cross');
    } else if (actionLower.includes('added') || actionLower.includes('published')) {
      actionBadgeClass = 'badge-approved';
      iconSvg = getSvgIcon('addProfile');
    } else if (actionLower.includes('hidden')) {
      actionBadgeClass = 'badge-hidden';
      iconSvg = getSvgIcon('eyeOff');
    }

    html += `
      <li style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0.5rem; border-bottom: 1px solid var(--border); flex-wrap: wrap; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="width: 32px; height: 32px; border-radius: 50%; background: var(--cream); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--maroon);">
            ${iconSvg}
          </span>
          <div>
            <div style="font-weight: 500; font-size: 0.925rem; color: var(--text);">
              ${escapeHtml(act.target)}
            </div>
            <span class="badge ${actionBadgeClass}" style="font-size: 0.7rem; margin-top: 0.2rem;">
              ${escapeHtml(act.action)}
            </span>
          </div>
        </div>
        <span style="font-size: 0.8rem; color: var(--text-soft);">
          ${formatTimeAgo(act.time)}
        </span>
      </li>
    `;
  });

  html += `</ul>`;
  container.innerHTML = html;
}
