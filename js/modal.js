function buildModalHolder() {
    var modal = document.createElement("div");
    var modalImg = document.createElement("img");
    var modalCaption = document.createElement("div");

    modal.classList.add("modal-img", "modal");
    modal.id="Modal";

    modalImg.id ="ModalImg";
    modalImg.classList.add("modal-content");

    modalCaption.id = "ModalCaption";
    modalCaption.classList.add("modalCaption");

    modal.appendChild(modalImg);
    modal.appendChild(modalCaption);

    modal.onclick = function () {
        modal.style.display = "none";
    };

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

