import{r as t}from"./index-d82af3d7.js";async function n(e){return await t("GET","reviews","reviews",null,!1,`targetId=${e}`)()}async function i(e){return await t("POST","reviews","postReview",{...e},!1)()}async function f(e){return await t("POST","reviews","postFeedback",{comment:e},!1)()}async function o(e,s){return await t("DELETE","reviews","reviews",{timestamp:e,place:s},!0)()}export{f as a,o as d,n as g,i as p};