// ====================================================================
// بيانات الشعب: (جـ + د) و (ه + و) — المعلمون والجدول ورابط الحصص المباشرة
// ====================================================================

// معلمون مشتركون بين الشعبتين
const sharedTeachers = {
    arabic: { subject: "اللغة العربية", name: "أ. ملاك علي محمد هرماس السعدة", email: "407323450g@vgaza.edu.ps" },
    english: { subject: "اللغة الإنجليزية", name: "أ. رامي عبد الرؤوف إسماعيل القيسي", email: "989431689g@vgaza.edu.ps" },
    islamic: { subject: "التربية الإسلامية", name: "أ. ريمة عزمي صبري الدويك", email: "989430830g@vgaza.edu.ps" },
    physics: { subject: "الفيزياء", name: "أ. مراد عبد المجيد محمود أبو عرة", email: "908128861g@vgaza.edu.ps" },
    biology: { subject: "الأحياء (العلوم الحياتية)", name: "أ. نديم حمدالله جميل بصلات", email: "851706523g@vgaza.edu.ps" }
};

// أسماء المواد المختصرة في جدول الحصص
const subjectShortNames = {
    math: "الرياضيات", arabic: "اللغة العربية", chemistry: "الكيمياء", english: "اللغة الإنجليزية",
    islamic: "التربية الإسلامية", physics: "الفيزياء", biology: "الأحياء", tech: "التكنولوجيا"
};

// أوقات الحصص (بتوقيت فلسطين) — نفسها للشعبتين
const periodTimes = ["02:40 - 03:30", "03:35 - 04:25", "04:30 - 05:15"];

const sections = {
    jd: {
        label: "جـ + د",
        match: "ج+د", // القيمة التي تكتبها في عمود "الشعبة" داخل جداول جوجل
        teams: "https://teams.microsoft.com/meet/389003714760497?p=XkQG3P98ySlSeiD3YS",
        teachers: {
            math: { subject: "الرياضيات", name: "أ. محمود عبدالله صادق قط", email: "851991570g@vgaza.edu.ps" },
            arabic: sharedTeachers.arabic,
            chemistry: { subject: "الكيمياء", name: "أ. داليا نمر محمد جبريل", email: "410246987g@vgaza.edu.ps" },
            english: sharedTeachers.english,
            islamic: sharedTeachers.islamic,
            physics: sharedTeachers.physics,
            biology: sharedTeachers.biology,
            tech: { subject: "التكنولوجيا", name: "أ. لمى محمود عتيلي", email: "411979693g@vgaza.edu.ps" }
        },
        layout: {
            Sunday: ["biology", "arabic", "math"],
            Monday: ["english", "islamic", "math"],
            Tuesday: ["biology", "tech", "chemistry"],
            Wednesday: ["english", "arabic", "math"],
            Thursday: ["physics", "physics", "chemistry"]
        }
    },
    hw: {
        label: "هـ + و",
        match: "ه+و",
        teams: "https://teams.microsoft.com/meet/350155334864272?p=WVbqB3otvDAWgWUfjT",
        teachers: {
            math: { subject: "الرياضيات", name: "أ. لبنى لبيب أحمد نعيرات", email: "852604628g@vgaza.edu.ps" },
            arabic: sharedTeachers.arabic,
            chemistry: { subject: "الكيمياء", name: "أ. نبيل شوقي ذياب بني عودة", email: "907544191g@vgaza.edu.ps" },
            english: sharedTeachers.english,
            islamic: sharedTeachers.islamic,
            physics: sharedTeachers.physics,
            biology: sharedTeachers.biology,
            tech: { subject: "التكنولوجيا", name: "أ. سالم إبراهيم سالم حروب", email: "906928882g@vgaza.edu.ps" }
        },
        layout: {
            Sunday: ["physics", "physics", "math"],
            Monday: ["tech", "english", "chemistry"],
            Tuesday: ["english", "biology", "arabic"],
            Wednesday: ["arabic", "islamic", "math"],
            Thursday: ["chemistry", "math", "biology"]
        }
    }
};

