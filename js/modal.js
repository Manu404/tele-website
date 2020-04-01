function buildModalHolder() {
    var modal = document.createElement("div");
    var modalImg = document.createElement("img");
    var modalCaption = document.createElement("div");

    modal.classList.add("modal-img", "modal");
    modal.id="Modal";

    modalImg.id ="ModalImg";
    modalImg.classList.add("modal-content");
    modalImg.onclick = function () {
        modal.style.display = "none";
    };

    modalCaption.id = "ModalCaption";
    modalCaption.classList.add("modalCaption");

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

    img.src = buildImageUrl(url + "_min", "jpg");
    img.alt = cap;
    img.dataset.imgUrl = buildImageUrl(url, "jpg");
    img.classList.add("img-fluid", "previewImage");
    img.onclick = function (source) {
        modal.style.display = "block";
        modalImg.src = source.target.dataset.imgUrl;
        modalCaption.innerHTML = source.target.alt;
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

