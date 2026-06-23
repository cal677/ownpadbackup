// ======================================================
// OWNPAD V3
// PART 1
// ======================================================

// ======================================================
// DOM ELEMENTS
// ======================================================

const noteForm =
    document.getElementById("noteForm");

const noteTitle =
    document.getElementById("noteTitle");

const noteContent =
    document.getElementById("noteContent");

const noteCategory =
    document.getElementById("noteCategory");

const noteImage =
    document.getElementById("noteImage");

const imagePreview =
    document.getElementById("imagePreview");

const notesList =
    document.getElementById("notesList");

const searchNote =
    document.getElementById("searchNote");

const categorySearch =
    document.getElementById("categorySearch");

const categoriesList =
    document.getElementById("categoriesList");

const currentCategory =
    document.getElementById("currentCategory");

const noteCount =
    document.getElementById("noteCount");

const categoryCount =
    document.getElementById("categoryCount");

const sidebar =
    document.getElementById("sidebar");

const categorySidebar =
    document.getElementById("categorySidebar");

const addCategoryBtn =
    document.getElementById("addCategoryBtn");

const imageModal =
    document.getElementById("imageModal");

const modalImage =
    document.getElementById("modalImage");

const loader =
    document.getElementById("loader");

// ======================================================
// LOCAL STORAGE KEYS
// ======================================================

const NOTES_KEY = "ownpad_notes";

const DRAFTS_KEY = "ownpad_drafts";

const CATEGORIES_KEY =
    "ownpad_categories";

const ACTIVE_DRAFT_KEY =
    "ownpad_active_draft";

// ======================================================
// STORAGE
// ======================================================

let notes =
    JSON.parse(
        localStorage.getItem(
            NOTES_KEY
        )
    ) || [];

let drafts =
    JSON.parse(
        localStorage.getItem(
            DRAFTS_KEY
        )
    ) || [];

let categories =
    JSON.parse(
        localStorage.getItem(
            CATEGORIES_KEY
        )
    ) || [
        "Study",
        "Recipe",
        "Diary",
        "Secret"
    ];

let selectedCategory = "All Notes";

let currentImage =
    null;

// TRUE AUTOSAVE DRAFT ID

let activeDraftId =
    localStorage.getItem(
        ACTIVE_DRAFT_KEY
    ) || null;

// ======================================================
// SAVE HELPERS
// ======================================================

function saveNotes() {

    localStorage.setItem(
        NOTES_KEY,
        JSON.stringify(notes)
    );
}

function saveDrafts() {

    localStorage.setItem(
        DRAFTS_KEY,
        JSON.stringify(drafts)
    );
}

function saveCategories() {

    localStorage.setItem(
        CATEGORIES_KEY,
        JSON.stringify(categories)
    );
}

// ======================================================
// SIDEBAR
// Principle:
// Anticipation
// Slow In & Slow Out
// ======================================================

function toggleSidebar() {

    sidebar.classList.toggle(
        "open"
    );
}

function toggleCategorySidebar() {

    categorySidebar.classList.toggle(
        "open"
    );
}

// ======================================================
// SCROLL TO TOP
// Principle:
// Follow Through
// ======================================================

function scrollToTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}

// ======================================================
// LOADER
// ======================================================

function showLoader() {

    if (!loader) return;

    loader.style.display =
        "flex";
}

function hideLoader() {

    if (!loader) return;

    loader.style.display =
        "none";
}

// ======================================================
// UPDATE STATS
// ======================================================

function updateStats() {

    if (noteCount) {

        noteCount.textContent =
            notes.length;
    }

    if (categoryCount) {

        categoryCount.textContent =
            categories.length;
    }
}

// ======================================================
// IMAGE PREVIEW
// ======================================================

