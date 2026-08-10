/* ========================================= */
/* CHAPTER DATA */
/* ========================================= */

/*
    Semua informasi chapter disimpan di sini.

    Kalau nanti mau menambah chapter baru,
    cukup tambahkan satu object ke array ini.

    HTML tidak perlu diedit.
*/

const chapters = [

    {
        id: 1,
        number: "1st Dawn",
        title: "NOT AVAILABLE",
        version: "final",
        date: "TBA",
        thumbnail: "images/not-available.jpg",
        synopsis:
            "Ramaikan #ReleaseTheScinisterCut untuk mempercepat perilisannya."
    },


    {
        id: 2,
        number: "2nd Dawn",
        title: "Tutorial Menanam Sawit feat. Eiden Dusk",
        version: "final",
        date: "TBA",
        thumbnail: "images/not-available.jpg",
        synopsis:
            "Open komis, minat inbok."
    },


    {
        id: 3,
        number: "3rd Dawn",
        title: "Placeholder buat testing fitur View All",
        version: "final",
        date: "TBA",
        thumbnail: "images/not-available.jpg",
        synopsis:
            "Hewan hewan apa yang kalo bisa padahal remot AC."
    },


    {
        id: 4,
        number: "4th Dawn",
        title: "Placeholder buat testing fitur Show Less",
        version: "final",
        date: "TBA",
        thumbnail: "images/not-available.jpg",
        synopsis:
            "Jangan kasih tahu siapa-siapa ya... Sebenernya aku ini Power Ranger Merah Muda."
    },


    {
        id: 1,
        number: "1st Dawn - Rough",
        title: "Beast of Hell",
        version: "rough",
        date: "Updated 2 June 2026",
        thumbnail: "images/001.jpg",
        synopsis:
            "Dialogue is not final and scenes may still change.",
        link: "chapter/001.html"
    },


    {
        id: 2,
        number: "2nd Dawn - Rough",
        title: "Beneath The Surface",
        version: "rough",
        date: "Updated 2 June 2026",
        thumbnail: "images/002.jpg",
        synopsis:
            "Dialogue is not final and scenes may still change.",
        link: "chapter/002.html"
    },


    {
        id: 3,
        number: "3rd Dawn - Incomplete",
        title: "A Silenced Warmth Amidst a Howling Storm",
        version: "rough",
        date: "Updated 23 July 2026",
        thumbnail: "images/003.jpg",
        synopsis:
            "Dialogue is not final and scenes may still change.",
        link: "chapter/003.html"
    }

];




/* ========================================= */
/* CONFIG */
/* ========================================= */

const CONFIG = {

    initialVisible: 3

};




/* ========================================= */
/* TRANSITION CONFIG */
/* ========================================= */

/*
    Pengaturan khusus untuk animasi
    View All / Show Less.

    Tidak ada opacity,
    flash,
    scale,
    atau efek cahaya.

    Hanya perubahan tinggi container.
*/

const TRANSITION_CONFIG = {

    duration: 350

};




/* ========================================= */
/* STATE */
/* ========================================= */

const state = {

    version: "rough",

    sort: "oldest",

    expanded: {

        final: false,

        rough: false

    },

    sortOpen: false

};




/* ========================================= */
/* TRANSITION STATE */
/* ========================================= */

/*
    Menandai apakah chapter list sedang
    menjalankan expand/collapse transition.
*/

let isChapterListTransitioning = false;




/* ========================================= */
/* ELEMENTS */
/* ========================================= */

const chapterList =

    document.getElementById(
        "chapterList"
    );


const viewAllButton =

    document.getElementById(
        "viewAllBtn"
    );


const toggleButtons =

    document.querySelectorAll(
        ".toggle-btn"
    );


const sortButton =

    document.querySelector(
        ".sort-btn"
    );


const sortDropdown =

    document.querySelector(
        ".sort-dropdown"
    );


const sortOptions =

    document.querySelectorAll(
        ".sort-dropdown button"
    );


/* ========================================= */
/* CREATE CHAPTER CARD */
/* ========================================= */

/*
    Struktur card:

    chapter-card
    ├── thumbnail
    └── chapter-info
        ├── chapter number
        ├── title
        ├── synopsis
        └── date

    Date sengaja berada di dalam chapter-info
    supaya mobile bisa menampilkannya tepat
    di bawah title tanpa membuat grid row baru.
*/

