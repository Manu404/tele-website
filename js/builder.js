function getContentAsync() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            build(this);
        }
    };
    xmlhttp.open("GET", "content.xml", true);
    xmlhttp.send();
}

function buildTitle(content, direction){
    var row = document.createElement("div");
    var col = document.createElement("div");
    var h = document.createElement("h3");
    var text = document.createTextNode(content);

    row.classList.add("row");
    col.classList.add("offset-xl-2", "col-xl-8", "col-md-8", "col-xs-8");
    h.classList.add((direction == 1 ? "float-right" : "float-left"));

    h.appendChild(text);
    col.appendChild(h);
    row.appendChild(col);

    return row;
}

function buildText(content){
    var row = document.createElement("div");
    var col = document.createElement("div");
    var p = document.createElement("p");
    var text = document.createTextNode(content);

    row.classList.add("row");
    col.classList.add("offset-xl-2", "col-xl-8", "col-md-8", "col-xs-8");

    p.appendChild(text);
    col.appendChild(p);
    row.appendChild(col);

    return row;
}

function buildImage(id, url, caption){
    var img = document.createElement("div");
    img.classList.add("modalImage");
    img.dataset.id = id;
    img.dataset.url = url;
    img.dataset.caption = caption;
    buildModal(img);
    return img;
}

function buildHeader(url, caption){
    var row = document.createElement("div");
    var col = document.createElement("div");
    var img = document.createElement("img");

    img.classList.add("img-fluid", "header-image");
    img.src = url;
    img.alt = caption;

    row.classList.add("row");
    col.classList.add("col-12", "text-center");

    col.appendChild(img);
    row.appendChild(col);

    return row;
}

function build(xml) {
    var content  = document.createElement("div");
    var x = xml.responseXML.getElementsByTagName("content")[0];
    document.getElementById("modalHolder").appendChild(buildHolder());
    for (var i = 0, t = 0; i< x.children.length; i++) {
        var node = x.children[i];
        var newNode;
        if(node.nodeName === "title"){
            newNode = (buildTitle(node.textContent, t++ % 2));
        }
        else if(node.nodeName === "text") {
            newNode = (buildText(node.textContent));
        }
        else if(node.nodeName === "image") {
            newNode = (buildImage(node.getAttribute("id"), node.getAttribute("url"), node.textContent));
        }
        else if(node.nodeName === "header") {
            newNode = (buildHeader(node.getAttribute("url"), node.textContent));
        }
        if(newNode != null)
            content.appendChild(newNode);
    }
    document.getElementById("contentHolder").appendChild(content);
    document.title = x.getAttribute("title");
}

getContentAsync();
