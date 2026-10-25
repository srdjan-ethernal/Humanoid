(()=>{'use strict';
const script=document.currentScript,base=new URL('.',script.src);
const languages={en:'English',sr:'Srpski',de:'Deutsch',fr:'Français',es:'Español',it:'Italiano',zh:'中文',ja:'日本語'};
const formats={en:'en-US',sr:'sr-Latn-RS',de:'de-DE',fr:'fr-FR',es:'es-ES',it:'it-IT',zh:'zh-CN',ja:'ja-JP'};
const countries={RS:'sr',ME:'sr',BA:'sr',DE:'de',AT:'de',LI:'de',CH:'de',FR:'fr',MC:'fr',BE:'fr',LU:'fr',ES:'es',MX:'es',AR:'es',BO:'es',CL:'es',CO:'es',CR:'es',CU:'es',DO:'es',EC:'es',SV:'es',GT:'es',HN:'es',NI:'es',PA:'es',PY:'es',PE:'es',PR:'es',UY:'es',VE:'es',IT:'it',SM:'it',VA:'it',CN:'zh',TW:'zh',HK:'zh',MO:'zh',SG:'zh',JP:'ja'};
let language='en',dictionary={},lower={},request=0,observer,scheduled=false;
const texts=new WeakMap,attributes=new WeakMap;
const normalize=s=>s.replace(/\s+/g,' ').trim();
const storage={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}},remove(k){try{localStorage.removeItem(k)}catch{}}};
function direct(s){if(Object.hasOwn(dictionary,s))return dictionary[s];const key=lower[s.toLowerCase()];if(key){const v=dictionary[key];return s===s.toUpperCase()&&/[a-z]/i.test(s)?v.toLocaleUpperCase(formats[language]):v}return null}
function translate(s,depth=0){if(language==='en'||!s||depth>5)return s;const n=normalize(s);if(!n||n==='HUMANOID'||/^https?:|^[\d\s.,%$€£¥+—–↗↓↑♥♡×®]+$/.test(n))return s;let result=direct(n);if(result!==null)return s.replace(s.trim(),result);
if(n.includes(' · '))return n.split(' · ').map(x=>translate(x,depth+1)).join(' · ');if(n.includes(' / '))return n.split(' / ').map(x=>translate(x,depth+1)).join(' / ');const edge=n.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);if(edge&&(edge[1]||edge[3])){const inner=translate(edge[2],depth+1);if(inner!==edge[2])return edge[1]+inner+edge[3]}
const count=n.match(/^(\d+)\s+(makers & suppliers|platforms & offers|platform \/ offer|stories|story|min read)(.*)$/i);if(count)return count[1]+' '+translate(count[2],depth+1)+translate(count[3],depth+1);
const date=n.match(/^(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s+(\d{4})$/i);if(date){const month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(date[2].slice(0,3).toLowerCase());return new Intl.DateTimeFormat(formats[language],{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(+date[3],month,+date[1])))}
const reviewed=n.match(/^Reviewed ([A-Z][a-z]+ \d{1,2}, \d{4})$/);if(reviewed)return translate('Reviewed',depth+1)+' '+new Intl.DateTimeFormat(formats[language],{dateStyle:'long',timeZone:'UTC'}).format(new Date(reviewed[1]));
if(n.includes(' · '))return n.split(' · ').map(x=>translate(x,depth+1)).join(' · ');
if(n.includes(' / '))return n.split(' / ').map(x=>translate(x,depth+1)).join(' / ');
if(n.startsWith('Source: '))return translate('Source:',depth+1)+' '+n.slice(8);
for(const prefix of ['Official source for ','Enlarge: ','Explore ','Unsave ','Save '])if(n.startsWith(prefix))return translate(prefix.trim(),depth+1)+' '+n.slice(prefix.length);
if(n.startsWith('View ')&&n.endsWith(' details'))return translate('View',depth+1)+' '+n.slice(5,-8)+' '+translate('details',depth+1);
if(n.startsWith('PLATFORM / '))return translate('PLATFORM',depth+1)+' / '+translate(n.slice(11),depth+1);
return s}
function ignored(el){return !el||el.closest('script,style,code,pre,[data-no-translate],.wordmark,.maker-strip a,.editorial-image>span,.maker-name,.product-title,#drafts')}
function apply(){scheduled=false;if(!document.body)return;observer?.disconnect();
document.querySelectorAll('option:not([value])').forEach(o=>o.setAttribute('value',o.textContent));
const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);let node;
while(node=walker.nextNode()){if(ignored(node.parentElement))continue;const current=node.nodeValue;let state=texts.get(node);if(!state||current!==state.last)state={original:current,last:current};const next=translate(state.original);if(next!==current)node.nodeValue=next;state.last=next;texts.set(node,state)}
for(const el of document.querySelectorAll('[placeholder],[aria-label],[title],[alt],meta[name="description"],meta[property="og:title"],meta[property="og:description"]')){if(el.closest('script,style,code,pre,[data-no-translate],#drafts'))continue;let state=attributes.get(el)||{};for(const attr of ['placeholder','aria-label','title','alt',...(el.tagName==='META'?['content']:[])]){if(!el.hasAttribute(attr))continue;const current=el.getAttribute(attr);let record=state[attr];if(!record||current!==record.last)record={original:current,last:current};const next=translate(record.original);if(next!==current)el.setAttribute(attr,next);record.last=next;state[attr]=record}attributes.set(el,state)}
document.documentElement.lang=language==='sr'?'sr-Latn':language==='zh'?'zh-Hans':language;
document.querySelectorAll('[data-language-select]').forEach(s=>{s.value=storage.get('hm-language')||'auto';s.setAttribute('aria-label',translate('Language'));s.querySelector('option[value=auto]').textContent=translate('Automatic · location')});
observer?.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title','alt','content']});}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(apply)}}
async function setLanguage(next){if(!languages[next])next='en';const ticket=++request;let dict={};try{if(next!=='en'){const response=await fetch(new URL('locales/'+next+'.json',base));if(!response.ok)throw Error('Locale unavailable');dict=await response.json()}}catch{next='en'}if(ticket!==request)return;language=next;dictionary=dict;lower=Object.fromEntries(Object.keys(dict).map(k=>[k.toLowerCase(),k]));apply();document.dispatchEvent(new CustomEvent('hm:language',{detail:{language}}));}
function countryLanguage(country){return countries[String(country||'').toUpperCase()]||'en'}
async function automatic(){const saved=storage.get('hm-country-cache');if(saved){try{const c=JSON.parse(saved);if(Date.now()-c.at<86400000)return setLanguage(countryLanguage(c.country))}catch{}}
const ticket=request;try{const control=new AbortController,timer=setTimeout(()=>control.abort(),3500);let response;try{response=await fetch('https://api.country.is/',{signal:control.signal,credentials:'omit',referrerPolicy:'no-referrer'})}finally{clearTimeout(timer)}if(!response.ok)throw Error('Country unavailable');const data=await response.json();if(!/^[A-Z]{2}$/.test(data.country||''))throw Error('Invalid country');storage.set('hm-country-cache',JSON.stringify({country:data.country,at:Date.now()}));if(ticket===request&&!storage.get('hm-language'))return setLanguage(countryLanguage(data.country))}catch{}if(ticket===request&&!storage.get('hm-language'))return setLanguage('en')}
function controls(){const optionHTML='<option value="auto">Auto · 🌐</option>'+Object.entries(languages).map(([code,label])=>`<option value="${code}">${label}</option>`).join('');const control=()=>{const label=document.createElement('label');label.className='language-control';label.dataset.noTranslate='';label.innerHTML='<span aria-hidden="true">🌐</span><select data-language-select aria-label="Language">'+optionHTML+'</select>';label.querySelector('select').addEventListener('change',e=>{const value=e.target.value;if(value==='auto'){storage.remove('hm-language');automatic()}else{storage.set('hm-language',value);setLanguage(value)}});return label};document.querySelector('header .header-actions')?.appendChild(control());for(const span of document.querySelectorAll('footer .footer-bottom>span'))if(span.textContent.trim()==='EN / English')span.replaceWith(control())}
window.HM_I18N={t:s=>translate(String(s??'')),get language(){return language},get locale(){return formats[language]},countryLanguage,setLanguage};
document.addEventListener('DOMContentLoaded',()=>{controls();observer=new MutationObserver(schedule);apply();const choice=storage.get('hm-language');if(languages[choice])setLanguage(choice);else automatic()});
})();




