fetch("components/header.html")
.then(response=>response.text())
.then(html=>{

document
.getElementById("header")
.innerHTML=html;

initializeHeader();

});

fetch("components/footer.html")
.then(response=>response.text())
.then(html=>{

document
.getElementById("footer")
.innerHTML=html;

});