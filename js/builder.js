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
    var h = document.createElement("h1");
    var text = document.createTextNode(content);

    row.classList.add("footer");
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

    col.appendChild(img);
    row.appendChild(col);

    return row;
}

function build(xml) {
    resetHolders();
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
            newNode = (buildModalImage(node.getAttribute("id"), node.getAttribute("url"), node.textContent));
        }
        else if(node.nodeName === "header") {
            newNode = (buildHeader(node.getAttribute("url"), node.textContent));
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

function resetHolders(){
    document.getElementById("contentHolder").innerHTML = "";
    document.getElementById("modalHolder").innerHTML = "";
}

