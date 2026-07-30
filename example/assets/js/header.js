let last=0;
const header=document.getElementById('header');
window.addEventListener('scroll',()=>{
 const y=window.scrollY;
 if(y>last && y>80){header.classList.add('hide');}
 else{header.classList.remove('hide');}
 last=y<=0?0:y;
});