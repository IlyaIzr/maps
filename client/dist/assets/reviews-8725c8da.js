import{d as t}from"./index-8ffe9592.js";async function r(e){return await t("GET","reviews","reviews",null,!1,`targetId=${e}`)()}async function i(e){return await t("POST","reviews","postReview",{...e},!1)()}async function f(e){return await t("POST","reviews","postFeedback",{comment:e},!1)()}async function o(e,s){return await t("DELETE","reviews","reviews",{timestamp:e,place:s},!0)()}export{i as a,o as d,r as g,f as p};