import{n as e,t}from"./utils-rEEOE1-V.js";var n=450,r=195,i=25,a=35,o=55,s=25;function c(e){return`
    @keyframes scaleInAnimation {
      from { transform: translate(-5px, 5px) scale(0); }
      to { transform: translate(-5px, 5px) scale(1); }
    }
    @keyframes fadeInAnimation {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes rankAnimation {
      from { stroke-dashoffset: 251.32741228718345; }
      to { stroke-dashoffset: ${e}; }
    }`}function l(e){return`
    .header {
      font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: #${e.title_color};
      animation: fadeInAnimation 0.8s ease-in-out forwards;
    }
    @supports(-moz-appearance: auto) {
      .header { font-size: 15.5px; }
    }
    .stat {
      font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: #${e.text_color};
    }
    @supports(-moz-appearance: auto) {
      .stat { font-size: 12px; }
    }
    .stagger {
      opacity: 0;
      animation: fadeInAnimation 0.3s ease-in-out forwards;
    }
    .rank-text {
      font: 800 24px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: #${e.text_color};
      animation: scaleInAnimation 0.3s ease-in-out forwards;
    }
    .rank-circle-rim {
      stroke: #${e.ring_color};
      fill: none;
      stroke-width: 6;
      opacity: 0.2;
    }
    .rank-circle {
      stroke: #${e.ring_color};
      stroke-dasharray: 251.32741228718345;
      fill: none;
      stroke-width: 6;
      stroke-linecap: round;
      opacity: 0.8;
      transform-origin: -10px 8px;
      transform: rotate(-90deg);
      animation: rankAnimation 1s forwards ease-in-out;
    }
    .icon {
      fill: #${e.icon_color};
    }`}var u=[1,12.5,25,37.5,50,62.5,75,87.5,100],d=[`S`,`A+`,`A`,`A-`,`B+`,`B`,`B-`,`C+`,`C`];function f(e){return 1-2**-e}function p(e){return e/(1+e)}function m({totalCommits:e,totalPRs:t,totalIssues:n,totalStars:r,followers:i},a){let o=(1-(2*f(e/(a?1e3:250))+3*f(t/50)+1*f(n/25)+4*p(r/50)+1*p(i/10))/11)*100;return{level:d[u.findIndex(e=>o<=e)]||`C`,percentile:o}}function h(e){return`
    <g data-testid="rank-circle" transform="translate(365, 47.5)">
      <circle class="rank-circle-rim" cx="-10" cy="8" r="40" />
      <circle class="rank-circle" cx="-10" cy="8" r="40" />
      <g class="rank-text">
        <text x="-5" y="3" alignment-baseline="central" dominant-baseline="central" text-anchor="middle" data-testid="level-rank-icon">${e.level}</text>
      </g>
    </g>`}var g={stars:`Total Stars Earned:`,commits:`Total Contributions:`,commits_year:`Commits (last year):`,prs:`Total PRs:`,issues:`Total Issues:`,repos:`Repositories:`,contribs:`Contributed to (last year):`};function _(n,r,i,a){let o=new Set(r),c=[];if(o.has(`stars`)||c.push({key:`stars`,value:e(n.totalStars)}),!o.has(`commits`)){let t=a?`commits`:`commits_year`;c.push({key:t,value:e(n.totalCommits)})}return o.has(`prs`)||c.push({key:`prs`,value:e(n.totalPRs)}),o.has(`issues`)||c.push({key:`issues`,value:e(n.totalIssues)}),o.has(`contribs`)||c.push({key:`contribs`,value:e(n.contributedTo)}),c.map((e,n)=>{let r=450+n*150,a=n*s,o=(i?140:120)+79.01,c=i?`x="25"`:``;return`<g transform="translate(0, ${a})">
    <g class="stagger" style="animation-delay: ${r}ms" transform="translate(25, 0)">
      ${i?`<svg data-testid="icon" class="icon" viewBox="0 0 16 16" width="16" height="16">${v(e.key)}</svg>`:``}
      <text class="stat bold" ${c} y="12.5">${t(g[e.key])}</text>
      <text class="stat bold" x="${o}" y="12.5" data-testid="${e.key}">${t(e.value)}</text>
    </g>
  </g>`}).join(`
`)}function v(e){switch(e){case`stars`:return`<path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" fill="currentColor"/>`;case`commits`:return`<path d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm6.5-4.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" fill="currentColor"/>`;case`prs`:return`<path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zM2.5 3.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM3.75 11.5a.75.75 0 100 1.5.75.75 0 000-1.5z" fill="currentColor"/>`;case`issues`:return`<path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm0-5a1 1 0 00-2 0v2a1 1 0 102 0V6z" fill="currentColor"/>`;case`repos`:return`<path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" fill="currentColor"/>`;case`contribs`:return`<path d="M2.5 1.75a.75.75 0 011.5 0v5.5c0 .69.56 1.25 1.25 1.25h2.5a.75.75 0 010 1.5h-2.5a2.75 2.75 0 01-2.75-2.75v-5.5z" fill="currentColor"/><path d="M6.25 4.75a.75.75 0 011.5 0v2.5a.75.75 0 01-1.5 0v-2.5z" fill="currentColor"/>`;default:return``}}function y(e,s,u={}){let{hide_rank:d=!1,show_icons:f=!1,hide:p=[],hide_border:g=!1,include_all_commits:v=!1}=u,y=m(e,v),b=251.32741228718345*(y.percentile/100),x=`${t(e.name)}'s GitHub Stats`,S=`Total Stars Earned: ${e.totalStars}, Total Commits: ${e.totalCommits}, Total PRs: ${e.totalPRs}, Total Issues: ${e.totalIssues}, Contributed to (last year): ${e.contributedTo}`,C=g?``:` stroke="#${s.border_color}" stroke-opacity="1"`;return`<svg
  width="${n}"
  height="${r}"
  viewBox="0 0 ${n} ${r}"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-labelledby="descId"
>
  <title id="titleId">${x}, Rank: ${y.level} (${Math.round(y.percentile)}th percentile)</title>
  <desc id="descId">${S}</desc>
  <style>
    ${l(s)}
    ${c(b)}
  </style>

  <rect
    data-testid="card-bg"
    x="0.5"
    y="0.5"
    rx="4.5"
    height="99%"
    width="${n-1}"
    fill="#${s.bg_color}"
    ${C}
  />

  <g
    data-testid="card-title"
    transform="translate(${i}, ${a})"
  >
    <g transform="translate(0, 0)">
      <text x="0" y="0" class="header" data-testid="header">${x}</text>
    </g>
  </g>

  <g
    data-testid="main-card-body"
    transform="translate(0, ${o})"
  >
    ${d?``:h(y)}
    <svg x="0" y="0">
      ${_(e,p,f,v)}
    </svg>
  </g>
</svg>`}export{y as renderStatsCard};