(this.webpackJsonpSpotifyAlbumRater=this.webpackJsonpSpotifyAlbumRater||[]).push([[0],{21:function(e,t,a){e.exports=a(40)},26:function(e,t,a){},27:function(e,t,a){},40:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(12),o=a.n(c),l=(a(26),a(27),a(6)),i=a.n(l),s=a(9),u=a(13),m=a(14),h=a(15),d=a(3),f=a(20),p=a(19),b=a(4),E=function(e){Object(f.a)(a,e);var t=Object(p.a)(a);function a(e){var n;return Object(m.a)(this,a),(n=t.call(this,e)).calculate=n.calculate.bind(Object(d.a)(n)),n}return Object(h.a)(a,[{key:"calculate",value:function(){var e=Object(u.a)(i.a.mark((function e(){var t,a,n,r,c,o,l,u,m,h,d,f,p,b,E,v,g,y,k,w,j,x,A,S,B,R,O;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t="https://dev-06brcesa.us.auth0.com/api/v2/users/",a="https://api.spotify.com/v1/search?",n="https://api.spotify.com/v1/me/tracks/?",r=this.props.auth0,c=r.user,o=r.getAccessTokenSilently,document.getElementById("calculatedScore").innerHTML="Loading rating...",e.next=7,o();case 7:return l=e.sent,e.next=10,fetch("".concat(t).concat(c.sub),{headers:{Authorization:"Bearer ".concat(l)}});case 10:return e.next=12,e.sent.json();case 12:return u=e.sent,m={q:"".concat(document.getElementById("album").value," ").concat(document.getElementById("artist").value),type:"album",limit:1},e.next=16,fetch("".concat(a).concat(new URLSearchParams(m)),{headers:{Authorization:"Bearer ".concat(u.accessToken)}});case 16:return e.next=18,e.sent.json();case 18:h=e.sent,d=h.albums.items[0],f=0,p=[],b={};case 23:return E={limit:50,offset:50*f},e.next=26,fetch("".concat(n).concat(new URLSearchParams(E)),{headers:{Authorization:"Bearer ".concat(u.accessToken)}});case 26:return e.next=28,e.sent.json();case 28:0!==(b=e.sent).items.length&&(p[f]=b),f++;case 31:if(0!==b.items.length){e.next=23;break}case 32:v=0,g=0,y=p;case 34:if(!(g<y.length)){e.next=50;break}k=y[g],w=Object(s.a)(k.items);try{for(w.s();!(j=w.n()).done;)(x=j.value).track.album.name===d.name&&(v=v+=x.track.duration_ms)}catch(i){w.e(i)}finally{w.f()}return e.next=40,fetch("https://api.spotify.com/v1/albums/".concat(d.id,"/tracks"),{headers:{Authorization:"Bearer ".concat(u.accessToken)}});case 40:return e.next=42,e.sent.json();case 42:A=e.sent,S=0,B=Object(s.a)(A.items);try{for(B.s();!(R=B.n()).done;)O=R.value,S=S+=O.duration_ms}catch(i){B.e(i)}finally{B.f()}isNaN(Math.round(v/S))?document.getElementById("calculatedScore").innerHTML="":document.getElementById("calculatedScore").innerHTML="Album rating: ".concat(Math.round(v/S*10)/2," out of 5");case 47:g++,e.next=34;break;case 50:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.props.auth0,t=e.isAuthenticated,a=e.logout,n=e.loginWithRedirect;return r.a.createElement("div",null,t?r.a.createElement("div",null,r.a.createElement("div",{style:{float:"left"}},r.a.createElement("label",{htmlFor:"artistname"},"Artist: "),r.a.createElement("input",{type:"text",id:"artist",name:"artistname"})),r.a.createElement("button",{style:{float:"right"},onClick:function(){return a({returnTo:window.location.origin+window.location.pathname})}},"Logout"),r.a.createElement("br",null),r.a.createElement("div",{style:{float:"left"}},r.a.createElement("label",{htmlFor:"albumname"},"Album: "),r.a.createElement("input",{type:"text",id:"album",name:"albumname"})),r.a.createElement("br",null),r.a.createElement("button",{onClick:this.calculate},"Calculate!"),r.a.createElement("h3",{id:"calculatedScore"})):r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){return n()}},"Login")))}}]),a}(r.a.Component),v=Object(b.b)(E);var g=function(){return r.a.createElement("div",null,r.a.createElement("h1",null,"Album Rater"),r.a.createElement("hr",null),r.a.createElement(v,null),r.a.createElement("hr",null),r.a.createElement("p",null,"Made by ",r.a.createElement("a",{href:"http://matthewjenkins97.github.io"},"Matthew R. Jenkins")," in 2021. Application uses ",r.a.createElement("a",{href:"https://reactjs.org/"},"React")," and CSS from ",r.a.createElement("a",{href:"http://bettermotherfuckingwebsite.com/"},"bettermotherfuckingwebsite.com"),"."),r.a.createElement("p",null,"Note that this is still in development! If you encounter any bugs feel free to report them on my ",r.a.createElement("a",{href:"https://github.com/matthewjenkins97/SpotifyAlbumRater/issues"},"github page"),"."))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var y=a(18);o.a.render(r.a.createElement(y.a,{basename:"/SpotifyAlbumRater"},r.a.createElement(b.a,{domain:"dev-06brcesa.us.auth0.com",clientId:"aExrjSgZXrCRZAcUVZ9Ol6w2P3nBkrue",redirectUri:window.location.origin+window.location.pathname,audience:"https://dev-06brcesa.us.auth0.com/api/v2/",scope:"read:current_user read:user_idp_tokens"},r.a.createElement(g,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[21,1,2]]]);
//# sourceMappingURL=main.446fac52.chunk.js.map