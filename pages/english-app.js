(function () {
  const STORAGE_KEY = "english-vocabulary";
  const LEARNED_KEY = "english-learned";
  const flashcardContainer = document.getElementById("flashcardContainer");
  const cardFront = document.getElementById("cardFront");
  const cardBack = document.getElementById("cardBack");
  const cardContent = document.getElementById("cardContent");
  const cardTranslation = document.getElementById("cardTranslation");
  const flipBtn = document.getElementById("flipBtn");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const cardCounter = document.getElementById("cardCounter");
  const cardFlip = document.getElementById("cardFlip");
  const toggleLearnedBtn = document.getElementById("toggleLearnedBtn");
  const learnedCount = document.getElementById("learnedCount");

  let vocabulary = [];
  let currentIndex = 0;
  let isFlipped = false;
  let learnedSet = new Set();
  let touchStartX = 0;
  let touchEndX = 0;

  // Load vocabulary from localStorage
  function loadVocabulary() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  // Load learned vocabulary
  function loadLearned() {
    try {
      const raw = localStorage.getItem(LEARNED_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (_) {
      return new Set();
    }
  }

  // Save learned vocabulary (localStorage only)
  function saveLearned() {
    try {
      localStorage.setItem(LEARNED_KEY, JSON.stringify(Array.from(learnedSet)));
    } catch (_) {}
  }

  // Check if current card is learned
  function isCurrentLearned() {
    if (vocabulary.length === 0) return false;
    return learnedSet.has(vocabulary[currentIndex].id);
  }

  // Toggle learned status
  function toggleLearned() {
    if (vocabulary.length === 0) return;
    const id = vocabulary[currentIndex].id;
    const wasLearned = learnedSet.has(id);
    
    if (wasLearned) {
      learnedSet.delete(id);
      showToast('Removed from learned');
    } else {
      learnedSet.add(id);
      showToast('Marked as learned! ✓');
    }
    saveLearned();
    updateCardUI();
    updateLearnedButton();
    updateLearnedStats();
  }

  // Update learned button text
  function updateLearnedButton() {
    if (!toggleLearnedBtn) return;
    if (isCurrentLearned()) {
      toggleLearnedBtn.classList.add('active');
      toggleLearnedBtn.querySelector('.btn-text').textContent = 'Learned';
      toggleLearnedBtn.querySelector('.btn-icon').textContent = '✓';
    } else {
      toggleLearnedBtn.classList.remove('active');
      toggleLearnedBtn.querySelector('.btn-text').textContent = 'Mark Learned';
      toggleLearnedBtn.querySelector('.btn-icon').textContent = '✓';
    }
  }

  // Initialize: load vocab and learned from API if logged in
  function init() {
    if (!flashcardContainer || !cardFlip || !cardContent || !cardTranslation) {
      console.error('Flashcard elements not found');
      return;
    }
    function start(vocab, learned) {
      vocabulary = vocab || [];
      learnedSet = learned || new Set();
      if (vocabulary.length === 0) {
        flashcardContainer.innerHTML = '<div class="empty-flashcard"><p>No vocabulary yet!</p><a href="english-admin.html" class="btn-admin-link">Add vocabulary here</a></div>';
        return;
      }
      shuffleVocabulary();
      renderCard();
      updateCounter();
      updateLearnedStats();
      setupTouchEvents();
    }
    start(loadVocabulary(), loadLearned());
  }

  // Shuffle vocabulary
  function shuffleVocabulary() {
    for (let i = vocabulary.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [vocabulary[i], vocabulary[j]] = [vocabulary[j], vocabulary[i]];
    }
    currentIndex = 0;
  }

  // Render current card
  function renderCard() {
    if (vocabulary.length === 0 || !cardContent || !cardTranslation) return;

    const current = vocabulary[currentIndex];
    cardContent.textContent = current.english;
    cardTranslation.textContent = current.vietnamese;
    
    // Reset flip state
    if (isFlipped) {
      cardFlip.classList.remove('flipped');
      isFlipped = false;
    }
    
    updateCardUI();
  }

  // Update card UI (learned badge, etc.)
  function updateCardUI() {
    if (!cardFlip) return;
    
    if (isCurrentLearned()) {
      cardFlip.classList.add('learned');
    } else {
      cardFlip.classList.remove('learned');
    }
    updateLearnedButton();
  }

  // Update counter
  function updateCounter() {
    if (cardCounter) {
      cardCounter.textContent = `${currentIndex + 1} / ${vocabulary.length}`;
    }
    updateLearnedStats();
  }

  // Update learned statistics
  function updateLearnedStats() {
    if (!learnedCount) return;
    const total = vocabulary.length;
    const learned = vocabulary.filter(function(item) {
      return learnedSet.has(item.id);
    }).length;
    
    if (total > 0) {
      const percentage = Math.round((learned / total) * 100);
      learnedCount.textContent = `${learned}/${total} learned (${percentage}%)`;
    } else {
      learnedCount.textContent = '0 learned';
    }
  }

  // Flip card
  if (flipBtn) {
    flipBtn.addEventListener('click', function () {
      if (!cardFlip) return;
      cardFlip.classList.toggle('flipped');
      isFlipped = !isFlipped;
    });
  }

  // Card click to flip
  if (cardFlip) {
    cardFlip.addEventListener('click', function(e) {
      // Don't flip if clicking on buttons
      if (e.target.closest('.card-actions')) return;
      cardFlip.classList.toggle('flipped');
      isFlipped = !isFlipped;
    });
  }

  // Next card
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (vocabulary.length === 0) return;
      currentIndex = (currentIndex + 1) % vocabulary.length;
      renderCard();
      updateCounter();
    });
  }

  // Previous card
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      if (vocabulary.length === 0) return;
      currentIndex = (currentIndex - 1 + vocabulary.length) % vocabulary.length;
      renderCard();
      updateCounter();
    });
  }

  // Shuffle cards
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', function () {
      shuffleVocabulary();
      renderCard();
      updateCounter();
      showToast('Cards shuffled!');
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    // Don't handle if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      if (e.key === ' ') {
        if (flipBtn) flipBtn.click();
      } else {
        if (nextBtn) nextBtn.click();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (prevBtn) prevBtn.click();
    } else if (e.key === 'l' || e.key === 'L') {
      e.preventDefault();
      toggleLearned();
    }
  });

  // Touch events for swipe
  function setupTouchEvents() {
    if (!cardFlip) return;
    
    cardFlip.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    cardFlip.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && nextBtn) {
        // Swipe left - next
        nextBtn.click();
      } else if (diff < 0 && prevBtn) {
        // Swipe right - previous
        prevBtn.click();
      }
    }
  }

  // Show toast notification
  function showToast(message) {
    const toast = document.getElementById('englishToast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(function () {
        toast.classList.remove('show');
      }, 2000);
    }
  }

  // Toggle learned button
  if (toggleLearnedBtn) {
    toggleLearnedBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleLearned();
    });
  }

  // Initialize on load
  init();
})();
