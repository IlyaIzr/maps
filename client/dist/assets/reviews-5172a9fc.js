import{r as t}from"./index-09e4430f.js";async function f(e){return await t("GET","reviews","reviews",null,!1,`targetId=${e}`)()}async function c(e,{isNew:s}){return await t("POST","reviews","postReview",{...e,isNew:s},!1)()}async function w(e){return await t("POST","reviews","postFeedback",{comment:e},!1)()}async function u(e,s,a,n){return await t("DELETE","reviews","reviews",{timestamp:e,place:s,author:a,asRoot:n},!0)()}export{w as a,u as d,f as g,c as p};
