/* ==========================================================================
   Bloodveil Dawn
   Reader Navigation
   ========================================================================== */


/* ==========================================================================
   STATE
   ========================================================================== */

let currentChapter = null;

let lastScrollY = window.scrollY;


/* ==========================================================================
   FIND CURRENT CHAPTER
   ========================================================================== */

function findCurrentChapter(){

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    currentChapter =
        readerConfig.chapters.find(
            function(chapter){

                return chapter.url === currentPage;

            }
        );


    if(!currentChapter){

        currentChapter =
            readerConfig.chapters[0];

    }

}


/* ==========================================================================
   LOAD COMPONENT
   ========================================================================== */

async function loadReaderNavigation(){

    const containers =
        document.querySelectorAll(
            "[data-reader-nav]"
        );


    if(!containers.length){

        return;

    }


    try{

        const response =
            await fetch(
                "../reader-nav/reader-nav.html"
            );


        if(!response.ok){

            throw new Error(
                "Reader navigation failed to load."
            );

        }


        const html =
            await response.text();


        containers.forEach(
            function(container){

                container.innerHTML =
                    html;

            }
        );


        initializeReaderNavigation();

    }

    catch(error){

        console.error(
            "Reader Navigation Error:",
            error
        );

    }

}


/* ==========================================================================
   CUSTOM DROPDOWN
   ========================================================================== */

function createChapterDropdown(){

    const menu =
        document.querySelector(
            "#chapterDropdownMenu"
        );


    const label =
        document.querySelector(
            "#chapterDropdownLabel"
        );


    if(!menu || !label){

        return;

    }


    menu.innerHTML = "";


    readerConfig.chapters.forEach(
        function(chapter){

            const option =
                document.createElement(
                    "button"
                );


            option.type =
                "button";


            option.className =
                "chapter-option";


            option.setAttribute(
                "role",
                "option"
            );


            option.dataset.url =
                chapter.url;


            option.textContent =
                chapter.title;


            if(
                chapter.number ===
                currentChapter.number
            ){

                option.classList.add(
                    "is-selected"
                );

                option.setAttribute(
                    "aria-selected",
                    "true"
                );


                label.textContent =
                    chapter.title;

            }

            else{

                option.setAttribute(
                    "aria-selected",
                    "false"
                );

            }


            option.addEventListener(
                "click",
                function(){

                    window.location.href =
                        chapter.url;

                }
            );


            menu.appendChild(
                option
            );

        }
    );

}


/* ==========================================================================
   OPEN / CLOSE DROPDOWN
   ========================================================================== */

function setDropdownState(isOpen){

    const button =
        document.querySelector(
            "#chapterDropdownButton"
        );


    const menu =
        document.querySelector(
            "#chapterDropdownMenu"
        );


    if(!button || !menu){

        return;

    }


    button.setAttribute(
        "aria-expanded",
        String(isOpen)
    );


    button.classList.toggle(
        "is-open",
        isOpen
    );


    menu.classList.toggle(
        "is-open",
        isOpen
    );

}


/* ==========================================================================
   DROPDOWN EVENTS
   ========================================================================== */

function setupChapterDropdown(){

    const button =
        document.querySelector(
            "#chapterDropdownButton"
        );


    if(!button){

        return;

    }


    button.addEventListener(
        "click",
        function(event){

            event.stopPropagation();


            const isOpen =
                button.getAttribute(
                    "aria-expanded"
                ) === "true";


            setDropdownState(
                !isOpen
            );

        }
    );


    document.addEventListener(
        "click",
        function(event){

            const dropdown =
                document.querySelector(
                    "#chapterDropdown"
                );


            if(
                dropdown &&
                !dropdown.contains(event.target)
            ){

                setDropdownState(false);

            }

        }
    );


    document.addEventListener(
        "keydown",
        function(event){

            if(
                event.key === "Escape"
            ){

                setDropdownState(false);

            }

        }
    );

}


/* ==========================================================================
   PREVIOUS / NEXT
   ========================================================================== */

function updateChapterNavigation(){

    const previousButton =
        document.querySelector(
            "#readerPrev"
        );


    const nextButton =
        document.querySelector(
            "#readerNext"
        );


    const currentIndex =
        readerConfig.chapters.findIndex(
            function(chapter){

                return (
                    chapter.number ===
                    currentChapter.number
                );

            }
        );


    const previousChapter =
        readerConfig.chapters[
            currentIndex - 1
        ];


    const nextChapter =
        readerConfig.chapters[
            currentIndex + 1
        ];


    /* Previous */

    if(previousChapter){

        previousButton.href =
            previousChapter.url;

        previousButton.classList.remove(
            "is-disabled"
        );

    }

    else{

        previousButton.removeAttribute(
            "href"
        );

        previousButton.classList.add(
            "is-disabled"
        );

    }


    /* Next */

    if(nextChapter){

        nextButton.href =
            nextChapter.url;

        nextButton.classList.remove(
            "is-disabled"
        );

    }

    else{

        nextButton.removeAttribute(
            "href"
        );

        nextButton.classList.add(
            "is-disabled"
        );

    }

}


/* ==========================================================================
   BACK TO TOP
   ========================================================================== */

function setupBackToTop(){

    const button =
        document.querySelector(
            "#readerTop"
        );


    if(!button){

        return;

    }


    button.addEventListener(
        "click",
        function(){

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        }
    );

}


/* ==========================================================================
   SHOW / HIDE NAV
   ========================================================================== */

function showReaderNavigation(){

    const nav =
        document.querySelector(
            "#readerNav"
        );


    if(nav){

        nav.classList.remove(
            "is-hidden"
        );

    }

}


function hideReaderNavigation(){

    const nav =
        document.querySelector(
            "#readerNav"
        );


    if(nav){

        nav.classList.add(
            "is-hidden"
        );

    }

}


/* ==========================================================================
   SCROLL BEHAVIOR
   ========================================================================== */

function setupScrollBehavior(){

    window.addEventListener(
        "scroll",
        function(){

            const currentScrollY =
                window.scrollY;


            const difference =
                currentScrollY -
                lastScrollY;


            if(
                currentScrollY <= 10
            ){

                showReaderNavigation();

                lastScrollY =
                    currentScrollY;

                return;

            }


            if(
                Math.abs(difference) < 5
            ){

                return;

            }


            if(difference > 0){

                hideReaderNavigation();

            }

            else{

                showReaderNavigation();

            }


            lastScrollY =
                currentScrollY;

        },
        {
            passive:true
        }
    );

}


/* ==========================================================================
   COMIC CLICK
   ========================================================================== */

function setupReaderClick(){

    const reader =
        document.querySelector(
            ".reader-container"
        );


    if(!reader){

        return;

    }


    reader.addEventListener(
        "click",
        function(){

            setDropdownState(false);

            hideReaderNavigation();

        }
    );

}


/* ==========================================================================
   INITIALIZE
   ========================================================================== */

function initializeReaderNavigation(){

    findCurrentChapter();

    createChapterDropdown();

    updateChapterNavigation();

    setupChapterDropdown();

    setupBackToTop();

    setupScrollBehavior();

    setupReaderClick();

    showReaderNavigation();

}


/* ==========================================================================
   START
   ========================================================================== */

document.addEventListener(
    "DOMContentLoaded",
    loadReaderNavigation
);