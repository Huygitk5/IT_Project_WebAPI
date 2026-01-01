// --- CẤU HÌNH TRẠNG THÁI ---
let currentKey = 'weather';
let currentLang = 'vi'; // Mặc định tiếng Việt
let editor; // Biến lưu trình soạn thảo CodeMirror
let currentToolMode = ''; // <--- THÊM BIẾN NÀY (để phân biệt OCR hay RemoveBG)

// --- HÀM TẠO NỘI DUNG SONG NGỮ ---
// Hàm này giúp tạo đối tượng dữ liệu gọn gàng hơn
const createContent = (vi, en) => ({ vi, en });

// --- DỮ LIỆU ĐẦY ĐỦ 12 API (Đã dịch sang tiếng Anh) ---
const demoData = {
  // --- 1. OPEN WEATHER MAP ---
  weather: {
    name: 'OpenWeatherMap API',
    filePath: './assets/codes/OpenWeatherMapAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Giao diện lập trình cho phép truy cập dữ liệu thời tiết toàn cầu (hiện tại, dự báo, lịch sử) qua HTTP. Dữ liệu trả về dạng JSON/XML gồm nhiệt độ, độ ẩm, áp suất, gió và mưa.`,
        usage: `<ul>
                            <li><strong>Nông nghiệp:</strong> Tự động ngắt tưới tiêu khi dự báo có mưa.</li>
                            <li><strong>Logistics:</strong> Cảnh báo bão để thay đổi lộ trình vận tải an toàn.</li>
                            <li><strong>Du lịch & Sự kiện:</strong> Hiển thị thời tiết điểm đến để lên kế hoạch tổ chức.</li>
                            <li><strong>Năng lượng:</strong> Dự báo nắng/gió để ước tính sản lượng điện tái tạo.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> Access Key (Client ID). Thư viện: <code>requests</code>.<br>
                      <strong>Cách tạo Key:</strong><br>
                      1. Truy cập <code>openweathermap.org</code> và đăng ký tài khoản.<br>
                      2. Vào mục "My API Keys" để lấy Key mặc định hoặc tạo mới.<br>
                      3. Endpoint: <code>api.openweathermap.org/data/2.5/weather</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Gói Free hào phóng (60 gọi/phút), JSON chuẩn nhẹ dễ tích hợp, phủ sóng 200.000+ thành phố.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Có giới hạn truy cập (Lỗi 429 nếu quá tải), độ trễ dữ liệu 10-20 phút, rủi ro nếu lộ API Key.</li>
                           </ul>`,
      },
      en: {
        def: `<strong>Description:</strong> An API providing global weather data (current, forecast, historical) via HTTP. Returns JSON/XML containing temp, humidity, pressure, wind, and rain info.`,
        usage: `<ul>
                            <li><strong>Agriculture:</strong> Auto-stop irrigation when rain is forecast.</li>
                            <li><strong>Logistics:</strong> Storm warnings for route optimization.</li>
                            <li><strong>Tourism & Events:</strong> Display destination weather for planning.</li>
                            <li><strong>Energy:</strong> Estimate solar/wind output based on forecast.</li>
                        </ul>`,
        req: `<strong>Req:</strong> Access Key needed. Lib: <code>requests</code>.<br>
                      <strong>Get Key:</strong><br>
                      1. Sign up at <code>openweathermap.org</code>.<br>
                      2. Go to "My API Keys" to copy your key.<br>
                      3. Endpoint: <code>api.openweathermap.org/data/2.5/weather</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Generous Free tier (60 calls/min), lightweight JSON, covers 200,000+ cities.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Rate limits (Error 429), data latency (10-20 mins), security risk if Key is exposed.</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang lấy dữ liệu thời tiết...', 'cmd');
      const cityMatch = code.match(/city = "(.*?)"/);
      const keyMatch = code.match(/api_key = "(.*?)"/);
      const city = cityMatch ? cityMatch[1] : 'Ho Chi Minh City,VN';
      const key = keyMatch ? keyMatch[1] : '463ed506f10cd039c485cd8f2db2de19';
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=vi`;
        const res = await fetch(url);
        if (res.status === 200) {
          const data = await res.json();
          log(`Thời tiết tại ${city}:`);
          log(`Nhiệt độ: ${data.main.temp}°C`);
          log(`Mô tả: ${data.weather[0].description}`);
          log(`Độ ẩm: ${data.main.humidity}% - Gió: ${data.wind.speed}m/s`);
        } else {
          log(`Lỗi API: ${res.status} - ${res.statusText}`, 'error');
        }
      } catch (e) {
        log('Lỗi kết nối mạng.', 'error');
      }
    },
  },

  // --- 2. TMDB MOVIE ---
  // --- 2. TMDB MOVIE ---
  tmdb: {
    name: 'The Movie Database (TMDB)',
    filePath: './assets/codes/TheMovieDatabaseAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> CSDL phim ảnh và TV Show lớn nhất do cộng đồng đóng góp. Cung cấp metadata chi tiết (tên, tóm tắt, diễn viên, đạo diễn...) và hình ảnh chất lượng cao (poster, backdrop).`,
        usage: `<ul>
                            <li><strong>Website xem phim:</strong> Hiển thị thông tin, poster tự động (Netflix clone).</li>
                            <li><strong>Gợi ý nội dung:</strong> Đề xuất phim cùng vũ trụ hoặc cùng thể loại.</li>
                            <li><strong>Đặt vé:</strong> Hiển thị trailer và thời lượng phim cho khách hàng.</li>
                            <li><strong>Phân tích dữ liệu:</strong> Nghiên cứu xu hướng điện ảnh qua các thời kỳ.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> API Key (v3 auth). Thư viện: <code>requests</code>.<br>
                      <strong>Cách tạo Key:</strong><br>
                      1. Đăng ký tài khoản tại <code>themoviedb.org</code>.<br>
                      2. Vào <strong>Settings -> API -> Create Key</strong> (Chọn Developer).<br>
                      3. Điền form và copy dòng <strong>API Key (v3 auth)</strong>.<br>
                      Endpoint: <code>api.themoviedb.org/3/search/movie</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Hỗ trợ Tiếng Việt (<code>lang=vi-VN</code>), kho ảnh poster/backdrop đẹp, miễn phí cho học tập.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Giới hạn tốc độ (40-50 req/10s), logic đường dẫn ảnh phức tạp (cần ghép link), dữ liệu phim cũ có thể thiếu.</li>
                           </ul>`,
      },
      en: {
        def: `<strong>Description:</strong> The largest community-built movie and TV database. Provides detailed metadata (title, overview, cast, crew...) and high-quality images (posters, backdrops).`,
        usage: `<ul>
                            <li><strong>Streaming Apps:</strong> Auto-display movie details & posters (Netflix clone).</li>
                            <li><strong>Recommendation:</strong> Suggest similar movies or same universe content.</li>
                            <li><strong>Booking:</strong> Show trailers and runtime for users.</li>
                            <li><strong>Analytics:</strong> Analyze cinema trends over time.</li>
                        </ul>`,
        req: `<strong>Req:</strong> API Key (v3 auth). Lib: <code>requests</code>.<br>
                      <strong>Get Key:</strong><br>
                      1. Sign up at <code>themoviedb.org</code>.<br>
                      2. Go to <strong>Settings -> API -> Create Key</strong> (Choose Developer).<br>
                      3. Fill form and copy <strong>API Key (v3 auth)</strong>.<br>
                      Endpoint: <code>api.themoviedb.org/3/search/movie</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Vietnamese support (<code>lang=vi-VN</code>), high-quality images, free for learning.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Rate limits (40-50 req/10s), complex image path logic (must construct URL), old movies might lack info.</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang kết nối đến TMDB Server...', 'cmd');

      // Regex linh hoạt hơn để bắt giá trị dù dùng ' hay "
      const queryMatch = code.match(/'query':\s*['"](.*?)['"]/);
      const keyMatch = code.match(/api_key\s*=\s*"(.*?)"/);

      const query = queryMatch ? queryMatch[1] : 'Mai';
      const key = keyMatch ? keyMatch[1] : '';

      try {
        // Thêm language=vi-VN để lấy nội dung tiếng Việt
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${query}&language=vi-VN`;
        const res = await fetch(url);

        if (res.status === 200) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const m = data.results[0]; // Lấy kết quả đầu tiên

            log(`✅ Đã tìm thấy phim:`);
            log(`----------------------------------------`);
            log(`🎬 Tên phim: ${m.title}`);
            log(`📅 Ngày phát hành: ${m.release_date}`);
            log(
              `⭐ Đánh giá: ${m.vote_average}/10 (${m.vote_count} lượt vote)`
            );
            log(
              `📝 Nội dung tóm tắt:\n${
                m.overview ? m.overview : 'Chưa có mô tả tiếng Việt.'
              }`
            );

            if (m.poster_path) {
              log(`🖼️ Poster chính thức:`);
              // Ghép link ảnh đầy đủ (w300 là kích thước ảnh)
              log(`https://image.tmdb.org/t/p/w300${m.poster_path}`, 'image');
            } else {
              log('⚠️ Phim này chưa cập nhật Poster.');
            }
            log(`----------------------------------------`);
          } else {
            log(`❌ Không tìm thấy phim nào có tên: "${query}"`, 'error');
          }
        } else if (res.status === 401) {
          log('⛔ Lỗi 401: API Key không hợp lệ hoặc sai.', 'error');
        } else {
          log(`⚠️ Lỗi API: ${res.status}`, 'error');
        }
      } catch (e) {
        console.error(e);
        log('❌ Lỗi kết nối mạng hoặc chặn CORS.', 'error');
      }
    },
  },

  // --- 3. UNSPLASH ---
  unsplash: {
    name: 'Unsplash API',
    filePath: './assets/codes/UnsplashAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Kho ảnh chất lượng cao miễn phí bản quyền.`,
        usage: `<ul><li><strong>Website:</strong> Tự động lấy ảnh minh họa, banner.</li><li><strong>Demo:</strong> Ứng dụng học tập.</li></ul>`,
        req: `<strong>Yêu cầu:</strong> Cần Access Key. Endpoint: <code>api.unsplash.com/search/photos</code>`,
        prosCons: `<ul><li style="color:#4caf50">Ưu: Ảnh đẹp, miễn phí.</li><li style="color:#ce9178">Nhược: Giới hạn 50 req/giờ.</li></ul>`,
      },
      en: {
        def: `<strong>Description:</strong> The internet’s source for visuals. Powered by creators everywhere.`,
        usage: `<ul><li><strong>Web:</strong> Auto-fetch stock photos, banners.</li><li><strong>Demo:</strong> Educational apps.</li></ul>`,
        req: `<strong>Req:</strong> Access Key needed. Endpoint: <code>api.unsplash.com/search/photos</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Beautiful, royalty-free.</li><li style="color:#ce9178">Cons: Strict rate limit (50 req/hr).</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang tìm ảnh trên Unsplash...', 'cmd');
      const keyMatch = code.match(/access_key = "(.*?)"/);
      const queryMatch = code.match(/query = "(.*?)"/);
      const key = keyMatch ? keyMatch[1] : '';
      const query = queryMatch ? queryMatch[1] : 'cat';
      try {
        const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${key}`;
        const res = await fetch(url);
        if (res.status === 200) {
          const data = await res.json();
          if (data.results[0]) {
            log(`Tìm thấy ảnh về "${query}":`);
            log(data.results[0].urls.small, 'image');
          } else {
            log('Không tìm thấy ảnh.');
          }
        } else {
          log(`Lỗi API: ${res.status}`, 'error');
        }
      } catch (e) {
        log('Lỗi kết nối.', 'error');
      }
    },
  },

  // --- 4. NEWS API ---
  news: {
    name: 'News API',
    filePath: './assets/codes/NewsAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Công cụ tổng hợp tin tức toàn cầu từ hàng nghìn nguồn uy tín (CNN, BBC, VNExpress...). Dữ liệu trả về gồm tiêu đề, mô tả, tác giả, ảnh thumbnail và link gốc.`,
        usage: `<ul>
                            <li><strong>App đọc báo:</strong> Gom tin từ nhiều nguồn vào một ứng dụng duy nhất.</li>
                            <li><strong>Phân tích dữ liệu:</strong> Quét từ khóa tài chính/công nghệ để dự đoán xu hướng.</li>
                            <li><strong>Cổng thông tin DN:</strong> Tự động hiển thị tin chuyên ngành lên website công ty.</li>
                            <li><strong>AI Training:</strong> Dữ liệu huấn luyện các mô hình tóm tắt văn bản.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br>
                      <strong>Cách tạo Key:</strong><br>
                      1. Truy cập <code>newsapi.org</code> và nhấn "Get API Key".<br>
                      2. Điền thông tin (Chọn "I am an individual").<br>
                      3. Copy Key hiện ra màn hình.<br>
                      Endpoint: <code>newsapi.org/v2/top-headlines</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Cập nhật tức thời, bộ lọc mạnh mẽ (nguồn, quốc gia, thời gian), tài liệu dễ dùng.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Gói Free chỉ trả về tóm tắt (không full bài), cấm dùng cho thương mại.</li>
                           </ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Global news aggregator from thousands of trusted sources (CNN, BBC...). Returns headlines, descriptions, authors, thumbnails, and original links.`,
        usage: `<ul>
                            <li><strong>News Aggregator:</strong> Centralize news from multiple sources into one app.</li>
                            <li><strong>Data Analysis:</strong> Scan keywords for market trend prediction.</li>
                            <li><strong>Corporate Portal:</strong> Auto-display industry-specific news.</li>
                            <li><strong>AI Training:</strong> Data source for text summarization models.</li>
                        </ul>`,
        req: `<strong>Req:</strong> API Key. Lib <code>requests</code>.<br>
                      <strong>Get Key:</strong><br>
                      1. Go to <code>newsapi.org</code> > "Get API Key".<br>
                      2. Fill info (Select "Individual").<br>
                      3. Copy the Key.<br>
                      Endpoint: <code>newsapi.org/v2/top-headlines</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Real-time updates, powerful filters (source, country, time), clear docs.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Free tier provides summary only (no full text), non-commercial use only.</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang kết nối đến NewsAPI...', 'cmd');

      const keyMatch = code.match(/api_key = "(.*?)"/);
      const countryMatch = code.match(/country = "(.*?)"/);
      const key = keyMatch ? keyMatch[1] : '42a7e5122a1d475fbe81576e3b088dbc';
      const country = countryMatch ? countryMatch[1] : 'us';

      try {
        const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${key}`;
        const res = await fetch(url);

        if (res.status === 200) {
          const data = await res.json();
          log(
            `✅ Đã tìm thấy ${data.totalResults} bài viết. Hiển thị 5 bài mới nhất:`,
            'success'
          );

          // SỬA Ở ĐÂY: Lấy 5 bài (slice 0->5)
          data.articles.slice(0, 5).forEach((n, i) => {
            log('--------------------------------------------------');
            log(`📰 BÀI VIẾT #${i + 1}`);
            log(`Tiêu đề: ${n.title}`, 'success');
            log(`✍️ Tác giả: ${n.author || 'Không rõ'}`);
            log(`🕒 Thời gian: ${new Date(n.publishedAt).toLocaleString()}`);
            log(`🏢 Nguồn: ${n.source.name}`);

            if (n.description) log(`📝 Tóm tắt: ${n.description}`);

            if (n.urlToImage) {
              log('🖼️ Ảnh Thumbnail:');
              log(n.urlToImage, 'image');
            }
            log(`🔗 Link gốc: ${n.url}`);
          });
          log('--------------------------------------------------');
        } else {
          throw new Error(`Status ${res.status}`);
        }
      } catch (e) {
        // FALLBACK Dữ liệu giả lập (Nếu lỗi CORS)
        log('⚠️ Lỗi kết nối API (CORS). Hiển thị dữ liệu mẫu 5 bài:', 'cmd');
        for (let i = 1; i <= 5; i++) {
          log('--------------------------------------------------');
          log(`📰 BÀI VIẾT #${i} (MÔ PHỎNG)`);
          log(
            `Tiêu đề: Tech News Headline Number ${i} - Breaking News`,
            'success'
          );
          log(`🔗 Link: https://example.com/news-${i}`);
        }
        log('--------------------------------------------------');
      }
    },
  },

  // --- 5. REST COUNTRIES ---
  country: {
    name: 'REST Countries API',
    filePath: './assets/codes/RESTCountriesAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Cung cấp thông tin quốc gia (dân số, thủ đô, cờ...).`,
        usage: `<ul><li><strong>Giáo dục:</strong> Website học địa lý.</li><li><strong>Du lịch:</strong> Tra cứu thông tin điểm đến.</li></ul>`,
        req: `<strong>Yêu cầu:</strong> KHÔNG cần Key. Endpoint: <code>restcountries.com/v3.1/name</code>`,
        prosCons: `<ul><li style="color:#4caf50">Ưu: Miễn phí hoàn toàn.</li><li style="color:#ce9178">Nhược: Dữ liệu tĩnh.</li></ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Get information about countries via a RESTful API.`,
        usage: `<ul><li><strong>Education:</strong> Geography learning sites.</li><li><strong>Travel:</strong> Destination lookup.</li></ul>`,
        req: `<strong>Req:</strong> No Key required. Endpoint: <code>restcountries.com/v3.1/name</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Completely Free.</li><li style="color:#ce9178">Cons: Static data.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang tra cứu...', 'cmd');
      const nameMatch = code.match(/country_name = "(.*?)"/);
      const name = nameMatch ? nameMatch[1] : 'vietnam';
      try {
        const url = `https://restcountries.com/v3.1/name/${name}`;
        const res = await fetch(url);
        if (res.status === 200) {
          const data = await res.json();
          const c = data[0];
          log(`Tên: ${c.name.common}`);
          log(c.flags.png, 'image');
          log(`Thủ đô: ${c.capital ? c.capital[0] : 'N/A'}`);
          log(`Dân số: ${c.population.toLocaleString()}`);
        } else {
          log('Không tìm thấy quốc gia.');
        }
      } catch (e) {
        log('Lỗi kết nối.', 'error');
      }
    },
  },

  // --- 6. EXCHANGE RATE ---
  exchange: {
    name: 'ExchangeRate API',
    filePath: './assets/codes/ExchangeRateAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Tỷ giá hối đoái thực và lịch sử của 160+ loại tiền tệ.`,
        usage: `<ul><li><strong>E-commerce:</strong> Hiển thị giá theo tiền tệ khách hàng.</li><li><strong>Kế toán:</strong> Quy đổi doanh thu.</li></ul>`,
        req: `<strong>Yêu cầu:</strong> Cần API Key. Endpoint: <code>v6.exchangerate-api.com</code>`,
        prosCons: `<ul><li style="color:#4caf50">Ưu: Dữ liệu tin cậy.</li><li style="color:#ce9178">Nhược: Phụ thuộc bên thứ 3.</li></ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Real-time and historical exchange rates for 160+ currencies.`,
        usage: `<ul><li><strong>E-commerce:</strong> Multi-currency pricing.</li><li><strong>Accounting:</strong> Revenue conversion.</li></ul>`,
        req: `<strong>Req:</strong> API Key needed. Endpoint: <code>v6.exchangerate-api.com</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Reliable data.</li><li style="color:#ce9178">Cons: Third-party dependency.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang lấy tỷ giá...', 'cmd');
      const keyMatch = code.match(/api_key = "(.*?)"/);
      const baseMatch = code.match(/base_currency = "(.*?)"/);
      const targetMatch = code.match(/target_currency = "(.*?)"/);
      const key = keyMatch ? keyMatch[1] : '';
      const base = baseMatch ? baseMatch[1] : 'USD';
      const target = targetMatch ? targetMatch[1] : 'VND';
      try {
        const url = `https://v6.exchangerate-api.com/v6/${key}/latest/${base}`;
        const res = await fetch(url);
        if (res.status === 200) {
          const data = await res.json();
          if (data.result === 'success') {
            const rate = data.conversion_rates[target];
            log(`1 ${base} = ${rate.toLocaleString()} ${target}`);
          } else {
            log('Lỗi API Key.', 'error');
          }
        } else {
          log(`Lỗi HTTP: ${res.status}`, 'error');
        }
      } catch (e) {
        log('Lỗi kết nối.', 'error');
      }
    },
  },

  // --- 7. QR SERVER ---
  qr: {
    name: 'QR Server API',
    filePath: './assets/codes/QRServerAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> API thuộc nhóm Utility/Image Processing. Chuyên tạo mã QR từ văn bản, URL, Email... và hỗ trợ giải mã (decode) nội dung từ ảnh QR.`,
        usage: `<ul>
                            <li><strong>Thanh toán:</strong> Tạo VietQR chứa số tài khoản để chuyển khoản nhanh.</li>
                            <li><strong>Tiện ích:</strong> QR kết nối Wi-Fi không cần nhập pass.</li>
                            <li><strong>Sự kiện:</strong> Vé mời điện tử, Check-in tự động.</li>
                            <li><strong>Marketing:</strong> Dẫn khách hàng tới trang khuyến mãi.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> Thư viện <code>requests</code>. Không cần API Key.<br>
                      <strong>Cài đặt:</strong> <code>pip install requests</code><br>
                      Endpoint: <code>api.qrserver.com/v1/create-qr-code</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Miễn phí, không cần đăng ký, tốc độ phản hồi nhanh, ổn định.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Chỉ tạo được QR Tĩnh (Static) - không thể sửa nội dung sau khi tạo, không có thống kê lượt quét.</li>
                           </ul>`,
      },
      en: {
        def: `<strong>Description:</strong> A Utility/Image Processing API. Generates QR codes from text, URLs, Emails... and supports decoding content from QR images.`,
        usage: `<ul>
                            <li><strong>Payments:</strong> Generate payment QRs (VietQR) for quick transfers.</li>
                            <li><strong>Utility:</strong> Wi-Fi login QRs (no password typing required).</li>
                            <li><strong>Events:</strong> E-tickets and automated Check-in.</li>
                            <li><strong>Marketing:</strong> Direct customers to landing pages.</li>
                        </ul>`,
        req: `<strong>Req:</strong> Lib <code>requests</code>. No API Key required.<br>
                      <strong>Install:</strong> <code>pip install requests</code><br>
                      Endpoint: <code>api.qrserver.com/v1/create-qr-code</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Free, no sign-up needed, fast response time, stable.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Static QR only (cannot change content later), no analytics/tracking features.</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      // Lấy dữ liệu từ code (xử lý cả ngoặc đơn và ngoặc kép)
      const dataMatch = code.match(/my_data\s*=\s*['"](.*?)['"]/);
      const myData = dataMatch ? dataMatch[1] : 'https://github.com'; // Mặc định nếu không tìm thấy

      // Tạo URL (Size 300x300 cho rõ nét)
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        myData
      )}`;

      log(`⏳ Đang tạo mã QR cho nội dung: "${myData}"...`, 'cmd');

      // Giả lập độ trễ mạng xíu cho chân thực
      setTimeout(() => {
        log('✅ Đã tạo thành công! (Click vào ảnh để phóng to)', 'success');

        // TỰ TẠO ELEMENT ẢNH ĐỂ GẮN SỰ KIỆN CLICK (ZOOM)
        const term = document.getElementById('console-output');

        // 1. Tạo khung chứa ảnh trong terminal
        const imgContainer = document.createElement('div');
        imgContainer.style.margin = '10px 0';

        const img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = '200px';
        img.style.border = '2px solid #fff';
        img.style.borderRadius = '8px';
        img.style.cursor = 'zoom-in'; // Hiện con trỏ kính lúp
        img.title = 'Click để phóng to toàn màn hình';

        // 2. SỰ KIỆN CLICK: Tạo Overlay phóng to
        img.onclick = function () {
          // Tạo lớp phủ đen mờ
          const overlay = document.createElement('div');
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          left = '0';
          overlay.style.width = '100vw';
          overlay.style.height = '100vh';
          overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
          overlay.style.zIndex = '99999'; // Đảm bảo nổi lên trên cùng
          overlay.style.display = 'flex';
          overlay.style.justifyContent = 'center';
          overlay.style.alignItems = 'center';
          overlay.style.flexDirection = 'column';
          overlay.style.cursor = 'zoom-out';

          // Tạo ảnh lớn
          const bigImg = document.createElement('img');
          bigImg.src = url;
          bigImg.style.width = '400px';
          bigImg.style.height = '400px';
          bigImg.style.boxShadow = '0 0 50px rgba(56, 189, 248, 0.5)'; // Hiệu ứng phát sáng
          bigImg.style.borderRadius = '15px';
          bigImg.style.border = '5px solid white';
          bigImg.style.backgroundColor = 'white'; // Nền trắng cho QR dễ quét

          // Dòng hướng dẫn
          const text = document.createElement('p');
          text.innerHTML =
            '<i class="fa-solid fa-mobile-screen"></i> Quét mã trên màn hình';
          text.style.color = 'white';
          text.style.marginTop = '20px';
          text.style.fontSize = '1.2rem';
          text.style.fontFamily = 'var(--font-ui)';

          // Gắn vào body
          overlay.appendChild(bigImg);
          overlay.appendChild(text);
          document.body.appendChild(overlay);

          // Click lần nữa để đóng
          overlay.onclick = () => document.body.removeChild(overlay);
        };

        imgContainer.appendChild(img);
        term.appendChild(imgContainer);
        term.scrollTop = term.scrollHeight; // Tự cuộn xuống dưới cùng
      }, 800);
    },
  },

  // --- 8. URL SCAN ---
  urlscan: {
    name: 'URLScan.io',
    filePath: './assets/codes/URLScan.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Quét link để phát hiện mã độc, phishing và phân tích IP.`,
        usage: `<ul><li><strong>Bảo mật:</strong> Bot quét link lạ trong chat.</li><li><strong>Phân tích:</strong> Xem web host ở đâu.</li></ul>`,
        req: `<strong>Yêu cầu:</strong> Cần API Key. Endpoint: <code>urlscan.io/api/v1/scan</code>`,
        prosCons: `<ul><li style="color:#4caf50">Ưu: An toàn.</li><li style="color:#ce9178">Nhược: Cần thời gian chờ.</li></ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Scan URLs to detect malware, phishing, and analyze IPs.`,
        usage: `<ul><li><strong>Security:</strong> Chat bot to scan suspicious links.</li><li><strong>Analysis:</strong> Check hosting info.</li></ul>`,
        req: `<strong>Req:</strong> API Key needed. Endpoint: <code>urlscan.io/api/v1/scan</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Safe (no direct click).</li><li style="color:#ce9178">Cons: Wait time required.</li></ul>`,
      },
    },
    action: async (code) => {
      const targetMatch = code.match(/target_url = "(.*?)"/);
      const target = targetMatch ? targetMatch[1] : 'google.com';
      log(`Đang gửi yêu cầu quét: ${target}`, 'cmd');
      setTimeout(() => {
        log(`Kết quả: Website An toàn (Mock result)`);
        log(
          `Xem chi tiết tại: https://urlscan.io/domain/${target.replace(
            'https://',
            ''
          )}`
        );
      }, 1500);
    },
  },

  // --- 9. OPENAI (CHATGPT) ---
  openai: {
    name: 'OpenAI API',
    filePath: './assets/codes/OpenAIAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> API truy cập các mô hình ngôn ngữ lớn (LLM) để xử lý ngôn ngữ tự nhiên.`,
        usage: `<ul><li><strong>Chatbot:</strong> CSKH tự động.</li><li><strong>Content:</strong> Tóm tắt, viết bài.</li></ul>`,
        req: `<strong>Yêu cầu:</strong> Cần API Key ($). Endpoint: <code>api.openai.com</code>`,
        prosCons: `<ul><li style="color:#4caf50">Ưu: Thông minh.</li><li style="color:#ce9178">Nhược: Trả phí.</li></ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Access Large Language Models (LLMs) for natural language processing.`,
        usage: `<ul><li><strong>Chatbot:</strong> Auto customer support.</li><li><strong>Content:</strong> Summarization, writing.</li></ul>`,
        req: `<strong>Req:</strong> API Key ($). Endpoint: <code>api.openai.com</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Intelligent.</li><li style="color:#ce9178">Cons: Paid usage.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang gửi prompt tới OpenAI...', 'cmd');
      setTimeout(() => {
        log(
          `Response: "Block cipher mode of operation is a technique... (Demo)"`,
          'success'
        );
      }, 2000);
    },
  },

  // --- 10. REMOVE BG ---
  removebg: {
    name: 'Remove.bg API',
    filePath: './assets/codes/RemoveBGAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Giải pháp xử lý hình ảnh dựa trên AI, chuyên dùng để tách nền tự động. Nhận diện chính xác chủ thể (người, sản phẩm, xe cộ) và loại bỏ phông nền chỉ trong vài giây, xử lý tốt cả tóc rối hay kính trong suốt.`,
        usage: `<ul>
                            <li><strong>Thương mại điện tử:</strong> Tự động xóa nền ảnh sản phẩm để ghép phông trắng chuẩn studio.</li>
                            <li><strong>Ảnh thẻ & Hồ sơ:</strong> Thay đổi phông nền xanh/trắng cho ảnh chân dung/thẻ nhân viên.</li>
                            <li><strong>Marketing:</strong> Tách layer nhanh chóng để làm banner, poster không cần cắt thủ công.</li>
                            <li><strong>Cá nhân hóa:</strong> Tạo sticker, meme từ ảnh cá nhân.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>. File ảnh.<br>
                      <strong>Cài đặt:</strong> <code>pip install requests</code><br>
                      <strong>Cách tạo Key:</strong><br>
                      1. Đăng ký tại <code>remove.bg</code> > Menu "Tools & API".<br>
                      2. Chọn "API Key" > "Create New API Key".<br>
                      Endpoint: <code>api.remove.bg/v1.0/removebg</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Chất lượng xuất sắc (top đầu thị trường), tốc độ xử lý nhanh (vài giây/ảnh).</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Chi phí cao nếu dùng nhiều, gói Free chỉ cho tải ảnh nhỏ (Preview ~0.25MP).</li>
                           </ul>`,
      },
      en: {
        def: `<strong>Description:</strong> AI-based image processing solution for automatic background removal. Accurately detects subjects (people, products, cars) and handles complex details like hair or transparent glass.`,
        usage: `<ul>
                            <li><strong>E-commerce:</strong> Auto-remove backgrounds for product photos.</li>
                            <li><strong>ID Photos:</strong> Change backgrounds for portraits/ID cards.</li>
                            <li><strong>Marketing:</strong> Quick layer extraction for banners/posters.</li>
                            <li><strong>Personal:</strong> Create stickers/memes.</li>
                        </ul>`,
        req: `<strong>Req:</strong> API Key. Lib <code>requests</code>. Image file.<br>
                      <strong>Install:</strong> <code>pip install requests</code><br>
                      <strong>Get Key:</strong> Sign up at <code>remove.bg</code> > "Tools & API" > Create Key.<br>
                      Endpoint: <code>api.remove.bg/v1.0/removebg</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Excellent quality (market leader), fast processing.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Expensive for high volume, Free tier only allows small resolution (Preview).</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang khởi động Remove.bg GUI...', 'cmd');
      setTimeout(() => {
        currentToolMode = 'removebg'; // Đặt chế độ RemoveBG

        // Đổi tiêu đề cửa sổ
        const toolHeader = document.querySelector('.tool-header span');
        if (toolHeader)
          toolHeader.innerHTML =
            '<i class="fa-solid fa-wand-magic-sparkles"></i> AI Background Remover';

        // Reset giao diện về mặc định
        document.getElementById('upload-stage').style.display = 'block';
        document.getElementById('result-stage').style.display = 'none';

        log('✅ Đã mở công cụ tách nền.', 'success');
        openTool();
      }, 500);
    },
  },

  // --- 11. OCR SPACE ---
  ocr: {
    name: 'OCR.space API',
    filePath: './assets/codes/OCRSpaceAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Dịch vụ Nhận dạng ký tự quang học (OCR) trên đám mây. Chuyển đổi ảnh Scan/PDF thành văn bản text.`,
        usage: `<ul><li><strong>Số hóa:</strong> Chuyển hợp đồng giấy thành file Word.</li><li><strong>eKYC:</strong> Đọc thông tin CMND/CCCD.</li></ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>. Endpoint: <code>api.ocr.space/parse/image</code>`,
        prosCons: `<ul><li style="color:#4caf50">Ưu: Hỗ trợ tiếng Việt.</li><li style="color:#ce9178">Nhược: Phụ thuộc độ nét ảnh.</li></ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Cloud-based OCR service. Converts scanned images/PDFs into editable text.`,
        usage: `<ul><li><strong>Digitization:</strong> Paper to digital text.</li><li><strong>eKYC:</strong> Extract ID card info.</li></ul>`,
        req: `<strong>Req:</strong> API Key. Lib <code>requests</code>. Endpoint: <code>api.ocr.space/parse/image</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Good Vietnamese support.</li><li style="color:#ce9178">Cons: Dependent on image quality.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang khởi động OCR Scanner...', 'cmd');
      setTimeout(() => {
        currentToolMode = 'ocr'; // Đặt chế độ OCR

        // Đổi tiêu đề cửa sổ
        const toolHeader = document.querySelector('.tool-header span');
        if (toolHeader)
          toolHeader.innerHTML =
            '<i class="fa-solid fa-file-invoice"></i> OCR Document Scanner';

        // Reset lại trạng thái giao diện (quan trọng)
        document.getElementById('upload-stage').style.display = 'block';
        document.getElementById('result-stage').style.display = 'none';

        log('✅ Đã mở cửa sổ chọn tài liệu.', 'success');
        openTool();
      }, 500);
    },
  },

  // --- 12. GOOGLE TRANSLATE (UNOFFICIAL) ---
  translate: {
    name: 'Googletrans (Unofficial)',
    filePath: './assets/codes/TranslateAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Thư viện Python mã nguồn mở, miễn phí, cho phép sử dụng Google Translate API không giới hạn. Hoạt động bằng cách gửi request trực tiếp đến giao diện web của Google Dịch.`,
        usage: `<ul>
                            <li><strong>Chatbot:</strong> Tự động dịch tin nhắn giữa người mua và người bán khác ngôn ngữ.</li>
                            <li><strong>Bản địa hóa (Localization):</strong> Dịch file ngôn ngữ (JSON/XML) cho ứng dụng quốc tế.</li>
                            <li><strong>Học tập:</strong> Tool học từ vựng, flashcard tự động lấy nghĩa/phát âm.</li>
                            <li><strong>Phân tích dữ liệu:</strong> Dịch bình luận/đánh giá về ngôn ngữ gốc để phân tích cảm xúc (Sentiment Analysis).</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> Python & thư viện <code>googletrans</code>.<br>
                      <strong>Cài đặt:</strong> <code>pip install googletrans==4.0.0-rc1</code><br>
                      (Lưu ý: Phải dùng bản <strong>rc1</strong> vì bản cũ thường lỗi kết nối).<br>
                      <strong>Cách dùng:</strong> Sử dụng class <code>Translator</code>.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Hoàn toàn miễn phí (không cần thẻ Visa/API Key), code đơn giản, tận dụng được data khổng lồ của Google.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Không ổn định (Unofficial - có thể bị chặn IP hoặc đổi cơ chế), dính lỗi 429 nếu spam request, không hợp cho Production lớn.</li>
                           </ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Free, open-source Python library that uses Google Translate API via web scraping requests. Supports auto-detection and translation for 100+ languages.`,
        usage: `<ul>
                            <li><strong>Chatbot:</strong> Auto-translate messages between buyers/sellers.</li>
                            <li><strong>Localization:</strong> Translate app language files (JSON/XML) for global markets.</li>
                            <li><strong>Learning:</strong> Vocabulary tools, auto-flashcards.</li>
                            <li><strong>Data Analysis:</strong> Translate reviews for Sentiment Analysis algorithms.</li>
                        </ul>`,
        req: `<strong>Req:</strong> Python & lib <code>googletrans</code>.<br>
                      <strong>Install:</strong> <code>pip install googletrans==4.0.0-rc1</code><br>
                      (Note: Use <strong>rc1</strong> version to avoid connection errors).<br>
                      <strong>Usage:</strong> Use <code>Translator</code> class.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Completely Free (no Credit Card/API Key), simple syntax, high accuracy from Google.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Unstable (Unofficial - risk of IP ban or breaking changes), Rate Limit (429) if abused, not for large Production.</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      // 1. Phân tích code để lấy text cần dịch
      const textMatch = code.match(/text = "(.*?)"/);
      const srcMatch = code.match(/src = "(.*?)"/);
      const destMatch = code.match(/dest = "(.*?)"/);

      const text = textMatch ? textMatch[1] : 'Hôm nay trời đẹp';
      const src = srcMatch ? srcMatch[1] : 'vi';
      const dest = destMatch ? destMatch[1] : 'en';

      // Giả lập Python Print: >>> Translating...
      log(`>>> Translating: '${text}' (${src} -> ${dest})...`, 'cmd');

      // 2. Gọi API Dịch miễn phí (MyMemory API) để demo kết quả thật
      // (Vì ta không thể chạy thư viện Python googletrans trên trình duyệt, nên dùng API này để thay thế cho sinh động)
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=${src}|${dest}`;
        const res = await fetch(url);
        const data = await res.json();

        // Giả lập độ trễ của mạng như code Python
        setTimeout(() => {
          if (data.responseData) {
            log(`Original: ${text}`);
            log(`Translated: ${data.responseData.translatedText}`);
          } else {
            log(`Original: ${text}`);
            log(`Translated: Today is beautiful (Fallback)`);
          }
        }, 1000);
      } catch (e) {
        // Fallback nếu lỗi mạng
        setTimeout(() => {
          log(`Original: ${text}`);
          log(`Translated: [Network Error] Could not fetch translation.`);
        }, 1000);
      }
    },
  },
};

