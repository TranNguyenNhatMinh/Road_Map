(function () {
  const STORAGE_KEY = "destination-b2-tracker";
  const MONTHS = window.DESTINATION_B2_MONTHS;
  if (!MONTHS) return;

  const MOTIVATION_BY_PROGRESS = {
    0: "Bắt đầu Unit 1 — từng bước nhỏ sẽ đưa bạn tới B2!",
    10: "Bạn đã bắt đầu. Giữ đà nhé!",
    25: "Đã qua 1/4 chặng. Rất tốt!",
    50: "Nửa chặng rồi — tin vào bản thân.",
    75: "Sắp xong — đừng dừng lại!",
    90: "Gần tới rồi! Ôn lại và đi thi thôi.",
    100: "Bạn đã hoàn thành tất cả units. Chúc bạn đạt B2!"
  };

  const COMPLETION_TOASTS = [
    "Unit xong — giữ đà! 💪",
    "Tiến độ tốt! ✨",
    "Cứ thế — B2 đang chờ! 🌟",
    "Một unit nữa hoàn thành!",
    "Rất hay ra thi — ôn kỹ nhé!"
  ];

  function getAllUnitIds() {
    const ids = [];
    MONTHS.forEach(function (m) {
      m.weeks.forEach(function (w) {
        w.units.forEach(function (u) {
          ids.push(u.id);
        });
      });
    });
    return ids;
  }

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

  function getProgressMessage(pct) {
    const thresholds = [0, 10, 25, 50, 75, 90, 100];
    let chosen = MOTIVATION_BY_PROGRESS[0];
    thresholds.forEach(function (t) {
      if (pct >= t) chosen = MOTIVATION_BY_PROGRESS[t];
    });
    return chosen;
  }

  function showToast(message) {
    const el = document.getElementById("b2Toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      el.classList.remove("show");
    }, 2500);
  }

  function toggleComplete(unitId) {
    const o = getStored();
    const wasCompleted = o[unitId] === true;
    o[unitId] = !o[unitId];
    setStored(o);
    updateProgress();
    updateUnitUI(unitId);
    if (o[unitId] && !wasCompleted) {
      const msg = COMPLETION_TOASTS[Math.floor(Math.random() * COMPLETION_TOASTS.length)];
      showToast(msg);
    }
  }

  function updateProgress() {
    const ids = getAllUnitIds();
    const completed = getCompletedSet();
    const total = ids.length;
    const done = completed.size;
    const pct = total ? Math.round((done / total) * 100) : 0;

    const bar = document.getElementById("globalProgressBar");
    const statCompleted = document.getElementById("statCompleted");
    const statTotal = document.getElementById("statTotal");
    const statPct = document.getElementById("statPct");
    const progressMsg = document.getElementById("motivationProgress");

    if (bar) bar.style.width = pct + "%";
    if (statCompleted) statCompleted.textContent = done;
    if (statTotal) statTotal.textContent = total;
    if (statPct) statPct.textContent = "(" + pct + "%)";
    if (progressMsg) progressMsg.textContent = getProgressMessage(pct);
  }

  function updateUnitUI(unitId) {
    const completed = getCompletedSet();
    const row = document.querySelector("[data-unit-id=\"" + unitId + "\"]");
    if (!row) return;
    const btn = row.querySelector(".module-complete-btn");
    if (completed.has(unitId)) {
      row.classList.add("completed");
      if (btn) btn.setAttribute("aria-pressed", "true");
    } else {
      row.classList.remove("completed");
      if (btn) btn.setAttribute("aria-pressed", "false");
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function renderCurriculum() {
    const container = document.getElementById("curriculum");
    if (!container) return;

    const completed = getCompletedSet();
    let html = "";

    MONTHS.forEach(function (month) {
      html += "<section class=\"topic destination-b2-month\" data-topic-id=\"" + escapeHtml(month.id) + "\">";
      html += "<h3 class=\"topic-title\">" + escapeHtml(month.title) + "</h3>";
      if (month.goal) {
        html += "<p class=\"topic-goal\">Mục tiêu: " + escapeHtml(month.goal) + "</p>";
      }

      month.weeks.forEach(function (week) {
        html += "<div class=\"destination-b2-week\">";
        html += "<h4 class=\"week-title\">" + escapeHtml(week.title) + "</h4>";
        html += "<ul class=\"module-list\">";

        week.units.forEach(function (u) {
          const isDone = completed.has(u.id);
          html += "<li class=\"module-row " + (isDone ? "completed" : "") + "\" data-unit-id=\"" + escapeHtml(u.id) + "\">";
          html += "<button type=\"button\" class=\"module-complete-btn\" aria-pressed=\"" + isDone + "\" aria-label=\"" + (isDone ? "Bỏ đánh dấu" : "Đánh dấu hoàn thành") + "\">";
          html += "<span class=\"check-icon\" aria-hidden=\"true\"></span>";
          html += "</button>";
          html += "<div class=\"module-body\"><span class=\"module-title\">" + escapeHtml(u.title) + "</span></div>";
          html += "</li>";
        });

        html += "</ul>";
        if (week.tip) {
          html += "<p class=\"week-tip\">" + escapeHtml(week.tip) + "</p>";
        }
        html += "</div>";
      });

      html += "</section>";
    });

    container.innerHTML = html;

    container.querySelectorAll(".module-row").forEach(function (row) {
      row.addEventListener("click", function () {
        const id = this.getAttribute("data-unit-id");
        if (id) toggleComplete(id);
      });
    });

    updateProgress();
  }

  renderCurriculum();
})();
