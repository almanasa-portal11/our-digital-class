// قائمة المعلمين والمواد الرسمية لشعب 11 علمي (جـ + د) مع حسابات التيمز
const teachersData = {
    math: { subject: "الرياضيات", name: "أ. محمود عبدالله صادق قط", email: "851991570g@vgaza.edu.ps" },
    arabic: { subject: "اللغة العربية", name: "أ. ملاك علي محمد هرماس السعدة", email: "407323450g@vgaza.edu.ps" },
    chemistry: { subject: "الكيمياء", name: "أ. داليا نمر محمد جبريل", email: "410246987g@vgaza.edu.ps" },
    english: { subject: "اللغة الإنجليزية", name: "أ. رامي عبد الرؤوف إسماعيل القيسي", email: "989431689g@vgaza.edu.ps" },
    islamic: { subject: "التربية الإسلامية", name: "أ. ريمة عزمي صبري الدويك", email: "989430830g@vgaza.edu.ps" },
    physics: { subject: "الفيزياء", name: "أ. مراد عبد المجيد محمود أبو عرة", email: "908128861g@vgaza.edu.ps" },
    biology: { subject: "الأحياء (العلوم الحياتية)", name: "أ. نديم حمدالله جميل بصلات", email: "851706523g@vgaza.edu.ps" },
    tech: { subject: "التكنولوجيا", name: "أ. لمى محمود عتيلي", email: "411979693g@vgaza.edu.ps" }
};

// جدول الحصص الأسبوعي الرسمي لشعب 11 علمي (جـ + د)
const weeklySchedule = {
    Sunday: [
        { subject: "الأحياء", teacher: teachersData.biology.name, time: "02:40 - 03:30", section: "جـ + د" },
        { subject: "اللغة العربية", teacher: teachersData.arabic.name, time: "03:35 - 04:25", section: "جـ + د" },
        { subject: "الرياضيات", teacher: teachersData.math.name, time: "04:30 - 05:15", section: "جـ + د" }
    ],
    Monday: [
        { subject: "اللغة الإنجليزية", teacher: teachersData.english.name, time: "02:40 - 03:30", section: "جـ + د" },
        { subject: "التربية الإسلامية", teacher: teachersData.islamic.name, time: "03:35 - 04:25", section: "جـ + د" },
        { subject: "الرياضيات", teacher: teachersData.math.name, time: "04:30 - 05:15", section: "جـ + د" }
    ],
    Tuesday: [
        { subject: "الأحياء", teacher: teachersData.biology.name, time: "02:40 - 03:30", section: "جـ + د" },
        { subject: "التكنولوجيا", teacher: teachersData.tech.name, time: "03:35 - 04:25", section: "جـ + د" },
        { subject: "الكيمياء", teacher: teachersData.chemistry.name, time: "04:30 - 05:15", section: "جـ + د" }
    ],
    Wednesday: [
        { subject: "اللغة الإنجليزية", teacher: teachersData.english.name, time: "02:40 - 03:30", section: "جـ + د" },
        { subject: "اللغة العربية", teacher: teachersData.arabic.name, time: "03:35 - 04:25", section: "جـ + د" },
        { subject: "الرياضيات", teacher: teachersData.math.name, time: "04:30 - 05:15", section: "جـ + د" }
    ],
    Thursday: [
        { subject: "الفيزياء", teacher: teachersData.physics.name, time: "02:40 - 03:30", section: "جـ + د" },
        { subject: "الفيزياء", teacher: teachersData.physics.name, time: "03:35 - 04:25", section: "جـ + د" },
        { subject: "الكيمياء", teacher: teachersData.chemistry.name, time: "04:30 - 05:15", section: "جـ + د" }
    ]
};

// منشورات المنتدى الرسمية
const forumPosts = [
    {
        id: 101,
        author: "مسؤول الشعبة",
        time: "إعلان رسمي",
        content: "📢 أهلاً وسهلاً بجميع طلاب شعبتنا (جـ + د) في موقعنا الموحد. نرجو المتابعة اليومية لجدول الحصص والواجبات.",
        reactions: { like: 0, idea: 0, grad: 0 }
    },
    {
        id: 102,
        author: "مسؤول الشعبة",
        time: "إعلان رسمي",
        content: "📝 تذكير: تم إرفاق جميع روابط ودلائل استخدام منصة التيمز والايسكول والموقع التقني في قسم الخدمات والمساعدة.",
        reactions: { like: 0, idea: 0, grad: 0 }
    }
];

const dayNamesAr = {
    Sunday: "الأحد", Monday: "الإثنين", Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء", Thursday: "الخميس", Friday: "الجمعة", Saturday: "السبت"
};

document.addEventListener("DOMContentLoaded", () => {
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
            <div class="period-time">${p.time}</div>
        `;
        item.addEventListener("click", () => openModal(p));
        listContainer.appendChild(item);
    });
}

function openModal(period) {
    document.getElementById("modal-subject-title").textContent = period.subject;
    document.getElementById("modal-teacher").textContent = period.teacher;
    document.getElementById("modal-time").textContent = period.time;
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

        const rows = data.split("\n").slice(1);
        const completedTasks = JSON.parse(localStorage.getItem("completedHomework")) || [];

        hwContainer.innerHTML = "";

        let hasTasks = false;

        rows.forEach(row => {
            if (!row.trim()) return;
            const cols = row.split(",");
            const id = cols[0]?.trim();
            const subject = cols[1]?.trim();
            const teacher = cols[2]?.trim();
            const task = cols[3]?.trim();
            const deadline = cols[4]?.trim();

            if (!id || isNaN(Number(id))) return;
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
            <p style="font-size: 0.85rem; color: var(--accent-blue); margin-top: 8px; word-break: break-all;">
                <strong>تيمز:</strong> ${t.email}
            </p>
        `;
        grid.appendChild(card);
    });
}

function renderForumPosts() {
    const container = document.getElementById("forum-posts-container");
    if (!container) return;

    container.innerHTML = "";

    forumPosts.forEach(post => {
        const card = document.createElement("div");
        card.className = "forum-post-card";
        card.innerHTML = `
            <div class="forum-post-header">
                <div>
                    <span class="admin-badge">${post.author}</span>
                </div>
                <span class="forum-post-time">${post.time}</span>
            </div>
            <div class="forum-post-content">${post.content}</div>
        `;
        container.appendChild(card);
    });
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

function startExamCountdown() {
    const currentYear = new Date().getFullYear();
    let targetDate = new Date(`December 28, ${currentYear} 08:00:00`).getTime();
    
    if (new Date().getTime() > targetDate) {
        targetDate = new Date(`December 28, ${currentYear + 1} 08:00:00`).getTime();
    }

    const timerElem = document.getElementById("exam-countdown");
    if (!timerElem) return;

    setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            timerElem.textContent = "بدأت الامتحانات اليوم!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        timerElem.textContent = `${days} يوم و ${hours} ساعة و ${minutes} دقيقة`;
    }, 1000);
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
        const rows = data.split("\n").slice(1);
        container.innerHTML = "";

        let count = 0;

        rows.forEach(row => {
            if (!row.trim()) return;
            const cols = row.split(",");
            const subject = cols[0]?.trim();
            const title = cols[1]?.trim();
            const teacher = cols[2]?.trim();
            const rawUrl = cols[3]?.trim();
            const date = cols[4]?.trim();

            if (!subject || !rawUrl) return;

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
