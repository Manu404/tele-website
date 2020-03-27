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
    var p = document.createElement("p");
    var text = document.createTextNode(content);

    row.classList.add("band");
    col.classList.add("text-center");

    p.innerHTML = content;

    col.appendChild(p);
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

function buildModal(id, titleContentText, closeCaptionText, contentText) {
    var modal = document.createElement("div");
    var dialog = document.createElement("div");
    var content = document.createElement("div");
    var header = document.createElement("div");
    var body = document.createElement("div");
    var footer = document.createElement("div");
    var title = document.createElement("h5");
    var titleText = document.createTextNode(titleContentText);
    var titleCloseButton = document.createElement("button");
    var closeButton = document.createElement("button");
    var modalClose = document.createElement("span");

    modal.classList.add("modal", "fade");
    dialog.classList.add("modal-dialog");
    content.classList.add("modal-content");
    header.classList.add("modal-header");
    body.classList.add("modal-body");
    footer.classList.add("modal-footer");

    title.classList.add("modal-title");
    title.appendChild(titleText);

    titleCloseButton.classList.add("close");
    titleCloseButton.type = "button";
    titleCloseButton.setAttribute("data-dismiss", "modal");
    modalClose.appendChild(document.createTextNode("x"));
    titleCloseButton.appendChild(modalClose);

    header.appendChild(title);
    header.appendChild(titleCloseButton);

    body.innerHTML = contentText;

    closeButton.classList.add("btn");
    closeButton.type = "button";
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.appendChild(document.createTextNode(closeCaptionText));

    footer.appendChild(closeButton);

    content.appendChild(header);
    content.appendChild(body);
    content.appendChild(footer);

    dialog.appendChild(content);

    modal.appendChild(dialog);
    modal.id=id;

    return modal;
}

function buildModalLink(caption, id){
    var link = document.createElement("a");
    link.classList.add("nav-item");
    link.href = "#";
    link.setAttribute("data-toggle", "modal");
    link.setAttribute("data-target", "#" + id);
    link.appendChild(document.createTextNode(caption));
    return link;
}

function builDynamicdBackgroundOption(caption, moment){

}


function buildDynamicBackgroundHolder(node){
    var nav = document.createElement("li");
    var nava = document.createElement("a");
    var menu = document.createElement("div");
    var icon = document.createElement("span");
    var list = document.createElement("ul");

    nav.classList.add("nav-item", "dropdown");
    nava.classList.add("nav-link", "dropdown-toggle");
    nava.href = "#";
    nava.setAttribute("data-toggle", "dropdown");
    icon.classList.add("fas", "fa-cloud-moon");
    nava.appendChild(icon);
    menu.classList.add("dropdown-menu");
    list.classList.add("list-inline");

    for (var ib = 0; ib < node.children.length; ib++) {
        var bg_node = node.children[ib];

        if(bg_node.nodeName === "bg") {
            var li = document.createElement("li");
            li.classList.add("nav-item");
            var a = document.createElement("a");
            a.classList.add("nav-link");
            a.href = "#";
            a.dataset.moment = bg_node.getAttribute("moment");
            a.innerText = bg_node.getAttribute("caption");
            a.onclick = function (source) {
                loadBackgroundImage(source.target.dataset.moment);
            };
            li.appendChild(a);
            list.appendChild(li);
            list.appendChild(document.createTextNode(" "));
        }
    }
    menu.appendChild(list);

    nav.appendChild(nava);
    nav.appendChild(menu);

    return nav;
}

function loadBackgroundImage(name){
    if(document.getElementById(name) != null)
    {
        showBackgroundImage(name);
    }
    else {
        var img = document.createElement("img");
        img.src = "img/bg_" + name + ".jpg";
        img.id = name;
        img.classList.add("bg-img");
        img.onload = function (source) {
            showBackgroundImage(source.target.id);
        };
        document.getElementsByClassName('bgImgHolder')[0].appendChild(img);
    }
}

