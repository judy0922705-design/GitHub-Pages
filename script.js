/* =====================================================
   🌿 單一植物資料（不再內建三盆植物）
===================================================== */

const STORAGE_KEY = "PlantFriend_v3_single";

let plant = {
    diary: {}
};

// 從 localStorage 載入
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
    try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") plant = parsed;
        if (!plant.diary) plant.diary = {};
    } catch {}
}

let currentPage = "homePage";

/* =====================================================
   🌿 頁面切換
===================================================== */
function goToPage(page) {
    document.getElementById(currentPage).classList.remove("active");
    document.getElementById(page).classList.add("active");
    currentPage = page;

    if (page === "diaryPage") renderCalendar();
    if (page === "analysisPage") renderAnalysisPage();
}

/* =====================================================
   🌿 日記（月曆）＋留言
===================================================== */

let selectedDate = "";

function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    grid.innerHTML = "";

    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const days = new Date(y, m + 1, 0).getDate();

    for (let d = 1; d <= days; d++) {
        const dateStr = `${y}-${m + 1}-${d}`;
        const record = plant.diary[dateStr] || {};
        const cell = document.createElement("div");
        cell.dataset.date = dateStr;
        cell.innerHTML = `${d}<br>${record.mood || ""} ${record.watered ? "💧" : ""}`;
        grid.appendChild(cell);
    }
}

document.getElementById("calendarGrid").addEventListener("click", e => {
    const cell = e.target.closest("div");
    if (!cell) return;

    selectedDate = cell.dataset.date;
    const record = plant.diary[selectedDate] || {};

    document.getElementById("popupDateLabel").innerText = `編輯 ${selectedDate}`;
    document.getElementById("moodSelect").value = record.mood || "🙂";
    document.getElementById("waterCheck").checked = record.watered || false;

    const commentInput = document.getElementById("commentInput");
    if (commentInput) commentInput.value = record.comment || "";

    document.getElementById("diaryPopup").classList.remove("hidden");
});

function closePopup() {
    document.getElementById("diaryPopup").classList.add("hidden");
}

function saveDiary() {
    plant.diary[selectedDate] = {
        mood: document.getElementById("moodSelect").value,
        watered: document.getElementById("waterCheck").checked,
        comment: document.getElementById("commentInput")?.value || ""
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(plant));
    closePopup();
    renderCalendar();
}

/* =====================================================
   🌿 AI 分析（上傳圖片 → 顯示數據）
===================================================== */

let uploadedImage = null;

function renderAnalysisPage() {
    const img = document.getElementById("analysisPhoto");
    img.src = uploadedImage || "";
    document.getElementById("analysisResult").innerText = "請上傳植物照片並開始分析";

    const stats = document.getElementById("uploadStats");
    if (stats) stats.style.display = "none";
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        uploadedImage = e.target.result;
        document.getElementById("analysisPhoto").src = uploadedImage;
        document.getElementById("analysisResult").innerText = "照片已上傳，請開始 AI 分析";

        const stats = document.getElementById("uploadStats");
        if (stats) stats.style.display = "none";
    };
    reader.readAsDataURL(file);
}

function runAI() {
    if (!uploadedImage) {
        document.getElementById("analysisResult").innerText = "請先上傳植物照片";
        return;
    }

    // ✅ 模擬影像分析數據（之後你若接真正AI模型，替換這裡即可）
    const health = Math.floor(70 + Math.random() * 30);
    const moisture = Math.floor(30 + Math.random() * 50);
    const light = Math.floor(30 + Math.random() * 50);
    const temp = Math.floor(18 + Math.random() * 10);

    document.getElementById("analysisResult").innerText =
        "分析完成，以下為植物狀態評估結果：";

    document.getElementById("uploadStats").style.display = "block";

    document.getElementById("uHealth").style.width = health + "%";
    document.getElementById("uHealthVal").innerText = health + "%";

    document.getElementById("uMoisture").style.width = moisture + "%";
    document.getElementById("uMoistureVal").innerText = moisture + "%";

    document.getElementById("uLight").style.width = light + "%";
    document.getElementById("uLightVal").innerText = light + "%";

    document.getElementById("uTemp").style.width = (temp / 40) * 100 + "%";
    document.getElementById("uTempVal").innerText = temp + "°C";
}

/* =====================================================
   📘 首頁功能介紹彈出視窗
===================================================== */

function openIntro(type) {
    const title = document.getElementById("introTitle");
    const content = document.getElementById("introContent");
    if (!title || !content) return;

    if (type === "analysis") {
        title.innerText = "📷 植物影像分析";
        content.innerText = "上傳你自己的植物照片，系統會分析植物狀態並提供數據。";
    } else if (type === "care") {
        title.innerText = "🪴 照護建議";
        content.innerText = "根據分析結果，提供澆水、日照與環境調整的建議方向。";
    } else if (type === "data") {
        title.innerText = "📊 狀態數據";
        content.innerText = "以健康度、濕度、光照、溫度等數值與條狀圖呈現目前狀況。";
    }

    document.getElementById("introModal").classList.remove("hidden");
}

function closeIntro() {
    document.getElementById("introModal").classList.add("hidden");
}