if (noteImage) {

    noteImage.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {

                currentImage =
                    null;

                imagePreview.innerHTML =
                    "";

                return;
            }

            const reader =
                new FileReader();

            reader.onload =
                function (e) {

                    currentImage =
                        e.target.result;

                    imagePreview.innerHTML =
                        `

                    <img
                        src="${currentImage}"
                        class="preview-image">

                    `;
                };

            reader.readAsDataURL(
                file
            );
        }
    );
}

// ======================================================
// IMAGE MODAL
// ======================================================

function openImage(src) {

    modalImage.src =
        src;

    imageModal.classList.add(
        "show"
    );
}

function closeImage() {

    imageModal.classList.remove(
        "show"
    );
}

const closeModalBtn =
    document.querySelector(
        ".close-modal"
    );

if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeImage
    );
}

// ======================================================
// INTERSECTION OBSERVER
// Principle:
// Staging
// Appeal
// Timing
// ======================================================

const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add(
                                "show"
                            );
                    }
                }
            );
        },

        {
            threshold: 0.15
        }

    );

// ======================================================
// OBSERVE REVEAL ELEMENTS
// ======================================================

function initializeReveal() {

    const reveals =
        document.querySelectorAll(
            ".reveal"
        );

    reveals.forEach(
        element => {

            observer.observe(
                element
            );
        }
    );
}

// ======================================================
// INITIAL LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeReveal();

        updateStats();

        hideLoader();
    }
);
// ======================================================
// TRUE AUTO SAVE SYSTEM
// ======================================================

// Principle:
// Timing
// Slow In & Slow Out
//
// Creates ONE draft and continuously
// updates it instead of creating duplicates.
// ======================================================

let autoSaveTimer = null;

// ======================================================
// GET ACTIVE DRAFT
// ======================================================

function getActiveDraft() {

    if (!activeDraftId)
        return null;

    return drafts.find(
        draft =>
            String(draft.id) ===
            String(activeDraftId)
    );
}

// ======================================================
// CREATE NEW DRAFT
// ======================================================

function createDraft() {

    const draft = {

        id: Date.now(),

        title:
            noteTitle.value.trim(),

        content:
            noteContent.value.trim(),

        category:
            noteCategory.value,

        image:
            currentImage,

        createdAt:
            new Date()
                .toLocaleString(),

        updatedAt:
            new Date()
                .toLocaleString()
    };

    drafts.push(draft);

    activeDraftId =
        draft.id;

    localStorage.setItem(
        ACTIVE_DRAFT_KEY,
        activeDraftId
    );

    saveDrafts();

    return draft;
}

// ======================================================
// UPDATE EXISTING DRAFT
// ======================================================

function updateDraft() {

    let draft =
        getActiveDraft();

    if (!draft) {

        draft =
            createDraft();
    }

    draft.title =
        noteTitle.value.trim();

    draft.content =
        noteContent.value.trim();

    draft.category =
        noteCategory.value;

    draft.image =
        currentImage;

    draft.updatedAt =
        new Date()
            .toLocaleString();

    saveDrafts();
}

// ======================================================
// AUTO SAVE
// ======================================================

function autoSaveDraft() {

    clearTimeout(
        autoSaveTimer
    );

    autoSaveTimer =
        setTimeout(() => {

            const title =
                noteTitle.value.trim();

            const content =
                noteContent.value.trim();

            if (
                title === "" &&
                content === ""
            ) {
                return;
            }

            updateDraft();

        }, 1500);

    // Principle:
    // Timing
    // Gives natural delay before save.
}

// ======================================================
// INPUT LISTENERS
// ======================================================

if (noteTitle) {

    noteTitle.addEventListener(
        "input",
        autoSaveDraft
    );
}

if (noteContent) {

    noteContent.addEventListener(
        "input",
        autoSaveDraft
    );
}

if (noteCategory) {

    noteCategory.addEventListener(
        "change",
        autoSaveDraft
    );
}

if (noteImage) {

    noteImage.addEventListener(
        "change",
        autoSaveDraft
    );
}

