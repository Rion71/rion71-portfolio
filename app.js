'use strict';
document.documentElement.classList.add('js');
let data={projects:[]};
function safeUrl(value){if(!value)return '';try{const url=new URL(value,document.baseURI);return ['http:','https:','file:'].includes(url.protocol)?url.href:'';}catch{return '';}}
function setImage(el,value){const url=safeUrl(value);if(url){el.style.backgroundImage=`url(${JSON.stringify(url)})`;el.style.backgroundSize='cover';el.style.backgroundPosition='center';}}
fetch('content/site.json').then(r=>{if(!r.ok)throw Error('content');return r.json();}).then(content=>{
 data=content;
 if(data.intro)document.querySelector('#intro').textContent=data.intro;
 if(data.about)document.querySelector('#about-text').textContent=data.about;
 if(data.hero)document.querySelector('#hero-video').poster=safeUrl(data.hero);
 if(data.hero_video && safeUrl(data.hero_video))document.querySelector('#hero-video').src=safeUrl(data.hero_video);
 document.querySelectorAll('.folder').forEach(el=>setImage(el.querySelector('.thumb-inner'),data[el.dataset.category.toLowerCase()+'_cover']));
}).catch(()=>{/* Local file preview uses the embedded sample text. */});
const dialog=document.querySelector('#gallery');
function openFolder(category){
 document.querySelector('#gallery-title').textContent=category;
 const target=document.querySelector('#projects');target.replaceChildren();
 const projects=(Array.isArray(data.projects)?data.projects:[]).filter(p=>p.category===category);
 if(!projects.length){const p=document.createElement('p');p.textContent='Здесь появятся проекты '+category+'. Сейчас это прототип главной страницы — раздел готов к наполнению.';target.append(p);}
 for(const project of projects){
  const article=document.createElement('article');article.className='project';
  const h=document.createElement('h3');h.textContent=project.title||'Без названия';article.append(h);
  const p=document.createElement('p');p.textContent=project.description||'';article.append(p);
  for(const value of [project.cover,...(Array.isArray(project.images)?project.images:[])]){const url=safeUrl(value);if(!url)continue;const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';const img=document.createElement('img');img.src=url;img.alt=project.title||'Работа';img.loading='lazy';a.append(img);article.append(a);}
  const video=safeUrl(project.video);if(video){const a=document.createElement('a');a.href=video;a.target='_blank';a.rel='noopener';a.textContent='Смотреть видео ↗';article.append(a);}
  target.append(article);
 }
 dialog.showModal();
}
document.querySelectorAll('.folder').forEach(el=>el.addEventListener('click',()=>openFolder(el.dataset.category)));
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

// Seek only after the previous decode completes; rapid direction changes use the latest target.
(() => {
 const sequence=document.querySelector('.hero-sequence');
 const background=document.querySelector('.atmosphere');
 const work=document.querySelector('#work');
 const video=document.querySelector('#hero-video');
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let target=0, frame=0;
 const clamp=n=>Math.max(0,Math.min(1,n));
 function seek(){
  if(preference.matches || video.readyState<2 || video.seeking || !Number.isFinite(video.duration))return;
  const time=target*Math.max(0,video.duration-1/24);
  if(Math.abs(video.currentTime-time)>1/48)video.currentTime=time;
 }
 function render(){
  frame=0;
  // Finish the portrait movement when the folders reach the middle of the screen.
  const viewport=background.offsetHeight;
  const workTop=window.scrollY+work.getBoundingClientRect().top;
  const span=Math.max(1,workTop-viewport*.35);
  target=preference.matches?0:clamp(-sequence.getBoundingClientRect().top/span);
  const ease=target*target*(3-2*target);
  const travel=Math.max(0,video.offsetHeight-viewport);
  background.style.setProperty('--pan',(ease*travel).toFixed(2));
  seek();
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(render);}
 video.addEventListener('seeked',seek);
 video.addEventListener('loadeddata',schedule);
 video.addEventListener('loadedmetadata',schedule);
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule);
 window.addEventListener('pageshow',schedule);
 preference.addEventListener('change',()=>{if(preference.matches && video.readyState>=2)video.currentTime=0;schedule();});
 schedule();
})();
