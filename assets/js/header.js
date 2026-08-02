function initializeHeader() {

    initializeActiveNavigation();

    initializeMobileMenu();

}

function initializeActiveNavigation() {

    const currentPage = window.location.pathname.split("/").pop();

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {

            link.classList.add("active");

        }

    });

}

function initializeMobileMenu() {

    const menuButton = document.getElementById("menuBtn");

    const navbar = document.getElementById("navbar");

    if (!menuButton || !navbar) {

        return;

    }

    menuButton.addEventListener("click", () => {

        navbar.classList.toggle("show");

    });

    const links = navbar.querySelectorAll("a");

    links.forEach(link => {

        link.addEventListener("click", () => {

            navbar.classList.remove("show");

        });

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {

            navbar.classList.remove("show");

        }

    });

}