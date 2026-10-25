'use strict';
const projects=window.PHOTO_PROJECTS||[];
const params=new URLSearchParams(location.search);
const selected=Math.max(0,projects.findIndex(p=>p.id===params.get('project')));
if(document.querySelector('.slider')){
 let current=selected,request=0;
 const cover=document.querySelector('#slide-image');
 const thumbnails=document.querySelector('.thumbnails');
 const buttons=projects.map((project,index)=>{
  const button=document.createElement('button');button.className='thumb';button.type='button';button.setAttribute('aria-label',project.title+' — '+project.kind);
  const img=document.createElement('img');img.src=project.cover;img.alt='';
  const label=document.createElement('span');label.textContent=String(index+1).padStart(2,'0')+' / '+project.title;
  button.append(img,label);button.addEventListener('click',()=>show(index));thumbnails.append(button);return button;
 });
 function show(index){
  current=(index+projects.length)%projects.length;const project=projects[current];const token=++request;
  document.querySelector('#slide-title').textContent=project.title;
  document.querySelector('#slide-kind').textContent=project.kind;
  document.querySelector('#slide-count').textContent=String(current+1).padStart(2,'0')+' / '+String(projects.length).padStart(2,'0');
  document.querySelector('#view-project').href='shoot.html?project='+encodeURIComponent(project.id);
  buttons.forEach((button,i)=>button.setAttribute('aria-current',String(i===current)));
  try{history.replaceState(null,'','photo.html?project='+encodeURIComponent(project.id));}catch{/* Direct file preview may disallow history updates. */}
  const image=new Image();image.onload=()=>{if(token!==request)return;cover.classList.add('changing');setTimeout(()=>{if(token!==request)return;cover.src=project.cover;cover.style.objectPosition=project.position||'center';cover.classList.remove('changing');},matchMedia('(prefers-reduced-motion: reduce)').matches?0:220);};image.src=project.cover;
 }
 document.querySelector('.previous').addEventListener('click',()=>show(current-1));
 document.querySelector('.next').addEventListener('click',()=>show(current+1));
 window.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}});
 let touchX=null;document.querySelector('.slide-images').addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;},{passive:true});
 document.querySelector('.slide-images').addEventListener('touchend',e=>{if(touchX!==null){const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>50)show(current+(dx<0?1:-1));}touchX=null;},{passive:true});
 show(current);
}else{
 const project=projects.find(p=>p.id===params.get('project'));
 if(!project){document.querySelector('#shoot-title').textContent='Проект не найден';}
 else{
  document.title=project.title+' — Alexandra Rion';
  document.querySelector('#shoot-title').textContent=project.title;document.querySelector('#shoot-kind').textContent=project.kind;document.querySelector('#shoot-description').textContent=project.description||'';
  document.querySelector('.back-projects').href='photo.html?project='+encodeURIComponent(project.id);
  const lightbox=document.querySelector('.lightbox'),large=lightbox.querySelector('img');
  project.images.forEach((src,index)=>{const button=document.createElement('button');button.className='shoot-photo';button.setAttribute('aria-label','Увеличить фото '+(index+1));const image=document.createElement('img');image.src=src;image.alt=project.title+' — кадр '+(index+1);image.loading=index?'lazy':'eager';button.append(image);button.addEventListener('click',()=>{large.src=src;large.alt=image.alt;large.classList.remove('zoomed');lightbox.showModal();});document.querySelector('#shoot-gallery').append(button);});
  lightbox.querySelector('button').addEventListener('click',()=>lightbox.close());large.addEventListener('click',()=>large.classList.toggle('zoomed'));
 }
}
