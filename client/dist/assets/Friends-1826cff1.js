import{f as n,a as p,z as d,j as t,_ as f,s as x,T as v}from"./index-47f67923.js";import{s as E}from"./tags-7a631d76.js";const g=r=>n.createElement("svg",{fill:"current",width:24,height:24,viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",...r},n.createElement("title",null,"search"),n.createElement("path",{d:"M16.464 15.05l4.243 4.243a1 1 0 0 1-1.414 1.414l-4.904-4.904a1 1 0 0 1 0-1.414 5.5 5.5 0 1 0-2.404 1.407 1 1 0 1 1 .54 1.926 7.5 7.5 0 1 1 3.94-2.672z",fillRule:"nonzero"})),y=({setSearchResults:r})=>{const o=p(),c=d(),[e,l]=n.useState("");function u(s){l(s.target.value)}async function i(){const s=c.location.pathname.split("/")[1];let a;if(s==="friends"?a=await f(e):a=await E(e),a.status!=="OK")return x(o,{message:v.requestError+" #subErr1"});r(a.data),c.push(`/${s}/search?query=${e}`)}function h(s){s.key==="Enter"&&i()}function m(){c.goBack()}return t.jsxs("div",{className:"searchContainer transition",children:[t.jsx("div",{onClick:m,className:"backButton",children:t.jsx("button",{className:"button mp-primary",children:"<<"})}),t.jsx("input",{type:"text",name:"search",value:e,onInput:u,onKeyDown:h}),t.jsx("div",{className:"searchButton relative",children:t.jsxs("button",{onClick:i,className:"button",children:["​",t.jsx(g,{fill:"var(--accent)"})]})})]})};export{y as S};