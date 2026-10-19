/* Reyhaneh: interactive storybook additions; no external services. */
(function(){
"use strict";
const KEY="reyhaneh.v2.progress", VAULT="reyhaneh.v2.vault", SOUND="reyhaneh.v2.sound";
const $=id=>document.getElementById(id);
const fa=n=>String(n).replace(/[0-9]/g,d=>"۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
const safeGet=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch(_){return f}};
const safeSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}};
const chapters=[...document.querySelectorAll(".chapter[data-chapter]")].filter(s=>/^ch[1-8]$/.test(s.id));
let soundOn=safeGet(SOUND,false), audioContext=null, toastTimer;
function sound(type="pop"){
 if(!soundOn)return;
 try{
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)return;
  audioContext ||= new AC();
  if(audioContext.state==="suspended")audioContext.resume();
  const t=audioContext.currentTime;
  const seq=type==="win"?[523.25,659.25,783.99,1046.5]:type==="open"?[392,587.3,783.99]:[660,880];
  seq.forEach((f,i)=>{
   const osc=audioContext.createOscillator(),gain=audioContext.createGain(),s=t+i*.095;
   osc.type="sine";osc.frequency.setValueAtTime(f,s);
   gain.gain.setValueAtTime(0,s);gain.gain.linearRampToValueAtTime(.035,s+.012);
   gain.gain.exponentialRampToValueAtTime(.001,s+.18);
   osc.connect(gain);gain.connect(audioContext.destination);
   osc.start(s);osc.stop(s+.20);
  });
 }catch(_){}
}
function announce(message){
 let el=$("story-toast");
 if(!el){el=document.createElement("div");el.id="story-toast";el.className="story-toast";el.setAttribute("role","status");document.body.append(el)}
 el.textContent=message;el.classList.add("visible");clearTimeout(toastTimer);
 toastTimer=setTimeout(()=>el.classList.remove("visible"),3200);
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))}
function getDone(){return chapters.filter(ch=>ch.classList.contains("done")).map(ch=>Number(ch.dataset.chapter))}
function setShards(){
 const done=getDone(),all=done.length===8;
 document.querySelectorAll(".story-shard").forEach((node,i)=>node.classList.toggle("collected",done.includes(i+1)));
 document.body.classList.toggle("journey-complete",all);
 const lock=$("finale-lock");if(lock){const p=lock.querySelector("[data-left]");if(p)p.textContent=all?"":fa(8-done.length)+" تکه دیگر مانده تا قلب ما کامل شود."}
 if(all&&!sessionStorage.getItem("reyhaneh.finale.celebrated")){
  sessionStorage.setItem("reyhaneh.finale.celebrated","1");
  sound("win");
 }
 const vault=$("memory-vault");if(vault && all && !vault.dataset.rendered){vault.dataset.rendered="1";renderVault()}
}
function buildProgress(){
 const bar=document.querySelector(".progress-wrap");
 if(!bar)return;
 const shards=document.createElement("div");shards.className="story-shards";shards.setAttribute("aria-label","هشت تکه قلب سفر");
 for(let i=0;i<8;i++){const diamond=document.createElement("span");diamond.className="story-shard";diamond.title="مرحله "+fa(i+1);shards.append(diamond)}
 bar.append(shards);
}
function buildIntro(){
 const el=document.createElement("div");
 el.id="story-intro";
 el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-labelledby","intro-title");
 el.innerHTML='<div class="intro-content"><p class="intro-overline">یک قصه، فقط برای تو</p><h2 id="intro-title">ریحانه، یه نامه داری...</h2><p class="intro-sub">بعضی حرف‌ها را نمی‌شود فقط گفت؛<br>باید با دست‌های خودت کشفشان کنی.</p><div class="intro-envelope" aria-hidden="true"><div class="back"></div><div class="letter">برای ریحانه‌ام ♥</div><div class="front"></div><div class="flap"></div><div class="seal">♥</div></div><button class="intro-start" id="intro-start" type="button">مُهر نامه را باز کن ✦</button><p class="intro-foot">هشت کشف کوچک، یک حرف بزرگ</p></div>';
 document.body.prepend(el);
 document.body.classList.add("intro-visible");
 const button=$("intro-start");
 button.addEventListener("click",()=>{
  button.disabled=true;el.classList.add("opening");sound("open");
  setTimeout(()=>{el.classList.add("leaving");document.body.classList.remove("intro-visible");setTimeout(()=>el.remove(),900);},950);
 });
 button.focus({preventScroll:true});
}
function buildChapterNotes(){
 const hints=[
 ["اولین تکه","گاهی یک لمس کوچک، آغاز همه‌چیز است."],
 ["دومین تکه","حرف‌های دوست‌داشتنی همیشه در یک نامه جا نمی‌شوند."],
 ["سومین تکه","نام‌هایی که فقط میان ما معنی پیدا می‌کنند."],
 ["چهارمین تکه","از یک گل شروع کن، تا یک باغ بسازیم."],
 ["پنجمین تکه","بعضی روشنایی‌ها را فقط یک نفر به زندگی می‌آورد."],
 ["ششمین تکه","ارزشمندترین قول‌ها زیر گردوغبار زمان هم می‌مانند."],
 ["هفتمین تکه","هر راهی که برویم، مهم این است که کنار هم باشیم."],
 ["هشتمین تکه","آخرین قطعه قلب، فقط یک بازی دیگر فاصله دارد."]
 ];
 chapters.forEach((ch,i)=>{
  const head=ch.querySelector(".chapter-head");if(!head)return;
  const eyebrow=document.createElement("p");eyebrow.className="story-eyebrow";eyebrow.textContent="فصل "+fa(i+1)+" از هشت · "+hints[i][0];head.prepend(eyebrow);
  const note=document.createElement("span");note.className="story-note";note.textContent=hints[i][1];head.append(note);
 });
 const finale=$("finale");if(!finale)return;
 const lead=finale.querySelector(".lead");
 if(lead)lead.textContent="تمام تکه‌های قلب را پیدا کن تا نامه آخر باز شود.";
 const lock=document.createElement("div");lock.className="finale-lock";lock.id="finale-lock";
 lock.innerHTML='<span class="finale-lock-icon" aria-hidden="true">♡</span><h3>آخرین نامه هنوز مُهر شده...</h3><p data-left>هشت تکه قلب تا این لحظه پنهان مانده است.</p><p>هر مرحله را که تمام کنی، یک تکه قلب به این نامه برمی‌گردد.</p><a class="btn small" href="#ch1">برگرد به ابتدای قصه</a>';
 const surprise=document.createElement("div");surprise.className="final-reveal";
 surprise.innerHTML='<span class="shard-heart" aria-hidden="true">♥</span><h3>هشت تکه، یک قلب...</h3><p>و این همه فقط بهانه بود تا باز یک‌بار دیگر بگویم:<br><strong>ریحانه، خوشحالم که هم‌سفر زندگی منی.</strong></p><p class="audio-help">اگر حسین یک پیام صوتی اضافه کرده باشد، اینجا شنیده می‌شود.</p><audio class="voice-player" id="voice-player" controls preload="none" hidden></audio><label class="voice-local-label" for="voice-local">پیام صوتی خصوصی را فقط روی همین دستگاه انتخاب کن <input id="voice-local" type="file" accept="audio/*"></label>';
 finale.querySelector(".chapter-head").after(lock,surprise);
 const voice=$("voice-local");
 voice.addEventListener("change",()=>{
  const f=voice.files?.[0];if(!f)return;
  const player=$("voice-player");if(player.dataset.url)URL.revokeObjectURL(player.dataset.url);
  player.dataset.url=URL.createObjectURL(f);player.src=player.dataset.url;player.hidden=false;
  announce("پیام صوتی آماده است؛ فقط در همین بازدید پخش می‌شود.");
 });
 const ghost=finale.querySelector(".chapter-head .done-badge");if(ghost)ghost.textContent="هشت تکه کامل شد ♥";
}
function buildSound(){
 const b=document.createElement("button");b.type="button";b.className="sound-toggle";b.id="sound-toggle";
 b.setAttribute("aria-pressed",String(soundOn));b.setAttribute("aria-label","روشن یا خاموش کردن افکت صوتی");
 function label(){b.textContent=soundOn?"♫ صدای افکت‌ها روشن":"♫ صدای افکت‌ها خاموش"}
 label();b.onclick=()=>{soundOn=!soundOn;safeSet(SOUND,soundOn);b.setAttribute("aria-pressed",String(soundOn));label();if(soundOn)sound("open")};
 document.body.append(b);
}
function vaultRecords(){const items=safeGet(VAULT,[]);return Array.isArray(items)?items:[]}
function buildVault(){
 const sec=document.createElement("section");sec.id="memory-vault";
 sec.innerHTML='<div class="vault-shell"><div class="vault-top"><span class="icon" aria-hidden="true">✦</span><h2>صندوقچه خاطرات ما</h2><p>این قصه قرار نیست همین‌جا تمام شود. اینجا می‌شود لحظه‌های قشنگ را نگه داشت؛ حتی نامه‌هایی برای روزهای آینده.</p></div><div class="vault-grid"><form class="vault-form" id="vault-form"><h3>یک یادگاری تازه بساز</h3><label>نام خاطره<input id="vault-title" maxlength="65" placeholder="مثلاً: روزی که..." required></label><label>حرفی که می‌خواهی بماند<textarea id="vault-body" maxlength="1200" required placeholder="یک جمله واقعی از قلبت..."></textarea></label><label>عکس کوچک (اختیاری)<input id="vault-photo" type="file" accept="image/*"></label><label>تاریخ بازشدن نامه (اختیاری)<input id="vault-date" type="date"></label><button class="btn small" type="submit">بگذار توی صندوقچه ♥</button><p class="form-status" id="vault-status" role="status"></p><small>یادگاری‌ها تنها در مرورگر همین دستگاه ذخیره می‌شوند؛ برای اشتراک‌گذاری یا پشتیبان‌گیری مناسب نیستند. تاریخ قفل امنیتی نیست.</small></form><div class="vault-list-wrap"><h3>خاطره‌های نگه‌داشته‌شده</h3><div id="vault-items" class="vault-items"></div></div></div><p class="vault-privacy">عکس‌ها به سرور فرستاده نمی‌شوند. پاک‌کردن داده‌های مرورگر ممکن است همه یادگاری‌ها را حذف کند.</p></div>';
 $("finale").after(sec);
 $("vault-form").addEventListener("submit",async e=>{
  e.preventDefault();
  const title=$("vault-title").value.trim(),body=$("vault-body").value.trim(),date=$("vault-date").value;
  const status=$("vault-status");
  if(!title||!body){status.textContent="نام و متن خاطره را بنویس.";return}
  const items=vaultRecords();if(items.length>=18){status.textContent="صندوقچه فعلاً تا ۱۸ یادگاری جا دارد.";return}
  let photo="";
  const file=$("vault-photo").files[0];
  if(file){
   if(file.size>8*1024*1024){status.textContent="برای ذخیره محلی، عکسی کوچک‌تر از ۸ مگابایت انتخاب کن.";return}
   try{
    photo=await compressImage(file);
   }catch(_){status.textContent="این عکس در مرورگر قابل پردازش نبود.";return}
  }
  items.unshift({id:Date.now()+"-"+Math.random().toString(36).slice(2),title,body,date,photo,created:new Date().toISOString()});
  if(!safeSet(VAULT,items)){status.textContent="حافظه مرورگر پر است. لطفاً عکس کوچک‌تری انتخاب کن.";return}
  $("vault-form").reset();status.textContent="یادگاری ذخیره شد ♥";renderVault();sound("win");
 });
 $("vault-items").addEventListener("click",e=>{
  const button=e.target.closest("button[data-delete]");
  if(!button)return;
  const items=vaultRecords().filter(item=>item.id!==button.dataset.delete);
  if(!window.confirm("این یادگاری از همین مرورگر پاک شود؟"))return;
  safeSet(VAULT,items);renderVault();
 });
}
function compressImage(file){
 return new Promise((resolve,reject)=>{
  const img=new Image(),url=URL.createObjectURL(file);
  img.onload=()=>{
   try{
    const c=document.createElement("canvas"),k=Math.min(1,800/Math.max(img.naturalWidth,img.naturalHeight));
    c.width=Math.max(1,Math.round(img.naturalWidth*k));c.height=Math.max(1,Math.round(img.naturalHeight*k));
    c.getContext("2d").drawImage(img,0,0,c.width,c.height);
    const str=c.toDataURL("image/jpeg",.66);
    URL.revokeObjectURL(url);resolve(str);
   }catch(e){URL.revokeObjectURL(url);reject(e)}
  };
  img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("invalid image"))};
  img.src=url;
 });
}
function renderVault(){
 const root=$("vault-items");if(!root)return;
 const items=vaultRecords();root.replaceChildren();
 if(!items.length){const p=document.createElement("p");p.className="vault-empty";p.textContent="هنوز چیزی اینجا نیست. شاید اولین خاطره را امروز بنویسیم؟";root.append(p);return}
 const now=new Date().toISOString().slice(0,10);
 items.forEach(item=>{
  const locked=item.date&&item.date>now;
  const div=document.createElement("article");div.className="vault-item"+(locked?" is-locked":"");
  const title=document.createElement("h4");title.textContent=locked?"🔒 یک نامه برای روز "+item.date:item.title;div.append(title);
  const meta=document.createElement("div");meta.className="vault-date";meta.textContent=locked?"هنوز زمان بازشدنش نرسیده است":new Date(item.created||Date.now()).toLocaleDateString("fa-IR");div.append(meta);
  if(!locked){
   const p=document.createElement("p");p.textContent=item.body;div.append(p);
   if(item.photo&&/^data:image\/(jpeg|png|webp);base64,/.test(item.photo)){const img=new Image();img.src=item.photo;img.alt="عکس همراه خاطره";img.loading="lazy";div.append(img)}
  }
  const del=document.createElement("button");del.type="button";del.className="vault-delete";del.dataset.delete=item.id;del.textContent="حذف یادگاری";div.append(del);root.append(div);
 });
}
function observation(){
 const observer=new MutationObserver(()=>{
  const done=getDone();
  const old=safeGet(KEY,[]);
  if(done.length && JSON.stringify(done)!==JSON.stringify(old)){
   safeSet(KEY,done);
   const added=done.filter(id=>!old.includes(id));
   if(added.length){const id=added.at(-1);announce("تکه "+fa(id)+" از هشت پیدا شد ✦");sound(done.length===8?"win":"pop")}
  }
  setShards();
 });
 chapters.forEach(ch=>observer.observe(ch,{attributes:true,attributeFilter:["class"]}));
 setShards();
}
function buildSkip(){
 const game=document.querySelector("#ch8 .panel");
 if(!game)return;
 const button=document.createElement("button");
 button.type="button";button.className="btn ghost small";button.style.cssText="margin-top:14px;font-size:.86rem";
 button.textContent="فقط نامه و شعر آخر را می‌خواهم";
 button.setAttribute("aria-label","رد کردن بازی زمان‌دار و باز کردن شعر");
 button.addEventListener("click",()=>{
  const poem=$("tap-poem");if(poem)poem.classList.add("show");
  if(typeof window.reyhanehComplete==="function")window.reyhanehComplete(8);
  announce("برای رسیدن به نامه آخر، نیازی نیست رکورد بزنی ♥");
 });
 game.append(button);
}
buildSkip();
buildProgress();
buildChapterNotes();
buildVault();
buildSound();
observation();
if(!location.hash || location.hash==="#ch1") buildIntro();
/* Restoring progress is handled by the original game's completion state hydration. */
})();
