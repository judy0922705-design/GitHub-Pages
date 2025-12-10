/* =====================================================
   🌿 植物資料模型（使用 Unsplash 可跨平台圖片）
===================================================== */

const plants = [
    {
        id: 0,
        name: "白鶴芋 Peace Lily",
        photo: "https://images.unsplash.com/photo-1587502537745-84a1e8ca9c33?auto=format&fit=crop&w=900&q=80",
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
        photo: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=900&q=80",
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
        photo: "https://images.unsplash.com/photo-1614593265248-7b5f75e7d05f?auto=format&fit=crop&w=900&q=80",
        health: 95,
        moisture: 48,
        light: 70,
        temp: 24,
        watered: true,
        mood: "🙂",
        diary: {}
    }
];

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
}


/* =====================================================
   🌿 首頁卡片點擊事件
===================================================== */

document.querySelectorAll(".plant-card").forEach(card => {
    card.addEventListener("click", function () {
        currentPlantId = parseInt(this.dataset.id);
        goToPage("detailPage");
    });
});


/* =====================================================
   🌿 詳細頁渲染
===================================================== */

function renderDetailPage() {
    const p = plants[currentPlantId];

    document.getElementById("detailPhoto").src = p.photo;
    document.getElementById("detailName").innerText = p.name;

    let html = `
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

    document.getElementById("detailStats").innerHTML = html;
}


/* =====================================================
   🌿 日記頁：月曆渲染
===================================================== */

function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    grid.innerHTML = "";

    const p = plants[currentPlantId];
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${month + 1}-${d}`;
        const record = p.diary[dateStr] || {};

        const mood = record.mood || "";
        const water = record.watered ? "💧" : "";

        const cell = document.createElement("div");
        cell.innerHTML = `${d}<br>${mood} ${water}`;
        grid.appendChild(cell);
    }
}


/* =====================================================
   🌿 AI 分析（模擬判斷）
===================================================== */

function runAI() {
    const p = plants[currentPlantId];

    document.getElementById("analysisPhoto").src = p.photo;

    let result = "植物狀態良好 🌿";

    if (p.moisture < 35) result = "🌵 土壤偏乾，建議澆水。";
    if (p.light < 30) result = "🌑 光照不足，建議移動到較亮的位置。";
    if (p.health < 80) result = "⚠️ 健康下降，可能出現病斑或缺乏營養。";

    document.getElementById("analysisResult").innerText = result;
}


/* =====================================================
   🌿 首頁：進度條初始化
===================================================== */

function initHomeBars() {
    const cards = document.querySelectorAll(".plant-card");

    cards.forEach((card, index) => {
        const p = plants[index];

        card.querySelector(".bar-fill.health").style.width = p.health + "%";
        card.querySelector(".bar-fill.moisture").style.width = p.moisture + "%";
        card.querySelector(".bar-fill.light").style.width = p.light + "%";
        card.querySelector(".bar-fill.temp").style.width = (p.temp / 40 * 100) + "%";
    });
}

initHomeBars();
