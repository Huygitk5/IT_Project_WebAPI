// CẤU HÌNH DỮ LIỆU (Chỉ còn đường dẫn file, rất gọn)
const demoData = {
    'weather': {
        name: "OpenWeatherMap API",
        filePath: "./assets/codes/OpenWeatherMapAPI.py", // Đường dẫn tới file code
        info: {
            def: "Là dịch vụ cung cấp dữ liệu thời tiết toàn cầu (hiện tại, dự báo, lịch sử). <span class='tag-badge'>Nhóm: Môi trường</span>",
            usage: `<ul>
                        <li><strong>Nông nghiệp:</strong> Tự động tưới tiêu dựa trên dự báo mưa.</li>
                        <li><strong>Logistics:</strong> Cảnh báo bão để điều chỉnh lộ trình vận chuyển.</li>
                    </ul>`,
            req: "Cần đăng ký tài khoản để lấy <strong>API Key</strong>.",
            prosCons: `<ul>
                        <li style="color:#4caf50"><strong>Ưu điểm:</strong> Dễ tiếp cận, gói Free hào phóng.</li>
                        <li style="color:#ce9178"><strong>Nhược điểm:</strong> Gói Free có độ trễ cập nhật.</li>
                    </ul>`
        },
        action: async (code) => {
            log(">>> Đang lấy dữ liệu thời tiết...");
            const cityMatch = code.match(/city = "(.*?)"/);
            const keyMatch = code.match(/api_key = "(.*?)"/);
            const city = cityMatch ? cityMatch[1] : "Ho Chi Minh City,VN";
            const key = keyMatch ? keyMatch[1] : "463ed506f10cd039c485cd8f2db2de19";
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=vi`;
                const res = await fetch(url);
                if (res.status === 200) {
                    const data = await res.json();
                    log(`Thời tiết tại ${city}:`);
                    log(`Nhiệt độ: ${data.main.temp}°C`);
                    log(`Mô tả: ${data.weather[0].description}`);
                } else { log(`Lỗi: ${res.status}`); }
            } catch (e) { log("Lỗi kết nối mạng."); }
        }
    },

    'tmdb': {
        name: "The Movie Database (TMDB)",
        filePath: "./assets/codes/TheMovieDatabaseAPI.py", // File code
        info: {
            def: "Cơ sở dữ liệu phim ảnh lớn nhất do cộng đồng đóng góp. <span class='tag-badge'>Nhóm: Giải trí</span>",
            usage: `<ul>
                        <li><strong>Web xem phim:</strong> Lấy poster, nội dung, diễn viên.</li>
                        <li><strong>Hệ thống gợi ý:</strong> Training dữ liệu sở thích người dùng.</li>
                    </ul>`,
            req: "Cần <strong>API Key</strong> (Read Access Token).",
            prosCons: `<ul>
                        <li style="color:#4caf50"><strong>Ưu điểm:</strong> Hỗ trợ Tiếng Việt tốt, ảnh đẹp.</li>
                        <li style="color:#ce9178"><strong>Nhược điểm:</strong> Rate limit khắt khe.</li>
                    </ul>`
        },
        action: async (code) => {
            log(">>> Đang tìm kiếm phim trên TMDB...");
            const queryMatch = code.match(/'query': '(.*?)'/);
            const keyMatch = code.match(/api_key = "(.*?)"/);
            const query = queryMatch ? queryMatch[1] : "Mưa đỏ";
            const key = keyMatch ? keyMatch[1] : "69ce4822562bacb250dea6a803cad4d6";
            try {
                const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${query}&language=vi-VN`;
                const res = await fetch(url);
                if(res.status === 200) {
                    const data = await res.json();
                    if(data.results && data.results.length > 0) {
                        const m = data.results[0];
                        log(`Tên phim: ${m.title}`);
                        log(`Ngày ra mắt: ${m.release_date}`);
                        log(`Điểm: ${m.vote_average}/10`);
                        log(`Nội dung: ${m.overview || "(Chưa có mô tả tiếng Việt)"}`);
                    } else { log("Không tìm thấy phim."); }
                } else { log(`Lỗi API: ${res.status}`); }
            } catch (e) { log("Lỗi mạng."); }
        }
    },
};

let currentKey = 'weather';

// HÀM CHỌN API (QUAN TRỌNG: CÓ FETCH FILE)
async function selectAPI(key) {
    currentKey = key;
    const data = demoData[key];

    // 1. Update Buttons
    document.querySelectorAll('.api-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    // 2. Load Code từ File (Sử dụng fetch)
    const codeEditor = document.getElementById('python-code');
    codeEditor.value = "Đang tải code..."; // Hiển thị trạng thái chờ
    
    try {
        const response = await fetch(data.filePath);
        if (response.ok) {
            const text = await response.text();
            codeEditor.value = text; // Đổ code vào ô nhập
        } else {
            codeEditor.value = `Lỗi: Không thể tải file ${data.filePath}. (Kiểm tra lại đường dẫn hoặc chạy trên Local Server)`;
        }
    } catch (error) {
        codeEditor.value = `Lỗi CORS: Bạn cần chạy file HTML này trên Server (ví dụ: Live Server của VS Code) thì mới đọc được file ngoài.`;
    }

    // 3. Update Info Box
    const infoHTML = `
        <h2 class="info-title">${data.name}</h2>
        <div class="info-grid">
            <div class="info-item">
                <h4>1. API là gì?</h4>
                <p>${data.info.def}</p>
                <h4>3. Cách gọi & Yêu cầu</h4>
                <p>${data.info.req}</p>
            </div>
            <div class="info-item">
                <h4>2. Công dụng & Ứng dụng</h4>
                ${data.info.usage}
                <h4>4. Ưu điểm & Nhược điểm</h4>
                ${data.info.prosCons}
            </div>
        </div>
    `;
    document.getElementById('info-panel').innerHTML = infoHTML;

    // 4. Clear Terminal
    document.getElementById('console-output').textContent = "C:\\Users\\Dev\\Projects> _";
}

function runSimulation() {
    const term = document.getElementById('console-output');
    const code = document.getElementById('python-code').value; // Lấy code hiện tại (sau khi fetch xong)
    term.textContent = "C:\\Users\\Dev\\Projects> python main.py\n";
    demoData[currentKey].action(code);
}

function log(text) {
    const term = document.getElementById('console-output');
    term.textContent += text + "\n";
    term.scrollTop = term.scrollHeight;
}

// Init
window.onload = () => selectAPI('weather');