function createChapterCard(chapter) {

    const card =
        document.createElement("a");


    card.className =
        "chapter-card";

    if (chapter.link) {
        card.href =
            chapter.link;

    }

    card.dataset.id =
        chapter.id;


    card.dataset.version =
        chapter.version;




    /* ========================================= */
    /* THUMBNAIL */
    /* ========================================= */

    const thumbnail =
        document.createElement("img");


    thumbnail.src =
        chapter.thumbnail;


    thumbnail.alt =
        chapter.title;




    /* ========================================= */
    /* CHAPTER INFO */
    /* ========================================= */

    const info =
        document.createElement("div");


    info.className =
        "chapter-info";




    /* ========================================= */
    /* CHAPTER NUMBER */
    /* ========================================= */

    const number =
        document.createElement("span");


    number.textContent =
        chapter.number;




    /* ========================================= */
    /* TITLE */
    /* ========================================= */

    const title =
        document.createElement("h3");


    title.textContent =
        chapter.title;




    /* ========================================= */
    /* SYNOPSIS */
    /* ========================================= */

    const synopsis =
        document.createElement("p");


    synopsis.textContent =
        chapter.synopsis;




    /* ========================================= */
    /* DATE */
    /* ========================================= */

    const date =
        document.createElement("time");


    date.className =
        "chapter-date";


    date.textContent =
        chapter.date;




    /* ========================================= */
    /* BUILD INFO */
/* ========================================= */

    info.appendChild(number);

    info.appendChild(title);

    info.appendChild(synopsis);

    info.appendChild(date);




    /* ========================================= */
    /* BUILD CARD */
    /* ========================================= */

    card.appendChild(thumbnail);

    card.appendChild(info);


    return card;

}




/* ========================================= */
/* GET CURRENT CHAPTERS */
/* ========================================= */

/*
    Mengambil chapter berdasarkan version
    yang sedang aktif.
*/

function getCurrentChapters() {

    return chapters.filter(

        chapter =>
            chapter.version ===
            state.version

    );

}




/* ========================================= */
/* SORT CHAPTERS */
/* ========================================= */

/*
    Sort tidak mengubah data asli.

    Kita membuat copy terlebih dahulu
    supaya `chapters` tetap menjadi
    sumber data utama.
*/

function getSortedChapters() {

    const currentChapters =

        [...getCurrentChapters()];


    currentChapters.sort(

        (a, b) => {

            if (
                state.sort ===
                "oldest"
            ) {

                return a.id - b.id;

            }


            return b.id - a.id;

        }

    );


    return currentChapters;

}




/* ========================================= */
/* GET CHAPTER LIST HEIGHT */
/* ========================================= */

/*
    Mengambil tinggi aktual chapter list.

    Ini yang nanti dipakai sebagai titik
    awal / akhir animasi expand dan collapse.
*/

function getChapterListHeight() {

    return chapterList.scrollHeight;

}


/* ========================================= */
/* UPDATE CHAPTER LIST */
/* ========================================= */

/*
    Memperbarui isi chapter list tanpa
    langsung menghancurkan seluruh DOM.

    Ini penting untuk transition.

    Card yang sudah ada akan dipertahankan
    kalau masih mewakili chapter yang sama.
*/

/* ========================================= */
/* UPDATE CHAPTER LIST */
/* ========================================= */

/*
    Memperbarui chapter list sambil menjaga
    card dari version yang sedang aktif.

    Card version lama akan dibuang.

    Card tambahan dari version aktif tetap
    dipertahankan ketika diperlukan untuk
    collapse transition.
*/

