import{a as I,x as N,u as j,z as k,f as c,j as o,T as s,G as E,L as G,A as T,c as i,s as u,B as w,y,C as A,D as M,E as B,F as r}from"./index-4b67aea8.js";import{R as K}from"./Responser-5062a836.js";const z=()=>{const t=I(),l=N(),g=j(e=>e.user),d=j(e=>e.app),m=k().pathname,[p,h]=c.useState(""),[f,x]=c.useState(""),[b,a]=c.useState("");function C(e){h(e.target.value)}function v(e){x(e.target.value)}async function R(){a(s.loading+"...");const e=await T({login:p,pword:f});if(e.status==="WRONG")return a(s.wrongAuth);if(e.status==="OK")return i(t),u(t,{message:s.greetings+", "+e.data.name,status:"complete",title:null}),a(""),await w(t),l.push("/"),y(t,e.data);a(s.errorReg+", "+s.errCode+": "+(e.msg||e))}async function L(){const e=await A();if(e.status==="OK")return u(t,{message:s.farewell+", "+g.name,status:"complete",title:null}),h(""),x(""),a(""),M(t);a(s.errorReg+", "+s.errCode+": "+(e.msg||e))}async function S(e){const n=await B(e.credential);if(n.status==="FIRSTTIME")return P(n),i(t),l.push("/googleConfirm");if(n.status==="OK")return i(t),u(t,{message:s.greetings+", "+n.data.name,status:"complete",title:null}),a(""),await w(t),l.push("/"),y(t,n.data);a(s.errorReg+", "+s.errCode+": "+(n.msg||n))}function F(e){console.log("%c⧭ google auth failed","color: #00a3cc",e),a(s.errorReg+", "+s.errCode+": "+JSON.stringify(e))}function O(){i(t)}return o.jsx("div",{children:d.isLogged?o.jsxs("div",{children:[o.jsxs("h4",{children:[s.greetings,", ",g.name]}),o.jsx("button",{className:"primary",onClick:L,children:s.logout})]}):o.jsxs("div",{children:[o.jsxs("div",{className:m!=="/auth"?"login-form login-form-bordered mp-border-secondary":"login-form",children:[o.jsxs("label",{htmlFor:"name",children:[s.yourLogin,":"]}),o.jsx("input",{type:"text",name:"login",value:p,onInput:C,autoFocus:!0}),o.jsx("br",{}),o.jsxs("label",{htmlFor:"pword",children:[s.yourPword,":"]}),o.jsx("input",{type:"password",name:"pword",value:f,onInput:v}),o.jsx(K,{message:b,setMessage:a}),o.jsx("button",{className:"primary mp-border-accent loginBtn",onClick:R,children:s.confirm}),o.jsx(E,{shape:"rectangular",onSuccess:S,onError:F,width:"200",theme:d.theme==="dark"?"filled_black":"outline"})]}),m!=="/auth"&&o.jsx("div",{className:"align-center",children:o.jsx(G,{to:"/auth?reg=true",onClick:O,children:o.jsx("button",{className:"button",children:s.register})})})]})})};function P(t){r.name=t.data.name,r.login=t.data.login,t.data.login||(r.occupiedLogin=t.data.email),r.avatar=t.data.avatar,r.id=t.data.id}export{z as Login};
