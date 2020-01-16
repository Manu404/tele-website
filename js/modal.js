function BindModal(prefix) {
    var modal = document.getElementById(prefix + "Modal");
    var img = document.getElementById(prefix + "Img");
    var modalImg = document.getElementById(prefix + "ModalImg");
    var captionText = document.getElementById(prefix + "ModalCaption");
    img.onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
    };
    var span = document.getElementById(prefix + "ModalClose");
    span.onclick = function () {
        modal.style.display = "none";
    };
}

function BuildModals(){
    var modals = document.getElementsByClassName("modalImage");
    Array.prototype.forEach.call(modals, function(current) {
        var col = document.createElement("div");
        var preview = document.createElement("div");
        var img = document.createElement("img");
        var caption = document.createElement("div");
        var modal = document.createElement("div");
        var modalClose = document.createElement("span");
        var modalImg = document.createElement("img");
        var modalCaption = document.createElement("div");
        var captionPara = document.createElement("p");

        col.classList.add("offset-xl-2", "col-xl-8", "col-md-8", "col-xs-8", "text-center");

        preview.classList.add("preview");

        img.id = current.dataset.id + "Img";
        img.src = current.dataset.url;
        img.alt = current.dataset.caption;
        img.classList.add("img-fluid", "previewImage");

        captionPara.classList.add("previewCaption");

        modal.id = current.dataset.id + "Modal";
        modal.classList.add("modal");

        modalClose.id = current.dataset.id + "ModalClose";
        modalClose.classList.add("modalClose");

        modalImg.id = current.dataset.id + "ModalImg";
        modalImg.classList.add("modal-content");

        modalCaption.id = current.dataset.id + "ModalCaption";
        modalCaption.classList.add("modalCaption");

        modalClose.appendChild(document.createTextNode("x"));

        modal.appendChild(modalClose);
        modal.appendChild(modalImg);
        modal.appendChild(modalCaption);

        captionPara.appendChild(document.createTextNode(current.dataset.caption));
        caption.appendChild(captionPara);

        preview.appendChild(img);
        preview.appendChild(caption);

        col.appendChild(preview);
        col.appendChild(modal);

        current.classList.add("row");

        current.appendChild(col);

        BindModal(current.dataset.id);
    });
}

BuildModals();