function updateChapterList(
    visibleChapters,
    mode = "instant"
) {

    /* ========================================= */
    /* REMOVE OLD VERSION CARDS */
    /* ========================================= */

    /*
        Jangan biarkan card Final lama
        tertinggal ketika pindah ke Rough,
        atau sebaliknya.
    */

    Array.from(
        chapterList.children
    ).forEach(
        card => {

            if (
                card.dataset.version !==
                state.version
            ) {

                card.remove();

            }

        }
    );


    /* ========================================= */
    /* CREATE / REUSE CURRENT CARDS */
    /* ========================================= */

    visibleChapters.forEach(
        (chapter, index) => {

            let card =
                chapterList.children[index];


            /*
                Belum ada card pada posisi ini.
            */

            if (!card) {

                card =
                    createChapterCard(
                        chapter
                    );


                chapterList.appendChild(
                    card
                );

            }


            /*
                Card pada posisi ini tidak
                sesuai dengan chapter yang
                seharusnya.
            */

            else if (

                card.dataset.id !==
                String(chapter.id)

                ||

                card.dataset.version !==
                chapter.version

            ) {

                const newCard =
                    createChapterCard(
                        chapter
                    );


                chapterList.replaceChild(
                    newCard,
                    card
                );


                card =
                    newCard;

            }


            /*
                Card yang dibutuhkan harus terlihat.
            */

            card.hidden =
                false;

        }
    );


    const cards =
        Array.from(
            chapterList.children
        );


    /* ========================================= */
    /* INSTANT */
    /* ========================================= */

    if (
        mode === "instant"
    ) {

        cards.forEach(
            (card, index) => {

                card.hidden =
                    index >=
                    visibleChapters.length;

            }
        );


        return;

    }


    /* ========================================= */
    /* EXPAND */
    /* ========================================= */

    if (
        mode === "expand"
    ) {

        cards.forEach(
            card => {

                card.hidden =
                    false;

            }
        );


        return;

    }


    /* ========================================= */
    /* COLLAPSE */
    /* ========================================= */

    if (
        mode === "collapse"
    ) {

        /*
            Untuk collapse, card tambahan
            sengaja TIDAK disembunyikan dulu.

            animateChapterList() yang akan
            menghitung target height dengan
            benar sebelum transition.
        */

        cards.forEach(
            (card, index) => {

                if (
                    index >=
                    visibleChapters.length
                ) {

                    card.dataset.collapse =
                        "true";

                }

            }
        );

    }

}




/* ========================================= */
/* UPDATE VIEW ALL BUTTON */
/* ========================================= */

/*
    Behavior tombol tetap sama seperti
    baseline sebelumnya.

    Hanya namanya yang berubah ketika
    expanded.
*/

function updateViewAllButton(
    totalChapters,
    isExpanded
) {

    if (
        totalChapters <=
        CONFIG.initialVisible
    ) {

        viewAllButton.classList.add(
            "hidden"
        );

        return;

    }


    viewAllButton.classList.remove(
        "hidden"
    );


    viewAllButton.textContent =

        isExpanded

            ? "Show Less"

            : "View All Chapters";

}


/* ========================================= */
/* RENDER CHAPTERS */
/* ========================================= */

/*
    Menampilkan chapter berdasarkan:

    1. Version
    2. Sort
    3. Expanded state

    `mode` menentukan apakah perubahan
    dilakukan secara instant atau memakai
    expand/collapse transition.

    mode:
        "instant"
        "expand"
        "collapse"
*/

function renderChapters(
    mode = "instant"
) {

    /*
        Simpan tinggi list sebelum DOM
        diperbarui.

        Ini menjadi titik awal animasi.
    */

    const previousHeight =
        getChapterListHeight();


    const sortedChapters =
        getSortedChapters();


    const isExpanded =
        state.expanded[
            state.version
        ];


    const visibleChapters =

        isExpanded

            ? sortedChapters

            : sortedChapters.slice(
                0,
                CONFIG.initialVisible
            );


    /*
        Update card berdasarkan mode.
    */

    updateChapterList(
        visibleChapters,
        mode
    );


    /*
        Update tombol View All /
        Show Less.
    */

    updateViewAllButton(
        sortedChapters.length,
        isExpanded
    );


    /*
        Hanya expand dan collapse yang
        membutuhkan animasi tinggi.
    */

    if (
        mode === "expand" ||
        mode === "collapse"
    ) {

        animateChapterList(
            previousHeight
        );

    }

}




/* ========================================= */
/* ANIMATE CHAPTER LIST */
/* ========================================= */

/*
    Menganimasikan perubahan tinggi
    chapter list.

    Tidak menggunakan:
        - opacity
        - scale
        - flash
        - efek cahaya

    Hanya height transition.
*/

/* ========================================= */
/* ANIMATE CHAPTER LIST */
/* ========================================= */

/*
    Expand:
        3 cards → 5 cards

    Collapse:
        5 cards → 3 cards

    Animasi hanya menggunakan height.
*/

