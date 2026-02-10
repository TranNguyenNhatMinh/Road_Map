/**
 * Sync roadmap progress with server so progress is kept when logging in on another device.
 * Uses api/progress.php (GET all, POST one roadmap).
 * Load auth.js before this. On roadmap pages: load progress from server when user is logged in, then save on each change.
 */

(function () {
  function getApiBase() {
    var path = typeof location !== 'undefined' && location.pathname ? location.pathname : '';
    return (path.indexOf('pages') !== -1 ? '../' : '') + 'api';
  }

  function request(method, path, body) {
    var url = getApiBase() + path;
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

  /** GET all progress: { "java-roadmap-tracker": ["id1","id2"], ... }. On 401 returns {}. */
  function fetchAll() {
    return request('GET', '/progress.php').then(function (data) {
      return data.progress || {};
    }).catch(function () {
      return {};
    });
  }

  /** POST completed ids for one roadmap. completedIds = array of item_id strings. */
  function saveRoadmap(roadmapKey, completedIds) {
    return request('POST', '/progress.php', {
      roadmap_key: roadmapKey,
      completed_ids: completedIds
    });
  }

  /** Convert array of ids to stored object { id: true, ... } */
  function idsToStored(ids) {
    var o = {};
    if (Array.isArray(ids)) {
      ids.forEach(function (id) {
        if (id) o[id] = true;
      });
    }
    return o;
  }

  /**
   * Load server progress for one roadmap key and merge into local state.
   * Call after getCurrentUser() confirms user. Returns Promise<object> = stored shape { id: true, ... } for that key (from server or {}).
   */
  function loadStoredForRoadmap(roadmapKey) {
    return fetchAll().then(function (progress) {
      return idsToStored(progress[roadmapKey] || []);
    });
  }

  window.RoadmapProgress = {
    getApiBase: getApiBase,
    fetchAll: fetchAll,
    saveRoadmap: saveRoadmap,
    idsToStored: idsToStored,
    loadStoredForRoadmap: loadStoredForRoadmap
  };
})();
