import{a as S,B as F,u as w,i as A,r as l,s as g,T as t,D as T,c as u,E as b,C as v,j as s,L as B,F as M,G as P,H as G,I as i}from"./index-a80ce244.js";import{R as K}from"./Responser-58641a58.js";const W=()=>{const n=S(),c=F(),m=w(e=>e.user),d=w(e=>e.app),p=A().pathname,[h,f]=l.useState(""),[x,j]=l.useState(""),[y,o]=l.useState("");l.useEffect(()=>{const{gapi:e}=window;if(!e)return g(n,{message:t.networkError});e.load("auth2",()=>{e.auth2.init().then(r=>{r.signOut().then(()=>{e.signin2.render("google-signin-button",{width:200,height:32,longtitle:!0,onsuccess:O,onfailure:E,theme:d.theme==="dark"||d.theme==="blueprint"?"dark":"white"})})})})},[]);function R(e){f(e.target.value)}function C(e){j(e.target.value)}async function I(){o(t.loading+"...");const e=await M({login:h,pword:x});if(e.status==="WRONG")return o(t.wrongAuth);if(e.status==="OK")return u(n),g(n,{message:t.greetings+", "+e.data.name,status:"complete",title:null}),o(""),await b(n),c.push("/"),v(n,e.data);o(t.errorReg+", "+t.errCode+": "+(e.msg||e))}async function k(){const e=await P();if(e.status==="OK")return g(n,{message:t.farewell+", "+m.name,status:"complete",title:null}),f(""),j(""),o(""),G(n);o(t.errorReg+", "+t.errCode+": "+(e.msg||e))}async function O(e){var r=e.getBasicProfile();const L={name:r.getName(),avatar:r.getImageUrl(),gmail:r.getEmail()},a=await T(L,e.getAuthResponse().id_token);if(a.status==="FIRSTTIME")return i.token=e.getAuthResponse().id_token,i.name=a.data.name,i.login=a.data.login,a.data.login||(i.occupiedLogin=r.getEmail().split("@")[0]),i.avatar=a.data.avatar,i.id=r.getId(),u(n),c.push("/googleConfirm");if(a.status==="OK")return u(n),g(n,{message:t.greetings+", "+a.data.name,status:"complete",title:null}),o(""),await b(n),c.push("/"),v(n,a.data);o(t.errorReg+", "+t.errCode+": "+(a.msg||a))}function E(e){console.log("%c⧭ failed","color: #00a3cc",e),o(t.errorReg+", "+t.errCode+": "+JSON.stringify(e))}function N(){u(n)}return s.jsx("div",{children:d.isLogged?s.jsxs("div",{children:[s.jsxs("h4",{children:[t.greetings,", ",m.name]}),s.jsx("button",{className:"primary",onClick:k,children:t.logout})]}):s.jsxs("div",{children:[s.jsxs("div",{className:p!=="/auth"?"login-form login-form-bordered mp-border-secondary":"login-form",children:[s.jsxs("label",{htmlFor:"name",children:[t.yourLogin,":"]}),s.jsx("input",{type:"text",name:"login",value:h,onInput:R,autoFocus:!0}),s.jsx("br",{}),s.jsxs("label",{htmlFor:"pword",children:[t.yourPword,":"]}),s.jsx("input",{type:"password",name:"pword",value:x,onInput:C}),s.jsx(K,{message:y,setMessage:o}),s.jsx("button",{className:"primary mp-border-accent loginBtn",onClick:I,children:t.confirm}),s.jsx("div",{id:"google-signin-button",className:"google-signin-button g-signin2 google-oauthBtn","data-onsuccess":"onSignIn"})]}),p!=="/auth"&&s.jsx("div",{className:"align-center",children:s.jsx(B,{to:"/auth?reg=true",onClick:N,children:s.jsx("button",{className:"button",children:t.register})})})]})})};export{W as Login};