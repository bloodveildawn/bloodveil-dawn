function initializeHeader(){

    initializeActiveNavigation();

    initializeMobileMenu();

    initializeAutoHideHeader();

}

/* ==========================================================
   ACTIVE NAVIGATION
========================================================== */

function initializeActiveNavigation(){

    const currentPage =
        window.location.pathname.split("/").pop();

    const navLinks =
        document.querySelectorAll(".header-link");

    navLinks.forEach(link=>{

        const href =
            link.getAttribute("href");

        if(href===currentPage){

            link.classList.add("active");

        }

    });

}

/* ==========================================================
   MOBILE MENU
========================================================== */

function initializeMobileMenu(){

    const menuButton =
        document.getElementById("headerMenuButton");

    const navigation =
        document.getElementById("headerNavigation");

    if(!menuButton || !navigation){

        return;

    }

    menuButton.addEventListener("click",()=>{

        navigation.classList.toggle("show");

    });

    navigation
        .querySelectorAll("a")
        .forEach(link=>{

            link.addEventListener("click",()=>{

                navigation.classList.remove("show");

            });

        });

    window.addEventListener("resize",()=>{

        if(window.innerWidth>768){

            navigation.classList.remove("show");

        }

    });

}

/* ==========================================================
   AUTO HIDE HEADER
========================================================== */

function initializeAutoHideHeader(){

    const header =
        document.querySelector(".header");

    if(!header){

        return;

    }

    let lastScroll =
        window.scrollY;

    window.addEventListener("scroll",()=>{

        const currentScroll =
            window.scrollY;

        /* Selalu tampil di paling atas halaman */
        if(currentScroll<=0){

            header.classList.remove("hide");

            lastScroll=currentScroll;

            return;

        }

        /* Scroll turun */
        if(currentScroll>lastScroll && currentScroll>100){

            header.classList.add("hide");

        }

        /* Scroll naik */
        else{

            header.classList.remove("hide");

        }

        lastScroll=currentScroll;

    });

}