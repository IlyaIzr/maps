(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{36:function(e,t,n){},37:function(e,t,n){},38:function(e,t,n){},42:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),c=n(19),s=n.n(c),o=n(5),i=n(18),u=n(4),l=n(6),d=n.n(l),p=n(14),j=n(3),b=n(12),m=n(8),f=n(17),g=n.n(f),h=("https://m4ps.herokuapp.com/"||"http://localhost:1414/")+"api/";function O(e,t,n,r){return v.apply(this,arguments)}function v(){return(v=Object(b.a)(d.a.mark((function e(t,n,r,a){var c,s,o;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(c={method:"GET",headers:{"Content-Type":"application/json"}},e.prev=1,!t){e.next=8;break}return e.next=5,fetch(h+"maps/places?minx=".concat(t,"&miny=").concat(r,"&maxx=").concat(n,"&maxy=").concat(a),c);case 5:s=e.sent,e.next=11;break;case 8:return e.next=10,fetch(h+"maps/places",c);case 10:s=e.sent;case 11:return e.next=13,s.json();case 13:return o=e.sent,e.abrupt("return",o);case 17:return e.prev=17,e.t0=e.catch(1),e.abrupt("return",e.t0);case 20:case"end":return e.stop()}}),e,null,[[1,17]])})))).apply(this,arguments)}function x(e){return y.apply(this,arguments)}function y(){return(y=Object(b.a)(d.a.mark((function e(t){var n,r,a;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={method:"GET",headers:{"Content-Type":"application/json"}},e.prev=1,e.next=4,fetch(h+"maps/reviews?targetId=".concat(t),n);case 4:return r=e.sent,e.next=7,r.json();case 7:return a=e.sent,e.abrupt("return",a);case 11:return e.prev=11,e.t0=e.catch(1),e.abrupt("return",e.t0);case 14:case"end":return e.stop()}}),e,null,[[1,11]])})))).apply(this,arguments)}function w(e){return N.apply(this,arguments)}function N(){return(N=Object(b.a)(d.a.mark((function e(t){var n,r,a;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object(j.a)({},t))},e.prev=1,e.next=4,fetch(h+"maps/postInitReview",n);case 4:return r=e.sent,e.next=7,r.json();case 7:return a=e.sent,e.abrupt("return",a);case 11:return e.prev=11,e.t0=e.catch(1),e.abrupt("return",e.t0);case 14:case"end":return e.stop()}}),e,null,[[1,11]])})))).apply(this,arguments)}function S(e){return k.apply(this,arguments)}function k(){return(k=Object(b.a)(d.a.mark((function e(t){var n,r,a;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object(j.a)({},t))},e.prev=1,e.next=4,fetch(h+"maps/postNextReview",n);case 4:return r=e.sent,e.next=7,r.json();case 7:return a=e.sent,e.abrupt("return",a);case 11:return e.prev=11,e.t0=e.catch(1),e.abrupt("return",e.t0);case 14:case"end":return e.stop()}}),e,null,[[1,11]])})))).apply(this,arguments)}var C=["#cd0c0c","#e14612","#e1922c","#e8c337","#94c52f","#0aa112"];function F(e,t){e.on("load",(function(n){e.addSource("ratedFeaturesSource",{type:"geojson",data:{type:"FeatureCollection",features:t}}),e.addSource("selectedFeatureSrc",{type:"geojson",data:{type:"FeatureCollection",features:[]}});var r=e.getStyle().layers.find((function(e){return"symbol"===e.type})).id;e.addLayer({id:"ratedFeatures",source:"ratedFeaturesSource",minzoom:11,type:"fill",paint:{"fill-opacity":.5,"fill-color":["interpolate",["linear"],["get","rating"],0,C[0],1,C[1],2,C[2],3,C[3],4,C[4],5,C[5]]}},r),e.addLayer({id:"selectedFeature",source:"selectedFeatureSrc",minzoom:13,type:"fill",paint:{"fill-opacity":.9,"fill-color":"#ffc900","fill-outline-color":"blue"}},r)}))}function L(e,t,n){function r(t){return function(e){if(!e[1])return e[0];var t=window.turf.union(e[0],e[1]);if(e[2])for(var n=2;n<e.length;n++)t=window.turf.union(t,e[n]);return t.geometry}(function(t){var n=e.querySourceFeatures("composite",{filter:["any",["==",["id"],t.id]],sourceLayer:t.sourceLayer});return n.splice(n.length/2),n.map((function(e){return e.geometry}))}(t)||[])}e.on("click",(function(a){function c(t){var n=a.lngLat,r=n.lng,c=n.lat;e.flyTo({center:[r,c],zoom:t})}n();var s=e.queryRenderedFeatures(a.point),o=new Set(["building","landuse"]),i=s.find((function(e){return"ratedFeaturesSource"===e.source}));if(i)return console.log("found rated feature",i.geometry),I(e,i),void t(i);var u=s.find((function(e){return o.has(e.sourceLayer)}));if(null===u||void 0===u?void 0:u.id){console.log("found feature",u);var l=e.getZoom();I(e,u,l<16?16:l),t(Object(j.a)(Object(j.a)({},u),{},{geometry:r(u)}))}else if(u)console.log("interesting, but no id",u),c(e.getZoom()+1),t(null);else{console.log("no interesting features",s);var d=new Set(["natural_label","place_label","poi_label","housenum_label","airport_label"]);if(s.find((function(e){return d.has(e.sourceLayer)}))){var p=e.getZoom()+1;p<16&&c(p)}t(null)}}))}function T(){var e=window.localStorage.getItem("lastLocation");if(!e)return{};var t=e=JSON.parse(e);return{lng:t.lng,lat:t.lat}}var B=n(1);g.a.accessToken="pk.eyJ1IjoiaWx5YWl6ciIsImEiOiJja29nNG5rNTkwbGdxMm5sYTFqbXpqbnlpIn0.S4LdF8fBwDtEQ6-dQBrWVw";var E=function(e){var t=e.feature,n=e.setFeature,a=e.resetRater,c=e.geoData,s=e.setGeoData,o=e.featureTrigger,i=Object(r.useRef)(null),u=Object(r.useRef)(null);return Object(r.useEffect)((function(){Object(b.a)(d.a.mark((function e(){var t,r,c,o,l;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=T(),r=t.lng,c=t.lat,e.next=3,O();case 3:if("OK"===(o=e.sent).status){e.next=6;break}return e.abrupt("return",console.log("bad request",o));case 6:if(!u.current){e.next=8;break}return e.abrupt("return");case 8:d=o.data,l=(null===d||void 0===d?void 0:d.length)?d.map((function(e){var t,n={type:"Feature",geometry:{type:"MultiPolygon"},id:e.id,properties:{rating:Number(e.rating),amount:e.amount},source:"composite",sourceLayer:"building"};return n.geometry.coordinates=null===e||void 0===e||null===(t=e.polygon)||void 0===t?void 0:t.map((function(e){return e.map((function(e){return e.map((function(e){return[e.x,e.y]}))}))})),n})):[],s(l),u.current=new g.a.Map({container:i.current,style:"mapbox://styles/ilyaizr/ckpk88ybo17tn17mzmd5etst8",center:[r||34.354,c||53.235],zoom:16}),F(u.current,l),L(u.current,n,a);case 13:case"end":return e.stop()}var d}),e)})))();var e=setInterval((function(){var e,t,n=null===(e=u.current)||void 0===e||null===(t=e.getCenter)||void 0===t?void 0:t.call(e);n&&function(e){var t=e.lng,n=e.lat;window.localStorage.setItem("lastLocation",JSON.stringify({lng:t,lat:n}))}(n)}),1e4);return function(){return clearInterval(e)}}),[]),Object(r.useEffect)((function(){u.current&&R(u.current,c,"ratedFeaturesSource")}),[o]),Object(r.useEffect)((function(){u.current&&R(u.current,[t||{}],"selectedFeatureSrc")}),[t]),Object(B.jsx)("div",{children:Object(B.jsx)("div",{ref:i,className:"map-container"})})};function R(e,t,n){e.getSource(n).setData({type:"FeatureCollection",features:t})}function I(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:16,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.5,a=Object(o.a)(window.turf.centroid(t.geometry).geometry.coordinates,2),c=a[0],s=a[1];e.flyTo({center:[c,s],zoom:n,speed:r})}var _={homeLinkBtn:"\u0413\u043b\u0430\u0432\u043d\u0430\u044f",authLinkBtn:"\u041b\u043e\u0433\u0438\u043d",setsLinkBtn:"\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438",login:"\u041b\u043e\u0433\u0438\u043d",logout:"\u0412\u044b\u0439\u0442\u0438",register:"\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f",yourName:"\u0412\u0430\u0448\u0435 \u0438\u043c\u044f",submit:"\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c",confirm:"\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c",greetings:"\u041f\u0440\u0438\u0432\u0435\u0442",firstTimeRate:"\u0412\u0430\u043c \u0432\u044b\u043f\u0430\u043b\u0430 \u0447\u0435\u0441\u0442\u044c \u043f\u0435\u0440\u0432\u044b\u043c \u043e\u0446\u0435\u043d\u0438\u0442\u044c \u044d\u0442\u043e \u043c\u0435\u0441\u0442\u043e!",placeRatingPrefix:"\u041e\u0431\u0449\u0438\u0439 \u0440\u0435\u0439\u0442\u0438\u043d\u0433",placeAmountPrefix:"\u042d\u0442\u043e \u043c\u0435\u0441\u0442\u043e \u043e\u0446\u0435\u043d\u0438\u043b\u0438",placeAmountNumberEnds1:"\u0440\u0430\u0437",placeAmountEndsMultiple:"\u0440\u0430\u0437\u0430",push:"\u041d\u0430\u0436\u0430\u0442\u044c",commentPlacehol:"\u0435\u0441\u0442\u044c \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438?",rating:"\u0412\u0430\u0448\u0430 \u043e\u0446\u0435\u043d\u043a\u0430",bestRating:"\u0417\u0430\u043c\u0435\u0447\u0430\u0442\u0435\u043b\u044c\u043d\u043e",worstRating:"\u0423\u0436\u0430\u0441\u043d\u043e",reviews:"\u041e\u0442\u0437\u044b\u0432\u044b",noComments:"\u0411\u0435\u0437 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0435\u0432"},M=function(e){var t=e.rating,n=e.setRating,a=e.comment,c=e.setComment,s=e.onSubmit,i=Object(r.useState)(0),u=Object(o.a)(i,2),l=u[0],d=u[1];function j(e){n(l)}function b(e){d(Number(e.target.name))}function m(){d(t)}return Object(B.jsxs)("div",{className:"rater",children:[Object(B.jsxs)("div",{className:"stars",children:[Object(B.jsxs)("h5",{className:"starRating",children:[_.rating," :"]})," ",Object(B.jsx)("span",{className:"hoverValue mp-dark",children:l}),Object(B.jsx)("br",{}),Object(p.a)(Array(5)).map((function(e,n){return n+=1,Object(B.jsx)("button",{type:"button",name:n,className:n<=(l||t)?"mp-accent starButton":"mp-secondary starButton",onClick:j,onMouseEnter:b,onMouseLeave:m,style:n<=(l||t)?{color:C[l]}:{},children:Object(B.jsx)("span",{className:"star",children:"\u2605"})},n)}))]}),Object(B.jsx)("textarea",{name:"comment",cols:"31",rows:"2",value:a,onInput:function(e){c(e.target.value)},className:"raterComment",placeholder:_.commentPlacehol}),Object(B.jsx)("div",{className:"raterBtnContainer",children:Object(B.jsx)("button",{type:"button",onClick:function(){d(0),s()},children:_.push})})]})},P=function(e){var t=e.feature;return(null===t||void 0===t?void 0:t.source)?"ratedFeaturesSource"===t.source?Object(B.jsxs)("div",{className:"featurer",children:[Object(B.jsxs)("p",{className:"rateAmount",children:[_.placeAmountPrefix+" "+t.properties.amount+" ",String(t.properties.amount).endsWith("1")?_.placeAmountNumberEnds1:_.placeAmountEndsMultiple]}),Object(B.jsxs)("h5",{className:"rateValue",children:[_.placeRatingPrefix,":",Object(B.jsxs)("span",{className:"rateNumber",children:[" ",t.properties.rating]})]})]}):Object(B.jsx)("div",{className:"featurer",children:_.firstTimeRate}):(console.log("wtf feature",t),null)};function D(e){var t;t="Polygon"===e.type?[e.coordinates]:e.coordinates;var n=-90,r=-180,a=90,c=180,s=[];t.forEach((function(e){s.push(function(e){var t=[];return e.forEach((function(e,s){t.push("("),e.forEach((function(e,i){var u=Object(o.a)(e,2),l=u[0],d=u[1];l<c&&(c=l),l>r&&(r=l),d>n&&(n=d),d<a&&(a=d),t[s]+=(i?", ":"")+String(l)+" "+String(d)})),t[s]+=")"})),"("+t.join(",")+")"}(e))}));var i="MULTIPOLYGON("+s.join(", ")+")";return[[r,n],[c,a],i]}n(36);var W=function(){return Object(B.jsx)("div",{className:"mapLegend mp-bg-light mp-border-secondary mp-shadow-light",children:Object(B.jsxs)("div",{className:"ratingLegend",children:[Object(B.jsxs)("div",{className:"ratingDescription",children:[Object(B.jsx)("span",{children:_.worstRating}),Object(B.jsx)("span",{}),Object(B.jsx)("span",{}),Object(B.jsx)("span",{}),Object(B.jsx)("span",{children:_.bestRating})]}),Object(B.jsx)("div",{className:"ratingUnitsWrap",children:C.map((function(e,t){return Object(B.jsx)("div",{className:"ratingUnit",children:Object(B.jsx)("span",{className:"ratingColor",style:{backgroundColor:e}})},e+t)}))}),Object(B.jsx)("div",{className:"ratingGradientWrap",children:Object(B.jsx)("div",{className:"ratingGradient",style:{background:"linear-gradient(90deg, ".concat(C[0],", ").concat(C[3],", ").concat(C[5],")")}})})]})})},A="app/log_in",G="app/log_out",J="app/expand_comms",z="app/shrink_comms",q={isLogged:!1,language:"en",reviewsShown:!0};var K=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];e(t?{type:A}:{type:G})},U=function(e){var t=e.feature,n=Object(m.b)(),a=Object(m.c)((function(e){return e.app})).reviewsShown,c=Object(r.useState)([]),s=Object(o.a)(c,2),i=s[0],u=s[1];return Object(r.useEffect)((function(){return Object(b.a)(d.a.mark((function e(){var n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x(t.id);case 2:if("OK"===(n=e.sent).status){e.next=5;break}return e.abrupt("return",console.log("error with res",n));case 5:u(n.data);case 6:case"end":return e.stop()}}),e)})))(),function(){u([])}}),[]),"ratedFeaturesSource"!==(null===t||void 0===t?void 0:t.source)?null:Object(B.jsxs)("div",{className:"reviewsContainer ".concat(a?"expanded":"shrinked"),children:[i.length?i.map((function(e){var t,n;return console.log("%c\u29ed","color: #8c0038",e),Object(B.jsxs)("div",{className:"reviewWrap mp-border-secondary mp-shadow-light",children:[Object(B.jsx)("div",{className:"authorLogo mp-bg-counter",children:Object(B.jsx)("span",{className:"mp-primary",title:e.author,children:null===(t=String(e.author))||void 0===t||null===(n=t[0])||void 0===n?void 0:n.toUpperCase()})}),Object(B.jsxs)("div",{className:"reviewBody",children:[Object(B.jsx)("p",{className:"author",children:e.author}),Object(B.jsx)("div",{className:"reviewDate mp-secondary",children:new Date(e.timestamp).toLocaleDateString()}),Boolean(e.comment)&&Object(B.jsx)("div",{className:"reviewComment mp-bg-primary",children:e.comment}),Object(B.jsxs)("div",{className:"reviewRating",children:[e.grade,"/5",Object(B.jsx)("span",{className:"reviewStars stars",children:Object(p.a)(Array(5)).map((function(t,n){return n+=1,Object(B.jsx)("span",{className:n<=e.grade?"mp-accent starButton":"mp-secondary starButton",children:"\u2605"},n)}))})]})]})]},e.author+e.grade+Math.random())})):Object(B.jsx)("div",{children:_.noreviews}),Object(B.jsx)("div",{className:"skipperContainer",children:Object(B.jsx)("div",{className:"skipper mp-bg-light mp-border-secondary",onClick:function(){a?n({type:z}):function(e){e({type:J})}(n)},children:a?Object(B.jsx)("span",{className:"mp-secondary",children:"\u21a5"}):Object(B.jsx)("span",{className:"mp-secondary",children:"\u21a7"})})})]})},V=function(){var e=Object(m.c)((function(e){return e.user})),t=Object(r.useState)(0),n=Object(o.a)(t,2),a=n[0],c=n[1],s=Object(r.useState)(""),i=Object(o.a)(s,2),u=i[0],l=i[1],f=Object(r.useState)(null),h=Object(o.a)(f,2),O=h[0],v=h[1],x=Object(r.useState)(null),y=Object(o.a)(x,2),N=y[0],k=y[1],C=Object(r.useState)(0),F=Object(o.a)(C,2),L=F[0],T=F[1];function R(){T(L+1)}function I(){c(0),l(""),v(null)}function _(){return(_=Object(b.a)(d.a.mark((function t(){var n,r,c,s,i,l,b,m,f,h,v,x,y,C,F,L,T;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=D(O.geometry),r=Object(o.a)(n,3),c=r[0],s=r[1],i=r[2],l=new g.a.LngLatBounds(c,s),b=l.getCenter(),m=b.lng,f=b.lat,h={comment:u,grade:a,targetId:O.id},v={lng:m,lat:f,x:O._vectorTileFeature._x,y:O._vectorTileFeature._y,id:O.id,polyString:i},"ratedFeaturesSource"!==O.source){t.next=23;break}return t.next=8,S({user:e.login,review:h,place:Object(j.a)(Object(j.a)({},O.properties),{},{id:O.id})});case 8:if("OK"===(x=t.sent).status){t.next=11;break}return t.abrupt("return",console.log("%c\u29ed","color: #bf1d00",x));case 11:y=0;case 12:if(!(y<N.length)){t.next=20;break}if(N[y].id!==O.id){t.next=17;break}return C=O.properties,F=C.amount,L=C.rating,N[y].properties={rating:+((F*L+h.grade)/(F+1)).toFixed(5),amount:F+1},t.abrupt("break",20);case 17:y++,t.next=12;break;case 20:return k(N),R(),t.abrupt("return",I());case 23:return k([].concat(Object(p.a)(N),[{type:"Feature",properties:{rating:a,amount:1},id:O.id,geometry:O.geometry}])),R(),t.next=27,w({user:e.login,review:h,place:v});case 27:if("OK"===(T=t.sent).status){t.next=30;break}return t.abrupt("return",console.log("%c\u29ed","color: #bf1d00",T));case 30:I();case 31:case"end":return t.stop()}}),t)})))).apply(this,arguments)}return Object(B.jsxs)("div",{children:[Object(B.jsx)(E,{feature:O,setFeature:v,resetRater:I,geoData:N,setGeoData:k,featureTrigger:L}),Object(B.jsx)(W,{}),O&&Object(B.jsxs)("div",{className:"featureContainer mp-bg-light mp-border-secondary",children:[Object(B.jsx)(P,{feature:O}),Object(B.jsx)(M,{rating:a,setRating:c,comment:u,setComment:l,onSubmit:function(){return _.apply(this,arguments)}}),Object(B.jsx)(U,{feature:O}),Object(B.jsx)("div",{className:"closeFeature",onClick:I,children:"\u2715"})]})]})},Y="user/set_credentials",Z="user/set_level",Q={name:"anonimus",login:"anonimus",level:0,id:1};var X=function(e,t,n,r){e({type:Y,credentials:{name:t,login:n,id:r}})},H=function(e,t,n,r){X(e,t,n,r),K(e,!0)},$=function(){var e=Object(r.useState)(""),t=Object(o.a)(e,2),n=t[0],a=t[1],c=Object(m.b)(),s=Object(m.c)((function(e){return e.user})),i=Object(m.c)((function(e){return e.app}));return Object(r.useEffect)((function(){n!==s.name&&a(s.name)}),[s.name]),Object(B.jsx)("div",{children:i.isLogged?Object(B.jsxs)("div",{children:[Object(B.jsxs)("h4",{children:[_.greetings,", ",n]}),Object(B.jsx)("button",{className:"primary",onClick:function(){var e;window.localStorage.clear(),a(""),X(e=c,"","",""),K(e,!1)},children:_.logout})]}):Object(B.jsxs)(B.Fragment,{children:[Object(B.jsx)("label",{htmlFor:"name",children:_.yourName}),Object(B.jsx)("input",{type:"text",name:"name",value:n,onInput:function(e){a(e.target.value)}}),Object(B.jsx)("button",{className:"primary",onClick:function(){H(c,n,n,n+"-"+Math.floor(1e3*Math.random())),window.localStorage.setItem("usernameTemp",n)},children:_.confirm})]})})},ee=function(){return Object(B.jsx)("div",{children:"TBC"})},te=function(){var e=Object(r.useState)(!0),t=Object(o.a)(e,2),n=t[0];t[1];return Object(B.jsx)("div",{children:n?Object(B.jsx)($,{}):Object(B.jsx)(ee,{})})};n(37),n(38);var ne=function(){var e=Object(r.useState)(!0),t=Object(o.a)(e,2),n=t[0],a=t[1],c=Object(m.b)();return Object(r.useEffect)((function(){var e=window.localStorage.getItem("usernameTemp");e&&H(c,e,e,e+"-"+Math.floor(1e3*Math.random()))}),[]),Object(B.jsxs)(i.a,{children:[Object(B.jsxs)("div",{className:"mainNavigation mp-bg-light mp-border-secondary",children:[Object(B.jsx)(i.b,{className:"mp-border-secondary",to:"/",onClick:function(){return a(!0)},children:_.homeLinkBtn}),Object(B.jsx)(i.b,{className:"mp-border-secondary",to:"/auth",onClick:function(){return a(!1)},children:_.authLinkBtn}),Object(B.jsx)(i.b,{className:"mp-border-secondary",to:"/settings",onClick:function(){return a(!1)},children:_.setsLinkBtn})]}),Object(B.jsx)("div",{className:n?"mainWrapper":"hidden",children:Object(B.jsx)(V,{})}),Object(B.jsxs)(u.c,{children:[Object(B.jsx)(u.a,{path:"/settings",children:Object(B.jsx)("div",{className:"routeWrapper",children:"Settings component will be released soon"})}),Object(B.jsx)(u.a,{path:"/auth",children:Object(B.jsx)("div",{className:"routeWrapper",children:Object(B.jsx)(te,{})})})]})]})},re=(n(41),n(26)),ae=Object(re.a)({user:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Q,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case Y:return Object(j.a)(Object(j.a)({},e),t.credentials);case Z:return Object(j.a)(Object(j.a)({},e),{},{level:t.newLevel});default:return e}},app:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:q,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case A:return Object(j.a)(Object(j.a)({},e),{},{isLogged:!0});case G:return Object(j.a)(Object(j.a)({},e),{},{isLogged:!1});case z:return Object(j.a)(Object(j.a)({},e),{},{reviewsShown:!1});case J:return Object(j.a)(Object(j.a)({},e),{},{reviewsShown:!0});default:return e}}}),ce=Object(re.b)(ae),se=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,43)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,c=t.getLCP,s=t.getTTFB;n(e),r(e),a(e),c(e),s(e)}))};s.a.render(Object(B.jsx)(a.a.StrictMode,{children:Object(B.jsx)(m.a,{store:ce,children:Object(B.jsx)(ne,{})})}),document.getElementById("root")),se()}},[[42,1,2]]]);
//# sourceMappingURL=main.4e8654d2.chunk.js.map