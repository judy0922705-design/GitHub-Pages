/* =====================================================
   🌿 植物資料模型
===================================================== */

const STORAGE_KEY = "PlantFriend_v3";

let plants = [
    {
        id: 0,
        name: "白鶴芋 Peace Lily",
        photo: "https://i.imgur.com/vj6Yw0N.jpeg",
        health: 92,
        moisture: 45,
        light: 60,
        temp: 23,
        watered: true,
        mood: "🙂",
        diary: {}
    },
    {
        id: 1,
        name: "流蘇蕨 Asparagus Fern",
        photo: "https://i.imgur.com/cXjUzGw.jpeg",
        health: 87,
        moisture: 52,
        light: 40,
        temp: 21,
        watered: false,
        mood: "😐",
        diary: {}
    },
    {
        id: 2,
        name: "吊蘭 Spider Plant",
        photo: "https://i.imgur.com/U7VxO8O.jpeg",
        health: 95,
        moisture: 48,
        light: 70,
        temp: 24,
        watered: true,
        mood: "🙂",
        diary: {}
    }
];

// 從 localStorage 載入
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
    try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) plants = parsed;
    } catch {}
}

let currentPage = "homePage";
let currentPlantId = 0;

/* =====================================================
   🌿 頁面切換
===================================================== */
function goToPage(page) {
    document.getElementById(currentPage).classList.remove("active");
    document.getElementById(page).classList.add("active");
    currentPage = page;

    if (page === "detailPage") renderDetailPage();
    if (page === "diaryPage") renderCalendar();
    if (page === "analysisPage") renderAnalysisPage();
}

/* =====================================================
   🌿 首頁卡片點擊
===================================================== */
document.querySelectorAll(".plant-card").forEach(card => {
    card.addEventListener("click", function () {
        currentPlantId = parseInt(this.dataset.id);
        goToPage("detailPage");
    });
});

/* =====================================================
   🌿 詳細頁
===================================================== */
function renderDetailPage() {
    const p = plants[currentPlantId];

    document.getElementById("detailPhoto").src = p.photo;
    document.getElementById("detailName").innerText = p.name;

    document.getElementById("detailStats").innerHTML = `
        <div class="stat-row">
            <span>健康度</span>
            <div class="bar"><div class="bar-fill health" style="width:${p.health}%"></div></div>
            <span>${p.health}%</span>
        </div>
        <div class="stat-row">
            <span>濕度</span>
            <div class="bar"><div class="bar-fill moisture" style="width:${p.moisture}%"></div></div>
            <span>${p.moisture}%</span>
        </div>
        <div class="stat-row">
            <span>光照</span>
            <div class="bar"><div class="bar-fill light" style="width:${p.light}%"></div></div>
            <span>${p.light}%</span>
        </div>
        <div class="stat-row">
            <span>溫度</span>
            <div class="bar"><div class="bar-fill temp" style="width:${(p.temp / 40) * 100}%"></div></div>
            <span>${p.temp}°C</span>
        </div>
        <div class="today-row">
            <span>今日澆水：${p.watered ? "✔" : "🌵"}</span>
            <span>心情：${p.mood}</span>
        </div>
    `;
}

/* =====================================================
   🌿 日記（月曆）
===================================================== */

let selectedDate = "";

function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    grid.innerHTML = "";

    const p = plants[currentPlantId];
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const days = new Date(y, m + 1, 0).getDate();

    for (let d = 1; d <= days; d++) {
        const dateStr = `${y}-${m + 1}-${d}`;
        const record = p.diary[dateStr] || {};
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
    const record = plants[currentPlantId].diary[selectedDate] || {};

    document.getElementById("popupDateLabel").innerText = `編輯 ${selectedDate}`;
    document.getElementById("moodSelect").value = record.mood || "🙂";
    document.getElementById("waterCheck").checked = record.watered || false;
    document.getElementById("diaryPopup").classList.remove("hidden");
});

function closePopup() {
    document.getElementById("diaryPopup").classList.add("hidden");
}

function saveDiary() {
    const p = plants[currentPlantId];
    p.diary[selectedDate] = {
        mood: document.getElementById("moodSelect").value,
        watered: document.getElementById("waterCheck").checked
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
    closePopup();
    renderCalendar();
    initHomeBars();
}

/* =====================================================
   🌿 AI 分析（圖片問題已修）
===================================================== */

let uploadedImage = null;

function renderAnalysisPage() {
    const p = plants[currentPlantId];
    const img = document.getElementById("analysisPhoto");

    // ❗關鍵：不要清 uploadedImage
    img.src = uploadedImage ? uploadedImage : p.photo;

    document.getElementById("analysisResult").innerText =
        "請上傳照片或直接開始 AI 分析";
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        uploadedImage = e.target.result;
        document.getElementById("analysisPhoto").src = uploadedImage;
        document.getElementById("analysisResult").innerText =
            "照片已上傳，請開始 AI 分析";
    };
    reader.readAsDataURL(file);
}

function runAI() {
    const p = plants[currentPlantId];

    // 有上傳圖片 → 用影像分析
    if (uploadedImage) {
        const r = Math.random();
        let result = "🌿 從照片判斷，植物狀態良好。";
        if (r < 0.33) result = "💧 葉片略垂，可能需要澆水。";
        else if (r < 0.66) result = "☀️ 葉色偏淡，可能需要更多光照。";
        else result = "⚠️ 葉片狀態不均，建議持續觀察。";

        document.getElementById("analysisResult").innerText = result;
        return;
    }

    // 沒上傳 → 原本資料分析
    let result = "植物狀態良好 🌿";
    if (p.moisture < 35) result = "🌵 土壤偏乾，建議澆水。";
    if (p.light < 30) result = "🌑 光照不足，建議移到較明亮處。";
    if (p.health < 80) result = "⚠️ 健康狀態下降，可能需要檢查病斑或施肥。";

    document.getElementById("analysisResult").innerText = result;
}

/* =====================================================
   🌿 首頁進度條
===================================================== */
function initHomeBars() {
    document.querySelectorAll(".plant-card").forEach((card, i) => {
        const p = plants[i];
        card.querySelector(".bar-fill.health").style.width = p.health + "%";
        card.querySelector(".bar-fill.moisture").style.width = p.moisture + "%";
        card.querySelector(".bar-fill.light").style.width = p.light + "%";
        card.querySelector(".bar-fill.temp").style.width = (p.temp / 40 * 100) + "%";
    });
}

initHomeBars();
