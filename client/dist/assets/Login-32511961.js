import{a as E,q as G,u as w,O as A,o as u,j as e,T as t,a8 as M,a9 as P,c as l,s as d,W as y,N as C,P as K,Q as W,aa as B,R as i}from"./index-09e4430f.js";import{R as q}from"./Responser-d1196265.js";import{A as D}from"./AppLink-fe8d650c.js";import{w as b}from"./url-6d62d571.js";const X=({afterLoggedIn:a})=>{const o=E(),c=G(),m=w(s=>s.user),g=w(s=>s.app),p=A().pathname,[h,x]=u.useState(""),[f,j]=u.useState(""),[R,n]=u.useState("");function v(s){x(s.target.value)}function S(s){j(s.target.value)}async function N(){n(t.loading+"...");const s=await P({login:h,pword:f});if(s.status==="WRONG")return n(t.wrongAuth);if(s.status==="OK")return l(o),d(o,{message:t.greetings+", "+s.data.name,status:"complete",title:null}),n(""),await y(o),a==null||a(),c.push(b("/")),C(o,s.data);n(t.errorReg+", "+t.errCode+": "+(s.msg||s))}async function O(){const s=await K();if(s.status==="OK")return d(o,{message:t.farewell+", "+m.name,status:"complete",title:null}),x(""),j(""),n(""),W(o);n(t.errorReg+", "+t.errCode+": "+(s.msg||s))}async function F(s){const r=await B(s.credential);if(r.status==="FIRSTTIME")return H(r),l(o),c.push("/googleConfirm");if(r.status==="OK")return l(o),d(o,{message:t.greetings+", "+r.data.name,status:"complete",title:null}),n(""),await y(o),a==null||a(),c.push(b("/")),C(o,r.data);n(t.errorReg+", "+t.errCode+": "+(r.msg||r))}function k(s){console.log("%c⧭ google auth failed","color: #00a3cc",s),n(t.errorReg+", "+t.errCode+": "+JSON.stringify(s))}function T(){l(o)}return e.jsx("div",{children:g.isLogged?e.jsxs("div",{children:[e.jsxs("h4",{children:[t.greetings,", ",m.name]}),e.jsx("button",{className:"primary",onClick:O,children:t.logout})]}):e.jsxs("div",{children:[e.jsxs("div",{className:p!=="/auth"?"login-form login-form-bordered mp-border-secondary":"login-form",children:[e.jsxs("label",{htmlFor:"name",children:[t.yourLogin,":"]}),e.jsx("input",{type:"text",name:"login",value:h,onInput:v,autoFocus:!0}),e.jsx("br",{}),e.jsxs("label",{htmlFor:"pword",children:[t.yourPword,":"]}),e.jsx("input",{type:"password",name:"pword",value:f,onInput:S}),e.jsx(q,{message:R,setMessage:n}),e.jsx("button",{className:"primary mp-border-accent loginBtn",onClick:N,children:t.confirm}),e.jsx(M,{shape:"rectangular",onSuccess:F,onError:k,width:"200",theme:g.theme==="dark"?"filled_black":"outline"})]}),p!=="/auth"&&e.jsx("div",{className:"align-center",children:e.jsx(D,{to:"/auth?reg=true",onClick:T,children:e.jsx("button",{className:"button",children:t.register})})})]})})};function H(a){i.name=a.data.name,i.login=a.data.login,a.data.login||(i.occupiedLogin=a.data.email),i.avatar=a.data.avatar,i.id=a.data.id}export{X as Login};