// بناء جدول الحصص الأسبوعي لشعبة معينة
function buildWeeklySchedule(sec) {
    const result = {};
    Object.keys(sec.layout).forEach(day => {
        result[day] = sec.layout[day].map((key, i) => ({
            subject: subjectShortNames[key],
            teacher: sec.teachers[key].name,
            time: periodTimes[i],
            section: sec.label
        }));
    });
    return result;
}

// الشعبة الحالية (تتغير حسب اختيار الطالب)
const DEFAULT_SECTION = "jd";
let currentSectionKey = DEFAULT_SECTION;
let currentSection = sections[DEFAULT_SECTION];
let teachersData = currentSection.teachers;
let weeklySchedule = buildWeeklySchedule(currentSection);

const dayNamesAr = {
    Sunday: "الأحد", Monday: "الإثنين", Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء", Thursday: "الخميس", Friday: "الجمعة", Saturday: "السبت"
};

// ====================================================================
// تحويل التوقيت: الأوقات المكتوبة أعلاه بتوقيت فلسطين (بعد الظهر)
// ويتم عرضها حسب توقيت جوال/جهاز الطالب تلقائياً
// ====================================================================
const SCHOOL_TZ = "Asia/Gaza";
const weekdayIndex = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

// فرق التوقيت (بالميلي ثانية) بين منطقة زمنية معينة وUTC في لحظة محددة
function getTzOffsetMs(utcMs, timeZone) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: timeZone,
        hourCycle: "h23",
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    }).formatToParts(new Date(utcMs));

    const p = {};
    parts.forEach(x => { if (x.type !== "literal") p[x.type] = Number(x.value); });

    const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second);
    return asUTC - Math.floor(utcMs / 1000) * 1000;
}

// تحويل وقت حائطي (بتوقيت فلسطين) في تاريخ معين إلى لحظة زمنية حقيقية (Date)
function schoolWallTimeToDate(y, m, d, hh, mm) {
    const guess = Date.UTC(y, m, d, hh, mm);
    let result = guess - getTzOffsetMs(guess, SCHOOL_TZ);
    result = guess - getTzOffsetMs(result, SCHOOL_TZ); // إعادة الفحص لدعم التوقيت الصيفي
    return new Date(result);
}

// تاريخ اليوم الحالي ويوم الأسبوع حسب توقيت فلسطين
function getSchoolToday() {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: SCHOOL_TZ,
        year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());

    const p = {};
    parts.forEach(x => { if (x.type !== "literal") p[x.type] = Number(x.value); });

    return {
        y: p.year,
        m: p.month - 1,
        d: p.day,
        weekday: new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay()
    };
}

// تحويل نص الوقت مثل "02:40 - 03:30" إلى توقيت جهاز الطالب
function convertScheduleTime(range, dayName) {
    try {
        const idx = weekdayIndex[dayName];
        if (idx === undefined || !range) return range;

        // أقرب تاريخ قادم (أو اليوم) لهذا اليوم من الأسبوع
        const today = getSchoolToday();
        const ahead = (idx - today.weekday + 7) % 7;
        const base = new Date(Date.UTC(today.y, today.m, today.d + ahead));
        const by = base.getUTCFullYear();
        const bm = base.getUTCMonth();
        const bd = base.getUTCDate();
        const baseDayMs = Date.UTC(by, bm, bd);

        const formatOne = (t) => {
            const [h, m] = t.trim().split(":").map(Number);
            if (isNaN(h) || isNaN(m)) throw new Error("bad time");
            const hh24 = h < 12 ? h + 12 : h; // الحصص بعد الظهر
            const dt = schoolWallTimeToDate(by, bm, bd, hh24, m);

            const lh = dt.getHours();
            const lm = dt.getMinutes();
            const h12 = lh % 12 || 12;
            const suffix = lh < 12 ? "ص" : "م";

            const dayDiff = Math.round(
                (Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()) - baseDayMs) / 86400000
            );
            let note = "";
            if (dayDiff > 0) note = " (اليوم التالي)";
            else if (dayDiff < 0) note = " (اليوم السابق)";

            return `${String(h12).padStart(2, "0")}:${String(lm).padStart(2, "0")} ${suffix}${note}`;
        };

        const pieces = range.split("-");
        if (pieces.length !== 2) return range;
        return `${formatOne(pieces[0])} - ${formatOne(pieces[1])}`;
    } catch (e) {
        return range; // في حال أي خطأ نعرض الوقت الأصلي كما هو
    }
}

