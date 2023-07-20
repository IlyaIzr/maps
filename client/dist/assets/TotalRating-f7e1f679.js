import{u as L,j as b,T as N,A as C,i as P}from"./index-ccb5f424.js";function E(r,i,e){e===void 0&&(e={});var t={type:"Feature"};return(e.id===0||e.id)&&(t.id=e.id),e.bbox&&(t.bbox=e.bbox),t.properties=i||{},t.geometry=r,t}function D(r,i,e){if(e===void 0&&(e={}),!r)throw new Error("coordinates is required");if(!Array.isArray(r))throw new Error("coordinates must be an Array");if(r.length<2)throw new Error("coordinates must be at least 2 numbers long");if(!G(r[0])||!G(r[1]))throw new Error("coordinates must contain numbers");var t={type:"Point",coordinates:r};return E(t,i,e)}function J(r,i,e){e===void 0&&(e={});for(var t=0,o=r;t<o.length;t++){var n=o[t];if(n.length<4)throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");for(var a=0;a<n[n.length-1].length;a++)if(n[n.length-1][a]!==n[0][a])throw new Error("First and last Position are not equivalent.")}var g={type:"Polygon",coordinates:r};return E(g,i,e)}function U(r,i,e){e===void 0&&(e={});var t={type:"MultiPolygon",coordinates:r};return E(t,i,e)}function G(r){return!isNaN(r)&&r!==null&&!Array.isArray(r)}function R(r,i,e){if(r!==null)for(var t,o,n,a,g,l,h,v=0,f=0,w,p=r.type,A=p==="FeatureCollection",S=p==="Feature",k=A?r.features.length:1,c=0;c<k;c++){h=A?r.features[c].geometry:S?r.geometry:r,w=h?h.type==="GeometryCollection":!1,g=w?h.geometries.length:1;for(var m=0;m<g;m++){var s=0,y=0;if(a=w?h.geometries[m]:h,a!==null){l=a.coordinates;var u=a.type;switch(v=e&&(u==="Polygon"||u==="MultiPolygon")?1:0,u){case null:break;case"Point":if(i(l,f,c,s,y)===!1)return!1;f++,s++;break;case"LineString":case"MultiPoint":for(t=0;t<l.length;t++){if(i(l[t],f,c,s,y)===!1)return!1;f++,u==="MultiPoint"&&s++}u==="LineString"&&s++;break;case"Polygon":case"MultiLineString":for(t=0;t<l.length;t++){for(o=0;o<l[t].length-v;o++){if(i(l[t][o],f,c,s,y)===!1)return!1;f++}u==="MultiLineString"&&s++,u==="Polygon"&&y++}u==="Polygon"&&s++;break;case"MultiPolygon":for(t=0;t<l.length;t++){for(y=0,o=0;o<l[t].length;o++){for(n=0;n<l[t][o].length-v;n++){if(i(l[t][o][n],f,c,s,y)===!1)return!1;f++}y++}s++}break;case"GeometryCollection":for(t=0;t<a.geometries.length;t++)if(R(a.geometries[t],i,e)===!1)return!1;break;default:throw new Error("Unknown Geometry Type")}}}}}function X(r){if(Array.isArray(r))return r;if(r.type==="Feature"){if(r.geometry!==null)return r.geometry.coordinates}else if(r.coordinates)return r.coordinates;throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array")}function $(r){return r.type==="Feature"?r.geometry:r}function M(r){return String(Number(r).toPrecision(3)).split(".")}function q(r,i){if(!r)return P[i][0];for(let e=0;e<P[i].length;e++)if(+r-1<e)return P[i][e]}function d({rating:r,amount:i}){const{theme:e}=L(o=>o.app),t=q(r,e);return b.jsx("div",{className:"rating",children:b.jsxs("div",{className:"ratingAmount mp-border-primary relative",style:{borderColor:t},title:N.rating,children:[C(M(r)[0]),".",b.jsx("span",{children:C(M(r)[1])}),b.jsxs("sub",{className:"mp-dark mp-bg-light",style:{color:t},title:N.marks,children:[" ( ",i," ) "]})]})})}export{d as T,J as a,X as b,R as c,$ as g,U as m,D as p};