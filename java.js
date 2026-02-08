(function () {
  const STORAGE_KEY = "java-roadmap-tracker";

  function getStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function setStored(obj) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }

  function getCompletedSet() {
    return new Set(Object.keys(getStored()).filter(function (id) {
      return getStored()[id] === true;
    }));
  }

  function getAllModuleIds() {
    if (!window.JAVA_TOPICS) return [];
    return window.JAVA_TOPICS.flatMap(function (t) {
      return t.modules.map(function (m) { return m.id; });
    });
  }

  function toggleComplete(moduleId) {
    var o = getStored();
    var wasCompleted = o[moduleId] === true;
    o[moduleId] = !o[moduleId];
    setStored(o);
    updateJavaProgress();
    updateModuleUI(moduleId);
    if (o[moduleId] && !wasCompleted) {
      showToast("One item done! Keep it up.");
    }
  }

  function updateJavaProgress() {
    var ids = getAllModuleIds();
    var completed = getCompletedSet();
    var total = ids.length;
    var done = completed.size;
    var pct = total ? Math.round((done / total) * 100) : 0;
    var bar = document.getElementById("javaProgressBar");
    var statDone = document.getElementById("javaStatDone");
    var statTotal = document.getElementById("javaStatTotal");
    if (bar) bar.style.width = pct + "%";
    if (statDone) statDone.textContent = done;
    if (statTotal) statTotal.textContent = total;
  }

  function updateModuleUI(moduleId) {
    var completed = getCompletedSet();
    var row = document.querySelector("[data-module-id=\"" + moduleId + "\"]");
    if (!row) return;
    var btn = row.querySelector(".module-complete-btn");
    if (completed.has(moduleId)) {
      row.classList.add("completed");
      if (btn) btn.setAttribute("aria-pressed", "true");
    } else {
      row.classList.remove("completed");
      if (btn) btn.setAttribute("aria-pressed", "false");
    }
  }

  function showToast(message) {
    var el = document.getElementById("javaToast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      el.classList.remove("show");
    }, 2500);
  }

  function renderCurriculum() {
    var container = document.getElementById("javaCurriculum");
    if (!container || !window.JAVA_TOPICS) return;

    var completed = getCompletedSet();
    var ids = getAllModuleIds();
    var total = ids.length;
    var done = completed.size;
    var pct = total ? Math.round((done / total) * 100) : 0;

    var progressHtml = "<section class=\"progress-panel panel\">";
    progressHtml += "<div class=\"progress-header\"><h2 class=\"panel-title\">Overall progress</h2>";
    progressHtml += "<div class=\"progress-stats\"><span class=\"stat\" id=\"javaStatDone\">" + done + "</span><span class=\"stat-label\">/</span><span class=\"stat\" id=\"javaStatTotal\">" + total + "</span><span class=\"stat-label\">items</span></div></div>";
    progressHtml += "<div class=\"progress-bar-wrap\"><div class=\"progress-bar\" id=\"javaProgressBar\" style=\"width:" + pct + "%\"></div></div></section>";

    var html = progressHtml;

    window.JAVA_TOPICS.forEach(function (topic) {
      html += "<section class=\"topic\" data-topic-id=\"" + topic.id + "\">";
      html += "<h3 class=\"topic-title\">" + topic.title + "</h3>";
      html += "<ul class=\"module-list\">";
      topic.modules.forEach(function (mod) {
        var isDone = completed.has(mod.id);
        html += "<li class=\"module-row " + (isDone ? "completed" : "") + "\" data-module-id=\"" + mod.id + "\">";
        html += "<button type=\"button\" class=\"module-complete-btn\" aria-pressed=\"" + isDone + "\" aria-label=\"" + (isDone ? "Mark incomplete" : "Mark complete") + "\"><span class=\"check-icon\" aria-hidden=\"true\"></span></button>";
        html += "<div class=\"module-body\"><span class=\"module-title\">" + mod.title + "</span></div>";
        html += "</li>";
      });
      html += "</ul></section>";
    });

    container.innerHTML = html;

    container.querySelectorAll(".module-row").forEach(function (row) {
      row.addEventListener("click", function () {
        var id = row.getAttribute("data-module-id");
        if (id) toggleComplete(id);
      });
    });

    updateJavaProgress();
  }

  renderCurriculum();
})();