function animateChapterList(
    previousHeight
) {

    isChapterListTransitioning =
        true;


    /*
        Tinggi target saat ini.

        Untuk expand:
            semua card sudah visible.

        Untuk collapse:
            card tambahan masih visible,
            jadi kita hitung target dengan
            menyembunyikannya sementara.
    */

    const collapsingCards =
        chapterList.querySelectorAll(
            '[data-collapse="true"]'
        );


    let nextHeight;


    if (
        collapsingCards.length > 0
    ) {

        /*
            Hitung tinggi ketika hanya
            3 card yang terlihat.
        */

        collapsingCards.forEach(
            card => {

                card.hidden =
                    true;

            }
        );


        nextHeight =
            getChapterListHeight();


        /*
            Tampilkan kembali card.

            Kita belum menghapusnya.
            Mereka akan disembunyikan setelah
            animasi selesai.
        */

        collapsingCards.forEach(
            card => {

                card.hidden =
                    false;

            }
        );

    }

    else {

        /*
            Expand:
            semua card sudah terlihat.
        */

        nextHeight =
            getChapterListHeight();

    }


    /* ========================================= */
    /* INITIAL HEIGHT */
    /* ========================================= */

    chapterList.style.height =
        `${previousHeight}px`;


    chapterList.style.overflow =
        "hidden";


    /*
        Paksa browser membaca height awal.
    */

    chapterList.offsetHeight;


    /* ========================================= */
    /* TRANSITION */
    /* ========================================= */

    chapterList.style.transition =
        `height ${
            TRANSITION_CONFIG.duration
        }ms ease`;


    chapterList.style.height =
        `${nextHeight}px`;


    /* ========================================= */
    /* FINISH */
    /* ========================================= */

    let finished =
        false;


    function finishTransition() {

        if (
            finished
        ) {

            return;

        }


        finished =
            true;


        /*
            Sekarang card tambahan benar-benar
            disembunyikan.
        */

        collapsingCards.forEach(
            card => {

                card.hidden =
                    true;


                delete card.dataset.collapse;

            }
        );


        /*
            Kembalikan container ke kondisi
            normal/responsive.
        */

        chapterList.style.height =
            "auto";


        chapterList.style.overflow =
            "";


        chapterList.style.transition =
            "";


        isChapterListTransitioning =
            false;

    }


    /*
        transitionend sebagai trigger utama.
    */

    function handleTransitionEnd(
        event
    ) {

        if (
            event.propertyName !==
            "height"
        ) {

            return;

        }


        chapterList.removeEventListener(
            "transitionend",
            handleTransitionEnd
        );


        finishTransition();

    }


    chapterList.addEventListener(
        "transitionend",
        handleTransitionEnd
    );


    /*
        Fallback kalau browser tidak
        mengirim transitionend.
    */

    setTimeout(
        () => {

            chapterList.removeEventListener(
                "transitionend",
                handleTransitionEnd
            );


            finishTransition();

        },
        TRANSITION_CONFIG.duration + 100
    );

}

/* ========================================= */
/* VIEW ALL / SHOW LESS */
/* ========================================= */

/*
    View All / Show Less adalah satu-satunya
    tombol yang menggunakan transition.

    Toggle dan Sort tetap instant.
*/

viewAllButton.addEventListener(
    "click",
    () => {

        /*
            Jangan memulai transition baru
            sebelum transition sebelumnya selesai.
        */

        if (
            isChapterListTransitioning
        ) {

            return;

        }


        const currentExpanded =
            state.expanded[
                state.version
            ];


        /*
            Tentukan jenis transition
            berdasarkan kondisi saat ini.
        */

        const mode =
            currentExpanded
                ? "collapse"
                : "expand";


        /*
            Ubah state expanded.
        */

        state.expanded[
            state.version
        ] = !currentExpanded;


        /*
            Render menggunakan transition.
        */

        renderChapters(
            mode
        );

    }
);




/* ========================================= */
/* TOGGLE VERSION */
/* ========================================= */

/*
    Final / Rough.

    Behavior tetap instant seperti
    baseline sebelumnya.
*/

toggleButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                /*
                    Kalau kebetulan user menekan
                    Toggle ketika transition masih
                    berjalan, jangan biarkan style
                    transition tertinggal.
                */

                if (
                    isChapterListTransitioning
                ) {

                    resetChapterListTransition();

                }


                state.version =
                    button.dataset.version;


                /*
                    Update active state.
                */

                toggleButtons.forEach(
                    toggle => {

                        const isActive =
                            toggle.dataset.version ===
                            state.version;


                        toggle.classList.toggle(
                            "active",
                            isActive
                        );


                        toggle.setAttribute(
                            "aria-pressed",
                            String(isActive)
                        );

                    }
                );


                /*
                    Toggle tetap instant.
                */

                renderChapters(
                    "instant"
                );

            }
        );

    }
);