function showBackgroundImage(name){
    var visible = document.getElementsByClassName('bg-visible');
    for(var i = 0; visible.length; i++){
        visible[i].classList.remove("bg-visible");
    }
    document.getElementById(name).classList.add("bg-visible");
}

function loadCurrentBackground() {
    var current = (new Date()).getHours();
    var name;
    if(current >= 6 && current < 13) {  name = "morning"; }
    else if(current >= 13 && current < 19) { name = "day"; }
    else if(current >= 19 && current < 22) { name = "evening"; }
    else if(current >= 22 && current < 3) { name = "night"; }
    else if(current >= 3 && current < 6) { name = "sleep"; }
    else {
        return;
    }
    loadBackgroundImage(name);
}
loadCurrentBackground();

function buildLanguageSelector(selected) {
    var nav = document.createElement("li");
    var nava = document.createElement("a");
    var menu = document.createElement("div");
    var icon = document.createElement("span");

    nav.classList.add("navbar-nav");

    for(var i = 0;  i < availableLang.length; i++){
        var li = document.createElement("li");
        li.classList.add("nav-item");
        var a = document.createElement("a");
        a.classList.add("nav-link");
        a.href = "#";
        a.dataset.lang = availableLang[i];
        a.innerText = availableLang[i].toUpperCase();
        a.onclick = function(source)  {
            loadLanguageFile(source.target.dataset.lang);
        };
        if(selected === availableLang[i])
            a.classList.add("selected");
        li.appendChild(a);
        nav.appendChild(li);
    }

    return nav;
}

function buildNavBar() {
    var nav = document.createElement("nav");
    var toggleButton = document.createElement("button");
    var toggleIcon = document.createElement("span");
    var modalLinks = document.createElement("div");
    var languageList = document.createElement("ul");
    var bgSelect = document.createElement("ul");
    var leftNavHolder = document.createElement("div");

    nav.classList.add("navbar", "navbar-expand-sm", "navbar-dark", "bg-translucid-dark", "fixed-top");
    toggleButton.classList.add("navbar-toggler");
    toggleButton.type = "button";
    toggleButton.setAttribute("data-toggle", "collapse");
    toggleButton.setAttribute("data-target", "#collapseBar");
    toggleIcon.classList.add("navbar-toggler-icon");
    toggleButton.appendChild(toggleIcon);

    modalLinks.id="modalLinks";

    languageList.classList.add("navbar-nav");
    languageList.id = "languageList";
    bgSelect.classList.add("navbar-nav");
    bgSelect.id="bgSelect";
    leftNavHolder.classList.add("navbar-nav","ml-auto");
    leftNavHolder.appendChild(languageList);
    leftNavHolder.appendChild(bgSelect);

    nav.appendChild(modalLinks);
    nav.appendChild(leftNavHolder);

    return nav;
}

function buildPage(xml) {
    clearHolders();
    document.getElementById("modalHolder").appendChild(buildModalHolder());
    document.getElementById("navHolder").appendChild(buildNavBar());
    document.getElementById("languageList").appendChild(buildLanguageSelector(xml.getAttribute("lang")));

    var content  = document.createElement("div");
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
        else if(node.nodeName === "modal") {
            newNode = (buildModal(node.getAttribute("id"), node.getAttribute("title"), node.getAttribute("closeCaption"), node.textContent));
            document.getElementById("modalLinks").appendChild(buildModalLink(node.getAttribute("link"),node.getAttribute("id")));
        }
        else if(node.nodeName === "background") {
            document.getElementById("bgSelect").appendChild(buildDynamicBackgroundHolder(node));
        }
        if(newNode != null)
            content.appendChild(newNode);
    }
    document.getElementById("contentHolder").appendChild(content);
    document.title = xml.getAttribute("title");
}

function clearHolders(){
    document.getElementById("contentHolder").innerHTML = "";
    document.getElementById("modalHolder").innerHTML = "";
    document.getElementById("navHolder").innerText = "";
}

