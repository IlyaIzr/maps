import{a as l,r as n,h as u,j as s,T as e,s as c}from"./index-a80ce244.js";import{p as d}from"./reviews-e44fd58b.js";const x=()=>{const t=l(),[a,r]=n.useState("");n.useEffect(()=>{u(t)},[]);function m(o){r(o.target.value)}async function i(){if((await d(a)).status!=="OK")return c(t,{message:e.requestError+" #aboutus1"});c(t,{message:e.sent,status:"complete"}),setTimeout(()=>{r("")},500)}return s.jsx("div",{className:"aboutPage relative",children:s.jsxs("div",{className:"paddingcontainer",children:[s.jsx("p",{children:e.aboutMain}),s.jsx("h5",{className:"mp-border-dark",children:e.aboutFutureTitle}),s.jsx("p",{children:e.aboutFuture}),s.jsx("br",{}),s.jsxs("p",{htmlFor:"comment",children:[e.comment,":"]}),s.jsx("textarea",{name:"comment",rows:"3",value:a,onInput:m,className:"raterComment mp-border-dark mp-dark",placeholder:e.aboutPlaceholder}),s.jsx("br",{}),s.jsx("button",{className:"button",onClick:i,children:e.submit}),s.jsx("br",{}),s.jsx("h5",{className:"mp-border-dark",children:e.techInfo}),s.jsx("p",{children:e.techSpecs}),s.jsx("br",{}),s.jsx("br",{}),s.jsxs("p",{className:"version mp-counter",children:[e.author,": @ilyaizr"]}),s.jsxs("p",{className:"version mp-counter",children:[e.version,": alpha 3.2"]}),s.jsx("div",{className:"bottom"})]})})};export{x as About};