// ======================================================
// REMOVE ACTIVE DRAFT
// ======================================================

function removeActiveDraft() {

    if (!activeDraftId)
        return;

    drafts =
        drafts.filter(
            draft =>
                String(draft.id) !==
                String(activeDraftId)
        );

    saveDrafts();

    localStorage.removeItem(
        ACTIVE_DRAFT_KEY
    );

    activeDraftId = null;
}

// ======================================================
// LOAD DRAFT FROM URL
//
// ownpad.html?draft=123
// ======================================================

function loadDraftFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const draftId =
        params.get("draft");

    if (!draftId)
        return;

    const draft =
        drafts.find(
            item =>
                String(item.id) ===
                String(draftId)
        );

    if (!draft)
        return;

    noteTitle.value =
        draft.title || "";

    noteContent.value =
        draft.content || "";

    noteCategory.value =
        draft.category || "";

    currentImage =
        draft.image || null;

    activeDraftId =
        draft.id;

    localStorage.setItem(
        ACTIVE_DRAFT_KEY,
        activeDraftId
    );

    // Restore preview

    if (
        currentImage &&
        imagePreview
    ) {

        imagePreview.innerHTML = `

        <img
            src="${currentImage}"
            class="preview-image">

        `;
    }
}

// ======================================================
// RESTORE LAST ACTIVE DRAFT
// ======================================================

function restoreLastDraft() {

    const draft =
        getActiveDraft();

    if (!draft)
        return;

    if (
        noteTitle.value ||
        noteContent.value
    ) {
        return;
    }

    noteTitle.value =
        draft.title || "";

    noteContent.value =
        draft.content || "";

    noteCategory.value =
        draft.category || "";

    currentImage =
        draft.image || null;

    if (
        currentImage &&
        imagePreview
    ) {

        imagePreview.innerHTML = `

        <img
            src="${currentImage}"
            class="preview-image">

        `;
    }
}

// ======================================================
// SAVE NOTE
// ======================================================

function saveNote() {

    const note = {

        id: Date.now(),

        title:
            noteTitle.value.trim(),

        content:
            noteContent.value.trim(),

        category:
            noteCategory.value,

        image:
            currentImage,

        createdAt:
            new Date()
                .toLocaleString()
    };

    notes.push(note);

    saveNotes();

    // Draft becomes note
    removeActiveDraft();

    noteForm.reset();

    currentImage = null;

    imagePreview.innerHTML = "";

    updateStats();

    filterNotesByCategory(
    selectedCategory
);
}

// ======================================================
// NOTE FORM SUBMIT
// ======================================================

if (noteForm) {

    noteForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            saveNote();
        }
    );
}

// ======================================================
// INITIALIZE DRAFT SYSTEM
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDraftFromURL();

        restoreLastDraft();
    }
);
// ======================================================
// NOTES RENDERING SYSTEM
// ======================================================

function renderNotes(filteredNotes = null) {

    if (!notesList) return;

    notesList.innerHTML = "";

    let displayNotes;

    if (filteredNotes) {

        displayNotes = filteredNotes;

    } else {

        if (selectedCategory === "All Notes") {

            displayNotes = notes;

        } else {

            displayNotes = notes.filter(
                note =>
                    note.category ===
                    selectedCategory
            );
        }
    }

    if (displayNotes.length === 0) {

        notesList.innerHTML = `

        <div class="note empty-note">

            <h3>No Notes Found</h3>

            <p>
                No notes in this category.
            </p>

        </div>

        `;

        return;
    }

    displayNotes.forEach(note => {

        const noteCard =
            document.createElement("div");

        noteCard.className =
            "note reveal";

        noteCard.innerHTML = `

            ${
                note.image
                ? `
                <img
                    src="${note.image}"
                    class="note-image"
                    onclick="openImage('${note.image}')">
                `
                : ""
            }

            <div class="note-header">

                <h3>${note.title}</h3>

                <span class="note-category">

                    ${note.category}

                </span>

            </div>

            <p class="note-content">

                ${note.content}

            </p>

            <small>

                ${note.createdAt}

            </small>

            <div class="note-actions">

                <button
                    class="edit-btn"
                    onclick="editNote(${note.id})">

                    ✏ Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteNote(${note.id})">

                    🗑 Delete

                </button>

            </div>

        `;

        notesList.appendChild(
            noteCard
        );
    });

    initializeReveal();

    updateStats();
}
// ======================================================
// DELETE NOTE
// ======================================================

