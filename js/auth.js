/**
 * Auth API client and nav helper for Roadmap app.
 * Requires PHP backend (api/login.php, register.php, me.php, logout.php).
 */

(function () {
  function getApiBase() {
    var path = typeof location !== 'undefined' && location.pathname ? location.pathname : '';
    return (path.indexOf('pages') !== -1 ? '../' : '') + 'api';
  }

  var API = getApiBase();

  function request(method, path, body) {
    var url = API + path;
    var opts = { method: method, credentials: 'include' };
    if (body) {
      opts.headers = { 'Content-Type': 'application/json' };
      opts.body = JSON.stringify(body);
    }
    return fetch(url, opts).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
      });
    });
  }

  window.RoadmapAuth = {
    getApiBase: getApiBase,
    getCurrentUser: function () {
      return request('GET', '/me.php');
    },
    login: function (email, password) {
      return request('POST', '/login.php', { email: email, password: password });
    },
    register: function (email, password, displayName) {
      return request('POST', '/register.php', {
        email: email,
        password: password,
        display_name: displayName || null
      });
    },
    logout: function () {
      return request('POST', '/logout.php');
    },
    /** Call on pages that have #authNav: inject Login link or Logout (email) */
    renderAuthInNav: function () {
      var el = document.getElementById('authNav');
      if (!el) return;
      this.getCurrentUser().then(function (data) {
        if (data.user) {
          el.innerHTML = '<span class="auth-email">' + (data.user.display_name || data.user.email) + '</span> ' +
            '<a href="#" id="authLogoutLink">Logout</a>';
          document.getElementById('authLogoutLink').addEventListener('click', function (e) {
            e.preventDefault();
            window.RoadmapAuth.logout().then(function () {
              try {
                var keys = [
                  "cfa-study-tracker",
                  "java-roadmap-tracker",
                  "aptech-tracker",
                  "frontend-tracker"
                ];
                keys.forEach(function (k) { localStorage.removeItem(k); });
              } catch (_) {}
              location.reload();
            });
          });
        } else {
          el.innerHTML = '<a href="' + (location.pathname.indexOf('pages') !== -1 ? 'login.html' : 'pages/login.html') + '">Login</a>';
        }
      }).catch(function () {
        el.innerHTML = '<a href="' + (location.pathname.indexOf('pages') !== -1 ? 'login.html' : 'pages/login.html') + '">Login</a>';
      });
    }
  };
})();
