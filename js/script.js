function loadPage(){"function"==typeof pageCleanup&&(pageCleanup(),pageCleanup=null),removeAllTooltips();let t=getURLParams();if(null!=t){for(let e=0;e<pages.length;e++)if(t.hasOwnProperty(pages[e]))return void $("#content").load(`pages/${pages[e]}.html`)}else $("#content").load("pages/categories.html")}function removeAllTooltips(){$(".tippy-popper").remove()}function setSearchFormVals(t,e,a,r,n){$("#category-input").val(t),$("#contributor-input").val(e),$("#id-input").val(a),$("#size-input").val(r),$("#color-picker-toggle").prop("checked",null!=n).change(),null!=n&&$.farbtastic("#color-picker").setColor(n)}function goToPage(t,e){if("function"==typeof pageCleanup&&(pageCleanup(),pageCleanup=null),"root"==t)history.pushState(null,"","/stash/"),$("#content").empty().append('<div class="hint">Loading...</div>').load("pages/categories.html",()=>{removeAllTooltips(),setSearchFormVals(),window.scrollTo(0,0)});else if(t.match(/^\?/)){let e=getURLParams(t),a=null;for(let t=0;t<pages.length;t++)if(e.hasOwnProperty(pages[t])){a=pages[t];break}history.pushState(null,"",t),$("#content").empty().append('<div class="hint">Loading...</div>').load(`pages/${a}.html`,()=>{removeAllTooltips(),e.search||setSearchFormVals(),window.scrollTo(0,0)})}else{let e={};e[t]=!0,history.pushState(null,"",toURLParams(e)),$("#content").empty().append('<div class="hint">Loading...</div>').load(`pages/${t}.html`,()=>{removeAllTooltips(),setSearchFormVals(),window.scrollTo(0,0)})}null!=e&&e.preventDefault()}function getURLParams(t=location.search){if(t.length<2)return null;let e,a=/(?:^\?|&)([A-z0-9]+)(?:=([^&]+)|(?=&)|$)/g,r={};for(;e=a.exec(t);)r[e[1]]=!e[2]||decodeURIComponent(e[2].replace(/\+/g,"%20"));return r}function toURLParams(t){let e=[];for(let a in t)if(t.hasOwnProperty(a)&&null!=t[a])if(!0===t[a])e.push(`${0==e.length?"?":"&"}${a}`);else{let r=encodeURIComponent(t[a]).replace(/%3A/g,":").replace(/%3B/g,";").replace(/%20/g,"+").replace(/%2C/g,",");e.push(`${0==e.length?"?":"&"}${a}=${r}`)}return e.join("")}function decodeQuery(){let t=getURLParams().search;if(null==t)return;let e=t.split(";"),a={};for(let t=0;t<e.length;t++){let r=e[t].split(":");a[longform[r[0]]]=r[1]}return a}function toSearchURLParams(t){let e=[];for(let a in t)t.hasOwnProperty(a)&&null!=t[a]&&t[a].length>0&&e.push(`${abbr[a]}:${t[a]}`);return toURLParams({search:e.join(";")})}function formatNum(t,e){let a=t;if("undefined"!=typeof Intl&&void 0!==Intl.NumberFormat&&(a=(new Intl.NumberFormat).format(t)),!e)return a;let r=t%10,n=t%100;return 1==r&&11!=n?a+"st":2==r&&12!=n?a+"nd":3==r&&13!=n?a+"rd":a+"th"}function naturalSorter(t,e){var a,r,n,o,i,s,l=0,c=/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;if(t===e)return 0;for(a=t.toLowerCase().match(c),r=e.toLowerCase().match(c),s=a.length;l<s;){if(!r[l])return 1;if(n=a[l],o=r[l++],n!==o)return i=n-o,isNaN(i)?n>o?1:-1:i}return r[l]?-1:0}function bestMatchSort(t){return(e,a)=>{let r=t.val().toLowerCase(),n=e.toLowerCase().indexOf(r)-a.toLowerCase().indexOf(r);if(0!=n)return n;let o=new RegExp(r,"gi");return a.match(o).length-e.match(o).length}}function idSort(t,e){return getID(t)-getID(e)}function lerp(t,e,a){return e*a+t*(1-a)}function getApproxTime(t){if(t>legacyTimeData[legacyTimeData.length-1].id)return-1;for(let e=0;e<legacyTimeData.length;e++)if(t>legacyTimeData[e].id&&t<=legacyTimeData[e+1].id)return lerp(legacyTimeData[e].time,legacyTimeData[e+1].time,(t-legacyTimeData[e].id)/(legacyTimeData[e+1].id-legacyTimeData[e].id));return-1}function formatDate(t){let e=new Date(1e3*t);return months[e.getMonth()]+" "+e.getDate()+", "+e.getFullYear()}function getCategory(t){return rgxCategory.exec(t)[1]}function getContributor(t){return rgxContributor.exec(t)[1]}function getID(t){return rgxID.exec(t)[1]}function categoryFilter(t){let e=new RegExp(`^${t}/`);return t=>t.match(e)}function contributorFilter(t){let e=new RegExp(`/${t}_[0-9]+$`);return t=>t.match(e)}function stringToIDList(t){if(null==t)return null;if(0==t.length)return null;let e=[],a=t.split(",");for(let t=0;t<a.length;t++){let r=a[t];if(~r.indexOf("-")){let t=r.split("-");e.push({min:parseInt(t[0]),max:parseInt(t[1])})}else e.push({min:parseInt(r),max:parseInt(r)})}return e}function idMatches(t,e){for(let a=0;a<e.length;a++)if(t>=e[a].min&&t<=e[a].max)return!0;return!1}function idFilter(t){return e=>{let a=e.split("_");return idMatches(a[a.length-1],t)}}function stringToSize(t){if(null==t)return null;if(!(t=t.trim()).match(rgxSize))return null;let e=rgxSize.exec(t);return{o:e[1],v:[parseInt(e[2]),parseInt(e[4]||e[2])]}}function sizeFilter(t){return"="==t.o||null==t.o?e=>stash.data[e].S[0]==t.v[0]&&stash.data[e].S[1]==t.v[1]:"<"==t.o?e=>stash.data[e].S[0]<t.v[0]&&stash.data[e].S[1]<t.v[1]:">"==t.o?e=>stash.data[e].S[0]>t.v[0]&&stash.data[e].S[1]>t.v[1]:"<="==t.o?e=>stash.data[e].S[0]<=t.v[0]&&stash.data[e].S[1]<=t.v[1]:">="==t.o?e=>stash.data[e].S[0]>=t.v[0]&&stash.data[e].S[1]>=t.v[1]:void 0}function hexToRgb(t){t=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(t,e,a,r)=>e+e+a+a+r+r);var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]:null}function rgbToLab(t){var e,a,r,n=t[0]/255,o=t[1]/255,i=t[2]/255;return n=n>.04045?Math.pow((n+.055)/1.055,2.4):n/12.92,o=o>.04045?Math.pow((o+.055)/1.055,2.4):o/12.92,i=i>.04045?Math.pow((i+.055)/1.055,2.4):i/12.92,e=(.4124*n+.3576*o+.1805*i)/.95047,a=(.2126*n+.7152*o+.0722*i)/1,r=(.0193*n+.1192*o+.9505*i)/1.08883,e=e>.008856?Math.pow(e,1/3):7.787*e+16/116,a=a>.008856?Math.pow(a,1/3):7.787*a+16/116,r=r>.008856?Math.pow(r,1/3):7.787*r+16/116,[116*a-16,500*(e-a),200*(a-r)]}function deltaE(t,e){var a=t[0]-e[0],r=t[1]-e[1],n=t[2]-e[2],o=Math.sqrt(t[1]*t[1]+t[2]*t[2]),i=o-Math.sqrt(e[1]*e[1]+e[2]*e[2]),s=r*r+n*n-i*i,l=a/1,c=i/(1+.045*o),p=(s=s<0?0:Math.sqrt(s))/(1+.015*o),u=l*l+c*c+p*p;return u<0?0:Math.sqrt(u)}function filterResultsByColor(){if(0==$("#content .result").length)return;let t=$.farbtastic("#color-picker"),e=rgbToLab(hexToRgb(t.color)),a=0,r=0,n=$("#results-count").text("Results: 0"),o=$("#content").find(".result");o.each((i,s)=>{let l=stash.data[$(s).attr("data-file")].P;for(let i in l)if(l.hasOwnProperty(i)&&l[i]){if(t.hsl[1]<.5&&~i.indexOf("V"))continue;if(t.hsl[1]>=.5&&~i.indexOf("M"))continue;if(deltaE(e,rgbToLab(l[i]))<=16)return $(s).show(),a++,r++,n.text(`Results: ${a}`),void(r==o.length&&updateResultGroupVisibility())}$(s).hide(),++r==o.length&&updateResultGroupVisibility()})}function createFilePreview(t,e){let a=`${stashURL}${t}.png`,r=stash.data[t].S;return e.attr("data-file",t).addClass("file"),r[1]/r[0]>6&&r[1]%r[0]==0?e.append($("<img>",{class:"animated b-lazy",src:"/stash/resources/transparent.png"}).attr("data-src",a).attr("data-width",128).attr("data-height",128)).append($("<div>",{class:`img b-lazy thumbnail${r[0]<128?" pixelated":""}`}).attr("data-src",`${thumbnails}${t}.png`).append($("<div>",{class:"spinner-container"}).append($("<div>",{class:"spinner"})))):((r[0]>128||r[1]>128)&&(a=`${thumbnails}${t}.png`),e.append($("<div>",{class:`img b-lazy${r[0]<128&&r[1]<128?" pixelated":""}`}).attr("data-src",a).append($("<div>",{class:"spinner-container"}).append($("<div>",{class:"spinner"}))))),e.append($("<a>",{class:"download-image-button",download:t.split("/")[1],title:"Download",href:`${stashURL}${t}.png`}).on("click",t=>{t.stopPropagation()}).on("contextmenu",t=>{t.stopPropagation()})),tippy(e.find(".download-image-button")[0],{arrow:!0,animation:"perspective",performance:!0}),e.append($("<div>",{class:"fullscreen-button",title:"Fullscreen"}).on("click",e=>{$("#fullscreen-cover").removeClass("hidden"),$("#fullscreen-cover>.img").removeClass("b-loaded b-error").attr("style","").attr("data-src",`${stashURL}${t}.png`).append($("<div>",{class:"spinner-container"}).append($("<div>",{class:"spinner"}))),e.stopPropagation()})),tippy(e.find(".fullscreen-button")[0],{arrow:!0,animation:"perspective",performance:!0}),e}function updateResultGroupVisibility(){$("#content>.group").each((t,e)=>{$(e).show(),0==$(e).children(".result:visible").length&&$(e).hide()})}function updateResultGroups(){let t=$("#sorting-options .group").val(),e=$("#sorting-options .sort-prop").val(),a=$("#sorting-options .sort-order").val();$("#content").find(".group>.result").detach().appendTo($("#content")),$("#content>.group").remove(),"none"!=t&&$("#content").children(".result").each((e,a)=>{let r=$(a).attr("data-file");if("category"==t){let t=getCategory(r),e=$(`#content .group[data-group="${t}"]`);0==e.length&&((e=$("<div>",{class:"group"}).append($("<h3>",{text:t}))).attr("data-group",t),$("#content").append(e)),$(a).detach().appendTo(e)}else if("contributor"==t){let t=getContributor(r),e=$(`#content .group[data-group="${t}"]`);0==e.length&&((e=$("<div>",{class:"group"}).append($("<h3>",{text:t}))).attr("data-group",t),$("#content").append(e)),$(a).detach().appendTo(e)}else if("year"==t){let t=new Date(1e3*(stash.data[r].T||getApproxTime(getID(r)))).getFullYear(),e=$(`#content .group[data-group="${t}"]`);0==e.length&&((e=$("<div>",{class:"group"}).append($("<h3>",{text:t}))).attr("data-group",t),$("#content").append(e)),$(a).detach().appendTo(e)}else if("size"==t){let t=stash.data[r].S,e=t[1]>6*t[0]?"Animation Strips":t.join("x"),n=$(`#content .group[data-group="${e}"]`);0==n.length&&((n=$("<div>",{class:"group"}).append($("<h3>",{text:e}))).attr("data-group",e),$("#content").append(n)),$(a).detach().appendTo(n)}});let r=t=>{let r=t.children(".result").toArray().sort((t,a)=>{let r=$(t).attr("data-file"),n=$(a).attr("data-file");if("category"==e){let t=naturalSorter(getCategory(r),getCategory(n));return 0!=t?t:naturalSorter(r,n)}if("contributor"==e){let t=naturalSorter(getContributor(r),getContributor(n));return 0!=t?t:naturalSorter(r,n)}if("id"==e)return idSort(r,n);if("size"==e){let t=stash.data[r].S,e=stash.data[n].S,a=t[0]*t[1]-e[0]*e[1];return 0!=a?a:naturalSorter(r,n)}});"des"==a&&r.reverse(),t.append(r)};if("none"!=t){let e=$("#content").children(".group").toArray().sort((e,a)=>{let r=$(e).children("h3").text(),n=$(a).children("h3").text();if("size"==t){if("Animation Strips"==r)return-1;if("Animation Strips"==n)return 1;let t=r.split("x").map(t=>parseInt(t)),e=n.split("x").map(t=>parseInt(t));return t[0]*t[1]-e[0]*e[1]}return naturalSorter(r,n)});"des"==a&&e.reverse(),$("#content").append(e),$("#content").children(".group").each((t,e)=>{r($(e))})}else r($("#content"));updateResultGroupVisibility()}function searchWithForm(){$(":focus").blur();let t=$("#category-input").val(),e=$("#contributor-input").val(),a=$("#id-input").val(),r=$("#size-input").val();if(t+e+a+r=="")return;goToPage(toSearchURLParams({category:t,contributor:e,id:a,size:r,color:$("#color-picker-toggle").is(":checked")?$("#color-picker-input").val().substr(1):null}))}const stashURL="https://bytebucket.org/CCCode/dokustash/raw/master/",thumbnails="/stash/resources/thumbnails/",cors="https://cors-anywhere.herokuapp.com/",pages=["search","about","contributors","profile","details","submit","login"],abbr={category:"ca",contributor:"co",id:"id",size:"si",color:"cl"},longform={ca:"category",co:"contributor",id:"id",si:"size",cl:"color"},months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],opTime=1312035589,legacyTimeData=[{time:1312051806,id:0},{time:1314221974,id:1e3},{time:1317388666,id:2e3},{time:1319090950,id:3e3},{time:1323408627,id:4e3},{time:1327695347,id:5e3},{time:1332070004,id:6e3},{time:1335737826,id:7e3},{time:1339451376,id:8e3},{time:1346105014,id:9e3},{time:1354211287,id:1e4},{time:1361130865,id:11e3},{time:1366174956,id:12e3},{time:1368929856,id:13e3},{time:1372727962,id:14e3},{time:1378402172,id:15e3},{time:1389405209,id:16e3},{time:1402541195,id:17e3},{time:1414832158,id:18e3},{time:1451429522,id:19e3},{time:1460483638,id:19160},{time:1460536130,id:19348},{time:1463713609,id:19398},{time:1464735265,id:19404},{time:1465704958,id:19415},{time:1469905303,id:19433},{time:1470202364,id:19444},{time:1478645533,id:19693},{time:1500235159,id:20122},{time:1512422195,id:20145}],rgxSize=/^\s*([<>]?=|[<>])?\s*(\d+)(\s*x\s*(\d+))?\s*$/,rgxCategory=/^(.+)\/.+_\d+/,rgxContributor=/\/(.+)_\d+/,rgxID=/\/.+_(\d+)/,bLazy=new Blazy({success:t=>{if($(t).is("img.animated")&&0==$(t).siblings(".mc-animation").length){let e=new MCAnimation(t.src);e.canvas.width=$(t).attr("data-width"),e.canvas.height=$(t).attr("data-height"),$(t).hide().after(e.canvas),$(t).siblings(".thumbnail").remove()}else setTimeout(()=>{$(t).find(".spinner-container").remove(),$(".spinner-container").css("display","none").slice(0,10).css("display","flex")},100)}});var stash={},pageCleanup=null;window.addEventListener("popstate",loadPage),$(()=>{$.getJSON("/stash/data.json",t=>{stash.data=t,stash.categories=[],stash.contributors=[],stash.cache={},stash.files={all:[],category:{}};for(let t in stash.data)if(stash.data.hasOwnProperty(t)&&stash.data[t]){~stash.files.all.indexOf(t)||stash.files.all.push(t);let e=t.split("/")[0];~stash.categories.indexOf(e)||stash.categories.push(e);let a=t.split("/")[1].split("_").slice(0,-1).join("_");~stash.contributors.indexOf(a)||stash.contributors.push(a)}for(var e=0;e<stash.categories.length;e++)stash.files.category[stash.categories[e]]=stash.files.all.filter(categoryFilter(stash.categories[e]));stash.categories.sort(naturalSorter),stash.contributors.sort(naturalSorter),new Awesomplete($("#category-input")[0],{list:stash.categories,autoFirst:!0,minChars:1,sort:bestMatchSort($("#category-input"))}),new Awesomplete($("#contributor-input")[0],{list:stash.contributors,autoFirst:!0,sort:bestMatchSort($("#contributor-input"))}),$("body").removeClass("preload"),loadPage()}),$(".menu-title").on("mouseenter",t=>{let e=$(t.currentTarget).find(".menu").addClass("title-hover"),a=e[0].getBoundingClientRect(),r=document.documentElement.clientWidth;a.right>r&&e.addClass("oob")}),$(".menu-title").on("mouseleave",t=>{$(t.currentTarget).find(".menu").removeClass("title-hover")}),$("#color-picker").farbtastic({callback:"#color-picker-input",width:200,onStop:filterResultsByColor}),$("#color-picker-toggle").on("change",t=>{$("#color-picker-toggle").is(":checked")?filterResultsByColor():($("#content").find(".result,.group").show(),0==$("#content>.result,#content>.group>.result").length?$("#results-count").text(""):$("#results-count").text("Results: "+$("#content").find(".result").length))}),$("#color-picker-input").on("change",t=>{$("#content .result").length<500&&filterResultsByColor()}),$('#search-form>.checkbox>input[type="checkbox"]').each((t,e)=>{$(e).on("change",t=>{$(e).is(":checked")?$(e).parent().next(".container").addClass("open"):$(e).parent().next(".container").removeClass("open")})}),$(".search-on-enter").on("keyup",t=>{13==t.which&&searchWithForm()}),$("#copy-link-button").on("click",t=>{$("#link-to-selected").select(),document.execCommand("Copy")}),$("#fullscreen-cover").on("click",t=>{$("#fullscreen-cover").addClass("hidden")}),$("body").on("keyup",t=>{27==t.which&&$("#fullscreen-cover").addClass("hidden")}),$(window).on("scroll",()=>{const t=document.querySelectorAll(".tippy-popper");for(const e of t){const t=e._reference._tippy;t.state.visible&&(t.popperInstance.disableEventListeners(),t.hide())}}),tippy(".tt",{placement:"right-start",arrow:!0,hideOnClick:!1,animation:"perspective",updateDuration:0,popperOptions:{modifiers:{preventOverflow:{enabled:!1}}}});let t=()=>{setTimeout(()=>{bLazy.revalidate(),t()},$("#results-count").attr("data-val")<1e3?500:2e3)};t()});