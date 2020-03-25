function  buildDefaultCol() {
    var col = document.createElement("div");
    col.classList.add("offset-xl-2", "col-xl-8", "col-md-8", "col-xs-8");
    return col;
}

function buildDefaultRow(){
    var row = document.createElement("div");
    row.classList.add("row");
    return row;
}

function buildTitle(content, direction){
    var row = buildDefaultRow();
    var h = document.createElement("h3");
    var text = document.createTextNode(content);
    var col = buildDefaultCol();

    h.classList.add((direction === 1 ? "float-right" : "float-left"));

    h.appendChild(text);
    col.appendChild(h);
    row.appendChild(col);

    return row;
}

function buildFooter(content){
    var row = buildDefaultRow();
    var col = buildDefaultCol();
    var p = document.createElement("p");

    row.classList.add("footer");
    col.classList.add("text-center");

    p.innerHTML = content;

    col.appendChild(p);
    row.appendChild(col);

    return row;
}

function buildBand(content){
    var row = buildDefaultRow();
    var col = buildDefaultCol();
    var h = document.createElement("h1");
    var text = document.createTextNode(content);

    row.classList.add("band");
    col.classList.add("text-center");

    h.appendChild(text);
    col.appendChild(h);
    row.appendChild(col);

    return row;
}

function buildText(content){
    var row = buildDefaultRow();
    var col = buildDefaultCol();
    var p = document.createElement("p");

    p.innerHTML = content;
    col.appendChild(p);
    row.appendChild(col);

    return row;
}

function buildHeader(url, caption){
    var row = buildDefaultRow();
    var col = document.createElement("div");
    var img = document.createElement("img");

    img.classList.add("img-fluid", "header-image");
    img.src = url;
    img.alt = caption;

    col.classList.add("col-12", "text-center");

    row.classList.add("header")

    col.appendChild(img);
    row.appendChild(col);

    return row;
}

function buildPage(xml) {
    clearHolders();
    buildLanguageSelector(xml.getAttribute("lang"));
    var content  = document.createElement("div");
    document.getElementById("modalHolder").appendChild(buildModalHolder());
    for (var i = 0, t = 0; i< xml.children.length; i++) {
        var node = xml.children[i];
        var newNode;
        if(node.nodeName === "title"){
            newNode = (buildTitle(node.textContent, t++ % 2));
        }
        else if(node.nodeName === "text") {
            newNode = (buildText(node.textContent));
        }
        else if(node.nodeName === "image") {
            newNode = (buildModalImage(node.getAttribute("url"), node.textContent));
        }
        else if(node.nodeName === "header") {
            newNode = (buildHeader(node.getAttribute("url"), node.textContent));
        }
        else if(node.nodeName === "band") {
            newNode = (buildBand(node.textContent));
        }
        else if(node.nodeName === "footer") {
            newNode = (buildFooter(node.textContent));
        }
        if(newNode != null)
            content.appendChild(newNode);
    }
    document.getElementById("contentHolder").appendChild(content);
    document.title = xml.getAttribute("title");
}

function buildLanguageSelector(selected) {
    for(var i = 0;  i < availableLang.length; i++){
        var option = document.createElement("a");
        option.href = "#";
        option.dataset.lang = availableLang[i];
        option.innerText = availableLang[i].toUpperCase();
        option.onclick = function(source)  {
            loadLanguageFile(source.target.dataset.lang);
        };
        if(selected === availableLang[i])
            option.classList.add("selected");
        document.getElementById("languageList").appendChild(option);
        document.getElementById("languageList").appendChild(document.createTextNode(" "));

    }
}

function clearHolders(){
    document.getElementById("contentHolder").innerHTML = "";
    document.getElementById("modalHolder").innerHTML = "";
    document.getElementById("languageList").innerHTML = "";
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

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

function buildModalHolder() {
    var modal = document.createElement("div");
    var modalClose = document.createElement("span");
    var modalImg = document.createElement("img");
    var modalCaption = document.createElement("div");

    modal.classList.add("modal");
    modal.id="Modal";

    modalClose.id = "ModalClose";
    modalClose.classList.add("modalClose");
    modalClose.onclick = function () {
        modal.style.display = "none";
    };

    modalImg.id ="ModalImg";
    modalImg.classList.add("modal-content");

    modalCaption.id = "ModalCaption";
    modalCaption.classList.add("modalCaption");

    modalClose.appendChild(document.createTextNode("x"));

    modal.appendChild(modalClose);
    modal.appendChild(modalImg);
    modal.appendChild(modalCaption);

    return modal;
}

function buildModalImage(url,  cap){
    var row = buildDefaultRow();
    var col = buildDefaultCol();
    var preview = document.createElement("div");
    var img = document.createElement("img");
    var caption = document.createElement("div");
    var captionPara = document.createElement("p");

    var modal = document.getElementById("Modal");
    var modalImg = document.getElementById("ModalImg");
    var modalCaption = document.getElementById("ModalCaption");

    col.classList.add("text-center");

    preview.classList.add("preview");

    img.src = url;
    img.alt = cap;
    img.classList.add("img-fluid", "previewImage");
    img.onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        modalCaption.innerHTML = this.alt;
    };

    captionPara.classList.add("previewCaption");

    captionPara.innerHTML = cap;
    caption.appendChild(captionPara);
    preview.appendChild(img);
    preview.appendChild(caption);
    col.appendChild(preview);
    row.appendChild(col);
    return row;
}