function deleteNote(id, skipConfirm = false) {

    if (!skipConfirm) {

        const confirmDelete =
            confirm(
                "Delete this note?"
            );

        if (!confirmDelete)
            return;
    }

    notes =
        notes.filter(
            note =>
                note.id !== id
        );

    saveNotes();

    filterNotesByCategory(
    selectedCategory
);
}

// ======================================================
// EDIT NOTE
// ======================================================

function editNote(id) {

    const note =
        notes.find(
            item =>
                item.id === id
        );

    if (!note)
        return;

    noteTitle.value =
        note.title;

    noteContent.value =
        note.content;

    noteCategory.value =
        note.category;

    currentImage =
        note.image || null;

    if (
        currentImage &&
        imagePreview
    ) {

        imagePreview.innerHTML = `

        <img
            src="${currentImage}"
            class="preview-image">

        `;
    }

    deleteNote(id, true);

    scrollToTop();
}

// ======================================================
// SEARCH NOTES
// ======================================================

function searchNotes() {

    const keyword =
        searchNote.value
        .toLowerCase()
        .trim();

    if (keyword === "") {

        filterNotesByCategory(
            selectedCategory
        );

        return;
    }

    const filtered =
        notes.filter(note =>

            note.title
                .toLowerCase()
                .includes(keyword)

            ||

            note.content
                .toLowerCase()
                .includes(keyword)

            ||

            note.category
                .toLowerCase()
                .includes(keyword)
        );

    renderNotes(filtered);
}

if (searchNote) {

    searchNote.addEventListener(
        "input",
        searchNotes
    );
}

// ======================================================
// FILTER NOTES
// ======================================================

function filterNotesByCategory(category) {

    selectedCategory = category;

    localStorage.setItem(
        "ownpad_selected_category",
        category
    );

    if (currentCategory) {

        currentCategory.textContent =
            category;
    }

    if (category === "All Notes") {

        renderNotes(notes);

        return;
    }

    const filteredNotes =
        notes.filter(
            note =>
                note.category === category
        );

    renderNotes(filteredNotes);
}

// ======================================================
// CATEGORY DROPDOWN
// ======================================================

function populateCategoryDropdown() {

    if (!noteCategory)
        return;

    noteCategory.innerHTML =
        "";

    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            category;

        option.textContent =
            category;

        noteCategory.appendChild(
            option
        );
    });
}

// ======================================================
// RENDER CATEGORIES
// ======================================================

function renderCategories(filter = "") {

    categoriesList.innerHTML = "";

    const allItem =
        document.createElement("div");

    allItem.className =
        "category-item";

    allItem.innerHTML = `

        <span>

            📋 All Notes (${notes.length})

        </span>

    `;

    allItem.addEventListener(
        "click",
        () =>
            filterNotesByCategory(
                "All Notes"
            )
    );

    categoriesList.appendChild(
        allItem
    );

    categories
        .filter(category =>

            category
                .toLowerCase()
                .includes(
                    filter.toLowerCase()
                )

        )
        .forEach(category => {

            const count =
                notes.filter(
                    note =>
                        note.category ===
                        category
                ).length;

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "category-item";

            item.innerHTML = `

                <div
                    class="category-name">

                    ${category}
                    (${count})

                </div>

                <div
                    class="category-buttons">

                    <button
                        onclick="event.stopPropagation(); editCategory('${category}')">

                        ✏

                    </button>

                    <button
                        onclick="event.stopPropagation(); deleteCategory('${category}')">

                        🗑

                    </button>

                </div>

            `;

            item.addEventListener(
                "click",
                () =>
                    filterNotesByCategory(
                        category
                    )
            );

            categoriesList.appendChild(
                item
            );
        });

    populateCategoryDropdown();
}

