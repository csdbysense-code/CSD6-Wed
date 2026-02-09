// script.js

// 1. ฟังก์ชันจำลองการ Login
function handleLogin(event) {
    event.preventDefault(); // ป้องกันการ Submit form จริง
    
    const usernamecsd6 = document.getElementById('usernamecsd6').value;
    const password = document.getElementById('password').value;

    if(usernamecsd6 && password) {
        // ในสถานการณ์จริง: ส่งข้อมูลไปเช็คที่ Server
        alert('กำลังเข้าสู่ระบบ...');
        // จำลองการเปลี่ยนหน้าไปยัง Workspace
        window.location.href = 'workspace.html';
    } else {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
}

// 2. ฟังก์ชัน Logout
function logout() {
    if(confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
        window.location.href = 'login.html';
    }
}

// 3. แสดงวันที่ปัจจุบันในส่วน Footer หรือ Header
document.addEventListener('DOMContentLoaded', () => {
    const dateElement = document.getElementById('current-date');
    if(dateElement) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        dateElement.innerText = now.toLocaleDateString('th-TH', options);
    }
});

// --- การตั้งค่า ---
// ใส่ Google Sheet ID ของคุณที่นี่
const SHEET_ID = '1s9Px5lhvXmfGuogF8E-QFZiPq_hJk74Rn5gULDxTMl8'; 
const SHEET_NAME = 'Sheet1'; // ชื่อแท็บข้างล่าง (ปกติคือ Sheet1)

// URL สำหรับดึงข้อมูลแบบ JSON
const API_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

async function fetchNews() {
    try {
        const response = await fetch(API_URL);
        const text = await response.text();

        // ข้อมูลที่ได้มาจะมี text ครอบอยู่ ต้องตัดออกเพื่อให้เป็น JSON แท้ๆ
        // รูปแบบคือ: /*O_o*/ google.visualization.Query.setResponse({...});
        const jsonText = text.substring(47).slice(0, -2);
        const json = JSON.parse(jsonText);
        
        const rows = json.table.rows;
        
        // จัดกลุ่มข้อมูลตามเดือน (Column A)
        const groupedNews = {};

        rows.forEach(row => {
            // ดึงค่าจากแต่ละคอลัมน์ (ระวัง index เริ่มที่ 0)
            // Col A (Index 0) = ประจำเดือน
            // Col C (Index 2) = ชื่อเรื่อง
            // Col G (Index 6) = วันที่ออกข่าว
            // Col H (Index 7) = ลิ้งค์ข่าว
            
            const monthRaw = row.c[0]?.v || "อื่นๆ";
            const title = row.c[2]?.v || "ไม่มีชื่อเรื่อง";
            const dateRaw = row.c[6]?.f || row.c[6]?.v || ""; // ใช้ .f (formatted) ถ้ามี
            const link = row.c[7]?.v || "#";

            // ถ้าไม่มีกลุ่มเดือนนี้ ให้สร้าง array ใหม่
            if (!groupedNews[monthRaw]) {
                groupedNews[monthRaw] = [];
            }

            groupedNews[monthRaw].push({
                title: title,
                date: dateRaw,
                link: link
            });
        });

        renderNews(groupedNews);

    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('news-feed').innerHTML = '<p style="color:red; text-align:center;">ไม่สามารถดึงข้อมูลได้ โปรดตรวจสอบ Sheet ID หรือการตั้งค่า Share</p>';
    }
}

function renderNews(groupedNews) {
    const container = document.getElementById('news-feed');
    container.innerHTML = ''; // เคลียร์ข้อความ Loading

    // รูปภาพสำรอง (กรณีลิ้งค์ใน Col H ไม่ใช่ไฟล์รูปภาพ)
    const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop";

    // วนลูปแต่ละเดือน
    for (const [month, newsItems] of Object.entries(groupedNews)) {
        
        // สร้างหัวข้อเดือน
        const monthSection = document.createElement('div');
        monthSection.className = 'month-group';
        
        const monthTitle = document.createElement('div');
        monthTitle.className = 'month-title';
        monthTitle.textContent = month;
        monthSection.appendChild(monthTitle);

        // สร้าง Grid สำหรับการ์ด
        const grid = document.createElement('div');
        grid.className = 'cards-grid';

        // วนลูปข่าวในเดือนนั้นๆ
        newsItems.forEach(item => {
            // สร้างการ์ด (ใช้ <a> คลุมทั้งหมดเพื่อให้กดได้ทั้งการ์ด)
            const card = document.createElement('a');
            card.href = item.link;
            card.className = 'news-card';
            card.target = '_blank'; // เปิดแท็บใหม่

            card.innerHTML = `
                <div class="card-image">
                    <img src="${item.link}" onerror="this.onerror=null;this.src='${fallbackImage}';" alt="${item.title}">
                </div>
                <div class="card-content">
                    <span class="card-date">${item.date}</span>
                    <h3 class="card-title">${item.title}</h3>
                </div>
            `;
            grid.appendChild(card);
        });

        monthSection.appendChild(grid);
        container.appendChild(monthSection);
    }
}

// เริ่มทำงานเมื่อโหลดหน้าเว็บ
fetchNews();