// --- CORE FUNCTIONS ---

async function selectAPI(key) {
  currentKey = key;
  const data = demoData[key];

  // 1. Update Buttons Active State
  document
    .querySelectorAll('.api-btn')
    .forEach((b) => b.classList.remove('active'));
  const clickedBtn = event
    ? event.currentTarget
    : document.querySelector(`button[onclick="selectAPI('${key}')"]`);
  if (clickedBtn) clickedBtn.classList.add('active');

  // 2. Load Code into CodeMirror
  if (editor) editor.setValue('# Loading code...');
  try {
    const response = await fetch(data.filePath);
    if (response.ok) {
      const text = await response.text();
      if (editor) editor.setValue(text);
    } else {
      if (editor) editor.setValue(`# Code file not found: ${data.filePath}`);
    }
  } catch (e) {
    if (editor) editor.setValue(`# Error loading file. Use Live Server.`);
  }

  // 3. Render Info Box (Theo ngôn ngữ hiện tại)
  renderInfoBox();

  // 4. Reset Console
  document.getElementById('console-output').innerHTML =
    'C:\\Users\\Dev\\Projects> _';
}

// Hàm hiển thị Info Box thông minh
function renderInfoBox() {
  const data = demoData[currentKey];
  if (!data || !data.langData) return;

  const content = data.langData[currentLang]; // Lấy nội dung theo ngôn ngữ đang chọn (vi hoặc en)

  // Nút bấm chuyển ngữ
  const btnLabel =
    currentLang === 'vi'
      ? `<i class="fa-solid fa-earth-americas"></i> &nbsp; Translate to English`
      : `<i class="fa-solid fa-rotate-left"></i> &nbsp; Dịch sang Tiếng Việt`;

  const infoPanel = document.getElementById('info-panel');

  // Tạo HTML
  infoPanel.innerHTML = `
        <h2 class="info-title">${data.name}</h2>
        <div class="info-grid">
            <div class="info-item">
                <h4>${
                  currentLang === 'vi' ? '1. Giới thiệu' : '1. Introduction'
                }</h4>
                <p>${content.def}</p>
                
                <button onclick="toggleLang()" class="run-btn" style="width:100%; margin-top:15px; padding:10px; justify-content:center; background:var(--primary); color:#000;">
                    ${btnLabel}
                </button>

                <br><br>
                <h4>${
                  currentLang === 'vi' ? '3. Yêu cầu' : '3. Requirements'
                }</h4>
                <p>${content.req}</p>
            </div>
            <div class="info-item">
                <h4>${currentLang === 'vi' ? '2. Ứng dụng' : '2. Usage'}</h4>
                ${content.usage}
                <h4>${
                  currentLang === 'vi' ? '4. Đánh giá' : '4. Pros & Cons'
                }</h4>
                ${content.prosCons}
            </div>
        </div>
    `;
}

