import{o as n,q as w,u as b,j as i,M as D,r as k,T as G}from"./index-762ffdee.js";import{S as M}from"./SearchBar-22797969.js";import{c as O,m as $,b as q,T as z}from"./TotalRating-0fae4c88.js";import{s as A}from"./url-6d62d571.js";import{g as F}from"./helperFuncs-a769e162.js";import"./tags-9946dc87.js";const B="_cityItem_yifel_1",U="_geojsonPreview_yifel_10",H="_cityDetails_yifel_18",L="_cityName_yifel_22",V="_cityRating_yifel_28",l={cityItem:B,geojsonPreview:U,cityDetails:H,cityName:L,cityRating:V};function h(c){var t=[1/0,1/0,-1/0,-1/0];return O(c,function(e){t[0]>e[0]&&(t[0]=e[0]),t[1]>e[1]&&(t[1]=e[1]),t[2]<e[0]&&(t[2]=e[0]),t[3]<e[1]&&(t[3]=e[1])}),t}h.default=h;const X=({amount:c,rating:t,en:e,ru:f,lat:o,lng:y,geometry:d})=>{const u=n.useRef(null),[m,_]=n.useState(null),j=w(),C=b(s=>s.app.mapRef),v=n.useCallback(()=>{const s=x;console.log("%c⧭","color: #e50000",{lat:o,lng:y}),A({lat:o,lng:y,zoom:s}),j.push(`/?lat=${o}&lng=${y}&zoom=${s}`),C.flyTo({center:[y,o],zoom:s,speed:.8})},[x]);return n.useEffect(()=>{if(d){const s=$(F(d));_(s)}},[d]),n.useEffect(()=>{if(m&&u.current){const s=u.current,a=s.getContext("2d");if(a){const r=h(m),N=r[2]-r[0],R=r[3]-r[1],E=s.width/N,T=s.height/R,I=getComputedStyle(document.querySelector("html")).getPropertyValue("--secondary");a.fillStyle=I,a.beginPath();const g=q(m);if(Array.isArray(g))for(const p of g[0][0]){const S=(p[0]-r[0])*E,P=s.height-(p[1]-r[1])*T;a.lineTo(S,P)}a.closePath(),a.fill()}}},[m,u]),i.jsxs("div",{className:l.cityItem,children:[i.jsx("div",{className:l.preview,onClick:v,children:i.jsx("canvas",{className:l.geojsonPreview,ref:u})}),i.jsxs("div",{className:l.cityDetails,children:[i.jsx("h2",{className:l.cityName,children:D==="ru"?f:e}),i.jsx("div",{className:l.cityRating,children:i.jsx(z,{rating:t,amount:c})})]})]})};async function Y(){return await k("GET","cities","top",null,!1)()}const Z="_container_c3z8_1",J={container:Z},x=14;function it(){const[c,t]=n.useState([]),e=c.length?c.map(f=>n.createElement(X,{...f,key:f.code})):i.jsx("h3",{children:G.noCities});return n.useEffect(()=>{(async function(){const o=await Y();o.data&&t(o.data)})()},[]),i.jsxs("div",{className:"cities",children:[i.jsx(M,{}),i.jsx("div",{className:J.container,children:e})]})}export{it as Cities,x as ZOOM_ON_CITY};