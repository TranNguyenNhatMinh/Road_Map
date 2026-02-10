(function () {
  const STORAGE_KEY = "english-vocabulary";
  const vocabList = document.getElementById("vocabList");
  const addForm = document.getElementById("addVocabForm");
  const bulkForm = document.getElementById("bulkImportForm");
  const englishInput = document.getElementById("englishInput");
  const vietnameseInput = document.getElementById("vietnameseInput");
  const bulkInput = document.getElementById("bulkInput");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const vocabCount = document.getElementById("vocabCount");
  const exportBtn = document.getElementById("exportBtn");
  const importBtn = document.getElementById("importBtn");
  const importModal = document.getElementById("importModal");
  const importInput = document.getElementById("importInput");
  const fileInput = document.getElementById("fileInput");
  const fileUploadArea = document.getElementById("fileUploadArea");
  const cancelImportBtn = document.getElementById("cancelImportBtn");
  const confirmImportBtn = document.getElementById("confirmImportBtn");
  const clearBulkBtn = document.getElementById("clearBulkBtn");
  const editModal = document.getElementById("editModal");
  const editEnglishInput = document.getElementById("editEnglishInput");
  const editVietnameseInput = document.getElementById("editVietnameseInput");
  const editIdInput = document.getElementById("editIdInput");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const saveEditBtn = document.getElementById("saveEditBtn");
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  let currentVocabulary = [];
  let filteredVocabulary = [];

  // Load vocabulary from localStorage
  function loadVocabulary() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  // Save vocabulary to localStorage and sync to server if logged in
  function saveVocabulary(vocab) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vocab));
    if (typeof window.RoadmapAuth !== 'undefined') {
      window.RoadmapAuth.getCurrentUser().then(function (data) {
        if (!data.user) return;
        return fetch(window.RoadmapAuth.getApiBase() + '/vocabulary.php', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: vocab })
        }).then(function (r) { return r.json(); });
      }).then(function (data) {
        if (data && data.ok && data.items && data.items.length >= 0) {
          currentVocabulary = data.items;
          filterVocabulary(searchInput ? searchInput.value : '');
        }
      }).catch(function () {});
    }
  }

  // Generate unique ID
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Parse bulk import text
  function parseBulkText(text) {
    const lines = text.split('\n').filter(function(line) {
      return line.trim().length > 0;
    });
    
    const vocab = [];
    const separators = [' - ', ':', '\t', ' — ', ' – '];
    
    lines.forEach(function(line) {
      line = line.trim();
      if (!line) return;
      
      let english = '';
      let vietnamese = '';
      let found = false;
      
      // Try each separator
      for (let i = 0; i < separators.length; i++) {
        const sep = separators[i];
        const index = line.indexOf(sep);
        if (index > 0) {
          english = line.substring(0, index).trim();
          vietnamese = line.substring(index + sep.length).trim();
          found = true;
          break;
        }
      }
      
      // If no separator found, try to split by first space
      if (!found && line.includes(' ')) {
        const firstSpace = line.indexOf(' ');
        english = line.substring(0, firstSpace).trim();
        vietnamese = line.substring(firstSpace + 1).trim();
        found = true;
      }
      
      if (found && english && vietnamese) {
        vocab.push({
          english: english,
          vietnamese: vietnamese
        });
      }
    });
    
    return vocab;
  }

  // Sort vocabulary
  function sortVocabulary(vocab, sortBy) {
    const sorted = [...vocab];
    
    switch(sortBy) {
      case 'english-asc':
        sorted.sort(function(a, b) {
          return a.english.localeCompare(b.english);
        });
        break;
      case 'english-desc':
        sorted.sort(function(a, b) {
          return b.english.localeCompare(a.english);
        });
        break;
      case 'vietnamese-asc':
        sorted.sort(function(a, b) {
          return a.vietnamese.localeCompare(b.vietnamese);
        });
        break;
      case 'vietnamese-desc':
        sorted.sort(function(a, b) {
          return b.vietnamese.localeCompare(a.vietnamese);
        });
        break;
      case 'newest':
        sorted.sort(function(a, b) {
          return parseInt(b.id, 36) - parseInt(a.id, 36);
        });
        break;
      case 'oldest':
        sorted.sort(function(a, b) {
          return parseInt(a.id, 36) - parseInt(b.id, 36);
        });
        break;
      default:
        // Keep original order
        break;
    }
    
    return sorted;
  }

  // Filter vocabulary by search term
  function filterVocabulary(searchTerm) {
    let vocab = currentVocabulary;
    
    // Apply search filter
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      vocab = vocab.filter(function(item) {
        return item.english.toLowerCase().includes(term) ||
               item.vietnamese.toLowerCase().includes(term);
      });
    }
    
    // Apply sort
    const sortBy = sortSelect ? sortSelect.value : 'default';
    filteredVocabulary = sortVocabulary(vocab, sortBy);
    renderVocabulary();
  }

  // Render vocabulary list
  function renderVocabulary() {
    const vocab = filteredVocabulary.length > 0 ? filteredVocabulary : currentVocabulary;
    
    if (vocab.length === 0) {
      vocabList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <p class="empty-message">No vocabulary found.</p>
          <p class="empty-hint">${currentVocabulary.length === 0 ? 'Add your first word to get started!' : 'Try a different search term.'}</p>
        </div>
      `;
      updateVocabCount();
      return;
    }

    vocabList.innerHTML = vocab.map(function (item, index) {
      return `
        <div class="vocab-item" data-id="${item.id}" style="animation-delay: ${index * 0.03}s">
          <div class="vocab-number">${index + 1}</div>
          <div class="vocab-content">
            <div class="vocab-english">${escapeHtml(item.english)}</div>
            <div class="vocab-vietnamese">${escapeHtml(item.vietnamese)}</div>
          </div>
          <div class="vocab-actions">
            <button class="btn-edit" onclick="editVocab('${item.id}')" title="Edit">
              <span>✏️</span>
              <span class="btn-text">Edit</span>
            </button>
            <button class="btn-delete" onclick="deleteVocab('${item.id}')" title="Delete">
              <span>🗑️</span>
              <span class="btn-text">Delete</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
    updateVocabCount();
  }

  // Update vocabulary count
  function updateVocabCount() {
    if (vocabCount) {
      const total = currentVocabulary.length;
      const filtered = filteredVocabulary.length > 0 ? filteredVocabulary.length : total;
      vocabCount.textContent = filtered === total ? `(${total})` : `(${filtered}/${total})`;
    }
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Tab switching
  tabButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // Update buttons
      tabButtons.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      
      // Update content
      tabContents.forEach(function(content) {
        content.classList.remove('active');
      });
      document.getElementById(targetTab === 'single' ? 'singleForm' : 'bulkForm').classList.add('active');
    });
  });

  // Bulk import
  bulkForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = bulkInput.value.trim();
    
    if (!text) {
      alert('Please paste vocabulary text!');
      return;
    }
    
    const parsed = parseBulkText(text);
    
    if (parsed.length === 0) {
      alert('No valid vocabulary found. Please check the format:\nword - meaning\nword: meaning\nword\tmeaning');
      return;
    }
    
    const vocab = loadVocabulary();
    let added = 0;
    
    parsed.forEach(function(item) {
      // Check for duplicates
      const exists = vocab.some(function(v) {
        return v.english.toLowerCase() === item.english.toLowerCase() &&
               v.vietnamese.toLowerCase() === item.vietnamese.toLowerCase();
      });
      
      if (!exists) {
        vocab.push({
          id: generateId(),
          english: item.english,
          vietnamese: item.vietnamese
        });
        added++;
      }
    });
    
    saveVocabulary(vocab);
    currentVocabulary = vocab;
    filterVocabulary(searchInput.value);
    bulkInput.value = '';
    showToast(`Successfully imported ${added} word(s)!`);
  });

  // Clear bulk input
  clearBulkBtn.addEventListener('click', function() {
    bulkInput.value = '';
    bulkInput.focus();
  });

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      filterVocabulary(this.value);
    });
  }

  // Sort functionality
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      filterVocabulary(searchInput ? searchInput.value : '');
    });
  }

  // Export vocabulary
  exportBtn.addEventListener('click', function() {
    const vocab = currentVocabulary;
    if (vocab.length === 0) {
      alert('No vocabulary to export!');
      return;
    }
    
    // Export as JSON for better compatibility
    const jsonData = JSON.stringify(vocab, null, 2);
    const textData = vocab.map(function(item) {
      return item.english + ' - ' + item.vietnamese;
    }).join('\n');
    
    // Create download file
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vocabulary-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
    
    // Also copy text format to clipboard
    navigator.clipboard.writeText(textData).then(function() {
      showToast('Vocabulary exported! JSON file downloaded and text copied to clipboard.');
    }).catch(function() {
      showToast('Vocabulary exported as JSON file!');
    });
  });

  // Import vocabulary
  importBtn.addEventListener('click', function() {
    importModal.style.display = 'flex';
    importInput.value = '';
    fileInput.value = '';
  });

  // File upload area click
  fileUploadArea.addEventListener('click', function() {
    fileInput.click();
  });

  // File drag and drop
  fileUploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('drag-over');
  });

  fileUploadArea.addEventListener('dragleave', function() {
    this.classList.remove('drag-over');
  });

  fileUploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      handleFileUpload(files[0]);
    }
  });

  // File input change
  fileInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  });

  // Handle file upload
  function handleFileUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      
      // Try to parse as JSON first
      try {
        const jsonData = JSON.parse(content);
        if (Array.isArray(jsonData)) {
          importInput.value = jsonData.map(function(item) {
            return item.english + ' - ' + item.vietnamese;
          }).join('\n');
          showToast('File loaded successfully!');
          return;
        }
      } catch (err) {
        // Not JSON, treat as text
      }
      
      // Treat as text file
      importInput.value = content;
      showToast('File loaded successfully!');
    };
    reader.readAsText(file);
  }

  // Cancel import
  cancelImportBtn.addEventListener('click', function() {
    importModal.style.display = 'none';
    importInput.value = '';
    fileInput.value = '';
  });

  // Confirm import
  confirmImportBtn.addEventListener('click', function() {
    const text = importInput.value.trim();
    
    if (!text) {
      alert('Please paste vocabulary or upload a file!');
      return;
    }
    
    // Try to parse as JSON first
    let parsed = [];
    try {
      const jsonData = JSON.parse(text);
      if (Array.isArray(jsonData)) {
        parsed = jsonData.map(function(item) {
          return {
            english: item.english || '',
            vietnamese: item.vietnamese || ''
          };
        }).filter(function(item) {
          return item.english && item.vietnamese;
        });
      }
    } catch (err) {
      // Not JSON, parse as text
      parsed = parseBulkText(text);
    }
    
    if (parsed.length === 0) {
      alert('No valid vocabulary found. Please check the format.');
      return;
    }
    
    const vocab = loadVocabulary();
    let added = 0;
    let skipped = 0;
    
    parsed.forEach(function(item) {
      // Check for duplicates
      const exists = vocab.some(function(v) {
        return v.english.toLowerCase() === item.english.toLowerCase() &&
               v.vietnamese.toLowerCase() === item.vietnamese.toLowerCase();
      });
      
      if (!exists) {
        vocab.push({
          id: generateId(),
          english: item.english,
          vietnamese: item.vietnamese
        });
        added++;
      } else {
        skipped++;
      }
    });
    
    saveVocabulary(vocab);
    currentVocabulary = vocab;
    filterVocabulary(searchInput.value);
    importModal.style.display = 'none';
    importInput.value = '';
    fileInput.value = '';
    
    let message = `Successfully imported ${added} word(s)!`;
    if (skipped > 0) {
      message += ` ${skipped} duplicate(s) skipped.`;
    }
    showToast(message);
  });

  // Close import modal when clicking outside
  importModal.addEventListener('click', function(e) {
    if (e.target === importModal) {
      importModal.style.display = 'none';
      importInput.value = '';
      fileInput.value = '';
    }
  });

  // Add new vocabulary
  addForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const english = englishInput.value.trim();
    const vietnamese = vietnameseInput.value.trim();

    if (!english || !vietnamese) {
      showToast('Please enter both English word and Vietnamese meaning!', 'error');
      return;
    }

    // Validate input length
    if (english.length > 100 || vietnamese.length > 100) {
      showToast('Words are too long (max 100 characters)!', 'error');
      return;
    }

    const vocab = loadVocabulary();
    
    // Check for duplicates
    const exists = vocab.some(function(v) {
      return v.english.toLowerCase() === english.toLowerCase() &&
             v.vietnamese.toLowerCase() === vietnamese.toLowerCase();
    });
    
    if (exists) {
      alert('This vocabulary already exists!');
      return;
    }
    
    vocab.push({
      id: generateId(),
      english: english,
      vietnamese: vietnamese
    });

    saveVocabulary(vocab);
    currentVocabulary = vocab;
    englishInput.value = '';
    vietnameseInput.value = '';
    filterVocabulary(searchInput ? searchInput.value : '');
    showToast('Vocabulary added successfully!', 'success');
  });

  // Edit vocabulary (exposed globally)
  window.editVocab = function (id) {
    const vocab = loadVocabulary();
    const item = vocab.find(function (v) { return v.id === id; });
    if (!item) return;

    editIdInput.value = id;
    editEnglishInput.value = item.english;
    editVietnameseInput.value = item.vietnamese;
    editModal.style.display = 'flex';
  };

  // Delete vocabulary (exposed globally)
  window.deleteVocab = function (id) {
    const item = currentVocabulary.find(function(v) { return v.id === id; });
    const word = item ? item.english : 'this vocabulary';
    
    if (!confirm(`Are you sure you want to delete "${word}"?`)) return;

    const vocab = loadVocabulary();
    const filtered = vocab.filter(function (v) { return v.id !== id; });
    saveVocabulary(filtered);
    currentVocabulary = filtered;
    filterVocabulary(searchInput ? searchInput.value : '');
    showToast('Vocabulary deleted!', 'success');
  };

  // Cancel edit
  cancelEditBtn.addEventListener('click', function () {
    editModal.style.display = 'none';
  });

  // Save edit
  saveEditBtn.addEventListener('click', function () {
    const id = editIdInput.value;
    const english = editEnglishInput.value.trim();
    const vietnamese = editVietnameseInput.value.trim();

    if (!english || !vietnamese) {
      showToast('Please enter both English word and Vietnamese meaning!', 'error');
      return;
    }

    // Validate input length
    if (english.length > 100 || vietnamese.length > 100) {
      showToast('Words are too long (max 100 characters)!', 'error');
      return;
    }

    const vocab = loadVocabulary();
    const index = vocab.findIndex(function (v) { return v.id === id; });
    if (index === -1) return;

    vocab[index] = {
      id: id,
      english: english,
      vietnamese: vietnamese
    };

    saveVocabulary(vocab);
    currentVocabulary = vocab;
    editModal.style.display = 'none';
    filterVocabulary(searchInput ? searchInput.value : '');
    showToast('Vocabulary updated!', 'success');
  });

  // Close modal when clicking outside
  editModal.addEventListener('click', function (e) {
    if (e.target === editModal) {
      editModal.style.display = 'none';
    }
  });

  // Show toast notification
  function showToast(message, type) {
    const toast = document.getElementById('adminToast');
    if (toast) {
      toast.textContent = message;
      toast.className = 'toast show';
      if (type === 'error') {
        toast.classList.add('toast-error');
      } else if (type === 'success') {
        toast.classList.add('toast-success');
      }
      setTimeout(function () {
        toast.classList.remove('show');
        toast.classList.remove('toast-error');
        toast.classList.remove('toast-success');
      }, 3000);
    }
  }

  // Initialize: load from API if logged in, else localStorage
  function initVocabulary() {
    function finish(vocab) {
      currentVocabulary = vocab || [];
      filteredVocabulary = [];
      renderVocabulary();
      if (englishInput) englishInput.focus();
    }
    if (typeof window.RoadmapAuth !== 'undefined') {
      window.RoadmapAuth.getCurrentUser().then(function (data) {
        if (data.user) {
          return fetch(window.RoadmapAuth.getApiBase() + '/vocabulary.php', { credentials: 'include' })
            .then(function (r) { return r.json(); })
            .then(function (res) { return res.ok && res.items ? res.items : loadVocabulary(); });
        }
        return loadVocabulary();
      }).then(finish).catch(function () { finish(loadVocabulary()); });
    } else {
      finish(loadVocabulary());
    }
  }
  initVocabulary();
})();
