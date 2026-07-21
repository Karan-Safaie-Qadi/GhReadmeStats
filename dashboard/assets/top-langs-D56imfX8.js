import{t as e}from"./utils-rEEOE1-V.js";var t=300,n=285,r=25,i=35,a=55,o=40,s=205,c=8;function l(){return`
    @keyframes slideInAnimation {
      from { width: 0; }
      to { width: calc(100%-100px); }
    }
    @keyframes growWidthAnimation {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes fadeInAnimation {
      from { opacity: 0; }
      to { opacity: 1; }
    }`}function u(e){return`
    .header {
      font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: #${e.title_color};
      animation: fadeInAnimation 0.8s ease-in-out forwards;
    }
    @supports(-moz-appearance: auto) {
      .header { font-size: 15.5px; }
    }
    .lang-name {
      font: 400 11px "Segoe UI", Ubuntu, Sans-Serif;
      fill: #${e.text_color};
    }
    .stagger {
      opacity: 0;
      animation: fadeInAnimation 0.3s ease-in-out forwards;
    }
    .lang-progress {
      animation: growWidthAnimation 0.6s ease-in-out forwards;
    }`}function d(d,f,p={}){let{hide_title:m=!1}=p,{langs:h}=d;if(!h||h.length===0)return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="120" viewBox="0 0 ${t} 120" fill="none">
      <rect x="0.5" y="0.5" rx="4.5" height="99%" width="${t-1}" fill="#${f.bg_color}" stroke="#${f.border_color}" stroke-opacity="1"/>
      <text x="${t/2}" y="65" fill="#${f.text_color}" font-size="14" text-anchor="middle" font-family="Segoe UI,Ubuntu,Sans-Serif">No language data available</text>
    </svg>`;let g=h.slice(0,5),_=a+g.length*o+20,v=Math.max(n,_),y=m?``:`
  <g data-testid="card-title" transform="translate(${r}, ${i})">
    <g transform="translate(0, 0)">
      <text x="0" y="0" class="header" data-testid="header">Most Used Languages</text>
    </g>
  </g>`,b=m?`<title id="titleId"></title>`:`<title id="titleId">Most Used Languages</title>`,x=m?`<desc id="descId"></desc>`:`<desc id="descId">${g.map(e=>`${e.name}: ${e.percent.toFixed(1)}%`).join(`, `)}</desc>`,S=g.map((t,n)=>{let r=450+n*150,i=n*o,a=t.percent.toFixed(2);return`
    <g transform="translate(0, ${i})">
      <g class="stagger" style="animation-delay: ${r}ms">
        <text data-testid="lang-name" x="2" y="15" class="lang-name">${e(t.name)}</text>
        <text x="215" y="34" class="lang-name">${a}%</text>
        <svg width="${s}" x="0" y="25">
          <rect rx="5" ry="5" x="0" y="0" width="${s}" height="${c}" fill="#ddd"></rect>
          <svg data-testid="lang-progress" width="${a}%">
            <rect
              height="${c}"
              fill="${t.color}"
              rx="5" ry="5" x="0" y="0"
              class="lang-progress"
              style="animation-delay: ${r+300}ms;"
            />
          </svg>
        </svg>
      </g>
    </g>`}).join(``);return`<svg
  width="${t}"
  height="${v}"
  viewBox="0 0 ${t} ${v}"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-labelledby="descId"
>
  ${b}
  ${x}
  <style>
    ${u(f)}
    ${l()}
  </style>

  <rect
    data-testid="card-bg"
    x="0.5"
    y="0.5"
    rx="4.5"
    height="99%"
    width="${t-1}"
    fill="#${f.bg_color}"
    stroke="#${f.border_color}"
    stroke-opacity="1"
  />

  ${y}

  <g
    data-testid="main-card-body"
    transform="translate(0, ${a})"
  >
    <svg data-testid="lang-items" x="${r}">
      ${S}
    </svg>
  </g>
</svg>`}export{d as renderTopLangsCard};