// ====================================================================
// اختيار الشعبة (جـ + د) / (ه + و) وحفظها على جهاز الطالب
// ====================================================================
function injectSectionStyles() {
    if (document.getElementById("section-picker-styles")) return;
    const style = document.createElement("style");
    style.id = "section-picker-styles";
    style.textContent = `
        #section-modal { z-index: 10000; }
        .section-choices { display: flex; gap: 12px; margin: 8px 0 14px; }
        .section-choice {
            flex: 1;
            padding: 18px 8px;
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--primary-blue);
            background: #f8fafc;
            border: 2px solid var(--accent-blue);
            border-radius: 12px;
            cursor: pointer;
            transition: background-color 0.2s ease, color 0.2s ease;
        }
        .section-choice.selected,
        .section-choice:active {
            background: var(--primary-blue);
            color: #ffffff;
            border-color: var(--primary-blue);
        }
        .section-cancel {
            background: none;
            border: none;
            color: var(--text-muted);
            font-weight: 600;
            cursor: pointer;
            padding: 8px;
        }
    `;
    document.head.appendChild(style);
}

function showSectionPicker(canClose) {
    let overlay = document.getElementById("section-modal");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        overlay.id = "section-modal";
        overlay.innerHTML = `
            <div class="modal-card" style="text-align:center;">
                <h3 style="color: var(--primary-blue); margin-bottom: 6px;">اختر شعبتك</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 14px;">
                    سيتم عرض الجدول والواجبات والتسجيلات والإشعارات الخاصة بشعبتك فقط
                </p>
                <div class="section-choices">
                    <button type="button" class="section-choice" data-section="jd">${sections.jd.label}</button>
                    <button type="button" class="section-choice" data-section="hw">${sections.hw.label}</button>
                </div>
                <button type="button" class="section-cancel">إلغاء</button>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelectorAll(".section-choice").forEach(btn => {
            btn.addEventListener("click", () => chooseSection(btn.getAttribute("data-section")));
        });
        overlay.querySelector(".section-cancel").addEventListener("click", () => {
            overlay.classList.remove("active");
        });
    }

    overlay.querySelector(".section-cancel").style.display = canClose ? "inline-block" : "none";
    overlay.querySelectorAll(".section-choice").forEach(btn => {
        btn.classList.toggle("selected", canClose && btn.getAttribute("data-section") === currentSectionKey);
    });
    overlay.classList.add("active");
}

function applySection(key) {
    if (!sections[key]) key = DEFAULT_SECTION;
    currentSectionKey = key;
    currentSection = sections[key];
    teachersData = currentSection.teachers;
    weeklySchedule = buildWeeklySchedule(currentSection);

    const badge = document.querySelector(".badge-section");
    if (badge) {
        badge.textContent = `الصف 11 علمي (${currentSection.label}) ▾`;
        badge.title = "تغيير الشعبة";
        badge.style.cursor = "pointer";
        if (!badge.getAttribute("data-bound")) {
            badge.setAttribute("data-bound", "1");
            badge.addEventListener("click", () => showSectionPicker(true));
        }
    }

    const modalBadge = document.getElementById("modal-section-badge");
    if (modalBadge) modalBadge.textContent = `الشعبة ${currentSection.label}`;
}

// تسجيل شعبة الطالب كوسم (tag) في OneSignal لتصله إشعارات شعبته فقط
function tagOneSignalSection(key) {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(function (OneSignal) {
        try { OneSignal.User.addTag("section", key); } catch (e) { /* تجاهل */ }
    });
}

function initSection() {
    injectSectionStyles();
    let saved = null;
    try { saved = localStorage.getItem("studentSection"); } catch (e) { /* تجاهل */ }

    if (saved && sections[saved]) {
        applySection(saved);
        tagOneSignalSection(saved);
    } else {
        applySection(DEFAULT_SECTION);
        showSectionPicker(false); // أول زيارة: يجب اختيار الشعبة
    }
}

function refreshSectionContent() {
    const activeTab = document.querySelector(".day-tab.active");
    const day = activeTab ? activeTab.getAttribute("data-day") : "Sunday";
    renderSchedule(day);
    renderHomework();
    renderTeachers();
    renderForumPosts();
    renderRecordings();
}

function chooseSection(key) {
    if (!sections[key]) return;
    try { localStorage.setItem("studentSection", key); } catch (e) { /* تجاهل */ }
    applySection(key);
    tagOneSignalSection(key);
    refreshSectionContent();

    const overlay = document.getElementById("section-modal");
    if (overlay) overlay.classList.remove("active");
}

// هل الصف (واجب/تسجيل) مخصص لشعبة الطالب؟ الفارغ أو "الكل" = لجميع الشعب
function normalizeSectionText(v) {
    return String(v || "").replace(/[\s\u0640]/g, "").toLowerCase();
}

function matchesSection(value) {
    const v = normalizeSectionText(value);
    if (v === "") return true;
    const target = normalizeSectionText(currentSection.match);
    return v.split(/[,،;؛|\/]/).some(p => p === "الكل" || p === "all" || p === target);
}

// قراءة ملف CSV بشكل سليم (يدعم الفواصل داخل النصوص والأسطر المتعددة)
function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    text = String(text || "").replace(/^\uFEFF/, "");

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { field += '"'; i++; }
                else inQuotes = false;
            } else {
                field += c;
            }
        } else if (c === '"') {
            inQuotes = true;
        } else if (c === ",") {
            row.push(field);
            field = "";
        } else if (c === "\n" || c === "\r") {
            if (c === "\r" && text[i + 1] === "\n") i++;
            row.push(field);
            field = "";
            if (row.some(v => v.trim() !== "")) rows.push(row);
            row = [];
        } else {
            field += c;
        }
    }
    row.push(field);
    if (row.some(v => v.trim() !== "")) rows.push(row);
    return rows;
}

document.addEventListener("DOMContentLoaded", () => {
    initSection(); // تحميل شعبة الطالب المحفوظة (أو عرض نافذة الاختيار)

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    let todayName = days[now.getDay()];
    if (todayName === "Friday" || todayName === "Saturday") todayName = "Sunday";

    const currentBadge = document.getElementById("current-day-badge");
    if (currentBadge) {
        currentBadge.textContent = `اليوم: ${dayNamesAr[days[now.getDay()]]}`;
    }

    const tabs = document.querySelectorAll(".day-tab");
    tabs.forEach(tab => {
        const day = tab.getAttribute("data-day");
        if (day === todayName) tab.classList.add("active", "is-today");
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            renderSchedule(day);
        });
    });

    renderSchedule(todayName);
    renderHomework();
    renderTeachers();
    renderForumPosts();
    renderRecordings(); // <--- أضف هذا السطر هنا لكي تعمل التسجيلات وتظهر الحصص والفيديوهات فوراً!
    startExamCountdown();

    const modal = document.getElementById("class-modal");
    const closeBtn = document.getElementById("close-modal");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    }
});

function switchView(viewName) {
    const views = document.querySelectorAll(".app-view");
    views.forEach(v => v.classList.remove("active"));

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) targetView.classList.add("active");

    const navButtons = document.querySelectorAll(".bottom-nav .nav-btn");
    navButtons.forEach(btn => btn.classList.remove("active"));
    
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add("active");
    }

    // إظهار أو إخفاء الشريط العلوي بناءً على ما إذا كنا في الصفحة الرئيسية أم لا
    if (viewName === 'home') {
        document.body.classList.add('at-home');
    } else {
        document.body.classList.remove('at-home');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function renderSchedule(day) {
    const listContainer = document.getElementById("schedule-list");
    if (!listContainer) return;
    listContainer.innerHTML = "";
    const periods = weeklySchedule[day] || [];

    if (periods.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px;">لا توجد حصص في هذا اليوم.</p>`;
        return;
    }

    periods.forEach(p => {
        const item = document.createElement("div");
        item.className = "period-item";
        item.innerHTML = `
            <div class="period-info">
                <h4>${p.subject}</h4>
                <p>المعلم: ${p.teacher} | الشعبة: ${p.section}</p>
            </div>
            <div class="period-time">${convertScheduleTime(p.time, day)}</div>
        `;
        item.addEventListener("click", () => openModal(p, day));
        listContainer.appendChild(item);
    });
}