// --- GLOBAL LANGUAGE TOGGLE ---
function toggleLang() {
  // 1. Đổi trạng thái ngôn ngữ
  currentLang = currentLang === 'vi' ? 'en' : 'vi';

  // 2. Tạo hiệu ứng Loading
  const infoPanel = document.getElementById('info-panel');
  infoPanel.style.opacity = '0.5';

  // Giữ nguyên độ cao để không bị giật layout
  const currentHeight = infoPanel.clientHeight;
  infoPanel.style.height = currentHeight + 'px';
  infoPanel.innerHTML = `<div style="height:100%; display:flex; align-items:center; justify-content:center; font-size:1.2em;">
                            <i class="fa-solid fa-circle-notch fa-spin" style="margin-right:10px; color:var(--primary)"></i> 
                            ${
                              currentLang === 'vi'
                                ? 'Đang dịch...'
                                : 'Translating...'
                            }
                           </div>`;

  // 3. Cập nhật lại giao diện sau 500ms
  setTimeout(() => {
    renderInfoBox();
    infoPanel.style.opacity = '1';
    infoPanel.style.height = 'auto'; // Trả lại chiều cao tự động
  }, 500);
}

function runSimulation() {
  log(`Running script: ${currentKey}_demo.py`, 'cmd');
  if (demoData[currentKey]) {
    // Lấy code từ editor thay vì textarea thường
    const codeContent = editor ? editor.getValue() : '';
    demoData[currentKey].action(codeContent);
  }
}

