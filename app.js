!function(){"use strict";var e="undefined"==typeof global?self:global;if("function"!=typeof e.require){var r={},t={},n={},o={}.hasOwnProperty,i=/^\.\.?(\/|$)/,a=function(e,r){for(var t,n=[],o=(i.test(r)?e+"/"+r:r).split("/"),a=0,l=o.length;a<l;a++)t=o[a],".."===t?n.pop():"."!==t&&""!==t&&n.push(t);return n.join("/")},l=function(e){return e.split("/").slice(0,-1).join("/")},u=function(r){return function(t){var n=a(l(r),t);return e.require(n,r)}},c=function(e,r){var n=p&&p.createHot(e),o={id:e,exports:{},hot:n};return t[e]=o,r(o.exports,u(e),o),o.exports},f=function(e){return n[e]?f(n[e]):e},s=function(e,r){return f(a(l(e),r))},d=function(e,n){null==n&&(n="/");var i=f(e);if(o.call(t,i))return t[i].exports;if(o.call(r,i))return c(i,r[i]);throw new Error("Cannot find module '"+e+"' from '"+n+"'")};d.alias=function(e,r){n[r]=e};var m=/\.[^.\/]+$/,g=/\/index(\.[^\/]+)?$/,v=function(e){if(m.test(e)){var r=e.replace(m,"");o.call(n,r)&&n[r].replace(m,"")!==r+"/index"||(n[r]=e)}if(g.test(e)){var t=e.replace(g,"");o.call(n,t)||(n[t]=e)}};d.register=d.define=function(e,n){if(e&&"object"==typeof e)for(var i in e)o.call(e,i)&&d.register(i,e[i]);else r[e]=n,delete t[e],v(e)},d.list=function(){var e=[];for(var t in r)o.call(r,t)&&e.push(t);return e};var p=e._hmr&&new e._hmr(s,d,r,t);d._cache=t,d.hmr=p&&p.wrap,d.brunch=!0,e.require=d}}(),function(){"undefined"==typeof window?this:window;require.register("main.js",function(e,r,t){"use strict";var n=function(){function e(e,r){var t=[],n=!0,o=!1,i=void 0;try{for(var a,l=e[Symbol.iterator]();!(n=(a=l.next()).done)&&(t.push(a.value),!r||t.length!==r);n=!0);}catch(u){o=!0,i=u}finally{try{!n&&l["return"]&&l["return"]()}finally{if(o)throw i}}return t}return function(r,t){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return e(r,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),o=["rgb(255,140,0)","rgb(255,213,0)","rgb(153,255,0)","rgb(0,255,221)","rgb(0,200,255)","rgb(0,115,255)","rgb(72,0,255)","rgb(255,0,221)","rgb(255,0,111)","rgb(255,0,9)"],i=50,a=5,l=i*a;window.addEventListener("mousemove",function(e){var r=e.clientX;i=Math.ceil(5e3*r/window.innerWidth)});var u=!1,c=[];new Worker("coordinates.js").onmessage=function(e){var r=e.data;"completed"===r?u=!0:c.push(r)};var f={timestamp:new Date,to:0},s=function(e){var r={timestamp:new Date,from:e.to,done:!1},t=r.timestamp-e.timestamp,n=Math.ceil(t*i/1e3);return r.to=r.from+n,r.scaleUntil=r.from+l,r.to>c.length&&(u?r.done=!0:console.log("rendering "+(r.to-c.length)+" too few coordinates because they are not yet loaded"),r.to=c.length),r},d=document.getElementById("map").getContext("2d"),m=function g(){f=s(f);for(var e=f,r=e.done,t=e.from,i=e.to;t<i;){var a=n(c[t],3),l=a[0],u=a[1],m=a[2];d.fillStyle=o[+l.toString()[0]],d.fillRect(u,m,2,2),t++}return r?void console.log("drawing all done"):void window.requestAnimationFrame(g)};window.requestAnimationFrame(m)}),require.register("___globals___",function(e,r,t){})}(),require("___globals___");