function openModal(period, day) {
    document.getElementById("modal-subject-title").textContent = period.subject;
    document.getElementById("modal-teacher").textContent = period.teacher;
    document.getElementById("modal-time").textContent = day ? convertScheduleTime(period.time, day) : period.time;
    const teamsBtn = document.querySelector("#class-modal .btn-join-teams");
    if (teamsBtn) teamsBtn.href = currentSection.teams;
    document.getElementById("class-modal").classList.add("active");
}

// جلب الواجبات تلقائياً من Google Sheets المرفق
async function renderHomework() {
    const hwContainer = document.getElementById("homework-list");
    if (!hwContainer) return;

    hwContainer.innerHTML = "<p style='text-align:center; color:var(--text-muted); padding:15px;'>جاري تحميل الواجبات من الجدول...</p>";

    // رابط الـ CSV المباشر لجدولك
    const sheetCSVUrl = "https://docs.google.com/spreadsheets/d/1F-jYF-cf2HYKyX1-1a289z8hy4KYeSK5RlZBaxv7GZA/export?format=csv";

    try {
        const response = await fetch(sheetCSVUrl);
        const data = await response.text();

        const rows = parseCSV(data).slice(1);
        const completedTasks = JSON.parse(localStorage.getItem("completedHomework")) || [];

        hwContainer.innerHTML = "";

        let hasTasks = false;

        rows.forEach(row => {
            const cols = row;
            const id = cols[0]?.trim();
            const subject = cols[1]?.trim();
            const teacher = cols[2]?.trim();
            const task = cols[3]?.trim();
            const deadline = cols[4]?.trim();

            if (!id || isNaN(Number(id))) return;
            if (!matchesSection(cols[5])) return; // عمود "الشعبة"
            hasTasks = true;

            const numericId = Number(id);
            const isDone = completedTasks.includes(numericId);
            const item = document.createElement("div");
            item.className = `homework-item ${isDone ? "completed" : ""}`;
            item.innerHTML = `
                <div class="hw-info">
                    <h4>${subject} (${teacher})</h4>
                    <p>${task}</p>
                    <span class="hw-deadline">التسليم: ${deadline}</span>
                </div>
                <button class="btn-toggle-hw" onclick="toggleHomework(${numericId})">
                    ${isDone ? "منجز" : "تحديد كمنجز"}
                </button>
            `;
            hwContainer.appendChild(item);
        });

        if (!hasTasks) {
            hwContainer.innerHTML = "<p style='text-align:center; color:var(--text-muted); padding:15px;'>لا توجد واجبات مسجلة حالياً في الجدول.</p>";
        }

    } catch (error) {
        hwContainer.innerHTML = `<p style="text-align:center; color:var(--color-alert); padding:15px;">تعذر تحميل الواجبات حالياً، تأكد من الاتصال بالإنترنت.</p>`;
    }
}

