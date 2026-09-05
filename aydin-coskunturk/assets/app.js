document.addEventListener('DOMContentLoaded',()=>{
  const menuButton=document.getElementById('menuBtn');
  const navigation=document.getElementById('mainNav');
  if(menuButton&&navigation){
    menuButton.addEventListener('click',()=>navigation.classList.toggle('open'));
    navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>navigation.classList.remove('open')));
  }
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
});
