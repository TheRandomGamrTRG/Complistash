function loadPage(){removeAllTooltips(),$("#results-count").text("");let t=getURLParams();if(null!=t)if(null!=t.page&&~pages.indexOf(t.page)){let e=()=>{$("#content").load(`pages/${t.page}.html`)};dependencies.hasOwnProperty(t.page)?runWithDeps(dependencies[t.page],e):e()}else null==t.profile?null==t.details?null==t.category&&null==t.contributor&&null==t.id&&null==t.size||(setUserInput(t.category,t.contributor,t.id,t.size,t.color?"#"+t.color:null),search(t.category,t.contributor,stringToIDList(t.id),stringToSize(t.size),t.color?"#"+t.color:null)):showDetails(stash.files.all.filter(idFilter(stringToIDList(t.details)))[0]):showProfile(t.profile);else showCategories()}function removeAllTooltips(){$(".tippy-popper").remove()}function runWithDeps(t,e){let r=0;for(let a=0;a<t.length;a++)if(void 0===window[optionalLibs[t[a]].obj]){let n=document.createElement("script");n.onload=(()=>{++r==t.length&&"function"==typeof e&&e()}),n.src=optionalLibs[t[a]].src,document.head.appendChild(n)}else++r==t.length&&"function"==typeof e&&e()}function setUserInput(t,e,r,a,n){$("#category-input").val(t),$("#contributor-input").val(e),$("#id-input").val(r),$("#size-input").val(a),$("#color-picker-toggle").prop("checked",null!=n).change(),null!=n&&$.farbtastic("#color-picker").setColor(n)}function showCategories(){"function"==typeof pageCleanup&&(pageCleanup(),pageCleanup=null),$("#content").empty(),removeAllTooltips(),$("#results-count").text(""),setUserInput(),$("#sorting-options").addClass("hidden");for(let t=0;t<stash.categories.length;t++){let e=stash.categories[t],r=toURLParams({category:e}),a=$("<a>",{class:"category button",href:r});a.on("click",t=>{setUserInput(e),search(e),history.pushState(null,"",r),t.preventDefault()}),a.append($("<div>",{class:"img b-lazy"}).attr("data-src",`/stash/resources/category-icons/${e}.png`).append($("<div>",{class:"spinner-container"}).append($("<div>",{class:"spinner"})))),a.append($("<p>",{text:e})),a.attr("title",`<h3>${e}</h3><br>${stash.files.category[e].length} files`),tippy(a[0],{position:"right",arrow:!0,animation:"perspective"}),$("#content").append(a)}bLazy.revalidate(),window.scrollTo(0,0)}function showDetails(t,e){"function"==typeof pageCleanup&&(pageCleanup(),pageCleanup=null),$("#content").empty().append('<div class="hint">Loading...</div>').load("pages/details.html",()=>{removeAllTooltips(),$("#results-count").text(""),setUserInput(),$("#sorting-options").addClass("hidden");let r=$("#texture-preview").append($("<div>",{class:"img b-lazy"}).attr("data-src",`${stashURL}${t}.png`).append($("<div>",{class:"spinner-container"}).append($("<div>",{class:"spinner"}))));bLazy.revalidate();let a=stash.data[t].S;a[0]<128&&a[1]<128&&r.addClass("pixelated"),r.append($("<a>",{class:"download-image-button",download:t.split("/")[1],title:"Download",href:stashURL+t+".png"})),tippy(r[0].children[1],{arrow:!0,animation:"perspective"}),r.append($("<div>",{class:"fullscreen-button",title:"Fullscreen"}).on("click",e=>{$("#fullscreen-cover").removeClass("hidden").css("background-image",`url('${stashURL}${t}.png'), url(resources/transparent.png)`)})),tippy(r[0].children[2],{arrow:!0,animation:"perspective"});let n=getID(t),o=stash.data[t].T||getApproxTime(n),i=getContributor(t),s=getCategory(t);$(".contributor-name").text(i).attr("title",`Click to see all textures by ${i}`).attr("href",toURLParams({contributor:i})).on("click",t=>{setUserInput(null,i),search(null,i),history.pushState(null,"",toURLParams({contributor:i})),t.preventDefault()}),$(".file-id").text(n),$(".file-category").text(s).attr("title",`Click to see all textures in ${s}`).attr("href",toURLParams({category:s})).on("click",t=>{setUserInput(s),search(s),history.pushState(null,"",toURLParams({category:s})),t.preventDefault()}),$(".image-size").text(a.join("x")),$(".file-date").text(formatDate(o)),tippy("#content .info a",{position:"right",arrow:!0,animation:"perspective"});let l=stash.files.all.filter(contributorFilter(i)).sort(idSort),p=l.indexOf(t)+1,u=l.filter(categoryFilter(s)).indexOf(t)+1,c=stash.files.all.sort(idSort),d=c.indexOf(t)+1,h=c.filter(categoryFilter(s)).indexOf(t)+1;var g=o-opTime,f=Math.floor(g/86400);$("#misc-stats").append($("<p>",{text:`This is the ${formatNum(p,!0)} texture ${i} posted and the ${formatNum(u,!0)} texture by them in ${s}.`})).append($("<p>",{text:`It is the ${formatNum(d,!0)} texture added to DokuStash and the ${formatNum(h,!0)} texture added to ${s}.`})).append($("<p>",{text:`It was posted approximately ${formatNum(f)} days after the continuation project started.`})),window.scrollTo(0,0),"function"==typeof e&&e()})}function showProfile(t,e){"function"==typeof pageCleanup&&(pageCleanup(),pageCleanup=null);runWithDeps(["ChartJS"],()=>{$("#content").empty().append('<div class="hint">Loading...</div>').load("pages/profile.html",()=>{removeAllTooltips(),$("#results-count").text(""),setUserInput(),$("#sorting-options").addClass("hidden");let r=stash.files.all.filter(contributorFilter(t)),a={},n=1/0,o=-1/0,i={};for(let t=0;t<r.length;t++){let e=r[t],s=getCategory(e),l=getID(e),p=stash.data[e].T||getApproxTime(l);a[s]=(a[s]||0)+1,n=Math.min(n,p),o=Math.max(o,p);let u=new Date(1e3*p),c=u.getFullYear()+" Q"+Math.floor((u.getMonth()+3)/3);i[c]=(i[c]||0)+1}let s=stash.categories.filter(t=>null!=a[t]);s.sort((t,e)=>a[e]-a[t]),s=s.slice(0,5);let l=new Date(1e3*n),p=new Date(1e3*o),u=l.getFullYear(),c=p.getFullYear();for(let t=l.getFullYear();t<=c;t++){let e=t!=u?1:Math.floor((l.getMonth()+3)/3),r=t!=c?4:Math.floor((p.getMonth()+3)/3);for(let a=e;a<=r;a++)i[t+" Q"+a]=i[t+" Q"+a]||0}let d=[];for(quarter in i)i.hasOwnProperty(quarter)&&d.push(quarter);d.sort(naturalSorter),$(".contributor-name").text(t),$(".contributor-stats").append($("<p>",{text:`Number of contributions: ${r.length}`})).append($("<p>",{text:`First contribution: ${formatDate(n)}`,title:"This date is only an estimate based on IDs"}));for(let t=0;t<s.length;t++)s[t],$(".top-categories>tbody").append($("<tr>").append($("<td>",{text:s[t]})).append($("<td>",{text:a[s[t]]})).append($("<td>",{text:Math.floor(a[s[t]]/stash.files.category[s[t]].length*100+.5)+"%"})));let h={maintainAspectRatio:!1,legend:{display:!1},scales:{xAxes:[{id:"xAxis1",gridLines:{display:!1},ticks:{callback:t=>t.split(" ")[1]}},{id:"xAxis2",gridLines:{display:!1},ticks:{callback:t=>~t.indexOf("Q1")||0==d.indexOf(t)?t.split(" ")[0]:""}}],yAxes:[{gridLines:{color:"#333"},ticks:{beginAtZero:!0}}]},tooltips:{bodyFontSize:16,footerFontSize:0,callbacks:{label:t=>"    "+t.yLabel,title:()=>"",footer:()=>" "},custom:t=>{t&&(t.displayColors=!1)}}};new Chart("activity-total-contributions",{type:"line",options:$.extend({},h,{title:{display:!0,text:"Total number of contributions"}}),data:{labels:d,datasets:[{data:d.map(t=>i[t]).reduce((t,e)=>(t.push((t.length&&t[t.length-1]||0)+e),t),[]),xAxisID:"xAxis1",backgroundColor:"rgba(85, 136, 255, 0.2)",borderColor:"#58f",pointHoverBorderColor:"#fff",borderWidth:2,pointRadius:5,lineTension:0}]}}),new Chart("activity-per-year-contributions",{type:"line",options:$.extend({},h,{title:{display:!0,text:"Number of contributions per quarter"}}),data:{labels:d,datasets:[{data:d.map(t=>i[t]),xAxisID:"xAxis1",backgroundColor:"rgba(85, 136, 255, 0.2)",borderColor:"#58f",pointHoverBorderColor:"#fff",borderWidth:2,pointRadius:5,lineTension:0}]}}),tippy(".top-categories th",{arrow:!0,animation:"perspective"}),tippy(".contributor-stats>*",{position:"right",arrow:!0,animation:"perspective"}),window.scrollTo(0,0),"function"==typeof e&&e()})})}function goToPage(t,e){if("function"==typeof pageCleanup&&(pageCleanup(),pageCleanup=null),"root"==t)removeAllTooltips(),$("#results-count").text(""),setUserInput(),$("#sorting-options").addClass("hidden"),showCategories(),history.pushState(null,"","/stash/");else{let e=()=>{$("#content").empty().append('<div class="hint">Loading...</div>').load(`pages/${t}.html`,()=>{removeAllTooltips(),$("#results-count").text(""),setUserInput(),$("#sorting-options").addClass("hidden"),history.pushState(null,"",toURLParams({page:t})),window.scrollTo(0,0)})};dependencies.hasOwnProperty(t)?runWithDeps(dependencies[t],e):e()}null!=e&&e.preventDefault()}function getURLParams(){if(location.search.length<4)return null;let t,e=/[?&]([A-z0-9]+)=([^&]+)/g,r={};for(;t=e.exec(location.search);)r[t[1]]=decodeURIComponent(t[2].replace(/\+/g,"%20"));return r}function toURLParams(t){let e=[];for(let r in t)t.hasOwnProperty(r)&&null!=t[r]&&t[r].length>0&&e.push(`${0==e.length?"?":"&"}${r}=${encodeURIComponent(t[r]).replace(/%20/g,"+")}`);return e.join("")}function formatNum(t,e){let r=t;if("undefined"!=typeof Intl&&void 0!==Intl.NumberFormat&&(r=(new Intl.NumberFormat).format(t)),!e)return r;let a=t%10,n=t%100;return 1==a&&11!=n?r+"st":2==a&&12!=n?r+"nd":3==a&&13!=n?r+"rd":r+"th"}function naturalSorter(t,e){var r,a,n,o,i,s,l=0,p=/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;if(t===e)return 0;for(r=t.toLowerCase().match(p),a=e.toLowerCase().match(p),s=r.length;l<s;){if(!a[l])return 1;if(n=r[l],o=a[l++],n!==o)return i=n-o,isNaN(i)?n>o?1:-1:i}return a[l]?-1:0}function bestMatchSort(t){return(e,r)=>{let a=t.val().toLowerCase(),n=e.toLowerCase().indexOf(a)-r.toLowerCase().indexOf(a);if(0!=n)return n;let o=new RegExp(a,"gi");return r.match(o).length-e.match(o).length}}function idSort(t,e){return getID(t)-getID(e)}function lerp(t,e,r){return e*r+t*(1-r)}function getApproxTime(t){if(t>legacyTimeData[legacyTimeData.length-1].id)return-1;for(let e=0;e<legacyTimeData.length;e++)if(t>legacyTimeData[e].id&&t<=legacyTimeData[e+1].id)return lerp(legacyTimeData[e].time,legacyTimeData[e+1].time,(t-legacyTimeData[e].id)/(legacyTimeData[e+1].id-legacyTimeData[e].id));return-1}function formatDate(t){let e=new Date(1e3*t);return months[e.getMonth()]+" "+e.getDate()+", "+e.getFullYear()}function getCategory(t){return rgxCategory.exec(t)[1]}function getContributor(t){return rgxContributor.exec(t)[1]}function getID(t){return rgxID.exec(t)[1]}function categoryFilter(t){let e=new RegExp(`^${t}/`);return t=>t.match(e)}function contributorFilter(t){let e=new RegExp(`/${t}_[0-9]+$`);return t=>t.match(e)}function stringToIDList(t){if(null==t)return null;if(0==t.length)return null;let e=[],r=t.split(",");for(let t=0;t<r.length;t++){let a=r[t];if(~a.indexOf("-")){let t=a.split("-");e.push({min:parseInt(t[0]),max:parseInt(t[1])})}else e.push({min:parseInt(a),max:parseInt(a)})}return e}function idMatches(t,e){for(let r=0;r<e.length;r++)if(t>=e[r].min&&t<=e[r].max)return!0;return!1}function idFilter(t){return e=>{let r=e.split("_");return idMatches(r[r.length-1],t)}}function stringToSize(t){if(null==t)return null;if(!(t=t.trim()).match(rgxSize))return null;let e=rgxSize.exec(t);return{o:e[1],v:[parseInt(e[2]),parseInt(e[4]||e[2])]}}function sizeFilter(t){return"="==t.o||null==t.o?e=>stash.data[e].S[0]==t.v[0]&&stash.data[e].S[1]==t.v[1]:"<"==t.o?e=>stash.data[e].S[0]<t.v[0]&&stash.data[e].S[1]<t.v[1]:">"==t.o?e=>stash.data[e].S[0]>t.v[0]&&stash.data[e].S[1]>t.v[1]:"<="==t.o?e=>stash.data[e].S[0]<=t.v[0]&&stash.data[e].S[1]<=t.v[1]:">="==t.o?e=>stash.data[e].S[0]>=t.v[0]&&stash.data[e].S[1]>=t.v[1]:void 0}function hexToRgb(t){t=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(t,e,r,a)=>e+e+r+r+a+a);var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]:null}function rgbToLab(t){var e,r,a,n=t[0]/255,o=t[1]/255,i=t[2]/255;return n=n>.04045?Math.pow((n+.055)/1.055,2.4):n/12.92,o=o>.04045?Math.pow((o+.055)/1.055,2.4):o/12.92,i=i>.04045?Math.pow((i+.055)/1.055,2.4):i/12.92,e=(.4124*n+.3576*o+.1805*i)/.95047,r=(.2126*n+.7152*o+.0722*i)/1,a=(.0193*n+.1192*o+.9505*i)/1.08883,e=e>.008856?Math.pow(e,1/3):7.787*e+16/116,r=r>.008856?Math.pow(r,1/3):7.787*r+16/116,a=a>.008856?Math.pow(a,1/3):7.787*a+16/116,[116*r-16,500*(e-r),200*(r-a)]}function deltaE(t,e){var r=t[0]-e[0],a=t[1]-e[1],n=t[2]-e[2],o=Math.sqrt(t[1]*t[1]+t[2]*t[2]),i=o-Math.sqrt(e[1]*e[1]+e[2]*e[2]),s=a*a+n*n-i*i,l=r/1,p=i/(1+.045*o),u=(s=s<0?0:Math.sqrt(s))/(1+.015*o),c=l*l+p*p+u*u;return c<0?0:Math.sqrt(c)}function filterResultsByColor(){if(0==$("#content>.result,#content>.group>.result").length)return;let t=$.farbtastic("#color-picker"),e=rgbToLab(hexToRgb(t.color)),r=0,a=0,n=$("#results-count").text("Results: 0"),o=$("#content").find(".result");o.each((i,s)=>{let l=stash.data[$(s).attr("data-file")].P;for(let i in l)if(l.hasOwnProperty(i)&&l[i]){if(t.hsl[1]<.5&&~i.indexOf("V"))continue;if(t.hsl[1]>=.5&&~i.indexOf("M"))continue;if(deltaE(e,rgbToLab(l[i]))<=16)return $(s).show(),r++,a++,n.text(`Results: ${r}`),void(a==o.length&&updateResultGroupVisibility())}$(s).hide(),++a==o.length&&updateResultGroupVisibility()})}function showResults(t){if($("#content").empty(),0==t.length)return $("#content").append($("<div>",{class:"hint",text:"No results"})),void $("#results-count").text("");$("#content").append($("<div>",{class:"fill"})),$("#results-count").text(`Results: ${t.length}`);for(let e=0;e<t.length;e++){let r=t[e],a="result",n=`${stashURL}${r}.png`,o=stash.data[r].S;o[0]<128&&o[1]<128?a+=" pixelated":(o[0]>128||o[1]>128)&&(n=`${thumbnails}${r}.png`);let i=$("<div>",{class:a}).append($("<div>",{class:"img b-lazy"}).attr("data-src",n).append($("<div>",{class:"spinner-container"}).append($("<div>",{class:"spinner"}))));i.attr("data-file",r),i.on("click",t=>{showDetails(r,()=>{history.pushState(null,"",toURLParams({details:getID(r)}))})}),i.append($("<a>",{class:"download-image-button",download:r.split("/")[1],title:"Download",href:stashURL+r+".png"}).on("click",t=>{t.stopPropagation()})),tippy(i[0].children[1],{arrow:!0,animation:"perspective"}),i.append($("<div>",{class:"fullscreen-button",title:"Fullscreen"}).on("click",t=>{$("#fullscreen-cover").removeClass("hidden").css("background-image",`url('${stashURL}${r}.png'), url(resources/transparent.png)`),t.stopPropagation()})),tippy(i[0].children[2],{arrow:!0,animation:"perspective"});let s=getID(r);i.attr("title",`<h3>${getContributor(r)} #${s}</h3><br>Size: ${o[0]}x${o[1]}<br>Date: ${formatDate(stash.data[r].T||getApproxTime(s))}<br><br><i>${getCategory(r)}</i>`),tippy(i[0],{position:"right",arrow:!0,animation:"perspective"}),$("#content").append(i)}bLazy.revalidate(),$("#sorting-options").removeClass("hidden"),updateResultGroups()}function updateResultGroupVisibility(){$("#content>.group").each((t,e)=>{$(e).show(),0==$(e).children(".result:visible").length&&$(e).hide()}),bLazy.revalidate()}function updateResultGroups(){let t=$("#sorting-options .group").val(),e=$("#sorting-options .sort-prop").val(),r=$("#sorting-options .sort-order").val();$("#content").find(".group>.result").detach().appendTo($("#content")),$("#content>.group").remove(),"none"!=t&&$("#content").children(".result").each((e,r)=>{let a=$(r).attr("data-file");if("category"==t){let t=getCategory(a),e=$(`#content .group[data-group="${t}"]`);0==e.length&&((e=$("<div>",{class:"group"}).append($("<h3>",{text:t}))).attr("data-group",t),$("#content").append(e)),$(r).detach().appendTo(e)}else if("contributor"==t){let t=getContributor(a),e=$(`#content .group[data-group="${t}"]`);0==e.length&&((e=$("<div>",{class:"group"}).append($("<h3>",{text:t}))).attr("data-group",t),$("#content").append(e)),$(r).detach().appendTo(e)}else if("year"==t){let t=new Date(1e3*(stash.data[a].T||getApproxTime(getID(a)))).getFullYear(),e=$(`#content .group[data-group="${t}"]`);0==e.length&&((e=$("<div>",{class:"group"}).append($("<h3>",{text:t}))).attr("data-group",t),$("#content").append(e)),$(r).detach().appendTo(e)}else if("size"==t){let t=stash.data[a].S,e=t[1]>6*t[0]?"Animation Strips":t.join("x"),n=$(`#content .group[data-group="${e}"]`);0==n.length&&((n=$("<div>",{class:"group"}).append($("<h3>",{text:e}))).attr("data-group",e),$("#content").append(n)),$(r).detach().appendTo(n)}});let a=t=>{let a=t.children(".result").toArray().sort((t,r)=>{let a=$(t).attr("data-file"),n=$(r).attr("data-file");if("category"==e){let t=naturalSorter(getCategory(a),getCategory(n));return 0!=t?t:naturalSorter(a,n)}if("contributor"==e){let t=naturalSorter(getContributor(a),getContributor(n));return 0!=t?t:naturalSorter(a,n)}if("id"==e)return idSort(a,n);if("size"==e){let t=stash.data[a].S,e=stash.data[n].S,r=t[0]*t[1]-e[0]*e[1];return 0!=r?r:naturalSorter(a,n)}});"des"==r&&a.reverse(),t.append(a)};if("none"!=t){let e=$("#content").children(".group").toArray().sort((e,r)=>{let a=$(e).children("h3").text(),n=$(r).children("h3").text();if("size"==t){if("Animation Strips"==a)return-1;if("Animation Strips"==n)return 1;let t=a.split("x").map(t=>parseInt(t)),e=n.split("x").map(t=>parseInt(t));return t[0]*t[1]-e[0]*e[1]}return naturalSorter(a,n)});"des"==r&&e.reverse(),$("#content").append(e),$("#content").children(".group").each((t,e)=>{a($(e))})}else a($("#content"));updateResultGroupVisibility()}function search(t,e,r,a,n){$("#content").empty().append('<div class="hint">Searching...</div>');let o=stash.files.all;null!=t&&t.length>0&&(o=stash.files.category[t]),null!=e&&e.length>0&&(o=o.filter(contributorFilter(e))),null!=r&&r.length>0&&(o=o.filter(idFilter(r))),null!=a&&(o=o.filter(sizeFilter(a))),showResults(o.sort(naturalSorter)),n&&filterResultsByColor(),window.scrollTo(0,0)}function searchWithForm(){$(":focus").blur();let t=$("#category-input").val(),e=$("#contributor-input").val(),r=$("#id-input").val(),a=$("#size-input").val();if(t+e+r+a=="")return;let n=$("#color-picker-toggle").is(":checked");search(t,e,stringToIDList(r),stringToSize(a),n),history.pushState(null,"",toURLParams({category:t,contributor:e,id:r,size:a,color:n?$("#color-picker-input").val().substr(1):null}))}const stashURL="https://bytebucket.org/CCCode/dokustash/raw/master/",thumbnails="/stash/resources/thumbnails/",pages=["about","contributors","submit","login"],optionalLibs={ChartJS:{obj:"Chart",src:"/stash/js/Chart.min.js"},GitHub:{obj:"GitHub",src:"/stash/js/GitHub.bundle.min.js"}},dependencies={about:["ChartJS"],submit:["GitHub"]},months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],opTime=1312035589,legacyTimeData=[{time:1312051806,id:0},{time:1314221974,id:1e3},{time:1317388666,id:2e3},{time:1319090950,id:3e3},{time:1323408627,id:4e3},{time:1327695347,id:5e3},{time:1332070004,id:6e3},{time:1335737826,id:7e3},{time:1339451376,id:8e3},{time:1346105014,id:9e3},{time:1354211287,id:1e4},{time:1361130865,id:11e3},{time:1366174956,id:12e3},{time:1368929856,id:13e3},{time:1372727962,id:14e3},{time:1378402172,id:15e3},{time:1389405209,id:16e3},{time:1402541195,id:17e3},{time:1414832158,id:18e3},{time:1451429522,id:19e3},{time:1460483638,id:19160},{time:1460536130,id:19348},{time:1463713609,id:19398},{time:1464735265,id:19404},{time:1465704958,id:19415},{time:1469905303,id:19433},{time:1470202364,id:19444},{time:1478645533,id:19693},{time:1500235159,id:20122},{time:1512422195,id:20145}],rgxSize=/^\s*([<>]?=|[<>])?\s*(\d+)(\s*x\s*(\d+))?\s*$/,rgxCategory=/^(.+)\/.+_\d+/,rgxContributor=/\/(.+)_\d+/,rgxID=/\/.+_(\d+)/,bLazy=new Blazy({success:t=>{setTimeout(()=>{$(t).find(".spinner-container").remove()},200)}});var stash={},pageCleanup=null;window.addEventListener("popstate",loadPage),$(()=>{$.getJSON("/stash/data.json",t=>{stash.data=t,stash.categories=[],stash.contributors=[],stash.cache={},stash.files={all:[],category:{}};for(let t in stash.data)if(stash.data.hasOwnProperty(t)&&stash.data[t]){~stash.files.all.indexOf(t)||stash.files.all.push(t);let e=t.split("/")[0];~stash.categories.indexOf(e)||stash.categories.push(e);let r=t.split("/")[1].split("_").slice(0,-1).join("_");~stash.contributors.indexOf(r)||stash.contributors.push(r)}for(var e=0;e<stash.categories.length;e++)stash.files.category[stash.categories[e]]=stash.files.all.filter(categoryFilter(stash.categories[e]));stash.categories.sort(naturalSorter),stash.contributors.sort(naturalSorter),new Awesomplete($("#category-input")[0],{list:stash.categories,autoFirst:!0,minChars:1,sort:bestMatchSort($("#category-input"))}),new Awesomplete($("#contributor-input")[0],{list:stash.contributors,autoFirst:!0,sort:bestMatchSort($("#contributor-input"))}),$("body").removeClass("preload"),loadPage()}),$("#color-picker").farbtastic({callback:"#color-picker-input",width:200,onStop:filterResultsByColor}),$("#color-picker-toggle").on("change",t=>{$("#color-picker-toggle").is(":checked")?filterResultsByColor():($("#content").find(".result,.group").show(),bLazy.revalidate(),0==$("#content>.result,#content>.group>.result").length?$("#results-count").text(""):$("#results-count").text("Results: "+$("#content").find(".result").length))}),$("#color-picker-input").on("change",t=>{$("#content").children(".result").length<500&&filterResultsByColor()}),$('#search-form>.checkbox>input[type="checkbox"]').each((t,e)=>{$(e).on("change",t=>{$(e).is(":checked")?$(e).parent().next(".container").addClass("open"):$(e).parent().next(".container").removeClass("open")})}),$(".search-on-enter").on("keyup",t=>{13==t.which&&searchWithForm()}),$("#fullscreen-cover").on("click",t=>{$("#fullscreen-cover").addClass("hidden")}),tippy(".tt",{position:"right",arrow:!0,hideOnClick:!1,animation:"perspective"})});