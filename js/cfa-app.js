(function () {
  const STORAGE_KEY = "cfa-study-tracker";

  const MOTIVATION_QUOTES = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "The best investment you can make is in your own abilities.", author: "Warren Buffett" },
    { text: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk" },
    { text: "I think it's possible for ordinary people to choose to be extraordinary.", author: "Elon Musk" },
    { text: "We all need people who will give us feedback. That's how we improve.", author: "Bill Gates" },
    { text: "Success is a lousy teacher. It seduces smart people into thinking they can't lose.", author: "Bill Gates" },
    { text: "If you're not stubborn, you'll give up on experiments too soon. And if you're not flexible, you'll pound your head against the wall.", author: "Jeff Bezos" },
    { text: "The biggest risk is not taking any risk.", author: "Mark Zuckerberg" },
    { text: "The biggest adventure you can take is to live the life of your dreams.", author: "Oprah Winfrey" },
    { text: "If someone offers you an amazing opportunity and you're not sure you can do it, say yes – then learn how to do it later.", author: "Richard Branson" },
    { text: "Today is hard, tomorrow will be worse, but the day after tomorrow will be sunshine.", author: "Jack Ma" },
    { text: "Always deliver more than expected.", author: "Larry Page" },
    { text: "It takes 20 years to build a reputation and five minutes to ruin it. Think about that and you'll do things differently.", author: "Warren Buffett" },
    { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" }
  ];

  const MOTIVATION_BY_PROGRESS = {
    0: "Start with the first module — you won't regret it!",
    10: "You've started. Keep the momentum!",
    25: "You're a quarter of the way there. Great!",
    50: "Halfway there! Believe in yourself.",
    75: "Almost done — don't stop now!",
    90: "Nearly there! One final review and you'll be ready.",
    100: "You've completed all modules. Congrats — review and ace the exam!"
  };

  const COMPLETION_TOASTS = [
    "Nice! Another module done. 💪",
    "You're making great progress! ✨",
    "Keep it up, the finish line is waiting! 🌟",
    "One more section complete — well done!",
    "At this rate, the exam won't stand a chance!"
  ];

  function getProgressMessage(pct) {
    const thresholds = [0, 10, 25, 50, 75, 90, 100];
    let chosen = MOTIVATION_BY_PROGRESS[0];
    for (const t of thresholds) {
      if (pct >= t) chosen = MOTIVATION_BY_PROGRESS[t];
    }
    return chosen;
  }

  function showToast(message) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      el.classList.remove("show");
    }, 2500);
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
    if (window.RoadmapAuth && window.RoadmapProgress) {
      window.RoadmapAuth.getCurrentUser().then(function (d) {
        if (d && d.user) {
          var ids = Object.keys(obj).filter(function (k) { return obj[k] === true; });
          window.RoadmapProgress.saveRoadmap(STORAGE_KEY, ids).catch(function () {});
        }
      }).catch(function () {});
    }
  }

  function getAllModuleIds() {
    return window.CFA_TOPICS.flatMap((t) => t.modules.map((m) => m.id));
  }

  function getCompletedSet() {
    return new Set(Object.keys(getStored()).filter((id) => getStored()[id] === true));
  }

  function toggleComplete(moduleId) {
    const o = getStored();
    const wasCompleted = o[moduleId] === true;
    o[moduleId] = !o[moduleId];
    setStored(o);
    updateProgress();
    updateModuleUI(moduleId);
    if (o[moduleId] && !wasCompleted) {
      const msg = COMPLETION_TOASTS[Math.floor(Math.random() * COMPLETION_TOASTS.length)];
      showToast(msg);
    }
  }

  function updateProgress() {
    const ids = getAllModuleIds();
    const completed = getCompletedSet();
    const total = ids.length;
    const done = completed.size;
    const pct = total ? Math.round((done / total) * 100) : 0;

    const bar = document.getElementById("globalProgressBar");
    const statCompleted = document.getElementById("statCompleted");
    const statTotal = document.getElementById("statTotal");
    const statPct = document.getElementById("statPct");

    if (bar) bar.style.width = pct + "%";
    if (statCompleted) statCompleted.textContent = done;
    if (statTotal) statTotal.textContent = total;
    if (statPct) statPct.textContent = "(" + pct + "%)";

    var progressMsg = document.getElementById("motivationProgress");
    if (progressMsg) progressMsg.textContent = getProgressMessage(pct);
  }

  function updateModuleUI(moduleId) {
    const completed = getCompletedSet();
    const row = document.querySelector(`[data-module-id="${moduleId}"]`);
    if (!row) return;
    const btn = row.querySelector(".module-complete-btn");
    const label = row.querySelector(".module-title");
    if (completed.has(moduleId)) {
      row.classList.add("completed");
      if (btn) btn.setAttribute("aria-pressed", "true");
      if (label) label.setAttribute("aria-label", "Completed");
    } else {
      row.classList.remove("completed");
      if (btn) btn.setAttribute("aria-pressed", "false");
      if (label) label.removeAttribute("aria-label");
    }
  }

  function renderCurriculum() {
    const container = document.getElementById("curriculum");
    if (!container || !window.CFA_TOPICS) return;

    const completed = getCompletedSet();

    let html = "";
    window.CFA_TOPICS.forEach((topic) => {
      html += `<section class="topic" data-topic-id="${topic.id}">`;
      html += `<h3 class="topic-title">${topic.title}</h3>`;
      html += `<ul class="module-list">`;

      topic.modules.forEach((mod) => {
        const isDone = completed.has(mod.id);
        const prereq = mod.prereq
          ? `<span class="module-prereq">Prerequisite: ${mod.prereq}</span>`
          : "";

        html += `
          <li class="module-row ${isDone ? "completed" : ""}" data-module-id="${mod.id}">
            <button type="button" class="module-complete-btn" aria-pressed="${isDone}" aria-label="${isDone ? "Mark incomplete" : "Mark complete"}">
              <span class="check-icon" aria-hidden="true"></span>
            </button>
            <div class="module-body">
              <span class="module-title">${mod.title}</span>
              ${prereq}
            </div>
          </li>`;
      });

      html += `</ul></section>`;
    });

    container.innerHTML = html;

    container.querySelectorAll(".module-row").forEach((row) => {
      row.addEventListener("click", function () {
        const id = this.getAttribute("data-module-id");
        if (id) toggleComplete(id);
      });
    });

    updateProgress();
  }

  function setRandomMotivation() {
    var q = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
    var textEl = document.getElementById("motivationText");
    var authorEl = document.getElementById("motivationAuthor");
    if (textEl) textEl.textContent = q.text;
    if (authorEl) authorEl.textContent = "— " + q.author;
  }

  setRandomMotivation();

  function init() {
    if (window.RoadmapAuth && window.RoadmapProgress) {
      window.RoadmapAuth.getCurrentUser().then(function (d) {
        if (d && d.user) {
          return window.RoadmapProgress.loadStoredForRoadmap(STORAGE_KEY).then(function (serverStored) {
            // Luôn đồng bộ localStorage theo server cho user hiện tại
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(serverStored));
            } catch (_) {}
          });
        }
      }).then(function () { renderCurriculum(); }).catch(function () { renderCurriculum(); });
    } else {
      renderCurriculum();
    }
  }
  init();
})();
