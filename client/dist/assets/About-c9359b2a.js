import{a as l,o as p,j as s,T as e,s as r}from"./index-762ffdee.js";import{a as u}from"./reviews-fcf188c0.js";import{c as d}from"./helperFuncs-a769e162.js";const b=()=>{const a=l(),[t,o]=p.useState("");function n(c){o(c.target.value)}async function i(){if((await u(t)).status!=="OK")return r(a,{message:e.requestError+" #aboutus1"});r(a,{message:e.sent,status:"complete"}),setTimeout(()=>{o("")},500)}function m(){d("ilyaizrailyan@gmail.com"),r(a,{message:"copied to clipboard",status:"complete"})}return s.jsx("div",{className:"aboutPage relative",children:s.jsxs("div",{className:"paddingcontainer",children:[s.jsx("p",{children:e.aboutMain}),s.jsx("h5",{className:"mp-border-dark",children:e.aboutFutureTitle}),s.jsx("p",{children:e.aboutFuture}),s.jsx("br",{}),s.jsxs("p",{children:[e.comment,":"]}),s.jsx("textarea",{name:"comment",rows:3,value:t,onInput:n,className:"raterComment mp-border-dark mp-dark",placeholder:e.aboutPlaceholder}),s.jsx("br",{}),s.jsx("button",{className:"button",onClick:i,children:e.submit}),s.jsx("br",{}),s.jsx("h5",{className:"mp-border-dark",children:e.techInfo}),s.jsx("p",{children:e.techSpecs}),s.jsx("br",{}),s.jsx("br",{}),s.jsxs("p",{className:"version mp-counter",children:[e.author,": @ilyaizr"]}),s.jsxs("p",{className:"version mp-counter",children:[e.version,": alpha 3.3"]}),s.jsxs("p",{className:"version mp-counter",children:["github: ",s.jsx("a",{className:"mp-accent",href:"https://github.com/IlyaIzr/maps",children:"github.com/IlyaIzr/maps"})]}),s.jsxs("p",{className:"version mp-counter ",children:["mail: ",s.jsx("span",{className:"cursor-pointer mp-accent",onClick:m,children:"ilyaizrailyan@gmail.com"})]}),s.jsxs("p",{className:"version mp-counter",children:[e.thanksTo,": ",s.jsx("a",{href:"nominatim.org",className:"mp-counter",children:"nominatim api"})]})]})})};export{b as About};