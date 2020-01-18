function buildHolder() {
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

function buildModal(current){
    var col = document.createElement("div");
    var preview = document.createElement("div");
    var img = document.createElement("img");
    var caption = document.createElement("div");
    var captionPara = document.createElement("p");

    var modal = document.getElementById("Modal");
    var modalImg = document.getElementById("ModalImg");
    var captionText = document.getElementById("ModalCaption");

    col.classList.add("offset-xl-2", "col-xl-8", "col-md-8", "col-xs-8", "text-center");

    preview.classList.add("preview");

    img.id = current.dataset.id + "Img";
    img.src = current.dataset.url;
    img.alt = current.dataset.caption;
    img.classList.add("img-fluid", "previewImage");
    img.onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
    };

    captionPara.classList.add("previewCaption");

    captionPara.appendChild(document.createTextNode(current.dataset.caption));
    caption.appendChild(captionPara);
    preview.appendChild(img);
    preview.appendChild(caption);
    col.appendChild(preview);
    current.classList.add("row");
    current.appendChild(col);



}
