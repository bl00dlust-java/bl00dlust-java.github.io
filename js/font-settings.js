(async()=>{
  'use strict';
  try {
    const response=await fetch("font-settings.json",{cache:"no-cache"});
    if(!response.ok)return;
    const config=await response.json();
    const fontFaceRules=(Array.isArray(config.fonts)?config.fonts:[]).map(font=>{
      if(!font||typeof font!=="object")return "";
      const family=String(font.family||"").replace(/[^a-zA-Z0-9 _-]/g,"").trim().slice(0,80);
      const src=String(font.src||"");
      const format=({woff2:"woff2",woff:"woff",ttf:"truetype",otf:"opentype"})[font.format];
      const weight=Number(font.weight||400);
      if(!family||!/^\/?assets\/fonts\/[A-Za-z0-9._-]+$/.test(src)||!format||!Number.isInteger(weight)||weight<100||weight>900)return "";
      return '@font-face{font-family:"'+family+'";src:url("'+src+'") format("'+format+'");font-weight:'+weight+';font-display:swap;}';
    }).filter(Boolean);
    const style=document.createElement("style");
    style.id="custom-font-settings";
    style.textContent=fontFaceRules.join("\n");
    const assignments=config.assignments||{};
    const safeFamily=value=>String(value||"").replace(/[^a-zA-Z0-9 _-]/g,"").trim().slice(0,80);
    const heading=safeFamily(assignments.heading),body=safeFamily(assignments.body),ui=safeFamily(assignments.ui),mono=safeFamily(assignments.mono);
    if(heading)style.textContent+='\n:root{--font-display:"'+heading+'",serif;}';
    if(body)style.textContent+='\n:root{--font-body:"'+body+'",sans-serif;}';
    if(ui)style.textContent+='\nbutton,.button,.desktop-nav a,.mobile-nav a{font-family:"'+ui+'",sans-serif;}';
    if(mono)style.textContent+='\n.eyebrow,.brand-name,.module-number-label{font-family:"'+mono+'",monospace;}';
    document.head.appendChild(style);
  } catch(error) {
    // Custom fonts are optional; the built-in system font stack remains available offline.
  }
})();