// CẤU HÌNH DỮ LIỆU (Chỉ còn đường dẫn file, rất gọn)
// --- CẬP NHẬT DỮ LIỆU CHI TIẾT TỪ NGƯỜI DÙNG ---
const demoData = {
    'weather': {
        name: "OpenWeatherMap API",
        filePath: "./assets/codes/OpenWeatherMapAPI.py", 
        info: {
            // 1. Định nghĩa
            def: `<strong>Tên đầy đủ:</strong> OpenWeatherMap API.<br>
                    <strong>Nhóm:</strong> Thời tiết & Môi trường (Weather & Environment Data).<br>
                    <strong>Mô tả:</strong> Dịch vụ cung cấp dữ liệu thời tiết toàn cầu (hiện tại, dự báo, lịch sử, bản đồ khí tượng).`,
            
            // 2. Ứng dụng
            usage: `<ul>
                        <li><strong>Nông nghiệp thông minh:</strong> Tự động ngắt tưới tiêu khi có dự báo mưa để tiết kiệm nước.</li>
                        <li><strong>Logistics (Grab/ShopeeFood):</strong> Cảnh báo bão để tính lại thời gian giao hàng (ETA) hoặc đổi lộ trình.</li>
                        <li><strong>Du lịch (Booking/Traveloka):</strong> Hiển thị thời tiết để khách chuẩn bị trang phục.</li>
                        <li><strong>Năng lượng tái tạo:</strong> Dự báo nắng/gió để ước tính sản lượng điện.</li>
                    </ul>`,
            
            // 3. Cách gọi & Tạo Key
            req: `<p><strong>Yêu cầu:</strong> Cần <code>API Key</code> (AppID).<br>
                    <strong>Endpoint:</strong> <code>api.openweathermap.org/data/2.5/weather...</code></p>
                    <hr style="border:0; border-top:1px solid #444; margin:5px 0">
                    <strong>Quy trình lấy Key:</strong>
                    <ol style="padding-left:20px; margin:5px 0">
                    <li>Đăng ký tại <em>home.openweathermap.org</em>.</li>
                    <li><strong>Quan trọng:</strong> Vào email xác nhận (Verify) thì Key mới dùng được.</li>
                    <li>Vào mục "My API keys" lấy Key mặc định hoặc tạo mới.</li>
                    <li><em>Lưu ý:</em> Chờ 15-60 phút để Key kích hoạt.</li>
                    </ol>`,
            
            // 4. Ưu nhược điểm
            prosCons: `<ul>
                        <li style="color:#4caf50"><strong>Ưu điểm:</strong> Gói Free hào phóng (60 gọi/phút), JSON nhẹ dễ xử lý, dữ liệu phủ >200.000 thành phố.</li>
                        <li style="color:#ce9178"><strong>Nhược điểm:</strong> Rate Limit (lỗi 429 nếu gọi quá nhiều), độ trễ dữ liệu 10-20 phút, rủi ro nếu lộ Key.</li>
                        </ul>`
        },
        action: async (code) => {
            // Logic giữ nguyên
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
                } else { log(`Lỗi: ${res.status} - ${(await res.text())}`); }
            } catch (e) { log("Lỗi kết nối mạng."); }
        }
    },

    'tmdb': {
        name: "The Movie Database (TMDB)",
        filePath: "./assets/codes/TheMovieDatabaseAPI.py",
        info: {
            // 1. Định nghĩa
            def: `<strong>Tên đầy đủ:</strong> TMDB API.<br>
                    <strong>Nhóm:</strong> Giải trí & Truyền thông.<br>
                    <strong>Mô tả:</strong> Cơ sở dữ liệu phim ảnh lớn nhất do cộng đồng đóng góp. Cung cấp metadata về phim, diễn viên, poster, trailer.`,
            
            // 2. Ứng dụng
            usage: `<ul>
                        <li><strong>Streaming (Netflix clone):</strong> Lấy poster, tóm tắt, diễn viên tự động.</li>
                        <li><strong>Gợi ý (Recommendation):</strong> Dùng dữ liệu thể loại/phim tương tự để đề xuất (Liên quan Đồ án 2).</li>
                        <li><strong>Đặt vé:</strong> Hiển thị trailer, thời lượng.</li>
                        <li><strong>Phân tích dữ liệu:</strong> Xu hướng điện ảnh năm 2024.</li>
                    </ul>`,
            
            // 3. Cách gọi & Tạo Key
            req: `<p><strong>Yêu cầu:</strong> Cần <code>API Key</code> (Read Access Token).<br>
                    <strong>Endpoint:</strong> <code>api.themoviedb.org/3/trending...</code></p>
                    <hr style="border:0; border-top:1px solid #444; margin:5px 0">
                    <strong>Quy trình lấy Key:</strong>
                    <ol style="padding-left:20px; margin:5px 0">
                    <li>Đăng ký tại <em>themoviedb.org</em> -> Settings -> API.</li>
                    <li>Chọn "Create" -> "Developer".</li>
                    <li>Điền form (Type: Education, URL: localhost).</li>
                    <li>Copy "API Key (v3 auth)".</li>
                    </ol>`,
            
            // 4. Ưu nhược điểm
            prosCons: `<ul>
                        <li style="color:#4caf50"><strong>Ưu điểm:</strong> Hỗ trợ Tiếng Việt (language=vi-VN), ảnh chất lượng cao, miễn phí cho học tập.</li>
                        <li style="color:#ce9178"><strong>Nhược điểm:</strong> Rate Limit (40 request/10s), cấu trúc link ảnh phức tạp, phim cũ có thể thiếu dữ liệu.</li>
                        </ul>`
        },
        action: async (code) => {
            // Logic giữ nguyên
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
    }
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
