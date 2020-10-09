(this.webpackJsonpphonebook=this.webpackJsonpphonebook||[]).push([[0],{48:function(e,t,n){e.exports=n(76)},49:function(e,t,n){},76:function(e,t,n){"use strict";n.r(t);var a=n(42),r=n(22),s=n(11),c=(n(49),n(0)),u=n.n(c),o=n(21),l=n.n(o),i="http://localhost:3001/api/persons",m=function(){return l.a.get(i).then((function(e){return e.data}))},f=function(e){return l.a.post(i,e).then((function(e){return e.data}))},h=function(e,t){return l.a.put("".concat(i,"/").concat(e),t).then((function(e){return e.data}))},d=function(e){return l.a.delete("".concat(i,"/").concat(e)).then((function(e){return e.data}))},p=n(98),v=n(96),x=Object(v.a)((function(e){return{button:{margin:e.spacing(1)}}}));function b(e,t,n,a,r,s){var c=x();return u.a.createElement(p.a,{variant:e,type:t,color:n,className:c.button,startIcon:r,onClick:s},a)}var g=n(40),S=n.n(g),E=n(41),O=n.n(E),j=n(100),w=n(99),y=function(e){return u.a.createElement("span",null,b(e.variant,e.type,e.color,e.text,e.icon,e.handleClick))},R=function(e){return e.status?u.a.createElement(w.a,{variant:e.variant,severity:e.status},e.text):null},T=function(e){var t=Object(c.useState)({error:!1,message:""}),n=Object(s.a)(t,2),o=n[0],l=n[1],i=Object(c.useState)({error:!1,message:""}),m=Object(s.a)(i,2),d=m[0],p=m[1],v=Object(c.useState)(""),x=Object(s.a)(v,2),g=x[0],E=x[1],O=Object(c.useState)(""),w=Object(s.a)(O,2),y=w[0],R=w[1];function T(){var e=(new Date).getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(t){var n=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"===t?n:3&n|8).toString(16)}))}return u.a.createElement("form",null,u.a.createElement("div",null,u.a.createElement(j.a,{error:o.error,name:"Name",type:"text",value:g,placeholder:"name",onChange:function(e){l({error:!1,message:""}),E(e.target.value)}}),u.a.createElement("div",null,u.a.createElement("span",{className:"error"},o.message))),u.a.createElement("div",null,u.a.createElement(j.a,{error:d.error,name:"Number",type:"text",value:y,placeholder:"number",onChange:function(e){p({error:!1,message:""}),R(e.target.value)}}),u.a.createElement("div",null,u.a.createElement("span",{className:"error"},d.message))),u.a.createElement("div",null,b("contained","submit","primary","add",u.a.createElement(S.a,null),(function(t){var n=e.persons.filter((function(e){return e.name===g}));if(t.preventDefault(),function(){var e=!g,t=!e;l({error:!t,message:e?"Field is required":""});var n=!y,a=!n;return p({error:!a,message:n?"Field is required":""}),t&&a}())if(n.length>0&&window.confirm("".concat(g," is already added to phonebook, replace the old number with a new one?"))){var s=Object(a.a)({},n[0]);s.number=y,h(s.id,s).then((function(t){console.log("promise fulfilled",t),e.setStatus({variant:"filled",status:"success",text:"Succesfully updated ".concat(g)}),setTimeout((function(){e.setStatus({})}),5e3);var n=function(e,t){for(var n=Object(r.a)(e),a=0,s=n.length;a<s;a++)if(n[a].id===t.id){n[a]=t;break}return n}(e.persons,t);e.setPersons(n),e.setSearchResults(e.getSearchResults(n,e.searchTerm)),E(""),R("")})).catch((function(t){e.setStatus({variant:"filled",status:"error",text:"Oops something went wrong"}),setTimeout((function(){e.setStatus({})}),5e3)}))}else 0===n.length&&f({name:g,number:y,id:T()}).then((function(t){console.log("promise fulfilled",t),e.setStatus({variant:"filled",status:"success",text:"Succesfully added ".concat(g)}),setTimeout((function(){e.setStatus({})}),5e3);var n=Object(r.a)(e.persons).concat(t);e.setPersons(n),e.setSearchResults(e.getSearchResults(n,e.searchTerm)),E(""),R("")})).catch((function(t){e.setStatus({variant:"filled",status:"error",text:"Oops something went wrong"}),setTimeout((function(){e.setStatus({})}),5e3)}))}))))},k=function(e){return u.a.createElement("div",null,u.a.createElement(j.a,{name:"Search",value:e.searchTerm,type:"text",placeholder:"enter a searchterm",onInput:function(t){e.setSearchTerm(t.target.value);var n=e.getSearchResults(e.persons,t.target.value);e.setSearchResults(n)}}))},C=function(e){var t=function(t,n){window.confirm("Do you really want to delete ".concat(t))&&d(n).then((function(a){console.log("promise fulfilled",a),e.setStatus({variant:"filled",status:"success",text:"Succesfully deleted ".concat(t)}),setTimeout((function(){e.setStatus({})}),5e3);var s=function(e,t){for(var n=Object(r.a)(e),a=0,s=n.length;a<s;a++)if(n[a].id===t){n.splice(a);break}return n}(e.persons,n);e.setPersons(s),e.setSearchResults(e.getSearchResults(s,e.searchTerm))})).catch((function(t){e.setStatus({variant:"filled",status:"error",text:"Oops something went wrong"}),setTimeout((function(){e.setStatus({})}),5e3)}))};return u.a.createElement("div",null,e.searchResults.map((function(e){return u.a.createElement("li",{key:e.id},e.name," ",e.number," ",u.a.createElement(y,{variant:"contained",type:"button",color:"primary",text:"delete",icon:u.a.createElement(O.a,null),handleClick:function(){return t(e.name,e.id)}}))})))},P=function(){var e=Object(c.useState)([]),t=Object(s.a)(e,2),n=t[0],a=t[1],o=Object(c.useState)({}),l=Object(s.a)(o,2),i=l[0],f=l[1];Object(c.useEffect)((function(){m().then((function(e){console.log("promise fulfilled",e),f({variant:"filled",status:"success",text:"Succesfully retrieved phonebook"}),setTimeout((function(){f({})}),5e3),a(e),v(e)})).catch((function(e){f({variant:"filled",status:"error",text:"Oops something went wrong"}),setTimeout((function(){f({})}),5e3)}))}),[]);var h=Object(c.useState)(Object(r.a)(n)),d=Object(s.a)(h,2),p=d[0],v=d[1],x=function(e,t){return e.filter((function(e){return e.name.toLowerCase().startsWith(t.toLowerCase())}))},b=Object(c.useState)(""),g=Object(s.a)(b,2),S=g[0],E=g[1];return u.a.createElement("div",null,u.a.createElement("h2",null,"Phonebook"),u.a.createElement(k,{persons:n,setPersons:a,searchTerm:S,setSearchTerm:E,searchResults:p,setSearchResults:v,getSearchResults:x}),u.a.createElement("br",null),u.a.createElement(T,{persons:n,setPersons:a,searchTerm:S,searchResults:p,setSearchResults:v,getSearchResults:x,setStatus:f}),u.a.createElement("h2",null,"Numbers"),u.a.createElement(C,{searchResults:p,persons:n,setPersons:a,searchTerm:S,setSearchResults:v,getSearchResults:x,setStatus:f}),u.a.createElement(R,{variant:i.variant,status:i.status,text:i.text}))},N=n(13);n.n(N).a.render(u.a.createElement(P,null),document.getElementById("root"))}},[[48,1,2]]]);
//# sourceMappingURL=main.1184fa45.chunk.js.map