function toggleHomework(id) {
    let completedTasks = JSON.parse(localStorage.getItem("completedHomework")) || [];
    if (completedTasks.includes(id)) {
        completedTasks = completedTasks.filter(taskId => taskId !== id);
    } else {
        completedTasks.push(id);
    }
    localStorage.setItem("completedHomework", JSON.stringify(completedTasks));
    renderHomework();
}

function renderTeachers() {
    const grid = document.getElementById("teachers-grid");
    if (!grid) return;
    grid.innerHTML = "";

    Object.values(teachersData).forEach(t => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${t.subject}</h3>
            <p><strong>المعلم:</strong> ${t.name}</p>
            <p style="font-size: 0.85rem; margin-top: 8px; word-break: break-all;">
                <strong>تيمز:</strong>
                <a href="https://teams.microsoft.com/l/chat/0/0?users=${t.email}" target="_blank" rel="noopener"
                   style="color: var(--accent-blue); text-decoration: underline;">💬 ${t.email}</a>
            </p>
        `;
        grid.appendChild(card);
    });
}

// رابط الـ CSV المباشر لجدول المنتدى (الأعمدة: الرقم | الكاتب | التاريخ | النص | الشعبة)
const FORUM_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1HyzJyeEG1GirQhkrZUHvK1nqacKg1qlPwE53-iS2kUk/export?format=csv";

// تحويل النص إلى HTML آمن مع الحفاظ على الأسطر وجعل الروابط قابلة للنقر
function formatForumText(text) {
    const escaped = String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    return escaped
        .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
        .replace(/\r?\n/g, "<br>");
}

function escapeText(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

async function renderForumPosts() {
    const container = document.getElementById("forum-posts-container");
    if (!container) return;

    container.innerHTML = "<p style='text-align:center; color:var(--text-muted); padding:15px;'>جاري تحميل المنشورات...</p>";

    try {
        const response = await fetch(FORUM_SHEET_CSV_URL);
        const data = await response.text();
        const rows = parseCSV(data).slice(1);

        const posts = rows
            .map(cols => ({
                author: (cols[1] || "").trim(),
                time: (cols[2] || "").trim(),
                content: (cols[3] || "").trim(),
                section: cols[4]
            }))
            .filter(post => post.content && matchesSection(post.section))
            .reverse(); // الأحدث (آخر صف في الشيت) يظهر في الأعلى

        container.innerHTML = "";

        if (posts.length === 0) {
            container.innerHTML = "<p style='text-align:center; color:var(--text-muted); padding:15px;'>لا توجد منشورات حالياً.</p>";
            return;
        }

        posts.forEach(post => {
            const card = document.createElement("div");
            card.className = "forum-post-card";
            card.innerHTML = `
                <div class="forum-post-header">
                    <div>
                        <span class="admin-badge">${escapeText(post.author || "مسؤول الشعبة")}</span>
                    </div>
                    <span class="forum-post-time">${escapeText(post.time)}</span>
                </div>
                <div class="forum-post-content">${formatForumText(post.content)}</div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = `<p style="text-align:center; color:var(--color-alert); padding:15px;">تعذر تحميل المنشورات حالياً، تأكد من الاتصال بالإنترنت.</p>`;
    }
}


