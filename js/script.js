function loadPage(){"function"==typeof stash.page.onRemove&&(stash.page.onRemove(),stash.page.onRemove=null,stash.page.onSidebarToggle=null),removeAllTooltips();let t=getURLParams();if(null!=t){for(let e=0;e<pages.length;e++)if(t.hasOwnProperty(pages[e]))return void $("#content").load(`pages/${pages[e]}.html`,onAjaxPageLoad);$("#content").empty().append('<div class="hint">This page does not exist.</div>'),stash.workError()}else $("#content").load("pages/categories.html",onAjaxPageLoad)}function onAjaxPageLoad(){$("select").selectric({expandToItemText:!0}),initSliders(),stash.page.hasWork||stash.workComplete(),$("#content-wrapper")[0].scrollTo(0,0)}function initSliders(){$(".slider:not(.initialized)").addClass("initialized").each((t,e)=>{noUiSlider.create(e,{start:[parseInt($(e).attr("value"))],step:parseInt($(e).attr("step")),range:{min:[parseInt($(e).attr("min"))],max:[parseInt($(e).attr("max"))]}});let a=$(e).attr("id");if(a&&stash.sliderEvents.hasOwnProperty(a)){for(let t in stash.sliderEvents[a])stash.sliderEvents[a].hasOwnProperty(t)&&e.noUiSlider.on(t,stash.sliderEvents[a][t]);delete stash.sliderEvents[a]}})}function removeAllTooltips(){$(".tippy-popper").remove()}function setSearchFormVals(t,e,a,s,r){$("#category-input").val(t),$("#contributor-input").val(e),$("#id-input").val(a),$("#size-input").val(s),$("#color-picker-toggle").prop("checked",null!=r).change(),null!=r&&$.farbtastic("#color-picker").setColor(r)}function goToPage(t,e){if(null!=e&&e.preventDefault(),null==getURLParams()||!getURLParams().hasOwnProperty(t))if(stash.workIndeterminate(),"function"==typeof stash.page.onRemove&&(stash.page.onRemove(),stash.page.onRemove=null,stash.page.onSidebarToggle=null),"root"==t)history.pushState(null,"","/stash/"),$("#content").empty().append('<div class="hint">Loading...</div>').load("pages/categories.html",()=>{removeAllTooltips(),setSearchFormVals(),onAjaxPageLoad()});else if(t.match(/^\?/)){let e=getURLParams(t),a=null;for(let t=0;t<pages.length;t++)if(e.hasOwnProperty(pages[t])){a=pages[t];break}history.pushState(null,"",t),$("#content").empty().append('<div class="hint">Loading...</div>').load(`pages/${a}.html`,()=>{removeAllTooltips(),e.search||setSearchFormVals(),onAjaxPageLoad()})}else{let e={};e[t]=!0,history.pushState(null,"",toURLParams(e)),$("#content").empty().append('<div class="hint">Loading...</div>').load(`pages/${t}.html`,()=>{removeAllTooltips(),setSearchFormVals(),onAjaxPageLoad()})}}function getURLParams(t=location.search){if(t.length<2)return null;let e,a=/(?:^\?|&)([A-z0-9]+)(?:=([^&]+)|(?=&)|$)/g,s={};for(;e=a.exec(t);)s[e[1]]=!e[2]||decodeURIComponent(e[2].replace(/\+/g,"%20"));return s}function toURLParams(t){let e=[];for(let a in t)if(t.hasOwnProperty(a)&&null!=t[a])if(!0===t[a])e.push(`${0==e.length?"?":"&"}${a}`);else{let s=encodeURIComponent(t[a]).replace(/%3A/g,":").replace(/%3B/g,";").replace(/%20/g,"+").replace(/%2C/g,",");e.push(`${0==e.length?"?":"&"}${a}=${s}`)}return e.join("")}function decodeQuery(){let t=getURLParams().search;if(null==t)return;let e=t.split(";"),a={};for(let t=0;t<e.length;t++){let s=e[t].split(":");a[longform[s[0]]]=s[1]}return a}function toSearchURLParams(t){let e=[];for(let a in t)t.hasOwnProperty(a)&&null!=t[a]&&t[a].length>0&&e.push(`${abbr[a]}:${t[a]}`);return toURLParams({search:e.join(";")})}function formatNum(t,e){let a=t;if("undefined"!=typeof Intl&&void 0!==Intl.NumberFormat&&(a=(new Intl.NumberFormat).format(t)),!e)return a;let s=t%10,r=t%100;return 1==s&&11!=r?a+"st":2==s&&12!=r?a+"nd":3==s&&13!=r?a+"rd":a+"th"}function formatBytes(t){if(0==t)return"0 B";let e=Math.floor(Math.log(t)/Math.log(1024));return parseFloat((t/Math.pow(1024,e)).toFixed(1))+" "+["B","KB","MB","GB","TB"][e]}function naturalSorter(t,e){let a,s,r,n,o,i,l=0,c=/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;if(t===e)return 0;for(a=t.toLowerCase().match(c),s=e.toLowerCase().match(c),i=a.length;l<i;){if(!s[l])return 1;if(r=a[l],n=s[l++],r!==n)return o=r-n,isNaN(o)?r>n?1:-1:o}return s[l]?-1:0}function bestMatchSort(t){return(e,a)=>{let s=t.val().toLowerCase(),r=e.toLowerCase().indexOf(s)-a.toLowerCase().indexOf(s);if(0!=r)return r;let n=new RegExp(s,"gi");return a.match(n).length-e.match(n).length}}function idSort(t,e){return getID(t)-getID(e)}function lerp(t,e,a){return e*a+t*(1-a)}function getApproxTime(t){if(t>legacyTimeData[legacyTimeData.length-1].id)return-1;for(let e=0;e<legacyTimeData.length;e++)if(t>legacyTimeData[e].id&&t<=legacyTimeData[e+1].id)return lerp(legacyTimeData[e].time,legacyTimeData[e+1].time,(t-legacyTimeData[e].id)/(legacyTimeData[e+1].id-legacyTimeData[e].id));return-1}function formatDate(t){let e=new Date(1e3*t);return months[e.getMonth()]+" "+e.getDate()+", "+e.getFullYear()}function getCategory(t){return rgxCategory.exec(t)[1]}function getContributor(t){return rgxContributor.exec(t)[1]}function getID(t){return rgxID.exec(t)[1]}function categoryFilter(t){let e=new RegExp(`^${t}/`);return t=>t.match(e)}function contributorFilter(t){let e=new RegExp(`/${t}_[0-9]+.(png|zip)$`);return t=>t.match(e)}function stringToIDList(t){if(null==t)return null;if(0==t.length)return null;let e=[],a=t.split(",");for(let t=0;t<a.length;t++){let s=a[t];if(~s.indexOf("-")){let t=s.split("-");e.push({min:parseInt(t[0]),max:parseInt(t[1])})}else e.push({min:parseInt(s),max:parseInt(s)})}return e}function idMatches(t,e){for(let a=0;a<e.length;a++)if(t>=e[a].min&&t<=e[a].max)return!0;return!1}function idFilter(t){return e=>idMatches(getID(e),t)}function stringToSize(t){if(null==t)return null;if(!(t=t.trim()).match(rgxSize))return null;let e=rgxSize.exec(t);return{o:e[1],v:[parseInt(e[2]),parseInt(e[4]||e[2])]}}function sizeFilter(t){return"="==t.o||null==t.o?e=>e.match(/\.png$/)&&stash.data[e].S[0]==t.v[0]&&stash.data[e].S[1]==t.v[1]:"<"==t.o?e=>e.match(/\.png$/)&&stash.data[e].S[0]<t.v[0]&&stash.data[e].S[1]<t.v[1]:">"==t.o?e=>e.match(/\.png$/)&&stash.data[e].S[0]>t.v[0]&&stash.data[e].S[1]>t.v[1]:"<="==t.o?e=>e.match(/\.png$/)&&stash.data[e].S[0]<=t.v[0]&&stash.data[e].S[1]<=t.v[1]:">="==t.o?e=>e.match(/\.png$/)&&stash.data[e].S[0]>=t.v[0]&&stash.data[e].S[1]>=t.v[1]:void 0}function hexToRgb(t){t=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(t,e,a,s)=>e+e+a+a+s+s);let e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]:null}function rgbToLab(t){let e,a,s,r=t[0]/255,n=t[1]/255,o=t[2]/255;return r=r>.04045?Math.pow((r+.055)/1.055,2.4):r/12.92,n=n>.04045?Math.pow((n+.055)/1.055,2.4):n/12.92,o=o>.04045?Math.pow((o+.055)/1.055,2.4):o/12.92,e=(.4124*r+.3576*n+.1805*o)/.95047,a=(.2126*r+.7152*n+.0722*o)/1,s=(.0193*r+.1192*n+.9505*o)/1.08883,e=e>.008856?Math.pow(e,1/3):7.787*e+16/116,a=a>.008856?Math.pow(a,1/3):7.787*a+16/116,s=s>.008856?Math.pow(s,1/3):7.787*s+16/116,[116*a-16,500*(e-a),200*(a-s)]}function deltaE(t,e){let a=t[0]-e[0],s=t[1]-e[1],r=t[2]-e[2],n=Math.sqrt(t[1]*t[1]+t[2]*t[2]),o=n-Math.sqrt(e[1]*e[1]+e[2]*e[2]),i=s*s+r*r-o*o,l=a/1,c=o/(1+.045*n),d=(i=i<0?0:Math.sqrt(i))/(1+.015*n),h=l*l+c*c+d*d;return h<0?0:Math.sqrt(h)}function filterResultsByColor(){let t=$("#content .result");if(0==t.length)return;let e=$.farbtastic("#color-picker"),a=rgbToLab(hexToRgb(e.color)),s=0,r=0,n=$("#results-count").text("Results: 0");t.each((o,i)=>{let l=stash.data[$(i).attr("data-file")].P;for(let o in l)if(l.hasOwnProperty(o)&&l[o]){if(e.hsl[1]<.5&&~o.indexOf("V"))continue;if(e.hsl[1]>=.5&&~o.indexOf("M"))continue;if(deltaE(a,rgbToLab(l[o]))<=16)return $(i).removeClass("hidden"),s++,r++,n.text(`Results: ${s}`),void(r==t.length&&updateResultGroupVisibility())}$(i).addClass("hidden"),++r==t.length&&updateResultGroupVisibility()})}function createFilePreview(t,e){let a=stash.data[t].S;if(e.attr("data-file",t).addClass("file"),stash.data[t].M&&e.addClass("mcmeta"),stash.data[t].Z&&e.addClass(stash.data[t].Z+" zip"),t.match(/\.png$/)){let s=stashURL+t;stash.data[t].M||a[1]/a[0]>=6&&a[1]%a[0]==0?e.append($("<img>",{class:"animated b-lazy",src:"/stash/resources/transparent.png"}).attr("data-src",s).attr("data-width",128).attr("data-height",128)).append($("<div>",{class:`img b-lazy x1 x2 x3 thumbnail${a[0]<128?" pixelated":""}`}).attr("data-src",thumbnails+t)):a[0]>128||a[1]>128?e.append($("<div>",{class:"img b-lazy x1"}).attr("data-src",thumbnails+t)).append($("<div>",{class:"img b-lazy x2 x3"}).attr("data-src",s)):e.append($("<div>",{class:`img b-lazy x1 x2 x3${a[0]<128&&a[1]<128?" pixelated":""}`}).attr("data-src",s))}else{let s=thumbnails+t.replace(/\.zip$/,".png");stash.data[t].M||a[1]/a[0]>6&&a[1]%a[0]==0?e.addClass("no-thumbnail").append($("<img>",{class:"animated b-lazy",src:"/stash/resources/transparent.png"}).attr("data-src",s).attr("data-width",128).attr("data-height",128)):e.append($("<div>",{class:`img b-lazy x1 x2 x3${a[0]<128&&a[1]<128?" pixelated":""}`}).attr("data-src",s))}let s=$("<div>",{class:"overlay"}).appendTo(e);return s.append($("<a>",{class:"action-button download-image-button",download:t.split("/")[1],title:"Download",href:stashURL+t}).on("click",t=>{t.stopPropagation()}).on("contextmenu",t=>{t.stopPropagation()})),t.match(/\.png$/)&&s.append($("<div>",{class:"action-button fullscreen-button",title:"Fullscreen"}).on("click",e=>{$("#fullscreen-cover").removeClass("hidden"),$("#fullscreen-cover .img").removeClass("b-loaded b-error").attr("style","").attr("data-src",stashURL+t),e.stopPropagation()})),tippy(s.find(".action-button").toArray(),{arrow:!0,animation:"perspective",performance:!0}),e}function updateFileScale(){if($("#file-scale")[0].noUiSlider){let t=parseInt($("#file-scale")[0].noUiSlider.get()),e=[128,256,512];$("#content .file").removeClass("x1 x2 x3").addClass("x"+t),$("#content .file .mc-animation").attr("width",e[t-1]).attr("height",e[t-1])}}function updateResultGroupVisibility(){$("#content>.group").each((t,e)=>{$(e).removeClass("hidden"),0==$(e).children(".result:visible").length&&$(e).addClass("hidden")})}function updateResultGroups(){let t=$("#sorting-options .group").val(),e=$("#sorting-options .sort-prop").val(),a=$("#sorting-options .sort-order").val();$("#content").find(".group>.result").detach().appendTo($("#content")),$("#content>.group").remove(),"none"!=t&&$("#content").children(".result").each((e,a)=>{let s=$(a).attr("data-file");if("category"==t){let t=getCategory(s),e=$(`#content .group[data-group="${t}"]`);0==e.length&&((e=$("<div>",{class:"group"}).append($("<h3>",{text:t}))).attr("data-group",t),$("#content").append(e)),$(a).detach().appendTo(e)}else if("contributor"==t){let t=getContributor(s),e=$(`#content .group[data-group="${t}"]`);0==e.length&&((e=$("<div>",{class:"group"}).append($("<h3>",{text:t}))).attr("data-group",t),$("#content").append(e)),$(a).detach().appendTo(e)}else if("year"==t){let t=new Date(1e3*(stash.data[s].T||getApproxTime(getID(s)))).getFullYear(),e=$(`#content .group[data-group="${t}"]`);0==e.length&&((e=$("<div>",{class:"group"}).append($("<h3>",{text:t}))).attr("data-group",t),$("#content").append(e)),$(a).detach().appendTo(e)}else if("size"==t){let t=stash.data[s].S,e=t[1]>6*t[0]?"Animation Strips":t.join("x"),r=$(`#content .group[data-group="${e}"]`);0==r.length&&((r=$("<div>",{class:"group"}).append($("<h3>",{text:e}))).attr("data-group",e),$("#content").append(r)),$(a).detach().appendTo(r)}});let s=t=>{let s=t.children(".result").toArray().sort((t,a)=>{let s=$(t).attr("data-file"),r=$(a).attr("data-file");if("category"==e){let t=naturalSorter(getCategory(s),getCategory(r));return 0!=t?t:naturalSorter(s,r)}if("contributor"==e){let t=naturalSorter(getContributor(s),getContributor(r));return 0!=t?t:naturalSorter(s,r)}if("id"==e)return idSort(s,r);if("size"==e){let t=stash.data[s].S,e=stash.data[r].S,a=t[0]*t[1]-e[0]*e[1];return 0!=a?a:naturalSorter(s,r)}});"des"==a&&s.reverse(),t.append(s)};if("none"!=t){let e=$("#content").children(".group").toArray().sort((e,a)=>{let s=$(e).children("h3").text(),r=$(a).children("h3").text();if("size"==t){if("Animation Strips"==s)return-1;if("Animation Strips"==r)return 1;let t=s.split("x").map(t=>parseInt(t)),e=r.split("x").map(t=>parseInt(t));return t[0]*t[1]-e[0]*e[1]}return naturalSorter(s,r)});"des"==a&&e.reverse(),$("#content").append(e),$("#content").children(".group").each((t,e)=>{s($(e))})}else s($("#content"));updateResultGroupVisibility()}function searchWithForm(){$(":focus").blur();let t=$("#category-input").val(),e=$("#contributor-input").val(),a=$("#id-input").val(),s=$("#size-input").val();if(t+e+a+s=="")return;goToPage(toSearchURLParams({category:t,contributor:e,id:a,size:s,color:$("#color-picker-toggle").is(":checked")?$("#color-picker-input").val().substr(1):null}))}function fileSelectionChanged(){let t=stash.selection.files.length;if(t>0){$("#content .file").each((t,e)=>{let a=$(e).attr("data-file");stash.selection.contains(a)?$(e).addClass("selected"):$(e).removeClass("selected")});let e=stash.selection.toString(),a=e.length,s=e.substring(0,50);a>s.length&&(s+="..."),$("#number-of-selected-files").text(`${t} file${1===t?"":"s"}`).attr("title","IDs: "+s),$("#link-to-selected").val("https://dokucraft.co.uk/stash/"+toSearchURLParams({id:e})),$("#selection-bar").removeClass("hidden"),$("body").addClass("selection-bar-visible")}else $("#content .selected").removeClass("selected"),$("#selection-bar").addClass("hidden"),$("body").removeClass("selection-bar-visible")}const stashURL="https://bytebucket.org/CCCode/dokustash/raw/master/",thumbnails="/stash/resources/thumbnails/",contentData="/stash/resources/content-data/",cors="https://cors-anywhere.herokuapp.com/",pages=["search","about","contributors","profile","details","submit","login","status"],abbr={category:"ca",contributor:"co",id:"id",size:"si",color:"cl"},longform={ca:"category",co:"contributor",id:"id",si:"size",cl:"color"},months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],opTime=1312035589,legacyTimeData=[{time:1312051806,id:0},{time:1314221974,id:1e3},{time:1317388666,id:2e3},{time:1319090950,id:3e3},{time:1323408627,id:4e3},{time:1327695347,id:5e3},{time:1332070004,id:6e3},{time:1335737826,id:7e3},{time:1339451376,id:8e3},{time:1346105014,id:9e3},{time:1354211287,id:1e4},{time:1361130865,id:11e3},{time:1366174956,id:12e3},{time:1368929856,id:13e3},{time:1372727962,id:14e3},{time:1378402172,id:15e3},{time:1389405209,id:16e3},{time:1402541195,id:17e3},{time:1414832158,id:18e3},{time:1451429522,id:19e3},{time:1460483638,id:19160},{time:1460536130,id:19348},{time:1463713609,id:19398},{time:1464735265,id:19404},{time:1465704958,id:19415},{time:1469905303,id:19433},{time:1470202364,id:19444},{time:1478645533,id:19693},{time:1500235159,id:20122},{time:1512422195,id:20145}],rgxSize=/^\s*([<>]?=|[<>])?\s*(\d+)(\s*x\s*(\d+))?\s*$/,rgxCategory=/^(.+)\/.+_\d+/,rgxContributor=/\/(.+)_\d+/,rgxID=/\/.+_(\d+)/,rgxExt=/\.(png|zip)$/,bLazy=new Blazy({success:t=>{if($(t).is("img.animated")&&!$(t).parent().attr("data-animation-done"))if($(t).parent().attr("data-animation-done",!0),$(t).parent().is(".mcmeta"))$.ajax({url:(~t.src.indexOf(stashURL)?cors:"")+t.src+".mcmeta",success:e=>{let a=new MCAnimation(t.src,JSON.parse(e));a.canvas.width=$(t).attr("data-width"),a.canvas.height=$(t).attr("data-height"),$(t).parent().removeClass("no-thumbnail"),$(t).hide().after(a.canvas),$(t).siblings(".thumbnail").remove()}});else{let e=new MCAnimation(t.src);e.canvas.width=$(t).attr("data-width"),e.canvas.height=$(t).attr("data-height"),$(t).parent().removeClass("no-thumbnail"),$(t).hide().after(e.canvas),$(t).siblings(".thumbnail").remove()}}});var stash={categories:["Ocean Plants"],contributors:[],page:{},cache:{},sliderEvents:{},files:{all:[],category:{}},selection:{files:[]},typeNames:{model:"Model",ctm:"CTM",cit:"CIT",set:"Texture set"}};$(window).on("popstate",loadPage),stash.toggleSidebar=(()=>{$("#sidebar-wrapper").toggleClass("closed"),"function"==typeof stash.page.onSidebarToggle&&stash.page.onSidebarToggle($("#sidebar-wrapper").is(".closed"))}),stash.search=(t=>{let e=stringToIDList(t.id),a=stringToSize(t.size),s=stash.files.all;return null!=t.category&&t.category.length>0&&(s=stash.files.category[t.category]),null!=t.contributor&&t.contributor.length>0&&(s=s.filter(contributorFilter(t.contributor))),null!=e&&e.length>0&&(s=s.filter(idFilter(e))),null!=a&&(s=s.filter(sizeFilter(a))),s}),stash.notify=((t,e,a)=>{let s=$("<div>",{class:"notification",text:t}),r=$("<div>",{class:"button-row"});"string"==typeof a&&s.addClass(a),e&&e.forEach(t=>{r.append($("<div>",{class:"button inline",text:t.text}).on("click",()=>{"function"==typeof t.func&&t.func(),s.remove()}))}),r.append($("<div>",{class:"button inline",text:"Dismiss"}).on("click",t=>{s.remove()})),s.append(r).appendTo($("body"))}),stash.selection.contains=(t=>~stash.selection.files.indexOf(t)),stash.selection.toString=(()=>stash.selection.files.map(t=>parseInt(getID(t))).sort().reduce((t,e)=>{if(0==t.length)return t.push([e]),t;let a=t[t.length-1];return a[a.length-1]==e-1?(a.push(e),t[t.length-1]=a.filter((t,e)=>0==e||e==a.length-1)):t.push([e]),t},[]).reduce((t,e,a)=>{let s=a>0?",":"";return 1==e.length?t+=s+e[0]:t+=`${s}${e[0]}-${e[1]}`,t},"")),stash.selection.download=(()=>{$("#download-selected-button").text("Working...").off("click",stash.selection.download);let t=new JSZip,e=stash.selection.files.slice();e=e.concat(e.filter(t=>stash.data[t].M&&t.match(/\.png$/)).map(t=>t+".mcmeta"));let a=0,s=!1,r=[];for(let n=0;n<e.length&&!s;n++){let o=new XMLHttpRequest;r.push(o),o.responseType="blob",o.onreadystatechange=function(){if(o.readyState==XMLHttpRequest.DONE&&200==o.status){t.file(e[n],o.response,{createFolders:!0}),a++;let s=Math.floor(100*a/e.length);stash.setWorkProgress(s),a==e.length&&t.generateAsync({type:"blob"}).then(t=>{saveAs(t,"dokustash.zip"),stash.workComplete(),$("#download-selected-button").text("Download").on("click",stash.selection.download)})}else o.status>=400&&(s=!0,r.forEach(t=>t.abort()),$("#download-selected-button").text("Error while downloading"),stash.workError(()=>{$("#download-selected-button").text("Download").on("click",stash.selection.download)}))},o.open("GET",cors+stashURL+e[n],!0),o.send()}}),stash.selectFile=(t=>{stash.selection.contains(t)||(stash.selection.files.push(t),fileSelectionChanged())}),stash.selectFiles=(t=>{t.forEach(t=>{stash.selection.contains(t)||stash.selection.files.push(t)}),fileSelectionChanged()}),stash.deselectFile=(t=>{let e=stash.selection.files.indexOf(t);e>-1&&(stash.selection.files.splice(e,1),fileSelectionChanged())}),stash.deselectAllFiles=(()=>{stash.selection.files=[],fileSelectionChanged()}),stash.setWorkProgress=(t=>{t=t||stash.cache.workProgress,stash.cache.workProgress=t,$("#work-progress-bar").removeClass("indeterminate").stop().animate({width:t+"%"},250)}),stash.workIndeterminate=(()=>{$("#work-progress-bar").addClass("indeterminate").stop()}),stash.workError=(t=>{stash.cache.workProgress;$("#work-progress-bar").css("background-color","#f58"),$("#work-progress-bar").is(".indeterminate")&&$("#work-progress-bar").removeClass("indeterminate").css("width","100%"),setTimeout(()=>{$("#work-progress-bar").stop().animate({width:0},500,()=>$("#work-progress-bar").css("background-color","#58f")),"function"==typeof t&&t()},3500)}),stash.workComplete=(()=>{stash.page.hasWork=!1,stash.cache.workProgress=0,$("#work-progress-bar").is(".indeterminate")?$("#work-progress-bar").stop().removeClass("indeterminate").css("width","100%").animate({height:0},500,()=>$("#work-progress-bar").css("width",0).css("height","4px")):$("#work-progress-bar").stop().animate({height:0,width:"100%"},500,()=>$("#work-progress-bar").css("width",0).css("height","4px"))}),$(()=>{$.getJSON("/stash/data.json",t=>{stash.data=t;let e=["V","LV","DV","M","LM","DM"];for(let t in stash.data)if(stash.data.hasOwnProperty(t)){let a={};stash.data[t].P.forEach((t,s)=>{0!==t&&(a[e[s]]=hexToRgb(t))}),stash.data[t].P=a}let a=0;for(let t in stash.data)if(stash.data.hasOwnProperty(t)&&stash.data[t]){~stash.files.all.indexOf(t)||stash.files.all.push(t);let e=getCategory(t);~stash.categories.indexOf(e)||stash.categories.push(e);let s=getContributor(t);~stash.contributors.indexOf(s)||stash.contributors.push(s);let r=parseInt(getID(t));a=Math.max(a,r)}for(var s=0;s<stash.categories.length;s++)stash.files.category[stash.categories[s]]=stash.files.all.filter(categoryFilter(stash.categories[s]));if(stash.categories.sort(naturalSorter),stash.contributors.sort(naturalSorter),null!=localStorage.getItem("stash-max-id")){let t=parseInt(localStorage.getItem("stash-max-id"));if(a>t){let e={id:t+1+"-"+a},s=stash.search(e);stash.notify(`${s.length} new file${s.length>1?"s":""} has been added to the stash.`,[{text:"View",func:()=>{goToPage(toSearchURLParams(e))}}]),localStorage.setItem("stash-max-id",a)}}else localStorage.setItem("stash-max-id",a);new Awesomplete($("#category-input")[0],{list:stash.categories,autoFirst:!0,minChars:1,sort:bestMatchSort($("#category-input"))}),new Awesomplete($("#contributor-input")[0],{list:stash.contributors,autoFirst:!0,sort:bestMatchSort($("#contributor-input"))}),$("body").removeClass("preload"),loadPage()}),$(".menu-title").on("mouseenter",t=>{let e=$(t.currentTarget).find(".menu").addClass("title-hover"),a=e[0].getBoundingClientRect(),s=document.documentElement.clientWidth;a.right>s&&e.addClass("oob")}),$(".menu-title").on("mouseleave",t=>{$(t.currentTarget).find(".menu").removeClass("title-hover")}),$("#color-picker").farbtastic({callback:"#color-picker-input",width:200,onStop:filterResultsByColor}),$("#color-picker-toggle").on("change",t=>{$("#color-picker-toggle").is(":checked")?filterResultsByColor():($("#content").find(".result,.group").removeClass("hidden"),0==$("#content>.result,#content>.group>.result").length?$("#results-count").text(""):$("#results-count").text("Results: "+$("#content .result").length))}),$("#color-picker-input").on("change",t=>{$("#content .result").length<500&&filterResultsByColor()}),$('#search-form>.checkbox>input[type="checkbox"]').each((t,e)=>{$(e).on("change",t=>{$(e).is(":checked")?$(e).parent().next(".container").addClass("open"):$(e).parent().next(".container").removeClass("open")})}),$(".search-on-enter").on("keyup",t=>{13==t.which&&searchWithForm()}),stash.sliderEvents["file-scale"]={change:updateFileScale},tippy("#number-of-selected-files",{placement:"top",arrow:!0,animation:"perspective",dynamicTitle:!0}),$("#deselect-selected-button").on("click",stash.deselectAllFiles),$("#download-selected-button").on("click",stash.selection.download),$("#copy-link-button").on("click",t=>{$("#link-to-selected").select(),document.execCommand("Copy")}),$("#fullscreen-cover").on("click",t=>{$("#fullscreen-cover").addClass("hidden")}),$("body").on("keyup",t=>{27==t.which&&$("#fullscreen-cover").addClass("hidden")}),$(window).on("scroll",()=>{for(const t of document.querySelectorAll(".tippy-popper")){const e=t._tippy;e.state.visible&&(e.popperInstance.disableEventListeners(),e.hide())}}),initSliders(),tippy(".tt",{placement:"right-start",arrow:!0,hideOnClick:!1,animation:"perspective",updateDuration:0,popperOptions:{modifiers:{preventOverflow:{enabled:!1}}}});let t=()=>{setTimeout(()=>{bLazy.revalidate(),t()},$("#results-count").attr("data-val")<1e3?500:2e3)};t()});