// ======================================================
// ADD CATEGORY
// ======================================================

function addCategory() {

    const name =
        prompt(
            "Category Name"
        );

    if (!name)
        return;

    if (
        categories.includes(
            name
        )
    ) {

        alert(
            "Category already exists."
        );

        return;
    }

    categories.push(name);

    saveCategories();

    renderCategories();
}

if (addCategoryBtn) {

    addCategoryBtn.addEventListener(
        "click",
        addCategory
    );
}

// ======================================================
// EDIT CATEGORY
// ======================================================

function editCategory(oldName) {

    const newName =
        prompt(
            "Edit Category",
            oldName
        );

    if (
        !newName ||
        newName === oldName
    )
        return;

    const index =
        categories.indexOf(
            oldName
        );

    if (
        index === -1
    )
        return;

    categories[index] =
        newName;

    notes.forEach(note => {

        if (
            note.category ===
            oldName
        ) {

            note.category =
                newName;
        }
    });

    saveCategories();

    saveNotes();

    renderCategories();

    renderNotes();
}

// ======================================================
// DELETE CATEGORY
// ======================================================

function deleteCategory(category) {

    const confirmDelete =
        confirm(

            `Delete ${category}?`

        );

    if (!confirmDelete)
        return;

    categories =
        categories.filter(
            item =>
                item !== category
        );

    notes.forEach(note => {

        if (
            note.category ===
            category
        ) {

            note.category =
                "Uncategorized";
        }
    });

    if (
        !categories.includes(
            "Uncategorized"
        )
    ) {

        categories.push(
            "Uncategorized"
        );
    }

    saveCategories();

    saveNotes();

    renderCategories();

    renderNotes();
}

// ======================================================
// CATEGORY SEARCH
// ======================================================

if (categorySearch) {

    categorySearch.addEventListener(
        "input",
        function () {

            renderCategories(
                this.value
            );
        }
    );
}

// ======================================================
// INITIALIZE PART 3
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderCategories();

        renderNotes();

        updateStats();
    }
);
// ======================================================
// IMAGE MODAL ENHANCEMENTS
// Principle:
// Staging
// Appeal
// ======================================================

if (imageModal) {

    imageModal.addEventListener(
        "click",
        function (e) {

            if (
                e.target === imageModal
            ) {

                closeImage();
            }
        }
    );
}

document.addEventListener(
    "keydown",
    function (e) {

        if (
            e.key === "Escape"
        ) {

            closeImage();
        }
    }
);

// ======================================================
// MOBILE RESPONSIVE SIDEBAR
// Principle:
// Follow Through
// ======================================================

function closeSidebarsMobile() {

    if (
        window.innerWidth <= 768
    ) {

        sidebar?.classList.remove(
            "open"
        );

        categorySidebar?.classList.remove(
            "open"
        );
    }
}

document.addEventListener(
    "click",
    function (e) {

        const categoryItem =
            e.target.closest(
                ".category-item"
            );

        if (
            categoryItem
        ) {

            closeSidebarsMobile();
        }
    }
);

// ======================================================
// KEYBOARD SHORTCUTS
// Principle:
// Anticipation
// ======================================================

document.addEventListener(
    "keydown",
    function (e) {

        if (
            e.ctrlKey &&
            e.key.toLowerCase() ===
                "s"
        ) {

            e.preventDefault();

            if (
                noteTitle &&
                noteContent &&
                (
                    noteTitle.value.trim() ||
                    noteContent.value.trim()
                )
            ) {

                saveNote();

                alert(
                    "Note saved successfully."
                );
            }
        }
    }
);

