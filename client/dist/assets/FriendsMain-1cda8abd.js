import{l as k,u as y,j as e,T as a,L as f,P as C,a as L,f as o,Q as w,s as h,R as E,J as v,S as F,U as R,G as S,V as U,W as P,X as j}from"./index-5904d5c1.js";import{S as q}from"./SearchBar-059e002a.js";/* empty css                */import"./tags-edc2d07f.js";const O=window.location.origin+"/friends/addByLink?id=",I=()=>{const r=k(),{id:t,friends:l,requests:s}=y(n=>n.user);function i(n){r.push(`/friends/item/${n}`)}function m(n){n.target.select()}return e.jsxs("div",{className:"friendsDefault",children:[e.jsx("h4",{children:a.friendList}),e.jsx("div",{className:"friendList",children:l!=null&&l.length?l.map(n=>{var u,c;return e.jsx("div",{className:"friendContainer",children:e.jsxs("div",{className:"resultUser cursor-pointer mp-accent-hover transition-small",onClick:()=>i(n.id),children:[e.jsx("div",{className:"authorLogo mp-bg-primary",children:e.jsx("span",{className:"mp-dark",title:n.login,children:(c=(u=String(n.name))==null?void 0:u[0])==null?void 0:c.toUpperCase()})}),e.jsxs("div",{className:"resultUser-creds",children:[e.jsx("p",{className:"mp-primary",children:n.name}),e.jsxs("label",{className:"cursor-pointer",children:["(",n.login,")"]})]})]},n.id)},n.id1+n.id2)}):e.jsx("div",{className:"noFriendsCase",children:e.jsx("h5",{children:a.sadlyNoFriends})})}),e.jsx("h4",{children:!!(s!=null&&s.length)&&a.friendRequests}),!!(s!=null&&s.length)&&e.jsx("div",{className:"friendList",children:!!(s!=null&&s.length)&&s.map(n=>{var u,c;return e.jsx("div",{className:"friendContainer",children:e.jsxs("div",{className:"resultUser cursor-pointer mp-accent-hover transition-small",onClick:()=>i(n.id),children:[e.jsx("div",{className:"authorLogo mp-bg-primary",children:e.jsx("span",{className:"mp-dark",title:n.login,children:(c=(u=String(n.name))==null?void 0:u[0])==null?void 0:c.toUpperCase()})}),e.jsxs("div",{className:"resultUser-creds",children:[e.jsx("p",{className:"mp-primary",children:n.name}),e.jsxs("label",{className:"cursor-pointer",children:["(",n.login,")"]})]})]},n.id)},n.id1+n.id2)})}),e.jsxs("div",{className:"addMeLink",children:[e.jsx("h4",{children:a.addMeLink}),e.jsx("input",{type:"text",value:O+t,onFocus:m,readOnly:!0})]}),e.jsx(f,{to:"/friends/addByLink",children:e.jsx("button",{className:"button",children:a.addByLink})})]})},B=({loading:r})=>r?e.jsx("div",{children:"Loading anmation..."}):null,T=()=>{const{userId:r}=C(),t=L(),l=y(d=>d.user),[s,i]=o.useState(null),[m,n]=o.useState(!0),[u,c]=o.useState(e.jsx("button",{className:"button",onClick:x,children:a.addFriend}));if(o.useEffect(()=>{(async function(){if(l.id===r)return i({...l}),c(e.jsx(f,{to:"/editProfile",children:e.jsx("button",{className:"button",children:a.profile})})),n(!1);const d=await w(r);d.status!=="OK"?h(t,{message:a.requestError+" #profEr1"}):i(d.data),n(!1)})()},[r]),o.useEffect(()=>{s!=null&&s.friendStatus&&(s.friendStatus==="friends"?c(e.jsxs("div",{children:[e.jsx(f,{to:"/friends",children:e.jsx("button",{className:"button",children:a.inFriendlist})}),e.jsx("button",{className:"button mp-border-counter",onClick:N,children:a.removeFriend})]})):s.friendStatus==="youRequested"?c(e.jsx("button",{className:"button mp-border-secondary mp-secondary",children:a.youRequested})):s.friendStatus==="youAsked"&&c(e.jsx("button",{className:"button mp-border-accent",onClick:g,children:a.confirmRequest})))},[s==null?void 0:s.friendStatus]),m)return e.jsx("div",{className:"profileContainer",children:e.jsx(B,{loading:m})});async function x(){if((await E(r)).status!=="OK")return h(t,{message:a.requestError+" #profEr2"});await v(t),c(e.jsx("button",{className:"button",children:a.sent}))}async function N(){if((await F(r)).status!=="OK")return h(t,{message:a.requestError+" #profEr3"});await v(t),i({...s,friendStatus:"youAsked"})}async function g(){if((await R(r)).status!=="OK")return h(t,{message:a.requestError+" #profEr4"});await v(t),i({...s,friendStatus:"friends"})}return s?e.jsxs("div",{className:"profileContainer",children:[e.jsxs("div",{className:"userProfile mp-border-dark",children:[!!s.avatar&&e.jsx("div",{className:"avatar",children:e.jsx("img",{src:s.avatar,alt:a.avatar})}),e.jsxs("div",{className:"mp-primary credentials ",title:a.userName,children:[s.name," ",e.jsxs("label",{className:"mp-dark",title:a.login,children:["(",s.login,")"]})]}),!!s.commentsn&&e.jsxs("div",{className:"commentsn",children:[a.commentsn,": ",s.commentsn]}),e.jsxs("div",{className:"level capitalize",children:[a.level,": ",e.jsx("label",{className:"mp-dark",children:s.level})]})]}),e.jsx("div",{className:"friends-actionButton",children:u})]}):e.jsx("div",{className:"profileContainer",children:e.jsx("div",{className:"userProfile mp-border-dark",children:e.jsx("p",{children:a.noResults})})})},D=({searchResults:r})=>{const t=new URLSearchParams(S().search).get("query"),l=k();if(!r)return null;if(!r.length)return e.jsx("div",{className:"resultsContainer",children:e.jsx("h5",{children:a.noResults})});function s(i){l.push(`/friends/item/${i}?from=${t}`)}return e.jsx("div",{className:"resultsContainer",children:r.map(i=>{var m,n;return e.jsxs("div",{className:"resultUser cursor-pointer mp-accent-hover transition-small",onClick:()=>s(i.id),children:[e.jsx("div",{className:"authorLogo mp-bg-primary",children:e.jsx("span",{className:"mp-dark",title:i.login,children:(n=(m=String(i.name))==null?void 0:m[0])==null?void 0:n.toUpperCase()})}),e.jsxs("div",{className:"resultUser-creds",children:[e.jsx("p",{className:"mp-primary",children:i.name}),e.jsxs("label",{className:"cursor-pointer",children:["(",i.login,")"]})]})]},i.id)})})},K=()=>{const r=new URLSearchParams(S().search).get("id"),t=L(),[l,s]=o.useState(null),[i,m]=o.useState(!0),[n,u]=o.useState("");function c(d){const p=d.target.value;if(u(p),p!=null&&p.includes("id")){const b=new URLSearchParams(p.split("?")[1]);b.get("id")&&s(b.get("id"))}}const[x,N]=o.useState(!1);o.useEffect(()=>{r&&s(r)},[]),o.useEffect(()=>{(async function(){l&&(console.log("%c⧭ id run","color: #733d00",l),await g(),m(!1))})()},[l]);async function g(){const d=await U(l);if(console.log("%c⧭","color: #00e600",d),d.status!=="OK")return h(t,{message:a.requestError+" #adBLi1"});h(t,{message:a.yourFriendsNow,status:"complete"}),N(!0)}return r&&i?e.jsx(B,{loading:i}):e.jsxs("div",{className:"addByLink",children:[e.jsx("h4",{children:a.addByLink}),x?e.jsx("div",{children:e.jsx(f,{to:"/friends",children:e.jsx("button",{className:"button",children:a.goBack})})}):e.jsxs("div",{className:"field",children:[e.jsx("label",{htmlFor:"link",children:a.pasteAddLink}),e.jsx("input",{type:"text",value:n,onInput:c,readOnly:x})]})]})},M=()=>{const r=y(s=>s.app),[t,l]=o.useState(null);return r.isLogged?e.jsxs("div",{className:"friendsWrap",children:[e.jsx(q,{setSearchResults:l}),e.jsxs(P,{children:[e.jsx(j,{exact:!0,path:"/friends",children:e.jsx(I,{})}),e.jsx(j,{path:"/friends/item/:userId",children:e.jsx(T,{})}),e.jsx(j,{path:"/friends/search",children:e.jsx(D,{searchResults:t})}),e.jsx(j,{path:"/friends/addByLink",children:e.jsx(K,{})})]})]}):e.jsx("div",{className:"friendsWrap friendsNotLoggedWrap auth-container relative",children:e.jsx("div",{className:"absolute center auth-subcontainer",children:e.jsxs("div",{className:"auth-action-wrap mp-border-secondary",children:[e.jsx("p",{children:a.loginToUseThis}),e.jsx(f,{to:"/auth",children:e.jsx("button",{className:"primary mp-border-accent loginBtn capitalize",children:a.authorization})})]})})})};export{M as FriendsMain};
