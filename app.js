'use strict';
document.documentElement.classList.add('js');
let data={projects:[]};
function safeUrl(value){if(!value)return '';try{const url=new URL(value,document.baseURI);return ['http:','https:','file:'].includes(url.protocol)?url.href:'';}catch{return '';}}
fetch('content/site.json').then(r=>{if(!r.ok)throw Error('content');return r.json();}).then(content=>{
 data=content;


 if(data.hero && safeUrl(data.hero))document.querySelector('#background').src=safeUrl(data.hero);
 if(data.logo && safeUrl(data.logo))document.querySelectorAll('.logo-image').forEach(el=>el.src=safeUrl(data.logo));

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
document.querySelectorAll('.project-link').forEach(el=>el.addEventListener('click',()=>openFolder(el.dataset.category)));
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});


document.querySelectorAll('[data-info]').forEach(button=>button.addEventListener('click',()=>{
 const about=button.dataset.info==='about';
 document.querySelector('#gallery-title').textContent=about?'About':'Contact';
 const p=document.createElement('p');
 p.textContent=about?(data.about||'Я — Александра Rion. Снимаю, рисую, создаю визуальные миры и вещи руками.'):'Контакты для связи скоро появятся здесь.';
 document.querySelector('#projects').replaceChildren(p);dialog.showModal();
}));