// ======================================================
// EXPORT NOTES BACKUP
// ======================================================

function exportNotes() {

    const backup = {

        notes,

        drafts,

        categories,

        exportedAt:
            new Date()
                .toLocaleString()
    };

    const blob =
        new Blob(

            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],

            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href = url;

    a.download =
        "ownpad-backup.json";

    a.click();

    URL.revokeObjectURL(
        url
    );
}

// ======================================================
// IMPORT NOTES BACKUP
// ======================================================

function importNotes(
    event
) {

    const file =
        event.target.files[0];

    if (!file)
        return;

    const reader =
        new FileReader();

    reader.onload =
        function (e) {

            try {

                const data =
                    JSON.parse(
                        e.target.result
                    );

                notes =
                    data.notes || [];

                drafts =
                    data.drafts || [];

                categories =
                    data.categories || [];

                saveNotes();

                saveDrafts();

                saveCategories();

                renderCategories();

                renderNotes();

                updateStats();

                alert(
                    "Backup imported successfully."
                );

            } catch {

                alert(
                    "Invalid backup file."
                );
            }
        };

    reader.readAsText(
        file
    );
}

// ======================================================
// CLEANUP EMPTY DRAFTS
// ======================================================

function cleanupDrafts() {

    drafts =
        drafts.filter(
            draft => {

                const hasTitle =
                    draft.title
                        ?.trim()
                        .length > 0;

                const hasContent =
                    draft.content
                        ?.trim()
                        .length > 0;

                return (
                    hasTitle ||
                    hasContent
                );
            }
        );

    saveDrafts();
}

// ======================================================
// STORAGE SYNC
// ======================================================

window.addEventListener(
    "storage",
    function () {

        notes =
            JSON.parse(
                localStorage.getItem(
                    NOTES_KEY
                )
            ) || [];

        drafts =
            JSON.parse(
                localStorage.getItem(
                    DRAFTS_KEY
                )
            ) || [];

        categories =
            JSON.parse(
                localStorage.getItem(
                    CATEGORIES_KEY
                )
            ) || [];

        renderCategories();

        renderNotes();

        updateStats();
    }
);

// ======================================================
// WINDOW RESIZE
// ======================================================

window.addEventListener(
    "resize",
    function () {

        if (
            window.innerWidth >
            768
        ) {

            sidebar?.classList.remove(
                "mobile"
            );

            categorySidebar?.classList.remove(
                "mobile"
            );
        }
    }
);

// ======================================================
// LOADER MANAGEMENT
// Principle:
// Timing
// Slow In & Slow Out
// ======================================================

window.addEventListener(
    "load",
    function () {

        setTimeout(() => {

            hideLoader();

        }, 500);
    }
);

// ======================================================
// FINAL APP INIT
// ======================================================

function initializeApp() {

    const savedCategory =
    localStorage.getItem(
        "ownpad_selected_category"
    );

    if (savedCategory) {

    selectedCategory =
        savedCategory;
    }
    cleanupDrafts();

    renderCategories();

    filterNotesByCategory(
    selectedCategory
    );

    updateStats();

    initializeReveal();

    loadDraftFromURL();

    restoreLastDraft();

    hideLoader();
}

// ======================================================
// START APP
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);

// ======================================================
// GLOBAL EXPORTS
// Needed for inline onclick()
// ======================================================

window.toggleSidebar =
    toggleSidebar;

window.toggleCategorySidebar =
    toggleCategorySidebar;

window.scrollToTop =
    scrollToTop;

window.deleteNote =
    deleteNote;

window.editNote =
    editNote;

window.openImage =
    openImage;

window.closeImage =
    closeImage;

window.editCategory =
    editCategory;

window.deleteCategory =
    deleteCategory;

window.exportNotes =
    exportNotes;

window.importNotes =
    importNotes;