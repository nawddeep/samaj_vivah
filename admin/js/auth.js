/* ==========================================================================
   AUTH.JS - Session Authentication & Guard Logic
   ========================================================================== */

const DEMO_CREDENTIALS = {
  email: 'admin@demo.com',
  password: 'Admin@123'
};

const Auth = {
  // Check if current user has active admin session
  isLoggedIn() {
    if (typeof getSession === 'function') {
      const session = getSession();
      return !!(session && session.email && session.token);
    }
    return false;
  },

  // Perform Admin Login
  login(email, password) {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const sessionData = {
        email: email,
        name: 'System Admin',
        role: 'Administrator',
        token: 'demo_token_' + Date.now(),
        loginTime: new Date().toISOString()
      };
      if (typeof setSession === 'function') {
        setSession(sessionData);
      }
      return { success: true };
    } else {
      return { success: false, message: 'Email or password is incorrect.' };
    }
  },

  // Logout Admin
  logout() {
    if (typeof clearSession === 'function') {
      clearSession();
    }
    window.location.href = 'index.html';
  },

  // Page Route Guard logic
  initGuard() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const isLoginPage = currentPath === 'index.html' || currentPath === '';

    if (this.isLoggedIn()) {
      if (isLoginPage) {
        window.location.href = 'dashboard.html';
      }
    } else {
      if (!isLoginPage) {
        window.location.href = 'index.html';
      }
    }
  }
};

// Run Auth Guard immediately on script load
Auth.initGuard();
