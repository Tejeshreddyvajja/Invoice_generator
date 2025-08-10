(() => {
  const API = 'http://localhost:5000';

  const $ = (id) => document.getElementById(id);
  const signupForm = $('signup-form');
  const loginForm = $('login-form');
  const signupResult = $('signup-result');
  const loginResult = $('login-result');
  const meBtn = $('me-btn');
  const meResult = $('me-result');
  const logoutBtn = $('logout-btn');

  function setToken(token) {
    if (token) localStorage.setItem('token', token);
  }
  function getToken() {
    return localStorage.getItem('token');
  }
  function clearToken() {
    localStorage.removeItem('token');
  }
  function show(target, data) {
    target.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  }

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      email: $('signup-email').value,
      password: $('signup-password').value,
      companyName: $('signup-company').value,
    };
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      show(signupResult, body);
    } catch (err) {
      show(signupResult, { error: err.message });
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      email: $('login-email').value,
      password: $('login-password').value,
    };
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (body && body.token) setToken(body.token);
      show(loginResult, body);
    } catch (err) {
      show(loginResult, { error: err.message });
    }
  });

  meBtn.addEventListener('click', async () => {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${getToken() || ''}`,
        },
      });
      const body = await res.json();
      show(meResult, body);
    } catch (err) {
      show(meResult, { error: err.message });
    }
  });

  logoutBtn.addEventListener('click', () => {
    clearToken();
    show(meResult, 'Logged out');
  });
})();


