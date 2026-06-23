// ======================================================
// OWNPAD V3
// DRAFTS PAGE
// ======================================================

// ======================================================
// STORAGE KEYS
// ======================================================

const DRAFTS_KEY =
    "ownpad_drafts";

const ACTIVE_DRAFT_KEY =
    "ownpad_active_draft";

// ======================================================
// ELEMENTS
// ======================================================

const sidebar =
    document.getElementById(
        "sidebar"
    );

const draftsList =
    document.getElementById(
        "draftsList"
    );

const draftCount =
    document.getElementById(
        "draftCount"
    );

const searchDraft =
    document.getElementById(
        "searchDraft"
    );

const loader =
    document.getElementById(
        "loader"
    );

// ======================================================
// STORAGE
// ======================================================

let drafts =
    JSON.parse(
        localStorage.getItem(
            DRAFTS_KEY
        )
    ) || [];

// ======================================================
// SIDEBAR
// ======================================================

function toggleSidebar() {

    sidebar?.classList.toggle(
        "open"
    );
}

// ======================================================
// CONTINUE WRITING
// ======================================================

function continueWriting(
    draftId
) {

    localStorage.setItem(
        ACTIVE_DRAFT_KEY,
        draftId
    );

    window.location.href =
        `ownpad.html?draft=${draftId}`;
}

// ======================================================
// DELETE DRAFT
// ======================================================

function deleteDraft(
    draftId
) {

    const confirmDelete =
        confirm(
            "Delete this draft?"
        );

    if (!confirmDelete)
        return;

    drafts =
        drafts.filter(
            draft =>
                String(
                    draft.id
                ) !==
                String(
                    draftId
                )
        );

    localStorage.setItem(
        DRAFTS_KEY,
        JSON.stringify(
            drafts
        )
    );

    loadDrafts();
}

// ======================================================
// DELETE ALL DRAFTS
// ======================================================

function clearAllDrafts() {

    const confirmDelete =
        confirm(
            "Delete all drafts?"
        );

    if (!confirmDelete)
        return;

    drafts = [];

    localStorage.setItem(
        DRAFTS_KEY,
        JSON.stringify(
            drafts
        )
    );

    localStorage.removeItem(
        ACTIVE_DRAFT_KEY
    );

    loadDrafts();
}

// ======================================================
// SEARCH DRAFTS
// ======================================================

function searchDrafts() {

    const keyword =
        searchDraft.value
            .toLowerCase()
            .trim();

    if (
        keyword === ""
    ) {

        loadDrafts();

        return;
    }

    const filtered =
        drafts.filter(
            draft =>

                draft.title
                    ?.toLowerCase()
                    .includes(
                        keyword
                    )

                ||

                draft.content
                    ?.toLowerCase()
                    .includes(
                        keyword
                    )

                ||

                draft.category
                    ?.toLowerCase()
                    .includes(
                        keyword
                    )
        );

    renderDrafts(
        filtered
    );
}

// ======================================================
// RENDER DRAFTS
// ======================================================

function renderDrafts(
    draftArray
) {

    // Hide loader
    if (loader) {
        loader.style.display = "none";
    }

    draftsList.innerHTML =
        "";

    draftCount.textContent =
        draftArray.length;

    if (
        draftArray.length === 0
    ) {

        draftsList.innerHTML = `

        <div class="note reveal">

            <h3>
                No Drafts Found
            </h3>

            <p>
                Start writing a note
                and it will appear here.
            </p>

        </div>

        `;

        return;
    }

    draftArray.forEach(
        draft => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "note reveal";

            card.innerHTML = `

                ${
                    draft.image
                    ? `
                    <img
                        src="${draft.image}"
                        class="note-image">
                    `
                    : ""
                }

                <div
                    class="note-header">

                    <h3>

                        ${
                            draft.title ||
                            "Untitled Draft"
                        }

                    </h3>

                    <span
                        class="note-category">

                        ${
                            draft.category ||
                            "Uncategorized"
                        }

                    </span>

                </div>

                <p
                    class="note-content">

                    ${
                        draft.content ||
                        "No content"
                    }

                </p>

                <small>

                    Updated:
                    ${
                        draft.updatedAt ||
                        draft.createdAt ||
                        "Unknown"
                    }

                </small>

                <div
                    class="note-actions">

                    <button
                        class="edit-btn"
                        onclick="continueWriting(${draft.id})">

                        ✏ Continue

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteDraft(${draft.id})">

                        🗑 Delete

                    </button>

                </div>

            `;

            draftsList.appendChild(
                card
            );
        }
    );

    initializeDraftReveal();
}

// ======================================================
// LOAD DRAFTS
// ======================================================

function loadDrafts() {

    drafts =
        JSON.parse(
            localStorage.getItem(
                DRAFTS_KEY
            )
        ) || [];

    renderDrafts(
        drafts
    );
}

// ======================================================
// INTERSECTION OBSERVER
// ======================================================

const draftObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
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

function initializeDraftReveal() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );

    elements.forEach(
        element => {

            draftObserver.observe(
                element
            );
        }
    );
}

// ======================================================
// STORAGE SYNC
// ======================================================

window.addEventListener(
    "storage",
    function () {

        loadDrafts();
    }
);

// ======================================================
// MOBILE CLOSE
// ======================================================

document.addEventListener(
    "click",
    function (e) {

        if (
            e.target.closest(
                ".note"
            ) &&
            window.innerWidth <= 768
        ) {

            sidebar?.classList.remove(
                "open"
            );
        }
    }
);

// ======================================================
// SEARCH LISTENER
// ======================================================

if (
    searchDraft
) {

    searchDraft.addEventListener(
        "input",
        searchDrafts
    );
}

// ======================================================
// EXPORTS
// ======================================================

window.toggleSidebar =
    toggleSidebar;

window.continueWriting =
    continueWriting;

window.deleteDraft =
    deleteDraft;

window.clearAllDrafts =
    clearAllDrafts;

// ======================================================
// INIT
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDrafts();
    }
);