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
   🔧 小工具：安全取得元素（避免找不到就整個壞掉）
===================================================== */
function $(id) {
    return document.getElementById(id);
}

/* =====================================================
   🌿 頁面切換
===================================================== */
function goToPage(page) {
    $(currentPage).classList.remove("active");
    $(page).classList.add("active");
    currentPage = page;

    if (page === "diaryPage") renderCalendar();
    if (page === "analysisPage") renderAnalysisPage();
}

/* =====================================================
   🌿 日記（月曆）＋留言
===================================================== */

let selectedDate = "";

function renderCalendar() {
    const grid = $("calendarGrid");
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

$("calendarGrid").addEventListener("click", e => {
    const cell = e.target.closest("div");
    if (!cell) return;

    selectedDate = cell.dataset.date;
    const record = plant.diary[selectedDate] || {};

    $("popupDateLabel").innerText = `編輯 ${selectedDate}`;
    $("moodSelect").value = record.mood || "🙂";
    $("waterCheck").checked = record.watered || false;

    const commentInput = $("commentInput");
    if (commentInput) commentInput.value = record.comment || "";

    $("diaryPopup").classList.remove("hidden");
});

function closePopup() {
    $("diaryPopup").classList.add("hidden");
}

function saveDiary() {
    plant.diary[selectedDate] = {
        mood: $("moodSelect").value,
        watered: $("waterCheck").checked,
        comment: $("commentInput")?.value || ""
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(plant));
    closePopup();
    renderCalendar();
}

/* =====================================================
   🧠 智慧判斷：把日記也納入（連續幾天沒澆水）
===================================================== */

// 將 yyyy-m-d 轉 yyyy-mm-dd（避免排序錯亂）
function normalizeDateKey(key) {
    const parts = key.split("-");
    if (parts.length !== 3) return key;
    const y = parts[0];
    const m = String(parts[1]).padStart(2, "0");
    const d = String(parts[2]).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

// 計算「最近連續幾天沒有勾澆水」
// 例如：最近一天澆水在 12/10，今天 12/13 → 會得到 2~3（依你日記有沒有填）
function countConsecutiveDaysWithoutWater(maxCheck = 10) {
    const keys = Object.keys(plant.diary || {}).map(normalizeDateKey).sort(); // 由舊到新
    if (keys.length === 0) return 0;

    // 從最新的紀錄往回看
    let count = 0;
    for (let i = keys.length - 1; i >= 0 && count < maxCheck; i--) {
        const record = plant.diary[keys[i]];
        if (record?.watered) break;
        count++;
    }
    return count;
}

// 規則型 AI：輸入數值 → 輸出照護建議
function generateCareAdvice({ health, moisture, light, temp }) {
    const advice = [];
    let waterSuggest = "";
    let statusLabel = "";

    const noWaterDays = countConsecutiveDaysWithoutWater();

    // 🌧 濕度/澆水建議
    if (moisture < 30) {
        statusLabel = "🔴 缺水警告";
        advice.push("土壤偏乾，植物可能缺水。");
        waterSuggest = "🌧 建議：24 小時內澆水";
    } else if (moisture > 75) {
        statusLabel = "🟠 濕度過高";
        advice.push("土壤濕度過高，需注意爛根風險。");
        waterSuggest = "⚠ 建議：暫停澆水並增加通風";
    } else {
        statusLabel = "🟢 狀態良好";
        advice.push("土壤濕度適中。");
        waterSuggest = "✅ 目前不需澆水";
    }

    // 📓 日記輔助判斷（連續多日沒澆水 + 濕度偏低 → 強化提醒）
    if (noWaterDays >= 3 && moisture < 40) {
        advice.push(`已連續 ${noWaterDays} 天未勾選澆水紀錄，建議立即補充水分。`);
        statusLabel = "🔴 缺水警告";
        waterSuggest = "🌧 建議：立即澆水（並觀察 3 小時後濕度）";
    }

    // ☀️ 光照
    if (light < 40) {
        advice.push("光照不足，建議移至較明亮位置或靠窗。");
        if (statusLabel === "🟢 狀態良好") statusLabel = "🟡 光照不足";
    }

    // 🌡 溫度
    if (temp < 15) advice.push("溫度偏低，注意保暖或移至室內較溫暖處。");
    if (temp > 32) advice.push("溫度偏高，避免直曬並增加通風。");

    // ❤️ 健康
    if (health < 50) {
        advice.push("整體健康度偏低，建議檢查是否黃葉、蟲害或根部狀況。");
        if (!statusLabel.startsWith("🔴")) statusLabel = "🟠 需要留意";
    }

    return {
        statusLabel,
        adviceText: advice.join(" "),
        waterSuggest
    };
}

/* =====================================================
   🌿 AI 分析（上傳圖片 → 顯示數據 + 智慧照護建議）
===================================================== */

let uploadedImage = null;

// ✅ 自動建立照護建議區塊（避免你忘記改 HTML）
function ensureCareAdviceUI() {
    // 如果已存在就不重建
    if ($("careAdvice") && $("adviceText") && $("waterSuggest")) return;

    const analysisPage = $("analysisPage");
    if (!analysisPage) return;

    // 建議插在 uploadStats 後面，若沒有就插在 analysisResult 後
    const afterNode = $("uploadStats") || $("analysisResult");
    if (!afterNode) return;

    const box = document.createElement("div");
    box.id = "careAdvice";
    box.className = "analysis-box";
    box.style.display = "none";
    box.innerHTML = `
        <h3>🌱 智慧照護建議</h3>
        <p id="statusLabel" style="font-weight:800; margin:6px 0 10px;"></p>
        <p id="adviceText">—</p>
        <p id="waterSuggest" style="font-weight:800; margin-top:10px;"></p>
        <p id="diaryHint" style="font-size:13px; color:#666; margin-top:8px;"></p>
    `;

    afterNode.insertAdjacentElement("afterend", box);
}

function renderAnalysisPage() {
    ensureCareAdviceUI();

    const img = $("analysisPhoto");
    img.src = uploadedImage || "";
    $("analysisResult").innerText = "請上傳植物照片並開始分析";

    const stats = $("uploadStats");
    if (stats) stats.style.display = "none";

    const care = $("careAdvice");
    if (care) care.style.display = "none";
}

function handleImageUpload(event) {
    ensureCareAdviceUI();

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        uploadedImage = e.target.result;
        $("analysisPhoto").src = uploadedImage;
        $("analysisResult").innerText = "照片已上傳，請開始 AI 分析";

        const stats = $("uploadStats");
        if (stats) stats.style.display = "none";

        const care = $("careAdvice");
        if (care) care.style.display = "none";
    };
    reader.readAsDataURL(file);
}

function runAI() {
    ensureCareAdviceUI();

    if (!uploadedImage) {
        $("analysisResult").innerText = "請先上傳植物照片";
        return;
    }

    // ✅ 模擬影像分析數據（之後你若接真正AI模型，替換這裡即可）
    const health = Math.floor(70 + Math.random() * 30);      // 70~99
    const moisture = Math.floor(30 + Math.random() * 50);    // 30~79
    const light = Math.floor(30 + Math.random() * 50);       // 30~79
    const temp = Math.floor(18 + Math.random() * 10);        // 18~27

    $("analysisResult").innerText =
        "分析完成，以下為植物狀態評估結果與智慧建議：";

    $("uploadStats").style.display = "block";

    $("uHealth").style.width = health + "%";
    $("uHealthVal").innerText = health + "%";

    $("uMoisture").style.width = moisture + "%";
    $("uMoistureVal").innerText = moisture + "%";

    $("uLight").style.width = light + "%";
    $("uLightVal").innerText = light + "%";

    $("uTemp").style.width = (temp / 40) * 100 + "%";
    $("uTempVal").innerText = temp + "°C";

    // 🧠 新增：規則型 AI 推論（含日記）
    const ai = generateCareAdvice({ health, moisture, light, temp });

    $("careAdvice").style.display = "block";
    const statusEl = $("statusLabel");
    if (statusEl) statusEl.innerText = ai.statusLabel;

    $("adviceText").innerText = ai.adviceText;
    $("waterSuggest").innerText = ai.waterSuggest;

    const noWaterDays = countConsecutiveDaysWithoutWater();
    const diaryHint = $("diaryHint");
    if (diaryHint) {
        diaryHint.innerText =
            noWaterDays > 0
                ? `📓 參考日記：最近連續 ${noWaterDays} 天未勾選澆水紀錄`
                : "📓 參考日記：目前沒有足夠紀錄可推估澆水習慣";
    }
}

/* =====================================================
   📘 首頁功能介紹彈出視窗
===================================================== */

function openIntro(type) {
    const title = $("introTitle");
    const content = $("introContent");
    if (!title || !content) return;

    if (type === "analysis") {
        title.innerText = "📷 植物影像分析";
        content.innerText = "上傳你自己的植物照片，系統會分析植物狀態並提供數據與智慧建議。";
    } else if (type === "care") {
        title.innerText = "🪴 智慧照護建議";
        content.innerText = "結合濕度、光照、溫度等數據與日記澆水紀錄，提供照護建議與澆水提醒。";
    } else if (type === "data") {
        title.innerText = "📊 狀態數據";
        content.innerText = "以健康度、濕度、光照、溫度等數值與條狀圖呈現目前狀況。";
    }

    $("introModal").classList.remove("hidden");
}

function closeIntro() {
    $("introModal").classList.add("hidden");
}
