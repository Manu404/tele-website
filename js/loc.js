var availableLang = ["fr", "en", "nl"];
var defaultLanguage = "en";
var cachedLanguage = [];

function downloadLanguageFile(lang) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            cachedLanguage[lang] = this.responseXML.getElementsByTagName("content")[0];
            buildPage(cachedLanguage[lang]);
        }
    };
    xmlhttp.open("GET", "content/"+lang+".xml", true);
    xmlhttp.send();
}

function loadLanguageFile(lang) {
    if(!availableLang.includes(lang)) lang = defaultLanguage;
    setCookie("lang", lang, 15);
    if(cachedLanguage[lang] === undefined)
        downloadLanguageFile(lang);
    else
        buildPage(cachedLanguage[lang]);
}

function loadLanguage(){
    var lang = getCookie("lang");
    if(availableLang.includes(lang))
        loadLanguageFile(lang);
    else if(availableLang.includes(navigator.language))
        loadLanguageFile(navigator.language);
    else
        loadLanguageFile(defaultLanguage);
}

loadLanguage();
