const images = document.querySelectorAll("figure img, .main-img");

images.forEach((img) => {
  img.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.className = "image-overlay";

    const bigImg = document.createElement("img");
    bigImg.src = img.src;

    overlay.appendChild(bigImg);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", () => {
      overlay.remove();
    });
  });
});
