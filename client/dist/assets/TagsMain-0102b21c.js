import{j as s,T as c,a as N,z as x,f as i,s as v,B as y,J as C,u as E,L as w,Z as f,v as j,S as P,R as h}from"./index-47f67923.js";import{S as R}from"./Friends-1826cff1.js";import{f as q,g as A}from"./tags-7a631d76.js";const g=({tagInfo:t,onClick:n})=>{if(!t)return null;function r(){n(t.tag)}return s.jsxs("div",{className:"tagItem cursor-pointer mp-accent-hover transition-small mp-border-dark ",onClick:r,children:[s.jsxs("div",{className:"mp-dark tagWrap",children:[s.jsx("span",{className:"bigHashtag",children:"# "}),s.jsx("span",{className:"tagContent mp-accent",children:t.tag})]}),s.jsxs("p",{className:"tagAmount mp-dark",children:[c.tagsAmount,": ",s.jsx("span",{className:"mp-accent",children:t.amount})]})]})},B=()=>{const t=N(),n=x(),[r,m]=i.useState([]),[l,p]=i.useState([]);i.useEffect(()=>{(async function(){const a=await q();if(a.status!=="OK")return v(t,{message:c.requestError+" #fts1"});m(a.data.recent),p(a.data.popular)})()},[]);function e(a){n.push(`/tags/item/${a}`)}return s.jsxs("div",{children:[s.jsx("h4",{className:"title",children:c.recentTags}),s.jsx("div",{className:"tagsGroup",children:!!r.length&&r.map(a=>s.jsx(g,{tagInfo:a,onClick:e},a.tag+"recent"))}),s.jsx("h4",{className:"title",children:c.mostPopular}),s.jsx("div",{className:"tagsGroup",children:!!l.length&&l.map(a=>s.jsx(g,{tagInfo:a,onClick:e},a.tag+"popular"))})]})},M=({searchResults:t})=>{const n=new URLSearchParams(y().search).get("query"),r=x(),[m,l]=i.useState([]);if(i.useEffect(()=>{if(!t)return;const e={};t.forEach(a=>{if(!e[a.tag])return e[a.tag]={amount:a.amount,places:[a.placeId],tag:a.tag};e[a.tag].amount+=a.amount,e[a.tag].places.push(a.placeId)}),l(Object.values(e))},[t]),!t)return null;if(!t.length)return s.jsx("div",{className:"resultsContainer",children:s.jsx("h5",{children:c.noResults})});function p(e){r.push(`/tags/item/${e}?from=${n}`)}return s.jsx("div",{className:"resultsContainer",children:m.map(e=>s.jsx(g,{tagInfo:e,onClick:p},e.key))})},I=()=>{const t=N(),{tag:n}=C(),r=x(),m=E(o=>o.app.mapRef),[l,p]=i.useState(null);i.useEffect(()=>{e()},[]);async function e(){const o=await A(n);if(console.log("%c⧭","color: #00e600",o),o.status!=="OK")return v(t,{message:c.requestError+" #tow1"});if(!o.data.length)return;const d={amount:0,places:[]};o.data.forEach(u=>{d.amount+=u.amount,d.places.push({...u})}),p(d)}if(!l)return null;function a(){f(t,n),j(t,"tags"),r.push("/")}return s.jsxs("div",{className:"tagOverview",children:[s.jsxs("h3",{className:"title tagWrap",children:[s.jsx("span",{className:"bigHashtag",children:"#"}),s.jsx("span",{className:"tagContent mp-accent",children:n})]}),s.jsxs("p",{className:"subtitle",children:[c.tagsAmount,": ",l.amount]}),s.jsx(w,{to:"/",children:s.jsx("button",{className:"button",onClick:a,children:c.watchAtMap})}),s.jsx("h4",{className:"title titlePopular",children:c.mostPopularPlaces}),s.jsx("div",{className:"tagPlaces",children:!!l.places&&l.places.map(({placeId:o,amount:d,name:u,lng:T,lat:k})=>{u||(u=c.noName);function S(){m.flyTo({center:[T,k],zoom:16,speed:.5}),f(t,n),j(t,"tags"),r.push("/")}return s.jsx("div",{children:s.jsxs("div",{className:"placeInTag",children:[s.jsx("div",{className:"amount mp-accent",title:c.mentionsAmount,children:d}),s.jsxs("div",{className:"placeTagInfo",children:[s.jsx("div",{className:"name",children:u}),s.jsx("button",{className:"button",onClick:S,children:c.show})]})]})},o)})})]})};const z=()=>{const[t,n]=i.useState(null);return s.jsxs("div",{className:"tags",children:[s.jsx(R,{setSearchResults:n}),s.jsxs(P,{children:[s.jsx(h,{exact:!0,path:"/tags",children:s.jsx(B,{})}),s.jsx(h,{path:"/tags/item/:tag",children:s.jsx(I,{})}),s.jsx(h,{path:"/tags/search",children:s.jsx(M,{searchResults:t})})]})]})};export{z as TagsMain};
