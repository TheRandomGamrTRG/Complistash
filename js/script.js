function loadPage(){removeAllTooltips(),$("#results-count").text("");let t=getURLParams();if(null!=t)if(null!=t.page&&~pages.indexOf(t.page)){let e=()=>{$("#content").load(`pages/${t.page}.html`)};chartJSDepencency[t.page]?loadChartJS(e):e()}else null==t.profile?null==t.details?null==t.category&&null==t.contributor&&null==t.id&&null==t.size||(setUserInput(t.category,t.contributor,t.id,t.size,t.color?"#"+t.color:null),search(t.category,t.contributor,stringToIDList(t.id),stringToSize(t.size),t.color?"#"+t.color:null)):showDetails(stash.files.all.filter(idFilter(stringToIDList(t.details)))[0]):showProfile(t.profile);else showCategories()}function removeAllTooltips(){$(".tippy-popper").remove()}function loadChartJS(t){if("undefined"==typeof Chart){var e=document.createElement("script");e.onload=(()=>{Chart.defaults.global.defaultFontColor="#ddd",Chart.defaults.global.defaultFontFamily="Roboto, Arial, sans-serif","function"==typeof t&&t()}),e.src="/stash/js/Chart.min.js",document.head.appendChild(e)}else"function"==typeof t&&t()}function setUserInput(t,e,r,o,a){$("#category-input").val(t),$("#contributor-input").val(e),$("#id-input").val(r),$("#size-input").val(o),$("#color-picker-toggle").prop("checked",null!=a).change(),null!=a&&$.farbtastic("#color-picker").setColor(a)}function showCategories(){$("#content").empty(),removeAllTooltips(),$("#results-count").text(""),setUserInput(),$("#sorting-options").addClass("hidden");for(let t=0;t<stash.categories.length;t++){let e=stash.categories[t],r=toURLParams({category:e}),o=$("<a>",{class:"category button",href:r});o.on("click",t=>{setUserInput(e),search(e),history.pushState(null,"",r),t.preventDefault()}),o.append($("<img>",{src:`/stash/resources/category-icons/${e}.png`})),o.append($("<p>",{text:e})),o.attr("title",`<h3>${e}</h3><br>${stash.files.category[e].length} files`),tippy(o[0],{position:"right",arrow:!0,animation:"perspective"}),$("#content").append(o)}window.scrollTo(0,0)}function showDetails(t,e){$("#content").empty().append('<div class="hint">Loading...</div>').load("pages/details.html",()=>{removeAllTooltips(),$("#results-count").text(""),setUserInput(),$("#sorting-options").addClass("hidden");let r=$("#texture-preview").append($("<div>",{class:"img b-lazy"}).attr("data-src",`${stashURL}${t}.png`).append($("<div>",{class:"spinner-container"}).append($("<div>",{class:"spinner"}))));bLazy.revalidate();let o=stash.data[t].S;o[0]<128&&o[1]<128&&r.addClass("pixelated"),r.append($("<a>",{class:"download-image-button",download:t.split("/")[1],title:"Download",href:stashURL+t+".png"})),tippy(r[0].children[1],{arrow:!0,animation:"perspective"}),r.append($("<div>",{class:"fullscreen-button",title:"Fullscreen"}).on("click",e=>{$("#fullscreen-cover").removeClass("hidden").css("background-image",`url('${stashURL}${t}.png'), url(resources/transparent.png)`)})),tippy(r[0].children[2],{arrow:!0,animation:"perspective"});let a=getID(t),n=getContributor(t),i=getCategory(t);$(".contributor-name").text(n).attr("title",`Click to see all textures by ${n}`).attr("href",toURLParams({contributor:n})).on("click",t=>{setUserInput(null,n),search(null,n),history.pushState(null,"",toURLParams({contributor:n})),t.preventDefault()}),$(".file-id").text(a),$(".file-category").text(i).attr("title",`Click to see all textures in ${i}`).attr("href",toURLParams({category:i})).on("click",t=>{setUserInput(i),search(i),history.pushState(null,"",toURLParams({category:i})),t.preventDefault()}),$(".image-size").text(o.join("x")),$(".file-date").text(formatDate(getApproxTime(a))),tippy("#content .info a",{position:"right",arrow:!0,animation:"perspective"});let s=stash.files.all.filter(contributorFilter(n)).sort(idSort),l=s.indexOf(t)+1,p=s.filter(categoryFilter(i)).indexOf(t)+1,c=stash.files.all.sort(idSort),u=c.indexOf(t)+1,d=c.filter(categoryFilter(i)).indexOf(t)+1;var h=getApproxTime(a)-opTime,g=Math.floor(h/86400);$("#misc-stats").append($("<p>",{text:`This is the ${formatNum(l,!0)} texture ${n} posted and the ${formatNum(p,!0)} texture by them in ${i}.`})).append($("<p>",{text:`It is the ${formatNum(u,!0)} texture added to DokuStash and the ${formatNum(d,!0)} texture added to ${i}.`})).append($("<p>",{text:`It was posted approximately ${formatNum(g)} days after the continuation project started.`})),window.scrollTo(0,0),"function"==typeof e&&e()})}function showProfile(t,e){loadChartJS(()=>{$("#content").empty().append('<div class="hint">Loading...</div>').load("pages/profile.html",()=>{removeAllTooltips(),$("#results-count").text(""),setUserInput(),$("#sorting-options").addClass("hidden");let r=stash.files.all.filter(contributorFilter(t)),o={},a=1/0,n=-1/0,i={};for(let t=0;t<r.length;t++){let e=r[t],s=getCategory(e),l=getID(e);o[s]=(o[s]||0)+1,a=Math.min(a,l),n=Math.max(n,l);let p=new Date(1e3*getApproxTime(l)),c=p.getFullYear()+" Q"+Math.floor((p.getMonth()+3)/3);i[c]=(i[c]||0)+1}let s=stash.categories.filter(t=>null!=o[t]);s.sort((t,e)=>o[e]-o[t]),s=s.slice(0,5);let l=new Date(1e3*getApproxTime(a)),p=new Date(1e3*getApproxTime(n)),c=l.getFullYear(),u=p.getFullYear();for(let t=l.getFullYear();t<=u;t++){let e=t!=c?1:Math.floor((l.getMonth()+3)/3),r=t!=u?4:Math.floor((p.getMonth()+3)/3);for(let o=e;o<=r;o++)i[t+" Q"+o]=i[t+" Q"+o]||0}let d=[];for(quarter in i)i.hasOwnProperty(quarter)&&d.push(quarter);d.sort(naturalSorter),$(".contributor-name").text(t),$(".contributor-stats").append($("<p>",{text:`Number of contributions: ${r.length}`})).append($("<p>",{text:`First contribution: ${formatDate(getApproxTime(a))}`,title:"This date is only an estimate based on IDs"}));for(let t=0;t<s.length;t++)s[t],$(".top-categories>tbody").append($("<tr>").append($("<td>",{text:s[t]})).append($("<td>",{text:o[s[t]]})).append($("<td>",{text:Math.floor(o[s[t]]/stash.files.category[s[t]].length*100+.5)+"%"})));let h={maintainAspectRatio:!1,legend:{display:!1},scales:{xAxes:[{id:"xAxis1",gridLines:{display:!1},ticks:{callback:t=>t.split(" ")[1]}},{id:"xAxis2",gridLines:{display:!1},ticks:{callback:t=>~t.indexOf("Q1")||0==d.indexOf(t)?t.split(" ")[0]:""}}],yAxes:[{gridLines:{color:"#333"},ticks:{beginAtZero:!0}}]},tooltips:{bodyFontSize:16,footerFontSize:0,callbacks:{label:t=>"    "+t.yLabel,title:()=>"",footer:()=>" "},custom:t=>{t&&(t.displayColors=!1)}}};new Chart("activity-total-contributions",{type:"line",options:$.extend({},h,{title:{display:!0,text:"Total number of contributions"}}),data:{labels:d,datasets:[{data:d.map(t=>i[t]).reduce((t,e)=>(t.push((t.length&&t[t.length-1]||0)+e),t),[]),xAxisID:"xAxis1",backgroundColor:"rgba(85, 136, 255, 0.2)",borderColor:"#58f",pointHoverBorderColor:"#fff",borderWidth:2,pointRadius:5,lineTension:0}]}}),new Chart("activity-per-year-contributions",{type:"line",options:$.extend({},h,{title:{display:!0,text:"Number of contributions per quarter"}}),data:{labels:d,datasets:[{data:d.map(t=>i[t]),xAxisID:"xAxis1",backgroundColor:"rgba(85, 136, 255, 0.2)",borderColor:"#58f",pointHoverBorderColor:"#fff",borderWidth:2,pointRadius:5,lineTension:0}]}}),tippy(".top-categories th",{arrow:!0,animation:"perspective"}),tippy(".contributor-stats>*",{position:"right",arrow:!0,animation:"perspective"}),window.scrollTo(0,0),"function"==typeof e&&e()})})}function goToPage(t,e){if("root"==t)removeAllTooltips(),$("#results-count").text(""),setUserInput(),$("#sorting-options").addClass("hidden"),showCategories(),history.pushState(null,"","/stash/");else{let e=()=>{$("#content").empty().append('<div class="hint">Loading...</div>').load(`pages/${t}.html`,()=>{removeAllTooltips(),$("#results-count").text(""),setUserInput(),$("#sorting-options").addClass("hidden"),history.pushState(null,"",toURLParams({page:t})),window.scrollTo(0,0)})};chartJSDepencency[t]?loadChartJS(e):e()}null!=e&&e.preventDefault()}function getURLParams(){if(location.search.length<4)return null;let t,e=/[?&]([A-z0-9]+)=([^&]+)/g,r={};for(;t=e.exec(location.search);)r[t[1]]=decodeURIComponent(t[2].replace(/\+/g,"%20"));return r}function toURLParams(t){let e=[];for(let r in t)t.hasOwnProperty(r)&&null!=t[r]&&t[r].length>0&&e.push(`${0==e.length?"?":"&"}${r}=${encodeURIComponent(t[r]).replace(/%20/g,"+")}`);return e.join("")}function formatNum(t,e){let r=t;if("undefined"!=typeof Intl&&void 0!==Intl.NumberFormat&&(r=(new Intl.NumberFormat).format(t)),!e)return r;let o=t%10,a=t%100;return 1==o&&11!=a?r+"st":2==o&&12!=a?r+"nd":3==o&&13!=a?r+"rd":r+"th"}function naturalSorter(t,e){var r,o,a,n,i,s,l=0,p=/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;if(t===e)return 0;for(r=t.toLowerCase().match(p),o=e.toLowerCase().match(p),s=r.length;l<s;){if(!o[l])return 1;if(a=r[l],n=o[l++],a!==n)return i=a-n,isNaN(i)?a>n?1:-1:i}return o[l]?-1:0}function bestMatchSort(t){return(e,r)=>{let o=t.val().toLowerCase(),a=e.toLowerCase().indexOf(o)-r.toLowerCase().indexOf(o);if(0!=a)return a;let n=new RegExp(o,"gi");return r.match(n).length-e.match(n).length}}function idSort(t,e){return getID(t)-getID(e)}function lerp(t,e,r){return e*r+t*(1-r)}function getApproxTime(t){if(t>timeData[timeData.length-1].id)return-1;for(let e=0;e<timeData.length;e++)if(t>timeData[e].id&&t<=timeData[e+1].id)return lerp(timeData[e].time,timeData[e+1].time,(t-timeData[e].id)/(timeData[e+1].id-timeData[e].id));return-1}function formatDate(t){let e=new Date(1e3*t);return months[e.getMonth()]+" "+e.getDate()+", "+e.getFullYear()}function getCategory(t){return rgxCategory.exec(t)[1]}function getContributor(t){return rgxContributor.exec(t)[1]}function getID(t){return rgxID.exec(t)[1]}function categoryFilter(t){let e=new RegExp(`^${t}/`);return t=>t.match(e)}function contributorFilter(t){let e=new RegExp(`/${t}_[0-9]+$`);return t=>t.match(e)}function stringToIDList(t){if(null==t)return null;if(0==t.length)return null;let e=[],r=t.split(",");for(let t=0;t<r.length;t++){let o=r[t];if(~o.indexOf("-")){let t=o.split("-");e.push({min:parseInt(t[0]),max:parseInt(t[1])})}else e.push({min:parseInt(o),max:parseInt(o)})}return e}function idMatches(t,e){for(let r=0;r<e.length;r++)if(t>=e[r].min&&t<=e[r].max)return!0;return!1}function idFilter(t){return e=>{let r=e.split("_");return idMatches(r[r.length-1],t)}}function stringToSize(t){if(null==t)return null;if(!(t=t.trim()).match(rgxSize))return null;let e=rgxSize.exec(t);return{o:e[1],v:[parseInt(e[2]),parseInt(e[4]||e[2])]}}function sizeFilter(t){return"="==t.o||null==t.o?e=>stash.data[e].S[0]==t.v[0]&&stash.data[e].S[1]==t.v[1]:"<"==t.o?e=>stash.data[e].S[0]<t.v[0]&&stash.data[e].S[1]<t.v[1]:">"==t.o?e=>stash.data[e].S[0]>t.v[0]&&stash.data[e].S[1]>t.v[1]:"<="==t.o?e=>stash.data[e].S[0]<=t.v[0]&&stash.data[e].S[1]<=t.v[1]:">="==t.o?e=>stash.data[e].S[0]>=t.v[0]&&stash.data[e].S[1]>=t.v[1]:void 0}function hexToRgb(t){t=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(t,e,r,o)=>e+e+r+r+o+o);var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]:null}function rgbToLab(t){var e,r,o,a=t[0]/255,n=t[1]/255,i=t[2]/255;return a=a>.04045?Math.pow((a+.055)/1.055,2.4):a/12.92,n=n>.04045?Math.pow((n+.055)/1.055,2.4):n/12.92,i=i>.04045?Math.pow((i+.055)/1.055,2.4):i/12.92,e=(.4124*a+.3576*n+.1805*i)/.95047,r=(.2126*a+.7152*n+.0722*i)/1,o=(.0193*a+.1192*n+.9505*i)/1.08883,e=e>.008856?Math.pow(e,1/3):7.787*e+16/116,r=r>.008856?Math.pow(r,1/3):7.787*r+16/116,o=o>.008856?Math.pow(o,1/3):7.787*o+16/116,[116*r-16,500*(e-r),200*(r-o)]}function deltaE(t,e){var r=t[0]-e[0],o=t[1]-e[1],a=t[2]-e[2],n=Math.sqrt(t[1]*t[1]+t[2]*t[2]),i=n-Math.sqrt(e[1]*e[1]+e[2]*e[2]),s=o*o+a*a-i*i,l=r/1,p=i/(1+.045*n),c=(s=s<0?0:Math.sqrt(s))/(1+.015*n),u=l*l+p*p+c*c;return u<0?0:Math.sqrt(u)}function filterResultsByColor(){if(0==$("#content>.result,#content>.group>.result").length)return;let t=$.farbtastic("#color-picker"),e=rgbToLab(hexToRgb(t.color)),r=0,o=0,a=$("#results-count").text("Results: 0"),n=$("#content").find(".result");n.each((i,s)=>{let l=stash.data[$(s).attr("data-file")].P;for(let i in l)if(l.hasOwnProperty(i)&&l[i]){if(t.hsl[1]<.5&&~i.indexOf("V"))continue;if(t.hsl[1]>=.5&&~i.indexOf("M"))continue;if(deltaE(e,rgbToLab(l[i]))<=16)return $(s).show(),r++,o++,a.text(`Results: ${r}`),void(o==n.length&&updateResultGroupVisibility())}$(s).hide(),++o==n.length&&updateResultGroupVisibility()})}function showResults(t){if($("#content").empty(),0==t.length)return $("#content").append($("<div>",{class:"hint",text:"No results"})),void $("#results-count").text("");$("#content").append($("<div>",{class:"fill"})),$("#results-count").text(`Results: ${t.length}`);for(let e=0;e<t.length;e++){let r=t[e],o=$("<div>",{class:"result"}).append($("<div>",{class:"img b-lazy"}).attr("data-src",`${stashURL}${r}.png`).append($("<div>",{class:"spinner-container"}).append($("<div>",{class:"spinner"}))));o.attr("data-file",r),o.on("click",t=>{showDetails(r,()=>{history.pushState(null,"",toURLParams({details:getID(r)}))})});let a=stash.data[r].S;a[0]<128&&a[1]<128&&o.addClass("pixelated"),o.append($("<a>",{class:"download-image-button",download:r.split("/")[1],title:"Download",href:stashURL+r+".png"}).on("click",t=>{t.stopPropagation()})),tippy(o[0].children[1],{arrow:!0,animation:"perspective"}),o.append($("<div>",{class:"fullscreen-button",title:"Fullscreen"}).on("click",t=>{$("#fullscreen-cover").removeClass("hidden").css("background-image",`url('${stashURL}${r}.png'), url(resources/transparent.png)`),t.stopPropagation()})),tippy(o[0].children[2],{arrow:!0,animation:"perspective"});let n=getID(r);o.attr("title",`<h3>${getContributor(r)} #${n}</h3><br>Size: ${a[0]}x${a[1]}<br>Date: ${formatDate(getApproxTime(n))}<br><br><i>${getCategory(r)}</i>`),tippy(o[0],{position:"right",arrow:!0,animation:"perspective"}),$("#content").append(o)}bLazy.revalidate(),$("#sorting-options").removeClass("hidden"),updateResultGroups()}function updateResultGroupVisibility(){$("#content>.group").each((t,e)=>{$(e).show(),0==$(e).children(".result:visible").length&&$(e).hide()}),bLazy.revalidate()}function updateResultGroups(){let t=$("#sorting-options .group").val(),e=$("#sorting-options .sort-prop").val(),r=$("#sorting-options .sort-order").val();$("#content").find(".group>.result").detach().appendTo($("#content")),$("#content>.group").remove(),"none"!=t&&$("#content").children(".result").each((e,r)=>{let o=$(r).attr("data-file");if("category"==t){let t=getCategory(o),e=$(`#content .group[data-group="${t}"]`);0==e.length&&((e=$("<div>",{class:"group"}).append($("<h3>",{text:t}))).attr("data-group",t),$("#content").append(e)),$(r).detach().appendTo(e)}else if("contributor"==t){let t=getContributor(o),e=$(`#content .group[data-group="${t}"]`);0==e.length&&((e=$("<div>",{class:"group"}).append($("<h3>",{text:t}))).attr("data-group",t),$("#content").append(e)),$(r).detach().appendTo(e)}else if("year"==t){let t=new Date(1e3*getApproxTime(getID(o))).getFullYear(),e=$(`#content .group[data-group="${t}"]`);0==e.length&&((e=$("<div>",{class:"group"}).append($("<h3>",{text:t}))).attr("data-group",t),$("#content").append(e)),$(r).detach().appendTo(e)}else if("size"==t){let t=stash.data[o].S,e=t[1]>6*t[0]?"Animation Strips":t.join("x"),a=$(`#content .group[data-group="${e}"]`);0==a.length&&((a=$("<div>",{class:"group"}).append($("<h3>",{text:e}))).attr("data-group",e),$("#content").append(a)),$(r).detach().appendTo(a)}});let o=t=>{let o=t.children(".result").toArray().sort((t,r)=>{let o=$(t).attr("data-file"),a=$(r).attr("data-file");if("category"==e){let t=naturalSorter(getCategory(o),getCategory(a));return 0!=t?t:naturalSorter(o,a)}if("contributor"==e){let t=naturalSorter(getContributor(o),getContributor(a));return 0!=t?t:naturalSorter(o,a)}if("id"==e)return idSort(o,a);if("size"==e){let t=stash.data[o].S,e=stash.data[a].S,r=t[0]*t[1]-e[0]*e[1];return 0!=r?r:naturalSorter(o,a)}});"des"==r&&o.reverse(),t.append(o)};if("none"!=t){let e=$("#content").children(".group").toArray().sort((e,r)=>{let o=$(e).children("h3").text(),a=$(r).children("h3").text();if("size"==t){if("Animation Strips"==o)return-1;if("Animation Strips"==a)return 1;let t=o.split("x").map(t=>parseInt(t)),e=a.split("x").map(t=>parseInt(t));return t[0]*t[1]-e[0]*e[1]}return naturalSorter(o,a)});"des"==r&&e.reverse(),$("#content").append(e),$("#content").children(".group").each((t,e)=>{o($(e))})}else o($("#content"));updateResultGroupVisibility()}function search(t,e,r,o,a){$("#content").empty().append('<div class="hint">Searching...</div>');let n=stash.files.all;null!=t&&t.length>0&&(n=stash.files.category[t]),null!=e&&e.length>0&&(n=n.filter(contributorFilter(e))),null!=r&&r.length>0&&(n=n.filter(idFilter(r))),null!=o&&(n=n.filter(sizeFilter(o))),showResults(n.sort(naturalSorter)),a&&filterResultsByColor(),window.scrollTo(0,0)}function searchWithForm(){$(":focus").blur();let t=$("#category-input").val(),e=$("#contributor-input").val(),r=$("#id-input").val(),o=$("#size-input").val();if(t+e+r+o=="")return;let a=$("#color-picker-toggle").is(":checked");search(t,e,stringToIDList(r),stringToSize(o),a),history.pushState(null,"",toURLParams({category:t,contributor:e,id:r,size:o,color:a?$("#color-picker-input").val().substr(1):null}))}const stashURL="https://bytebucket.org/CCCode/dokustash/raw/master/",pages=["about","contributors"],chartJSDepencency={about:!0},months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],opTime=1312035589,timeData=[{time:1312051806,id:0},{time:1314221974,id:1e3},{time:1317388666,id:2e3},{time:1319090950,id:3e3},{time:1323408627,id:4e3},{time:1327695347,id:5e3},{time:1332070004,id:6e3},{time:1335737826,id:7e3},{time:1339451376,id:8e3},{time:1346105014,id:9e3},{time:1354211287,id:1e4},{time:1361130865,id:11e3},{time:1366174956,id:12e3},{time:1368929856,id:13e3},{time:1372727962,id:14e3},{time:1378402172,id:15e3},{time:1389405209,id:16e3},{time:1402541195,id:17e3},{time:1414832158,id:18e3},{time:1451429522,id:19e3},{time:1460483638,id:19160},{time:1460536130,id:19348},{time:1463713609,id:19398},{time:1464735265,id:19404},{time:1465704958,id:19415},{time:1469905303,id:19433},{time:1470202364,id:19444},{time:1478645533,id:19693},{time:1500235159,id:20122}],rgxSize=/^\s*([<>]?=|[<>])?\s*(\d+)(\s*x\s*(\d+))?\s*$/,rgxCategory=/^(.+)\/.+_\d+/,rgxContributor=/\/(.+)_\d+/,rgxID=/\/.+_(\d+)/,bLazy=new Blazy({success:t=>{setTimeout(()=>{$(t).find(".spinner-container").remove()},200)}});var stash={};window.addEventListener("popstate",loadPage),$(()=>{$.getJSON("/stash/data.json",t=>{stash.data=t,stash.categories=[],stash.contributors=[],stash.files={all:[],category:{}};for(let t in stash.data)if(stash.data.hasOwnProperty(t)&&stash.data[t]){~stash.files.all.indexOf(t)||stash.files.all.push(t);let e=t.split("/")[0];~stash.categories.indexOf(e)||stash.categories.push(e);let r=t.split("/")[1].split("_").slice(0,-1).join("_");~stash.contributors.indexOf(r)||stash.contributors.push(r)}for(var e=0;e<stash.categories.length;e++)stash.files.category[stash.categories[e]]=stash.files.all.filter(categoryFilter(stash.categories[e]));stash.categories.sort(naturalSorter),stash.contributors.sort(naturalSorter),new Awesomplete($("#category-input")[0],{list:stash.categories,autoFirst:!0,minChars:1,sort:bestMatchSort($("#category-input"))}),new Awesomplete($("#contributor-input")[0],{list:stash.contributors,autoFirst:!0,sort:bestMatchSort($("#contributor-input"))}),$("body").removeClass("preload"),loadPage()}),$("#color-picker").farbtastic({callback:"#color-picker-input",width:200,onStop:filterResultsByColor}),$("#color-picker-toggle").on("change",t=>{$("#color-picker-toggle").is(":checked")?filterResultsByColor():($("#content").find(".result,.group").show(),bLazy.revalidate(),0==$("#content>.result,#content>.group>.result").length?$("#results-count").text(""):$("#results-count").text("Results: "+$("#content").find(".result").length))}),$("#color-picker-input").on("change",t=>{$("#content").children(".result").length<500&&filterResultsByColor()}),$('#search-form>.checkbox>input[type="checkbox"]').each((t,e)=>{$(e).on("change",t=>{$(e).is(":checked")?$(e).parent().next(".container").addClass("open"):$(e).parent().next(".container").removeClass("open")})}),$(".search-on-enter").on("keyup",t=>{13==t.which&&searchWithForm()}),$("#fullscreen-cover").on("click",t=>{$("#fullscreen-cover").addClass("hidden")}),tippy(".tt",{position:"right",arrow:!0,hideOnClick:!1,animation:"perspective"})});