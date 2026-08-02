function initializeActiveNav(){

const currentPage=
window.location.pathname.split("/").pop();

const links=
document.querySelectorAll(".nav-link");

links.forEach(link=>{

const href=
link.getAttribute("href");

if(href===currentPage){

link.classList.add("active");

}

});

}