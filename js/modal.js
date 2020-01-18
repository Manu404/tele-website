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

function buildModalImage(id, url,  cap){
    var row = buildDefaultRow();
    var col = buildDefaultCol();
    var preview = document.createElement("div");
    var img = document.createElement("img");
    var caption = document.createElement("div");
    var captionPara = document.createElement("p");

    var modal = document.getElementById("Modal");
    var modalImg = document.getElementById("ModalImg");
    var captionText = document.getElementById("ModalCaption");

    col.classList.add("text-center");

    preview.classList.add("preview");

    img.id = id + "Img";
    img.src = url;
    img.alt = cap;
    img.classList.add("img-fluid", "previewImage");
    img.onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
    };

    captionPara.classList.add("previewCaption");

    captionPara.innerHTML = cap;
    caption.appendChild(captionPara);
    preview.appendChild(img);
    preview.appendChild(caption);
    col.appendChild(preview);
    row.classList.add("row");
    row.appendChild(col);
    return row;
}
