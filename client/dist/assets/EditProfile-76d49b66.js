import{a as b,u as C,v,p as d,j as e,T as s,P as f,U as y,s as L,V as N,Q as q}from"./index-cd8e0308.js";import{u as F,a as E}from"./users-31a4e652.js";import{R as O}from"./Responser-7e308649.js";/* empty css             */const m={login:"",pword:"",name:"",question:"",answer:""},D=()=>{const c=b(),n=C(a=>a.user),x=v(),[t,l]=d.useState(m),[p,g]=d.useState(!1),[h,r]=d.useState("");d.useEffect(()=>(n.id&&l(a=>({...a,name:n.name,login:n.login,avatar:n.avatar})),()=>{l(m)}),[n]);function i(a){l({...t,[a.target.name]:a.target.value})}async function j(a){if(a.preventDefault(),!t.login||!t.name)return r(s.fillRequiredFields);if(t.login.length>50)return r((s.field+" "+s.login+" "+s.tooLong).toLocaleLowerCase().capitalize());if(t.pword.length>50)return r((s.field+" "+s.password+" "+s.tooLong).toLocaleLowerCase().capitalize());if(t.name.length>140)return r((s.field+" "+s.userName+" "+s.tooLong).toLocaleLowerCase().capitalize());if(p){const u=await F(t);return u.status==="OK"?(r(s.successfulUpdate),g(!1),f(c,u.data)):u.status==="BANEDPWORD"?r(s.bannedPassword+" - "+t.pword):r(s.errCode+": "+(u.msg||u))}const o=await E(t);if(console.log("%c⧭","color: #514080",o),o.status==="OK")return r(s.successfulUpdate),f(c,o.data);if(o.status==="EXISTING")return r(s.loginOccupied+" - "+t.login);if(o.status==="PWORDCHANGE")return g(!0),l({...t,question:o.data.question}),r(s.secretChallenge);r(s.errCode+": "+(o.msg||o))}async function w(){const a=await y();if(a.status==="OK")return l(m),r(""),L(c,{message:s.farewell+", "+n.name,status:"complete",title:""}),N(c),x.push(q("/")),location.reload();r(s.errCode+": "+(a.msg||a))}return e.jsx("div",{className:"edit-profile-area relative ",children:e.jsxs("div",{className:"edit-profile-wrapper absolute center mp-border-secondary",children:[e.jsxs("form",{className:"edit-profile ",children:[e.jsx("h4",{children:s.editProfile}),e.jsxs("label",{htmlFor:"login",children:[s.login,":"]}),e.jsx("input",{type:"text",name:"login",value:t.login,onInput:i,autoFocus:!0,required:!0}),e.jsx("br",{}),e.jsxs("label",{htmlFor:"name",children:[s.userName,":"]}),e.jsx("input",{type:"text",name:"name",value:t.name,onInput:i,autoFocus:!0,required:!0}),e.jsx("br",{}),e.jsxs("label",{htmlFor:"pword",children:[s.newPassword,":"]}),e.jsx("input",{type:"password",name:"pword",value:t.pword,onInput:i}),e.jsx("br",{}),e.jsx("br",{}),p&&e.jsxs(e.Fragment,{children:[e.jsxs("label",{htmlFor:"question",children:[s.secretQuestion,":"]}),e.jsx("br",{}),e.jsx("textarea",{type:"text",name:"question",value:t.question,onInput:i,autoComplete:"false",readOnly:!0}),e.jsx("br",{}),e.jsxs("label",{htmlFor:"answer",children:[s.secterAnswer,":"]}),e.jsx("input",{type:"text",name:"answer",value:t.answer,onInput:i,required:!!t.question,autoComplete:"false"}),e.jsx("br",{})]}),e.jsx(O,{message:h,setMessage:r})]}),e.jsx("hr",{className:"mp-border-secondary"}),e.jsxs("div",{className:"logout-container",children:[e.jsx("button",{className:"mp-border-secondary profile-logout",onClick:w,children:s.logout}),e.jsx("button",{className:"mp-border-accent",onClick:j,children:s.submit})]})]})})};export{D as EditProfile};
