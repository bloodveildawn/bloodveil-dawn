async function loadComponent(id,file){const r=await fetch(file);document.getElementById(id).innerHTML=await r.text();}
loadComponent("header","/assets/components/header.html");