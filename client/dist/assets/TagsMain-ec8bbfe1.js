import{j as s,T as r,a as v,q as x,o as i,s as T,O as y,S as C,u as E,a6 as f,D as j,$ as P,a0 as d}from"./index-09e4430f.js";/* empty css                */import{S as A}from"./SearchBar-c0fca8b8.js";import{f as R,g as q}from"./tags-ed4fccce.js";import{A as M}from"./AppLink-fe8d650c.js";import{w as N}from"./url-6d62d571.js";const g=({tagInfo:t,onClick:n})=>{if(!t)return null;function c(){n(t.tag)}return s.jsxs("div",{className:"tagItem cursor-pointer mp-accent-hover transition-small mp-border-dark ",onClick:c,children:[s.jsxs("div",{className:"mp-dark tagWrap",children:[s.jsx("span",{className:"bigHashtag",children:"# "}),s.jsx("span",{className:"tagContent mp-accent",children:t.tag})]}),s.jsxs("p",{className:"tagAmount mp-dark",children:[r.tagsAmount,": ",s.jsx("span",{className:"mp-accent",children:t.amount})]})]})},B=()=>{const t=v(),n=x(),[c,m]=i.useState([]),[o,p]=i.useState([]);i.useEffect(()=>{(async function(){const a=await R();if(a.status!=="OK")return T(t,{message:r.requestError+" #fts1"});m(a.data.recent),p(a.data.popular)})()},[]);function e(a){n.push(`/tags/item/${a}`)}return s.jsxs("div",{children:[s.jsx("h4",{className:"title",children:r.recentTags}),s.jsx("div",{className:"tagsGroup",children:!!c.length&&c.map(a=>s.jsx(g,{tagInfo:a,onClick:e},a.tag+"recent"))}),s.jsx("h4",{className:"title",children:r.mostPopular}),s.jsx("div",{className:"tagsGroup",children:!!o.length&&o.map(a=>s.jsx(g,{tagInfo:a,onClick:e},a.tag+"popular"))})]})},I=({searchResults:t})=>{const n=new URLSearchParams(y().search).get("query"),c=x(),[m,o]=i.useState([]);if(i.useEffect(()=>{if(!t)return;const e={};t.forEach(a=>{if(!e[a.tag])return e[a.tag]={amount:a.amount,places:[a.placeId],tag:a.tag};e[a.tag].amount+=a.amount,e[a.tag].places.push(a.placeId)}),o(Object.values(e))},[t]),!t)return null;if(!t.length)return s.jsx("div",{className:"resultsContainer",children:s.jsx("h5",{children:r.noResults})});function p(e){c.push(`/tags/item/${e}?from=${n}`)}return s.jsx("div",{className:"resultsContainer",children:m.map(e=>s.jsx(g,{tagInfo:e,onClick:p},e.key))})},$=()=>{const t=v(),{tag:n}=C(),c=x(),m=E(l=>l.app.mapRef),[o,p]=i.useState(null);i.useEffect(()=>{e()},[]);async function e(){const l=await q(n);if(console.log("%c⧭","color: #00e600",l),l.status!=="OK")return T(t,{message:r.requestError+" #tow1"});if(!l.data.length)return;const h={amount:0,places:[]};l.data.forEach(u=>{h.amount+=u.amount,h.places.push({...u})}),p(h)}if(!o)return null;function a(){f(t,n),j(t,"tags"),c.push(N("/"))}return s.jsxs("div",{className:"tagOverview",children:[s.jsxs("h3",{className:"title tagWrap",children:[s.jsx("span",{className:"bigHashtag",children:"#"}),s.jsx("span",{className:"tagContent mp-accent",children:n})]}),s.jsxs("p",{className:"subtitle",children:[r.tagsAmount,": ",o.amount]}),s.jsx(M,{to:"/",children:s.jsx("button",{className:"button",onClick:a,children:r.watchAtMap})}),s.jsx("h4",{className:"title titlePopular",children:r.mostPopularPlaces}),s.jsx("div",{className:"tagPlaces",children:!!o.places&&o.places.map(({placeId:l,amount:h,name:u,lng:S,lat:k})=>{u||(u=r.noName);function w(){m.flyTo({center:[S,k],zoom:16,speed:.5}),f(t,n),j(t,"tags"),c.push(N("/"))}return s.jsx("div",{children:s.jsxs("div",{className:"placeInTag",children:[s.jsx("div",{className:"amount mp-accent",title:r.mentionsAmount,children:h}),s.jsxs("div",{className:"placeTagInfo",children:[s.jsx("div",{className:"name",children:u}),s.jsx("button",{className:"button",onClick:w,children:r.show})]})]})},l)})})]})};const U=()=>{const[t,n]=i.useState(null);return s.jsxs("div",{className:"tags",children:[s.jsx(A,{setSearchResults:n}),s.jsxs(P,{children:[s.jsx(d,{exact:!0,path:"/tags",children:s.jsx(B,{})}),s.jsx(d,{path:"/tags/item/:tag",children:s.jsx($,{})}),s.jsx(d,{path:"/tags/search",children:s.jsx(I,{searchResults:t})})]})]})};export{U as TagsMain};