function addReaction(postId, type) {
    let savedReactions = JSON.parse(localStorage.getItem("userPostReactions")) || {};
    if (!savedReactions[postId]) {
        savedReactions[postId] = { like: 0, idea: 0, grad: 0 };
    }
    
    savedReactions[postId][type]++;
    localStorage.setItem("userPostReactions", JSON.stringify(savedReactions));

    const counterSpan = document.getElementById(`react-${postId}-${type}`);
    if (counterSpan) {
        counterSpan.textContent = savedReactions[postId][type];
    }
}

// ====================================================================
// العد التنازلي للامتحانات النهائية (28 ديسمبر الساعة 08:00 بتوقيت فلسطين)
// عرض رسمي ضمن مربعات رقمية: أيام / ساعات / دقائق / ثواني
// ====================================================================
function injectCountdownStyles() {
    if (document.getElementById("exam-countdown-styles")) return;

    const style = document.createElement("style");
    style.id = "exam-countdown-styles";
    style.textContent = `
        .cd-wrap {
            display: flex;
            justify-content: center;
            align-items: stretch;
            gap: 10px;
            direction: rtl;
            margin: 8px 0;
            width: 100%;
        }
        .cd-box {
            flex: 1 1 0;
            min-width: 54px;
            max-width: 90px;
            padding: 12px 4px 10px;
            text-align: center;
            background: linear-gradient(180deg, #1e3a8a 0%, #172554 100%);
            border: 1px solid rgba(255, 255, 255, 0.14);
            border-radius: 12px;
            box-shadow: 0 6px 16px rgba(15, 23, 42, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }
        .cd-num {
            display: block;
            direction: ltr;
            font-size: 1.8rem;
            font-weight: 700;
            line-height: 1.1;
            letter-spacing: 1px;
            color: #ffffff;
            font-variant-numeric: tabular-nums;
            font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
        }
        .cd-label {
            display: block;
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px solid rgba(255, 255, 255, 0.18);
            font-size: 0.75rem;
            font-weight: 500;
            color: #cbd5e1;
        }
        .cd-finished {
            text-align: center;
            font-weight: 700;
            padding: 12px;
        }
        @media (max-width: 380px) {
            .cd-wrap { gap: 6px; }
            .cd-num { font-size: 1.4rem; }
            .cd-label { font-size: 0.68rem; }
        }
    `;
    document.head.appendChild(style);
}

