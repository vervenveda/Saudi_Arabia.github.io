(()=>{
  const root=document.documentElement;
  const langButton=document.getElementById("languageToggle");
  let lang="en";
  try{lang=localStorage.getItem("VNV_SAUDI_LANG")==="ar"?"ar":"en"}catch{}
  function applyLanguage(next){
    lang=next==="ar"?"ar":"en";
    root.lang=lang;
    root.dir=lang==="ar"?"rtl":"ltr";
    document.querySelectorAll("[data-en][data-ar]").forEach(el=>{
      el.textContent=lang==="ar"?el.dataset.ar:el.dataset.en;
    });
    document.querySelectorAll("[data-html-en][data-html-ar]").forEach(el=>{
      el.innerHTML=lang==="ar"?el.dataset.htmlAr:el.dataset.htmlEn;
    });
    document.querySelectorAll("[data-aria-en][data-aria-ar]").forEach(el=>{
      el.setAttribute("aria-label",lang==="ar"?el.dataset.ariaAr:el.dataset.ariaEn);
    });
    document.querySelectorAll("[data-title-en][data-title-ar]").forEach(el=>{
      el.setAttribute("title",lang==="ar"?el.dataset.titleAr:el.dataset.titleEn);
    });
    if(langButton){
      langButton.textContent=lang==="ar"?"English":"العربية";
      langButton.setAttribute("aria-label",lang==="ar"?"Switch language to English":"التبديل إلى العربية");
      langButton.setAttribute("aria-pressed",String(lang==="ar"));
    }
    try{localStorage.setItem("VNV_SAUDI_LANG",lang)}catch{}
    document.dispatchEvent(new CustomEvent("saudi:language",{detail:{lang}}));
  }
  if(langButton)langButton.addEventListener("click",()=>applyLanguage(lang==="ar"?"en":"ar"));
  applyLanguage(lang);

  document.querySelectorAll("[data-tabset]").forEach(set=>{
    const tabs=[...set.querySelectorAll("[data-tab]")];
    const panels=[...set.querySelectorAll("[data-panel]")];
    function activate(id){
      tabs.forEach(t=>t.setAttribute("aria-selected",String(t.dataset.tab===id)));
      panels.forEach(p=>p.hidden=p.dataset.panel!==id);
    }
    tabs.forEach(tab=>tab.addEventListener("click",()=>activate(tab.dataset.tab)));
    const selected=tabs.find(t=>t.getAttribute("aria-selected")==="true")||tabs[0];
    if(selected)activate(selected.dataset.tab);
  });

  const pattern=document.getElementById("patternStage");
  if(pattern){
    document.querySelectorAll("[data-pattern-choice]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const value=btn.dataset.patternChoice;
        pattern.dataset.pattern=value;
        document.querySelectorAll("[data-pattern-choice]").forEach(b=>b.setAttribute("aria-selected",String(b===btn)));
      });
    });
  }

  const rhythm=document.getElementById("rhythmGrid");
  if(rhythm){
    const patterns={
      dialogue:["accent","","secondary","","accent","","secondary",""],
      procession:["accent","secondary","","secondary","accent","secondary","","secondary"],
      maritime:["accent","","","secondary","accent","","secondary",""]
    };
    function draw(name){
      rhythm.replaceChildren(...patterns[name].map((kind,i)=>{
        const cell=document.createElement("div");
        cell.className="beat"+(kind?" "+kind:"");
        cell.textContent=String(i+1);
        cell.setAttribute("aria-label",(lang==="ar"?"نبضة ":"Beat ")+(i+1));
        return cell;
      }));
    }
    document.querySelectorAll("[data-rhythm]").forEach(btn=>btn.addEventListener("click",()=>{
      document.querySelectorAll("[data-rhythm]").forEach(b=>b.setAttribute("aria-selected",String(b===btn)));
      draw(btn.dataset.rhythm);
    }));
    draw("dialogue");
    document.addEventListener("saudi:language",()=>draw(document.querySelector("[data-rhythm][aria-selected='true']")?.dataset.rhythm||"dialogue"));
  }

  const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
})();