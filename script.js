// 閱讀進度條
const progressBar = document.createElement("div");
progressBar.className = "progress-bar";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + "%";
});

// 圖片點擊放大
const images = document.querySelectorAll(".article img");

images.forEach((img) => {
  img.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.className = "image-overlay";

    const bigImg = document.createElement("img");
    bigImg.src = img.src;
    bigImg.alt = img.alt;

    overlay.appendChild(bigImg);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", () => {
      overlay.remove();
    });
  });
});

// 返回頂端按鈕
const topButton = document.createElement("button");
topButton.className = "top-button";
topButton.innerText = "TOP";
document.body.appendChild(topButton);

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    topButton.classList.add("show");
  } else {
    topButton.classList.remove("show");
  }
});

topButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
