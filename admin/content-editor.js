(() => {
'use strict';
const repo='bl00dlust-java/bl00dlust-java.github.io';
const branch='main';
const path='contents/data/hub-content.json?ref='+branch;
const $=id=>document.getElementById(id);
let token='';
let fileSha='';
let hasLoaded=false;
const status=(id,message)=>{$(id).textContent=message;};
const api=async(url,options={})=>{
 const response=await fetch('https://api.github.com/repos/'+repo+'/'+url,{
  ...options,
  headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(token?{Authorization:'Bearer '+token}:{}),...(options.headers||{})}
 });
 const raw=await response.text();
 let data={};try{data=raw?JSON.parse(raw):{};}catch(_){}
 if(!response.ok){const error=new Error(data.message||('HTTP '+response.status));error.status=response.status;throw error;}
 return data;
};
const decode=data=>decodeURIComponent(escape(atob(data.replace(/\s/g,''))));
const encode=value=>btoa(unescape(encodeURIComponent(value)));
function validate(data){
 if(!data||data.version!==1)throw new Error('Поле version должно иметь значение 1.');
 const fields=[
  ['articles','title','category','text',100],
  ['glossary','term','definition',null,200],
  ['news','title','text','url',100]
 ];
 for(const [key,a,b,c,max] of fields){
  if(!Array.isArray(data[key])||data[key].length>max)throw new Error(key+': ожидается массив не более чем из '+max+' записей.');
  data[key].forEach((item,index)=>{
   if(!item||typeof item!=='object')throw new Error(key+'['+index+']: запись должна быть объектом.');
   for(const field of [a,b,c].filter(Boolean)){
    if(typeof item[field]!=='string'||!item[field].trim()||item[field].length>3000)throw new Error(key+'['+index+']: проверь поле '+field+'.');
   }
   if(key==='news'){let url;try{url=new URL(item.url);}catch(_){throw new Error('Некорректная ссылка в news['+index+'].');}if(url.protocol!=='https:')throw new Error('В news разрешены только HTTPS-ссылки.');}
  });
 }
 return data;
}
$('content-connect').addEventListener('click',async()=>{
 token=$('content-token').value.trim();
 if(!token){status('content-connect-status','Введи токен.');return;}
 try{await api('contents/index.html?ref='+branch);status('content-connect-status','Подключение подтверждено. Токен не сохраняется.');}
 catch(error){status('content-connect-status','Ошибка подключения: '+error.message);}
});
$('content-load').addEventListener('click',async()=>{
 if(!token){status('content-status','Сначала подключись к GitHub.');return;}
 try{const file=await api(path);fileSha=file.sha;hasLoaded=true;$('content-json').value=decode(file.content);status('content-status','Материалы загружены из GitHub.');}
 catch(error){status('content-status','Не удалось загрузить файл: '+error.message);}
});
$('content-validate').addEventListener('click',()=>{
 try{const data=validate(JSON.parse($('content-json').value));$('content-json').value=JSON.stringify(data,null,2);status('content-status','Проверка пройдена. Статей: '+data.articles.length+', терминов: '+data.glossary.length+', источников: '+data.news.length+'.');}
 catch(error){status('content-status','Ошибка проверки: '+error.message);}
});
$('content-publish').addEventListener('click',async()=>{
 if(!token){status('content-status','Сначала подключись к GitHub.');return;}
 if(!hasLoaded){status('content-status','Сначала загрузи текущие материалы из GitHub. Это защитит от случайной публикации пустого файла.');return;}
 try{
  const data=validate(JSON.parse($('content-json').value));
  const current=await api(path);
  if(current.sha!==fileSha)throw new Error('Файл изменился после загрузки. Загрузите актуальную версию и повторите изменения.');
  const result=await api('contents/data/hub-content.json',{
   method:'PUT',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({message:'Update knowledge base and trusted resources',content:encode(JSON.stringify(data,null,2)),branch,sha:current.sha})
  });
  fileSha=result.content?.sha||'';
  status('content-status','Опубликовано. Коммит: '+(result.commit?.sha||'создан')+'. GitHub Pages обновит сайт автоматически.');
 }catch(error){status('content-status','Не удалось опубликовать: '+error.message);}
});
$('content-json').value=JSON.stringify({version:1,articles:[],glossary:[],news:[]},null,2);
})();