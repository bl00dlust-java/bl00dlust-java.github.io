(() => {
'use strict';
const repo='bl00dlust-java/bl00dlust-java.github.io',branch='main',path='contents/data/simulators.json?ref='+branch;
const $=id=>document.getElementById(id);
let token='',scenarios=[],editingId='',fileSha='';
const set=(id,value)=>{$(id).textContent=value;};
const encode=value=>btoa(unescape(encodeURIComponent(value)));
const decode=value=>decodeURIComponent(escape(atob(value.replace(/\\s/g,''))));
async function api(url,options={}){
 const response=await fetch('https://api.github.com/repos/'+repo+'/'+url,{...options,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(token?{Authorization:'Bearer '+token}:{}),...(options.headers||{})}});
 const raw=await response.text();let data={};try{data=raw?JSON.parse(raw):{};}catch(_){}
 if(!response.ok){const error=new Error(data.message||('HTTP '+response.status));error.status=response.status;throw error;}return data;
}
function validate(value){
 if(!value||value.version!==1||!Array.isArray(value.scenarios)||value.scenarios.length>50)throw new Error('Ожидается version: 1 и массив scenarios (до 50 записей).');
 const ids=new Set();
 value.scenarios.forEach((x,i)=>{
  const text=(v,max)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
  if(!x||!text(x.id,40)||!/^[a-z0-9-]+$/.test(x.id)||ids.has(x.id))throw new Error('Сценарий '+(i+1)+': некорректный или повторяющийся ID.');
  ids.add(x.id);
  if(!text(x.title,160)||!text(x.prompt,1200)||!text(x.explanation,1200)||!Array.isArray(x.options)||x.options.length<2||x.options.length>5||!x.options.every(v=>text(v,300))||!Number.isInteger(x.correctIndex)||x.correctIndex<0||x.correctIndex>=x.options.length)throw new Error('Сценарий '+(i+1)+': проверь название, описание, варианты и правильный ответ.');
  if(x.category!==undefined&&!text(x.category,80))throw new Error('Сценарий '+(i+1)+': некорректная категория.');
 });
 return value;
}
function clearForm(){
 editingId='';$('sim-id').value='';$('sim-category').value='';$('sim-title').value='';$('sim-prompt').value='';$('sim-options').value='';$('sim-correct').value='1';$('sim-explanation').value='';$('sim-add').textContent='Добавить сценарий';
}
function slug(value){return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,30)||'scenario';}
function renderList(){
 const list=$('sim-list');list.replaceChildren();
 if(!scenarios.length){const p=document.createElement('p');p.textContent='Сценариев пока нет.';list.append(p);return;}
 scenarios.forEach((item,index)=>{
  const row=document.createElement('article');row.className='hub-article';
  const h=document.createElement('h3');h.textContent=item.title;
  const p=document.createElement('p');p.textContent=(item.category||'Тренажёр')+' · '+item.options.length+' варианта ответа';
  const edit=document.createElement('button');edit.className='button button-ghost';edit.type='button';edit.textContent='Изменить';edit.addEventListener('click',()=>{editingId=item.id;$('sim-id').value=item.id;$('sim-category').value=item.category||'';$('sim-title').value=item.title;$('sim-prompt').value=item.prompt;$('sim-options').value=item.options.join('\\n');$('sim-correct').value=String(item.correctIndex+1);$('sim-explanation').value=item.explanation;$('sim-add').textContent='Сохранить изменения';set('sim-form-status','Редактируется: '+item.title);window.scrollTo({top:0,behavior:'smooth'});});
  const remove=document.createElement('button');remove.className='button button-ghost';remove.type='button';remove.textContent='Удалить';remove.addEventListener('click',()=>{scenarios.splice(index,1);renderList();set('sim-status','Сценарий удалён из черновика. Нажми «Опубликовать», чтобы сохранить изменение в GitHub.');if(editingId===item.id)clearForm();});
  row.append(h,p,edit,remove);list.append(row);
 });
}
$('sim-connect').addEventListener('click',async()=>{
 token=$('sim-token').value.trim();if(!token){set('sim-connect-status','Введи токен.');return;}
 try{await api('contents/index.html?ref='+branch);set('sim-connect-status','Подключение подтверждено. Токен не сохраняется.');}
 catch(error){set('sim-connect-status','Ошибка подключения: '+error.message);}
});
$('sim-add').addEventListener('click',()=>{
 try{
  const options=$('sim-options').value.split('\\n').map(x=>x.trim()).filter(Boolean);
  const title=$('sim-title').value.trim(),baseId=slug(title),id=editingId||baseId;
  const item={id,category:$('sim-category').value.trim()||'ТРЕНАЖЁР',title,prompt:$('sim-prompt').value.trim(),options,correctIndex:Number($('sim-correct').value)-1,explanation:$('sim-explanation').value.trim()};
  const draft=scenarios.filter(x=>x.id!==editingId);draft.push(item);validate({version:1,scenarios:draft});scenarios=draft;renderList();clearForm();set('sim-form-status','Сценарий добавлен в черновик. Не забудь опубликовать изменения.');
 }catch(error){set('sim-form-status','Проверь данные: '+error.message);}
});
$('sim-clear').addEventListener('click',clearForm);
$('sim-load').addEventListener('click',async()=>{
 if(!token){set('sim-status','Сначала подключись к GitHub.');return;}
 try{const file=await api(path);fileSha=file.sha;const data=validate(JSON.parse(decode(file.content)));scenarios=data.scenarios;renderList();set('sim-status','Загружено сценариев: '+scenarios.length+'.');}
 catch(error){set('sim-status','Не удалось загрузить: '+error.message);}
});
$('sim-publish').addEventListener('click',async()=>{
 if(!token){set('sim-status','Сначала подключись к GitHub.');return;}
 try{
  const data=validate({version:1,scenarios});
  let current;try{current=await api(path);}catch(error){if(error.status!==404)throw error;}
  const url=current?'contents/data/simulators.json':'contents/data/simulators.json';
  await api(url,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Update interactive learning scenarios',content:encode(JSON.stringify(data,null,2)),branch,...(current?{sha:current.sha}:{})})});
  set('sim-status','Опубликовано. GitHub Pages обновит тренажёры после публикации сайта.');
 }catch(error){set('sim-status','Не удалось опубликовать: '+error.message);}
});
renderList();
})();