/* ========================================= */
/* SORT BUTTON */
/* ========================================= */

sortButton.addEventListener(
    "click",
    event => {

        /*
            Mencegah click ini langsung
            ditangkap oleh document listener
            di bawah.
        */

        event.stopPropagation();


        state.sortOpen =
            !state.sortOpen;


        sortDropdown.classList.toggle(
            "show",
            state.sortOpen
        );


        sortButton.setAttribute(
            "aria-expanded",
            String(
                state.sortOpen
            )
        );

    }
);




/* ========================================= */
/* SORT OPTIONS */
/* ========================================= */

sortOptions.forEach(
    option => {

        option.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                /*
                    Sort tetap instant.
                */

                if (
                    isChapterListTransitioning
                ) {

                    resetChapterListTransition();

                }


                state.sort =
                    option.dataset.sort;


                /*
                    Update label Sort By.
                */

                sortButton.textContent =
                    option.textContent +
                    " ▾";


                /*
                    Tutup dropdown.
                */

                state.sortOpen =
                    false;


                sortDropdown.classList.remove(
                    "show"
                );


                sortButton.setAttribute(
                    "aria-expanded",
                    "false"
                );


                /*
                    Render tanpa transition.
                */

                renderChapters(
                    "instant"
                );

            }
        );

    }
);




/* ========================================= */
/* CLOSE SORT DROPDOWN */
/* ========================================= */

document.addEventListener(
    "click",
    () => {

        if (
            !state.sortOpen
        ) {

            return;

        }


        state.sortOpen =
            false;


        sortDropdown.classList.remove(
            "show"
        );


        sortButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }
);


/* ========================================= */
/* RESET ACTIVE TRANSITION */
/* ========================================= */

/*
    Membatalkan transition yang sedang berjalan.

    Dipakai ketika user mengganti:
    - Final / Rough
    - Sort

    supaya style transition tidak tertinggal
    ketika list langsung dirender ulang.
*/

function resetChapterListTransition() {

    const collapsingCards =
        chapterList.querySelectorAll(
            '[data-collapse="true"]'
        );


    /*
        Hapus tanda collapse.
    */

    collapsingCards.forEach(
        card => {

            delete card.dataset.collapse;

        }
    );


    /*
        Matikan transition sementara.
    */

    chapterList.style.transition =
        "none";


    /*
        Kembalikan tinggi container
        ke kondisi normal.
    */

    chapterList.style.height =
        "auto";


    chapterList.style.overflow =
        "";


    /*
        Reset transition state.
    */

    isChapterListTransitioning =
        false;

}




/* ========================================= */
/* INITIALIZE */
/* ========================================= */

/*
    Menyiapkan kondisi awal Chapter List.

    Initialize hanya dijalankan sekali
    ketika script selesai dimuat.
*/

function initializeChapterList() {


    /* ========================================= */
    /* INITIAL TOGGLE STATE */
    /* ========================================= */

    toggleButtons.forEach(
        button => {

            const isActive =
                button.dataset.version ===
                state.version;


            button.classList.toggle(
                "active",
                isActive
            );


            /*
                Tetap menggunakan aria-pressed
                dari sistem toggle yang sudah ada.
            */

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        }
    );




    /* ========================================= */
    /* INITIAL SORT STATE */
    /* ========================================= */

    state.sortOpen =
        false;


    sortDropdown.classList.remove(
        "show"
    );


    sortButton.setAttribute(
        "aria-expanded",
        "false"
    );


    /*
        Cari option yang sesuai dengan
        sort default.
    */

    const initialSortOption =
        Array.from(
            sortOptions
        ).find(
            option =>
                option.dataset.sort ===
                state.sort
        );


    /*
        Tampilkan label sort awal.
    */

    if (
        initialSortOption
    ) {

        sortButton.textContent =
            initialSortOption.textContent +
            " ▾";

    }




    /* ========================================= */
    /* INITIAL RENDER */
    /* ========================================= */

    /*
        Initial render selalu instant.

        Jadi saat halaman pertama dibuka,
        tidak ada animasi expand/collapse.
    */

    renderChapters(
        "instant"
    );

}




/* ========================================= */
/* START */
/* ========================================= */

/*
    Jalankan Chapter List.
*/

initializeChapterList();