function startExamCountdown() {
    const timerElem = document.getElementById("exam-countdown");
    if (!timerElem) return;

    injectCountdownStyles();

    // موعد الامتحان: 28 ديسمبر 08:00 صباحاً بتوقيت فلسطين (لحظة زمنية واحدة لكل الطلاب)
    const currentYear = new Date().getFullYear();
    let targetDate = schoolWallTimeToDate(currentYear, 11, 28, 8, 0).getTime();

    if (new Date().getTime() > targetDate) {
        targetDate = schoolWallTimeToDate(currentYear + 1, 11, 28, 8, 0).getTime();
    }

    // بناء المربعات مرة واحدة ثم تحديث الأرقام فقط
    timerElem.innerHTML = `
        <div class="cd-wrap">
            <div class="cd-box"><span class="cd-num" id="cd-days">00</span><span class="cd-label">يوم</span></div>
            <div class="cd-box"><span class="cd-num" id="cd-hours">00</span><span class="cd-label">ساعة</span></div>
            <div class="cd-box"><span class="cd-num" id="cd-minutes">00</span><span class="cd-label">دقيقة</span></div>
            <div class="cd-box"><span class="cd-num" id="cd-seconds">00</span><span class="cd-label">ثانية</span></div>
        </div>
    `;

    const pad = (n) => String(n).padStart(2, "0");

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            timerElem.innerHTML = `<div class="cd-finished">بدأت الامتحانات اليوم!</div>`;
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const dEl = document.getElementById("cd-days");
        const hEl = document.getElementById("cd-hours");
        const mEl = document.getElementById("cd-minutes");
        const sEl = document.getElementById("cd-seconds");

        if (dEl) dEl.textContent = pad(days);
        if (hEl) hEl.textContent = pad(hours);
        if (mEl) mEl.textContent = pad(minutes);
        if (sEl) sEl.textContent = pad(seconds);
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // عرض فوري بدون انتظار الثانية الأولى
}


function toggleSupportModal() {
    const modal = document.getElementById("support-modal");
    if (modal) modal.classList.toggle("active");
}

async function handleSupportSubmit(e) {
    e.preventDefault();

    const form = document.getElementById("support-form");
    const btn = document.getElementById("submit-report-btn");
    const resultDiv = document.getElementById("support-form-result");

    const originalBtnText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "جاري الإرسال...";
    resultDiv.style.display = "none";

    const formData = new FormData(form);
    formData.set("subject", `بلاغ جديد من موقع شعبتنا الرقمية (${currentSection.label})`);
    formData.append("section", currentSection.label);

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            resultDiv.style.color = "#059669";
            resultDiv.textContent = "تم إرسال بلاغك بنجاح إلى مسؤول الشعبة.";
            resultDiv.style.display = "block";
            form.reset();

            setTimeout(() => {
                toggleSupportModal();
                resultDiv.style.display = "none";
                btn.disabled = false;
                btn.textContent = originalBtnText;
            }, 2000);
        } else {
            resultDiv.style.color = "#dc2626";
            resultDiv.textContent = "حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.";
            resultDiv.style.display = "block";
            btn.disabled = false;
            btn.textContent = originalBtnText;
        }
    } catch (error) {
        resultDiv.style.color = "#dc2626";
        resultDiv.textContent = "يرجى التأكد من الاتصال بالإنترنت والمحاولة مجدداً.";
        resultDiv.style.display = "block";
        btn.disabled = false;
        btn.textContent = originalBtnText;
    }
}


