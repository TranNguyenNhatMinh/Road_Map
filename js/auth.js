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
    // Đảm bảo URL đúng format
    var url = API + path;
    if (!url.startsWith('http') && !url.startsWith('/')) {
      url = '/' + url;
    }
    
    var opts = { 
      method: method, 
      credentials: 'include',
      mode: 'cors',
      cache: 'no-cache'
    };
    
    if (body) {
      opts.headers = { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      opts.body = JSON.stringify(body);
    }
    
    return fetch(url, opts).then(function (res) {
      var contentType = res.headers.get('content-type') || '';
      // Kiểm tra nếu response không phải JSON
      if (!contentType.includes('application/json')) {
        return res.text().then(function (text) {
          var errorMsg = 'Server error: ';
          if (res.status === 404) {
            errorMsg += 'API endpoint not found. Check if file exists: ' + url;
          } else if (res.status === 500) {
            errorMsg += 'Server internal error. Check PHP configuration.';
          } else {
            errorMsg += 'Server returned HTML instead of JSON. Response: ' + text.substring(0, 100);
          }
          throw new Error(errorMsg);
        });
      }
      return res.json().then(function (data) {
        if (!res.ok) {
          var errorMsg = data.error || 'Request failed';
          if (res.status === 401) {
            errorMsg = 'Invalid email or password';
          } else if (res.status === 400) {
            errorMsg = data.error || 'Invalid input';
          } else if (res.status === 500) {
            errorMsg = data.error || 'Server error';
          }
          throw new Error(errorMsg);
        }
        return data;
      }).catch(function (err) {
        // Nếu parse JSON lỗi
        if (err instanceof SyntaxError) {
          throw new Error('Server returned invalid JSON. Check if PHP is running correctly.');
        }
        throw err;
      });
    }).catch(function (err) {
      // Network error hoặc CORS error
      if (err.message.indexOf('fetch') !== -1 || err.message.indexOf('Failed') !== -1) {
        throw new Error('Cannot connect to server. Check network connection and API URL: ' + API + path);
      }
      throw err;
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