// --- UTILS & GUI LOGIC ---
function log(text, type = 'normal') {
  const term = document.getElementById('console-output');
  if (type === 'image') {
    const img = document.createElement('img');
    img.src = text;
    img.style.maxWidth = '200px';
    img.style.border = '1px solid #555';
    img.style.margin = '5px 0';
    term.appendChild(img);
    img.onload = () => {
      term.scrollTop = term.scrollHeight;
    };
  } else {
    const line = document.createElement('div');
    line.textContent = text;
    if (type === 'cmd') line.style.color = '#ffff00';
    if (type === 'success') line.style.color = '#4CAF50';
    if (type === 'error') line.style.color = '#ff5f56';
    term.appendChild(line);
    term.scrollTop = term.scrollHeight;
  }
}

// Overlay Functions
const overlay = document.getElementById('tool-overlay');
function openTool() {
  overlay.style.display = 'flex';
  setTimeout(() => overlay.classList.add('active'), 10);
}
function closeTool() {
  overlay.classList.remove('active');
  setTimeout(() => {
    overlay.style.display = 'none';
    resetTool();
  }, 300);
}

// --- HÀM XỬ LÝ ẢNH THỰC TẾ (REAL API CALL) ---
function processImage(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];

    // --- NHÁNH 1: XỬ LÝ OCR (GỌI API THẬT) ---
    if (currentToolMode === 'ocr') {
      // 1. Cập nhật giao diện trạng thái
      document.getElementById('upload-stage').style.display = 'none';
      document.getElementById('result-stage').style.display = 'block';

      // Ẩn view RemoveBG
      const removeBgView = document.getElementById('removebg-view');
      if (removeBgView) removeBgView.style.display = 'none';

      const statusText = document.getElementById('status-text');
      statusText.innerHTML = '⏳ Đang gửi ảnh lên Server OCR.space...';
      statusText.style.color = '#e2e8f0';

      log(
        `GUI: Đã chọn file "${file.name}" (${(file.size / 1024).toFixed(
          1
        )} KB)`,
        'cmd'
      );

      // 2. Chuẩn bị dữ liệu gửi đi (FormData)
      const formData = new FormData();
      formData.append('file', file); // File ảnh thật
      formData.append('apikey', 'helloworld'); // Key test (Giới hạn <1MB). Thay key riêng nếu muốn.
      formData.append('language', 'eng'); // 'eng' hoặc 'vie' (Nếu dùng Key riêng mới đổi được sang 'vie')
      formData.append('isOverlayRequired', 'false');

      // 3. Đóng cửa sổ chọn ảnh để người dùng nhìn Console
      setTimeout(() => {
        statusText.innerHTML = `<i class="fa-solid fa-check-circle"></i> Upload xong. Đang xử lý...`;
        statusText.style.color = '#4CAF50';
        setTimeout(() => closeTool(), 500); // Đóng sau 0.5s
      }, 1000);

      // 4. GỌI API THỰC TẾ (FETCH)
      log('>>> Đang kết nối tới https://api.ocr.space/parse/image...', 'cmd');

      fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Kiểm tra lỗi từ API
          if (data.IsErroredOnProcessing) {
            log(`❌ Lỗi API: ${data.ErrorMessage}`, 'error');
            if (data.ErrorMessage.includes('file size')) {
              log(
                "⚠️ Gợi ý: Key 'helloworld' chỉ cho phép ảnh dưới 1MB.",
                'cmd'
              );
            }
          } else if (data.ParsedResults && data.ParsedResults.length > 0) {
            // Lấy kết quả chữ thật
            const realText = data.ParsedResults[0].ParsedText;

            log('✅ Đã nhận dạng thành công!', 'success');
            log(
              '--------------------------------------------------',
              'success'
            );
            log(`📄 KẾT QUẢ THỰC TẾ TỪ ẢNH:`);
            log(
              '--------------------------------------------------',
              'success'
            );

            // In nội dung chữ ra console
            if (realText.trim() === '') {
              log('(Không tìm thấy văn bản nào trong ảnh)', 'error');
            } else {
              log(realText);
            }
            log(
              '--------------------------------------------------',
              'success'
            );
          } else {
            log('⚠️ API không trả về kết quả nào.', 'error');
          }
        })
        .catch((error) => {
          console.error(error);
          log('❌ Lỗi kết nối mạng hoặc chặn CORS.', 'error');
          log(
            "⚠️ Lưu ý: Nếu dùng Key 'helloworld' quá nhiều lần sẽ bị chặn IP tạm thời.",
            'cmd'
          );
        })
        .finally(() => {
          input.value = ''; // Reset input để chọn file khác
        });
    }

    // --- NHÁNH 2: XỬ LÝ REMOVE BG ---
    else {
      const objectURL = URL.createObjectURL(file);
      document.getElementById('upload-stage').style.display = 'none';
      document.getElementById('result-stage').style.display = 'block';

      // Hiện lại giao diện RemoveBG
      const removeBgView = document.getElementById('removebg-view');
      if (removeBgView) removeBgView.style.display = 'flex';

      // Hiển thị ảnh gốc
      document.getElementById('img-original').src = objectURL;

      // Reset ảnh kết quả
      const imgResult = document.getElementById('img-result');
      imgResult.src = '';
      imgResult.style.opacity = '0.5';
      imgResult.onclick = null; // Xóa sự kiện click cũ
      imgResult.style.cursor = 'default';
      imgResult.title = '';

      const statusText = document.getElementById('status-text');
      statusText.innerText = '⏳ Đang gửi ảnh lên Server Remove.bg...';
      statusText.style.color = '#e2e8f0';

      log(`GUI: Đã tải file "${file.name}"`, 'cmd');

      // --- CHUẨN BỊ GỌI API ---
      // Key lấy từ file Python của bạn. Lưu ý: Key Free có giới hạn số lần gọi.
      const apiKey = 'f8uU5eupXfvjoQoojq2RofN1';

      const formData = new FormData();
      formData.append('image_file', file);
      formData.append('size', 'auto');

      log('>>> Đang gọi API Remove.bg (POST)...', 'cmd');

      fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
        },
        body: formData,
      })
        .then(async (response) => {
          if (response.ok) {
            return response.blob(); // API trả về file ảnh (Blob)
          } else {
            const errorText = await response.text();
            throw new Error(`Lỗi API (${response.status}): ${errorText}`);
          }
        })
        .then((blob) => {
          // Xử lý thành công
          const resultUrl = URL.createObjectURL(blob);

          imgResult.src = resultUrl;
          imgResult.style.opacity = '1';

          statusText.innerHTML =
            '✅ Tách nền thành công! (Click vào ảnh để tải)';
          statusText.style.color = '#4CAF50';

          log('✅ Đã nhận được ảnh kết quả.', 'success');

          // --- TÍNH NĂNG TẢI ẢNH KHI CLICK ---
          imgResult.style.cursor = 'pointer';
          imgResult.title = 'Click để tải ảnh về máy';
          imgResult.onclick = () => {
            const a = document.createElement('a');
            a.href = resultUrl;
            a.download = 'removebg_result.png'; // Tên file khi tải về
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            log('⬇️ Đang tải ảnh về máy...', 'cmd');
          };
        })
        .catch((error) => {
          console.error(error);
          statusText.innerText = '❌ Lỗi: ' + error.message;
          statusText.style.color = '#ff5f56';
          log('❌ ' + error.message, 'error');

          // Cảnh báo về CORS (Vấn đề thường gặp khi gọi RemoveBG từ trình duyệt)
          if (error.message.includes('Failed to fetch')) {
            log(
              '⚠️ LƯU Ý: Remove.bg chặn gọi trực tiếp từ trình duyệt (CORS).',
              'cmd'
            );
            log(
              "Để chạy được demo này, bạn cần cài Extension 'Allow CORS' hoặc chạy qua Proxy server.",
              'cmd'
            );
          }
        })
        .finally(() => {
          input.value = ''; // Reset để chọn ảnh khác
        });
    }
  }
}

function resetTool() {
  document.getElementById('file-upload').value = '';
  document.getElementById('upload-stage').style.display = 'block';
  document.getElementById('result-stage').style.display = 'none';
  document.getElementById('status-text').innerText = '⏳ Processing...';
  document.getElementById('img-original').src = '';
  document.getElementById('img-result').src = '';
}

// Theme Toggle
function toggleTheme() {
  const body = document.body;
  body.classList.toggle('light-mode');
  const isLight = body.classList.contains('light-mode');
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');

  if (isLight) {
    icon.className = 'fa-solid fa-sun';
    text.innerText = 'Light Mode';
    icon.style.color = '#f59e0b';
  } else {
    icon.className = 'fa-solid fa-moon';
    text.innerText = 'Dark Mode';
    icon.style.color = '';
  }
}

// Init CodeMirror & First API
window.onload = () => {
  // Khởi tạo CodeMirror
  editor = CodeMirror.fromTextArea(document.getElementById('python-code'), {
    mode: 'python',
    theme: 'dracula',
    lineNumbers: true,
    indentUnit: 4,
    matchBrackets: true,
  });

  // Chỉnh kích thước
  editor.setSize('100%', '100%');

  // Load API đầu tiên
  selectAPI('weather');
};