// دالة استخراج رمز فيديو اليوتيوب من أي رابط (سواء طويل أو قصير)
// دالة استخراج رمز فيديو اليوتيوب النظيفة
function getYouTubeEmbedUrl(url) {
    if (!url) return '';
    let cleanUrl = url.trim().replace(/^"|"$/g, '');
    let videoId = '';
    
    if (cleanUrl.includes('youtu.be/')) {
        videoId = cleanUrl.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
    } else if (cleanUrl.includes('watch?v=')) {
        videoId = cleanUrl.split('watch?v=')[1]?.split('&')[0];
    } else if (cleanUrl.includes('embed/')) {
        videoId = cleanUrl.split('embed/')[1]?.split('?')[0]?.split('&')[0];
    } else if (cleanUrl.includes('shorts/')) {
        videoId = cleanUrl.split('shorts/')[1]?.split('?')[0]?.split('&')[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

// دالة جلب وعرض التسجيلات من جوجل شيت
// دالة جلب وعرض التسجيلات كروابط مباشرة تفتح في يوتيوب
async function renderRecordings() {
    const container = document.getElementById("recordings-list");
    if (!container) return;

    container.innerHTML = "<p style='text-align:center; color:var(--text-muted); grid-column: 1/-1; padding:20px;'>جاري تحميل تسجيلات الدروس من الجدول...</p>";

    // رابط الـ CSV المباشر لجدول التسجيلات
    const recordingsCSVUrl = "https://docs.google.com/spreadsheets/d/14PjnQPZev1CLlchWIMn5Zmzi-pCvwQBhdox1FNPvX38/export?format=csv"; 

    try {
        const response = await fetch(recordingsCSVUrl);
        const data = await response.text();
        const rows = parseCSV(data).slice(1);
        container.innerHTML = "";

        let count = 0;

        rows.forEach(row => {
            const cols = row;
            const subject = cols[0]?.trim();
            const title = cols[1]?.trim();
            const teacher = cols[2]?.trim();
            const rawUrl = cols[3]?.trim();
            const date = cols[4]?.trim();

            if (!subject || !rawUrl) return;
            if (!matchesSection(cols[5])) return; // عمود "الشعبة"

            count++;
            const card = document.createElement("div");
            card.className = "card";
            card.style.margin = "0";
            card.style.padding = "16px";
            card.innerHTML = `
                <h4 style="margin: 0 0 8px 0; color: var(--primary-blue);">${title || subject}</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
                    <strong>المادة:</strong> ${subject} | <strong>المعلم:</strong> ${teacher}
                    ${date ? `<br>📅 <strong>التاريخ:</strong> ${date}` : ''}
                </p>
                <a href="${rawUrl}" target="_blank" class="btn-primary" style="display: block; text-align: center; text-decoration: none;">
                    ▶️ مشاهدة الحصة مباشرة على يوتيوب
                </a>
            `;
            container.appendChild(card);
        });

        if (count === 0) {
            container.innerHTML = "<p style='text-align:center; color:var(--text-muted); grid-column: 1/-1; padding:20px;'>لا توجد تسجيلات دروس متوفرة حالياً في الجدول.</p>";
        }
    } catch (error) {
        container.innerHTML = `<p style="text-align:center; color:var(--color-alert); grid-column: 1/-1; padding:20px;">تعذر تحميل التسجيلات حالياً، تأكد من الاتصال بالإنترنت.</p>`;
    }
}
