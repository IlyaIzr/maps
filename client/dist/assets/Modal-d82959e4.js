import{u as m,a as u,T as t,j as o,c as i}from"./index-762ffdee.js";const b=()=>{const a=m(c=>c.app.modal),l=u(),e=a.acceptLabel!==void 0?a.acceptLabel:t.acceptDefault,n=a.cancelLabel!==void 0?a.cancelLabel:t.cancelDefault;async function s(){var c;await((c=a.cancelAction)==null?void 0:c.call(a)),i(l)}async function d(){var c;await((c=a.acceptAction)==null?void 0:c.call(a)),i(l)}async function r(c){c.stopPropagation(),await s()}function p(c){c.stopPropagation()}return a?o.jsx("div",{className:"modal-dialog-wrap",onClick:r,children:o.jsx("div",{className:"modal-dialog mp-border-dark mp-bg-light",onClick:p,children:o.jsxs("div",{className:"modal-dialog-content mp-dark",children:[o.jsx("div",{className:"modal-content",children:a.message}),!!a.children&&a.children,o.jsxs("div",{className:"modal-buttons",children:[!!n&&o.jsx("button",{className:"modal-cancel",onClick:s,children:n}),!!e&&o.jsx("button",{className:"modal-accept",onClick:d,children:e})]})]})})}):null};export{b as Modal};