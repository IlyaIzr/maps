import{j as s,T as c,a as v,v as x,p as i,s as T,R as y,X as C,u as E,aa as f,F as j,Q as N,a3 as P,a4 as d}from"./index-0cae8e42.js";/* empty css                */import{S as R}from"./SearchBar-817d9f04.js";import{f as A,g as q}from"./tags-5db168a7.js";import{A as M}from"./AppLink-a299117d.js";const g=({tagInfo:t,onClick:n})=>{if(!t)return null;function r(){n(t.tag)}return s.jsxs("div",{className:"tagItem cursor-pointer mp-accent-hover transition-small mp-border-dark ",onClick:r,children:[s.jsxs("div",{className:"mp-dark tagWrap",children:[s.jsx("span",{className:"bigHashtag",children:"# "}),s.jsx("span",{className:"tagContent mp-accent",children:t.tag})]}),s.jsxs("p",{className:"tagAmount mp-dark",children:[c.tagsAmount,": ",s.jsx("span",{className:"mp-accent",children:t.amount})]})]})},B=()=>{const t=v(),n=x(),[r,m]=i.useState([]),[o,p]=i.useState([]);i.useEffect(()=>{(async function(){const a=await A();if(a.status!=="OK")return T(t,{message:c.requestError+" #fts1"});m(a.data.recent),p(a.data.popular)})()},[]);function e(a){n.push(`/tags/item/${a}`)}return s.jsxs("div",{children:[s.jsx("h4",{className:"title",children:c.recentTags}),s.jsx("div",{className:"tagsGroup",children:!!r.length&&r.map(a=>s.jsx(g,{tagInfo:a,onClick:e},a.tag+"recent"))}),s.jsx("h4",{className:"title",children:c.mostPopular}),s.jsx("div",{className:"tagsGroup",children:!!o.length&&o.map(a=>s.jsx(g,{tagInfo:a,onClick:e},a.tag+"popular"))})]})},I=({searchResults:t})=>{const n=new URLSearchParams(y().search).get("query"),r=x(),[m,o]=i.useState([]);if(i.useEffect(()=>{if(!t)return;const e={};t.forEach(a=>{if(!e[a.tag])return e[a.tag]={amount:a.amount,places:[a.placeId],tag:a.tag};e[a.tag].amount+=a.amount,e[a.tag].places.push(a.placeId)}),o(Object.values(e))},[t]),!t)return null;if(!t.length)return s.jsx("div",{className:"resultsContainer",children:s.jsx("h5",{children:c.noResults})});function p(e){r.push(`/tags/item/${e}?from=${n}`)}return s.jsx("div",{className:"resultsContainer",children:m.map(e=>s.jsx(g,{tagInfo:e,onClick:p},e.key))})},F=()=>{const t=v(),{tag:n}=C(),r=x(),m=E(l=>l.app.mapRef),[o,p]=i.useState(null);i.useEffect(()=>{e()},[]);async function e(){const l=await q(n);if(console.log("%c⧭","color: #00e600",l),l.status!=="OK")return T(t,{message:c.requestError+" #tow1"});if(!l.data.length)return;const h={amount:0,places:[]};l.data.forEach(u=>{h.amount+=u.amount,h.places.push({...u})}),p(h)}if(!o)return null;function a(){f(t,n),j(t,"tags"),r.push(N("/"))}return s.jsxs("div",{className:"tagOverview",children:[s.jsxs("h3",{className:"title tagWrap",children:[s.jsx("span",{className:"bigHashtag",children:"#"}),s.jsx("span",{className:"tagContent mp-accent",children:n})]}),s.jsxs("p",{className:"subtitle",children:[c.tagsAmount,": ",o.amount]}),s.jsx(M,{to:"/",children:s.jsx("button",{className:"button",onClick:a,children:c.watchAtMap})}),s.jsx("h4",{className:"title titlePopular",children:c.mostPopularPlaces}),s.jsx("div",{className:"tagPlaces",children:!!o.places&&o.places.map(({placeId:l,amount:h,name:u,lng:k,lat:S})=>{u||(u=c.noName);function w(){m.flyTo({center:[k,S],zoom:16,speed:.5}),f(t,n),j(t,"tags"),r.push(N("/"))}return s.jsx("div",{children:s.jsxs("div",{className:"placeInTag",children:[s.jsx("div",{className:"amount mp-accent",title:c.mentionsAmount,children:h}),s.jsxs("div",{className:"placeTagInfo",children:[s.jsx("div",{className:"name",children:u}),s.jsx("button",{className:"button",onClick:w,children:c.show})]})]})},l)})})]})};const U=()=>{const[t,n]=i.useState(null);return s.jsxs("div",{className:"tags",children:[s.jsx(R,{setSearchResults:n}),s.jsxs(P,{children:[s.jsx(d,{exact:!0,path:"/tags",children:s.jsx(B,{})}),s.jsx(d,{path:"/tags/item/:tag",children:s.jsx(F,{})}),s.jsx(d,{path:"/tags/search",children:s.jsx(I,{searchResults:t})})]})]})};export{U as TagsMain};