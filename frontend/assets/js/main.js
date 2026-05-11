function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/index.html';
    return false;
  }
  return true;
}

function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

function isAlumni() {
  const user = getCurrentUser();
  return user && user.role === 'alumni';
}

function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function showLoading(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.innerHTML = '<div class="loading">Loading...</div>';
}

function showElementError(message, elementId) {
  if (elementId) {
    const el = document.getElementById(elementId);
    if (el) el.innerHTML = `<div class="error-message">${message}</div>`;
  } else {
    alert(message);
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/index.html';
}

function setTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  const btn = document.querySelector('.theme-float');
  if (btn) btn.textContent = next === 'dark' ? '\u2600' : '\u{1F319}';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  const btn = document.querySelector('.theme-float');
  if (!btn) {
    const b = document.createElement('button');
    b.className = 'theme-float';
    b.setAttribute('aria-label', 'Toggle theme');
    b.onclick = toggleTheme;
    document.body.appendChild(b);
  }
  setTheme(saved);
}

document.addEventListener('DOMContentLoaded', initTheme);
