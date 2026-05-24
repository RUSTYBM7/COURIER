// auth-guard.js - Add this to ALL protected static HTML pages
// Place in <head> before any content loads

(function() {
  const PROTECTED_PAGES = [
    '/dashboard.html',
    '/payment.html', 
    '/settings.html',
    '/chat.html',
    '/documents.html'
  ];

  const ADMIN_PAGES = [
    '/admin.html',
    '/admin-panel.html'
  ];

  const currentPath = window.location.pathname;

  // Check if this is a protected page
  const isProtected = PROTECTED_PAGES.some(p => currentPath.includes(p) || currentPath.endsWith(p.replace('.html', '')));
  const isAdmin = ADMIN_PAGES.some(p => currentPath.includes(p) || currentPath.endsWith(p.replace('.html', '')));

  if (!isProtected && !isAdmin) return; // Public page, no check needed

  // Check auth status from API
  fetch('/api/auth/me', { credentials: 'include' })
    .then(r => r.json())
    .then(data => {
      if (!data.user) {
        // Not authenticated - redirect to login
        window.location.href = '/signin.html?redirect=' + encodeURIComponent(window.location.pathname);
        return;
      }

      // Check admin access
      if (isAdmin && data.user.role !== 'admin') {
        window.location.href = '/dashboard.html?error=unauthorized';
        return;
      }

      // Store user info for page use
      window.__AIRPAK_USER = data.user;

      // Dispatch event so pages can use user data
      document.dispatchEvent(new CustomEvent('airpak-auth-ready', { detail: data.user }));
    })
    .catch(err => {
      console.error('Auth check failed:', err);
      window.location.href = '/signin.html?error=auth_check_failed';
    });
})();
