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
    document.getElementById("commentInput").value = record.comment || "";

    document.getElementById("diaryPopup").classList.remove("hidden");
});

function closePopup() {
    document.getElementById("diaryPopup").classList.add("hidden");
}

function saveDiary() {
    plant.diary[selectedDate] = {
        mood: document.getElementById("moodSelect").value,
        watered: document.getElementById("waterCheck").checked,
        comment: document.getElementById("commentInput").value || ""
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(plant));
    closePopup();
    renderCalendar();
}

/* =====================================================
   🌿 AI 規則模型：結合感測數據＋日記
===================================================== */

function countDaysWithoutWater() {
    const dates = Object.keys(plant.diary).sort().reverse();
    let count = 0;

    for (const date of dates) {
        if (plant.diary[date].watered) break;
        count++;
    }
    return count;
}

function generateCareAdvice(health, moisture, light, temp) {
    let advice = [];
    let waterSuggest = "";

    const noWaterDays = countDaysWithoutWater();

    // 🌧 澆水判斷（核心 AI 規則）
    if (moisture < 30) {
        advice.push("土壤偏乾，植物可能缺水。");
        waterSuggest = "🌧 建議：24 小時內澆水";
    } else if (moisture > 75) {
        advice.push("土壤濕度過高，需注意爛根風險。");
        waterSuggest = "⚠ 建議：暫停澆水並增加通風";
    } else {
        waterSuggest = "✅ 目前不需澆水";
    }

    // 📓 日記輔助判斷（超加分）
    if (noWaterDays >= 3 && moisture < 40) {
        advice.push("已多日未澆水，建議立即補充水分。");
    }

    // ☀️ 光照
    if (light < 40) {
        advice.push("光照不足，建議移至較明亮位置。");
    }

    // 🌡 溫度
    if (temp < 15 || temp > 32) {
        advice.push("環境溫度可能影響植物生長。");
    }

    // ❤️ 健康
    if (health < 50) {
        advice.push("整體健康狀況偏低，建議密切觀察。");
    }

    return {
        adviceText: advice.join(" "),
        waterSuggest
    };
}

/* =====================================================
   🌿 AI 分析（上傳圖片 → 數據 → 照護建議）
===================================================== */

let uploadedImage = null;

function renderAnalysisPage() {
    document.getElementById("analysisPhoto").src = uploadedImage || "";
    document.getElementById("analysisResult").innerText = "請上傳植物照片並開始分析";
    document.getElementById("uploadStats").style.display = "none";
    document.getElementById("careAdvice").style.display = "none";
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        uploadedImage = e.target.result;
        document.getElementById("analysisPhoto").src = uploadedImage;
        document.getElementById("analysisResult").innerText = "照片已上傳，請開始 AI 分析";
        document.getElementById("uploadStats").style.display = "none";
        document.getElementById("careAdvice").style.display = "none";
    };
    reader.readAsDataURL(file);
}

function runAI() {
    if (!uploadedImage) {
        document.getElementById("analysisResult").innerText = "請先上傳植物照片";
        return;
    }

    // 🌿 模擬感測數據（未來可接 IoT / AI）
    const health = Math.floor(60 + Math.random() * 30);
    const moisture = Math.floor(20 + Math.random() * 60);
    const light = Math.floor(20 + Math.random() * 70);
    const temp = Math.floor(18 + Math.random() * 12);

    document.getElementById("analysisResult").innerText =
        "分析完成，以下為植物狀態與智慧照護建議：";

    document.getElementById("uploadStats").style.display = "block";

    document.getElementById("uHealth").style.width = health + "%";
    document.getElementById("uHealthVal").innerText = health + "%";

    document.getElementById("uMoisture").style.width = moisture + "%";
    document.getElementById("uMoistureVal").innerText = moisture + "%";

    document.getElementById("uLight").style.width = light + "%";
    document.getElementById("uLightVal").innerText = light + "%";

    document.getElementById("uTemp").style.width = (temp / 40) * 100 + "%";
    document.getElementById("uTempVal").innerText = temp + "°C";

    // 🧠 AI 照護建議
    const result = generateCareAdvice(health, moisture, light, temp);

    document.getElementById("careAdvice").style.display = "block";
    document.getElementById("adviceText").innerText = result.adviceText;
    document.getElementById("waterSuggest").innerText = result.waterSuggest;
}

/* =====================================================
   📘 首頁功能介紹彈出視窗
===================================================== */

function openIntro(type) {
    const title = document.getElementById("introTitle");
    const content = document.getElementById("introContent");

    if (type === "analysis") {
        title.innerText = "📷 植物影像分析";
        content.innerText = "上傳植物照片，系統會分析植物狀態並提供數據與照護建議。";
    } else if (type === "care") {
        title.innerText = "🪴 智慧照護建議";
        content.innerText = "結合感測數據與使用者紀錄，提供澆水與環境調整建議。";
    } else if (type === "data") {
        title.innerText = "📊 狀態數據";
        content.innerText = "以圖表方式呈現植物健康、濕度、光照與溫度。";
    }

    document.getElementById("introModal").classList.remove("hidden");
}

function closeIntro() {
    document.getElementById("introModal").classList.add("hidden");
}
