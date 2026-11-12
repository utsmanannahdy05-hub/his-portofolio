document.addEventListener('DOMContentLoaded', () => {

  // ========================================================
  // 1. SISTEM CATATAN (NOTES) - CRUD + LocalStorage
  // ========================================================
  const defaultNotes = [
    { id: 1, category: 'quote', content: 'Cara terbaik untuk memprediksi masa depan adalah dengan menciptakannya.', author: 'Peter Drucker' },
    { id: 2, category: 'hadits', content: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.', author: 'HR. Ahmad' },
    { id: 3, category: 'history', content: 'ENIAC, komputer elektronik pertama di dunia, mulai beroperasi pada tahun 1946.', author: 'Sejarah Komputer' }
  ];

  let notes = JSON.parse(localStorage.getItem('my_portfolio_notes')) || defaultNotes;

  const notesContainer = document.getElementById('notesContainer');
  const addNoteForm = document.getElementById('addNoteForm');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentFilter = 'all';

  function renderNotes() {
    notesContainer.innerHTML = '';
    const filteredNotes = notes.filter(n => currentFilter === 'all' || n.category === currentFilter);

    if (filteredNotes.length === 0) {
      notesContainer.innerHTML = `<p class="col-span-3 text-center text-slate-400 text-xs py-4">Belum ada catatan untuk kategori ini.</p>`;
      return;
    }

    filteredNotes.forEach(note => {
      const card = document.createElement('div');
      card.className = `note-card ${note.category} p-5 rounded-2xl bg-white border border-softpink-200 shadow-sm relative group flex flex-col justify-between`;
      card.innerHTML = `
        <div>
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold uppercase text-softpink-600 bg-softpink-100 px-2 py-0.5 rounded-md border border-softpink-200">${note.category}</span>
            <button onclick="deleteNote(${note.id})" class="text-slate-400 hover:text-red-500 text-xs transition-colors p-1" title="Hapus Catatan">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <p class="mt-3 text-slate-700 text-xs italic">"${escapeHtml(note.content)}"</p>
        </div>
        <span class="block mt-3 text-[11px] font-medium text-slate-400">— ${escapeHtml(note.author)}</span>
      `;
      notesContainer.appendChild(card);
    });
  }

  addNoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = document.getElementById('noteCategory').value;
    const content = document.getElementById('noteContent').value.trim();
    const author = document.getElementById('noteAuthor').value.trim();

    if (content && author) {
      const newNote = { id: Date.now(), category, content, author };
      notes.unshift(newNote);
      saveAndRenderNotes();

      document.getElementById('noteContent').value = '';
      document.getElementById('noteAuthor').value = '';
    }
  });

  window.deleteNote = function(id) {
    notes = notes.filter(n => n.id !== id);
    saveAndRenderNotes();
  };

  function saveAndRenderNotes() {
    localStorage.setItem('my_portfolio_notes', JSON.stringify(notes));
    renderNotes();
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-softpink-500', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'text-softpink-500');
      });

      btn.classList.remove('bg-white', 'text-softpink-500');
      btn.classList.add('bg-softpink-500', 'text-white', 'shadow-sm');

      currentFilter = btn.getAttribute('data-filter');
      renderNotes();
    });
  });

  renderNotes();


  // ========================================================
  // 2. SISTEM FEEDBACK - Tersimpan di LocalStorage & Diterima
  // ========================================================
  const defaultFeedbacks = [
    { name: 'Ahmad', message: 'Desain websitenya sangat rapi dan warnanya lembut sekali!' }
  ];

  let feedbacks = JSON.parse(localStorage.getItem('my_portfolio_feedbacks')) || defaultFeedbacks;
  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackList = document.getElementById('feedbackList');

  function renderFeedbacks() {
    feedbackList.innerHTML = '';
    feedbacks.forEach(fb => {
      const card = document.createElement('div');
      card.className = 'p-3 rounded-xl bg-white border border-softpink-200 shadow-sm';
      card.innerHTML = `
        <h4 class="font-bold text-slate-800 text-xs">${escapeHtml(fb.name)}</h4>
        <p class="text-slate-600 text-xs mt-0.5">${escapeHtml(fb.message)}</p>
      `;
      feedbackList.appendChild(card);
    });
  }

  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    const message = document.getElementById('messageInput').value.trim();

    if (name && message) {
      feedbacks.unshift({ name, message });
      localStorage.setItem('my_portfolio_feedbacks', JSON.stringify(feedbacks));
      renderFeedbacks();

      document.getElementById('nameInput').value = '';
      document.getElementById('messageInput').value = '';
      alert('Terima kasih! Feedback kamu berhasil dikirim dan diterima.');
    }
  });

  renderFeedbacks();

  // Helper pengaman teks HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

});