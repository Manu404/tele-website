var availableLang = ["fr","en"];
var defaultLanguage = "en";
var cachedLanguage = [];

function languageExist(lang){
    for(var i = 0; i < availableLang.length; i++){
        if(availableLang[i] === lang) return true;
    }
    return false;
}

function downloadLanguageFile(lang) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var xml = this.responseXML.getElementsByTagName("content")[0];
            cachedLanguage[lang] = xml;
            build(xml);
        }
    };
    xmlhttp.open("GET", "content_"+lang+".xml", true);
    xmlhttp.send();
}

function loadLanguageFile(lang) {
    if(!languageExist(lang)) lang = defaultLanguage;
    setCookie("lang", lang, 15);
    if(cachedLanguage[lang] === undefined)
        downloadLanguageFile(lang);
    else
        build(cachedLanguage[lang]);
}

function loadLanguage(){
    var lang = getCookie("lang");
    if(languageExist(lang))
        loadLanguageFile(lang);
    else if(languageExist(navigator.language))
        loadLanguageFile(navigator.language);
    else
        loadLanguageFile(defaultLanguage);
}

loadLanguage();
