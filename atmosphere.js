'use strict';
// Decorative depth layers. The original photo is never warped or repainted.
(() => {
 const image=document.querySelector('#background');
 const logo=document.querySelector('.hero-logo');
 const grain=document.querySelector('.grain');
 const canvas=document.querySelector('#particles');
 const ctx=canvas.getContext('2d');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const desktop=matchMedia('(min-width:901px) and (hover:hover) and (pointer:fine)');
 let frame=0,tx=0,ty=0,x=0,y=0,width=0,height=0;
 const points=Array.from({length:38},()=>({x:Math.random(),y:Math.random(),r:.35+Math.random()*.8,z:.3+Math.random()*.7,a:.08+Math.random()*.3}));
 const enabled=()=>desktop.matches&&!reduced.matches&&!document.hidden;
 function paint(){
  if(!ctx)return;
  ctx.clearRect(0,0,width,height);
  for(const p of points){ctx.fillStyle=`rgba(128,238,238,${p.a})`;ctx.beginPath();ctx.arc(p.x*width+x*22*p.z,p.y*height+y*18*p.z,p.r,0,Math.PI*2);ctx.fill();}
 }
 function render(){
  frame=0;if(!enabled())return;
  x+=(tx-x)*.065;y+=(ty-y)*.065;
  image.style.transform=`translate3d(${x*9}px,${y*7}px,0)`;
  logo.style.transform=`translate3d(${x*3}px,${y*2}px,0)`;
  grain.style.transform=`translate3d(${x*-13}px,${y*-10}px,0)`;
  paint();if(Math.abs(tx-x)+Math.abs(ty-y)>.001)frame=requestAnimationFrame(render);
 }
 function schedule(){if(enabled()&&!frame)frame=requestAnimationFrame(render);}
 function reset(){tx=ty=0;schedule();}
 function setup(){
  if(frame)cancelAnimationFrame(frame);frame=0;x=y=tx=ty=0;
  image.style.transform=logo.style.transform=grain.style.transform='';
  width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio||1,1.5);
  canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
  if(ctx){ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);}
  if(enabled())schedule();
 }
 window.addEventListener('pointermove',e=>{if(!enabled()||e.pointerType==='touch')return;tx=Math.max(-1,Math.min(1,e.clientX/width*2-1));ty=Math.max(-1,Math.min(1,e.clientY/height*2-1));schedule();},{passive:true});
 document.documentElement.addEventListener('pointerleave',reset);
 window.addEventListener('blur',reset);
 window.addEventListener('resize',setup);
 document.addEventListener('visibilitychange',setup);
 reduced.addEventListener('change',setup);desktop.addEventListener('change',setup);
 setup();
})();
