let last=0;
window.addEventListener('scroll',()=>{
 const h=document.getElementById('header'); if(!h)return;
 const y=window.scrollY;
 if(y>last && y>80) h.classList.add('hide');
 else h.classList.remove('hide');
 last=y;
});