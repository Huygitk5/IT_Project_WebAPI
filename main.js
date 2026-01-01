// --- CẤU HÌNH TRẠNG THÁI ---
let currentKey = 'weather';
let currentLang = 'vi';
let editor;
let currentToolMode = ''; // Chế độ tool (ocr/removebg)

// --- DỮ LIỆU CẤU HÌNH API (FULL REAL + GIỮ NGUYÊN MÔ TẢ) ---
const demoData = {
  // --- 1. OPEN WEATHER MAP ---
  weather: {
    name: 'OpenWeatherMap API',
    filePath: './assets/codes/OpenWeatherMapAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> API cung cấp dữ liệu thời tiết toàn cầu (hiện tại, dự báo, lịch sử). Trả về JSON gồm nhiệt độ, độ ẩm, áp suất, gió và mưa.`,
        usage: `<ul>
                            <li><strong>Nông nghiệp:</strong> Tự động ngắt tưới tiêu khi sắp mưa.</li>
                            <li><strong>Logistics:</strong> Cảnh báo bão để đổi lộ trình giao hàng.</li>
                            <li><strong>Du lịch:</strong> Hiển thị thời tiết điểm đến.</li>
                            <li><strong>Năng lượng:</strong> Dự báo nắng/gió cho điện tái tạo.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> Access Key. Thư viện: <code>requests</code>.<br>
                      <strong>Cách tạo Key:</strong> Truy cập <code>openweathermap.org</code> > "My API Keys".<br>
                      Endpoint: <code>api.openweathermap.org/data/2.5/weather</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50">Ưu: Gói Free hào phóng (60 gọi/phút), JSON nhẹ, phủ sóng rộng.</li>
                               <li style="color:#ce9178">Nhược: Giới hạn truy cập (Lỗi 429), độ trễ 10-20p.</li>
                           </ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Provides global weather data (current, forecast, historical). Returns JSON with temp, humidity, pressure, wind.`,
        usage: `<ul>
                            <li><strong>Agriculture:</strong> Auto-stop irrigation when rain is expected.</li>
                            <li><strong>Logistics:</strong> Storm warnings for route optimization.</li>
                        </ul>`,
        req: `<strong>Req:</strong> Access Key. Endpoint: <code>api.openweathermap.org/data/2.5/weather</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Generous Free tier.</li><li style="color:#ce9178">Cons: Rate limits.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang kết nối OpenWeatherMap ...', 'cmd');
      const cityMatch = code.match(/city = "(.*?)"/);
      const keyMatch = code.match(/api_key = "(.*?)"/);
      const city = cityMatch ? cityMatch[1] : 'Ho Chi Minh City,VN';
      const key = keyMatch ? keyMatch[1] : '463ed506f10cd039c485cd8f2db2de19';

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=vi`;
        const res = await fetch(url);
        if (res.status === 200) {
          const data = await res.json();
          log(`✅ Thời tiết tại ${data.name}, ${data.sys.country}:`, 'success');
          log(
            `🌡️ Nhiệt độ: ${data.main.temp}°C (Cảm giác như: ${data.main.feels_like}°C)`
          );
          log(`☁️ Mô tả: ${data.weather[0].description.toUpperCase()}`);
          log(
            `💧 Độ ẩm: ${data.main.humidity}% - 💨 Gió: ${data.wind.speed}m/s`
          );
        } else {
          log(`❌ Lỗi API: ${res.status} ${res.statusText}`, 'error');
        }
      } catch (e) {
        log('❌ Lỗi kết nối mạng.', 'error');
      }
    },
  },

  // --- 2. TMDB MOVIE ---
  tmdb: {
    name: 'The Movie Database (TMDB)',
    filePath: './assets/codes/TheMovieDatabaseAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> CSDL phim ảnh lớn nhất thế giới do cộng đồng đóng góp. Cung cấp tên, tóm tắt, diễn viên, poster, trailer...`,
        usage: `<ul>
                            <li><strong>Streaming:</strong> Hiển thị thông tin phim (Netflix clone).</li>
                            <li><strong>Gợi ý:</strong> Đề xuất phim tương tự.</li>
                            <li><strong>Đặt vé:</strong> Xem trailer, thời lượng.</li>
                            <li><strong>Phân tích:</strong> Xu hướng điện ảnh.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br>
                      <strong>Cách tạo Key:</strong> <code>themoviedb.org</code> > Settings > API.<br>
                      Endpoint: <code>api.themoviedb.org/3/search/movie</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50">Ưu: Hỗ trợ Tiếng Việt, ảnh đẹp, miễn phí cho học tập.</li>
                               <li style="color:#ce9178">Nhược: Rate Limit (40 req/10s), logic ảnh phức tạp.</li>
                           </ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Largest movie database. Provides metadata, posters, cast, crew...`,
        usage: `<ul><li><strong>Streaming:</strong> Show movie info.</li><li><strong>Recs:</strong> Suggest similar movies.</li></ul>`,
        req: `<strong>Req:</strong> API Key. Endpoint: <code>api.themoviedb.org/3/search/movie</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: VN Support, high quality.</li><li style="color:#ce9178">Cons: Rate Limit.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang tìm kiếm trên TMDB ...', 'cmd');
      const queryMatch = code.match(/'query': '(.*?)'/);
      const keyMatch = code.match(/api_key = "(.*?)"/);
      const query = queryMatch ? queryMatch[1] : 'Mai';
      const key = keyMatch ? keyMatch[1] : '';

      try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${query}&language=vi-VN`;
        const res = await fetch(url);
        if (res.status === 200) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const m = data.results[0];
            log(`🎬 ${m.title} (${m.release_date})`, 'success');
            log(`⭐ Điểm: ${m.vote_average}/10`);
            log(`📝 Nội dung: ${m.overview}`);
            if (m.poster_path)
              log(`https://image.tmdb.org/t/p/w200${m.poster_path}`, 'image');
          } else {
            log('❌ Không tìm thấy phim nào.', 'error');
          }
        } else {
          log(`❌ Lỗi API: ${res.status}`, 'error');
        }
      } catch (e) {
        log('❌ Lỗi mạng.', 'error');
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
        usage: `<ul><li><strong>Website:</strong> Lấy ảnh minh họa.</li><li><strong>Demo:</strong> App hình nền.</li></ul>`,
        req: `<strong>Yêu cầu:</strong> Access Key. Endpoint: <code>api.unsplash.com/search/photos</code>`,
        prosCons: `<ul><li style="color:#4caf50">Ưu: Ảnh đẹp, free.</li><li style="color:#ce9178">Nhược: Giới hạn request.</li></ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Source for visuals. Powered by creators.`,
        usage: `<ul><li><strong>Web:</strong> Stock photos.</li><li><strong>Demo:</strong> Wallpaper apps.</li></ul>`,
        req: `<strong>Req:</strong> Access Key. Endpoint: <code>api.unsplash.com/search/photos</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: High quality.</li><li style="color:#ce9178">Cons: Rate limits.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang tìm ảnh trên Unsplash...', 'cmd');
      const keyMatch = code.match(/access_key = "(.*?)"/);
      const queryMatch = code.match(/query = "(.*?)"/);
      const key = keyMatch ? keyMatch[1] : '';
      const query = queryMatch ? queryMatch[1] : 'nature';

      try {
        const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${key}`;
        const res = await fetch(url);
        if (res.status === 200) {
          const data = await res.json();
          if (data.results[0]) {
            log(`✅ Kết quả cho: "${query}"`, 'success');
            log(data.results[0].urls.small, 'image');
          } else {
            log('❌ Không tìm thấy ảnh.', 'error');
          }
        } else {
          log(`❌ Lỗi API: ${res.status} (Key có thể sai/hết hạn)`, 'error');
        }
      } catch (e) {
        log('❌ Lỗi kết nối.', 'error');
      }
    },
  },

  // --- 4. NEWS API ---
  news: {
    name: 'News API',
    filePath: './assets/codes/NewsAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Công cụ tổng hợp tin tức toàn cầu (CNN, BBC, VNExpress...). Trả về tiêu đề, mô tả, tác giả, ảnh thumbnail, link gốc.`,
        usage: `<ul>
                            <li><strong>App đọc báo:</strong> Gom tin từ nhiều nguồn.</li>
                            <li><strong>Phân tích:</strong> Quét từ khóa tài chính, công nghệ.</li>
                            <li><strong>Cổng thông tin DN:</strong> Tin chuyên ngành.</li>
                            <li><strong>AI Training:</strong> Huấn luyện model tóm tắt.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br>
                      <strong>Cách tạo Key:</strong> <code>newsapi.org</code> > "Get API Key".<br>
                      Endpoint: <code>newsapi.org/v2/top-headlines</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50">Ưu: Cập nhật tức thời, bộ lọc mạnh mẽ.</li>
                               <li style="color:#ce9178">Nhược: Gói Free chỉ có tóm tắt, cấm thương mại.</li>
                           </ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Global news aggregator. Returns headlines, summary, author, image.`,
        usage: `<ul><li><strong>News App:</strong> Centralize news.</li><li><strong>Analysis:</strong> Market trends.</li></ul>`,
        req: `<strong>Req:</strong> API Key. Endpoint: <code>newsapi.org/v2/top-headlines</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Fast, good filters.</li><li style="color:#ce9178">Cons: Free tier summary only.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang kết nối NewsAPI (Real)...', 'cmd');

      // Lấy thông tin từ code Python người dùng nhập
      const keyMatch = code.match(/api_key = "(.*?)"/);
      const countryMatch = code.match(/country = "(.*?)"/);
      const key = keyMatch ? keyMatch[1] : '42a7e5122a1d475fbe81576e3b088dbc';
      const country = countryMatch ? countryMatch[1] : 'us';

      // Danh sách các nước NewsAPI hỗ trợ tin nóng (Top Headlines)
      const supportedCountries = [
        'ae',
        'ar',
        'at',
        'au',
        'be',
        'bg',
        'br',
        'ca',
        'ch',
        'cn',
        'co',
        'cu',
        'cz',
        'de',
        'eg',
        'fr',
        'gb',
        'gr',
        'hk',
        'hu',
        'id',
        'ie',
        'il',
        'in',
        'it',
        'jp',
        'kr',
        'lt',
        'lv',
        'ma',
        'mx',
        'my',
        'ng',
        'nl',
        'no',
        'nz',
        'ph',
        'pl',
        'pt',
        'ro',
        'rs',
        'ru',
        'sa',
        'se',
        'sg',
        'si',
        'sk',
        'th',
        'tr',
        'tw',
        'ua',
        'us',
        've',
        'za',
      ];

      try {
        let url = '';

        // LOGIC THÔNG MINH:
        if (supportedCountries.includes(country)) {
          // Nếu nước này có trong danh sách hỗ trợ -> Dùng Top Headlines
          url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${key}`;
        } else {
          // Nếu không (ví dụ 'vn') -> Chuyển sang tìm kiếm từ khóa (Everything)
          log(
            `⚠️ Mã '${country}' không hỗ trợ tin nóng (Top-Headlines).`,
            'cmd'
          );

          // Nếu là vn thì tìm từ khóa "vietnam", ngược lại tìm chính mã đó
          const query = country === 'vn' ? 'vietnam' : country;
          log(
            `🔄 Đang chuyển sang tìm kiếm các bài viết về: "${query}"...`,
            'cmd'
          );

          url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${key}`;
        }

        const res = await fetch(url);
        if (res.status === 200) {
          const data = await res.json();

          if (data.totalResults === 0) {
            log(`❌ Không tìm thấy bài báo nào.`, 'error');
            return;
          }

          log(
            `✅ Tìm thấy ${data.totalResults} bài viết. Hiển thị 5 bài mới nhất:`,
            'success'
          );
          data.articles.slice(0, 5).forEach((n, i) => {
            log('--------------------');
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
        } else {
          // Nếu vẫn lỗi thì in ra lỗi chi tiết
          const errData = await res.json();
          throw new Error(errData.message || res.statusText);
        }
      } catch (e) {
        log('❌ Lỗi kết nối API.', 'error');
        log(`Chi tiết: ${e.message}`);
        log(
          "👉 Kiểm tra lại Extension 'Allow CORS' hoặc API Key của bạn.",
          'cmd'
        );
      }
    },
  },

  // --- 5. REST COUNTRIES ---
  country: {
    name: 'REST Countries API',
    filePath: './assets/codes/RESTCountriesAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Thông tin quốc gia (dân số, thủ đô, cờ...).`,
        usage: `<ul><li><strong>Giáo dục:</strong> Web địa lý.</li><li><strong>Du lịch:</strong> Tra cứu điểm đến.</li></ul>`,
        req: `<strong>Yêu cầu:</strong> KHÔNG cần Key. Endpoint: <code>restcountries.com/v3.1/name</code>`,
        prosCons: `<ul><li style="color:#4caf50">Ưu: Miễn phí.</li><li style="color:#ce9178">Nhược: Dữ liệu tĩnh.</li></ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Country info (population, capital, flag...).`,
        usage: `<ul><li><strong>Education:</strong> Geography.</li><li><strong>Travel:</strong> Info lookup.</li></ul>`,
        req: `<strong>Req:</strong> No Key. Endpoint: <code>restcountries.com/v3.1/name</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Free.</li><li style="color:#ce9178">Cons: Static data.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang tra cứu quốc gia...', 'cmd');
      const nameMatch = code.match(/country_name = "(.*?)"/);
      const name = nameMatch ? nameMatch[1] : 'vietnam';
      try {
        const url = `https://restcountries.com/v3.1/name/${name}`;
        const res = await fetch(url);
        if (res.status === 200) {
          const data = await res.json();
          const c = data[0];
          log(`✅ Quốc gia: ${c.name.common}`, 'success');
          log(c.flags.png, 'image');
          log(`🏛️ Thủ đô: ${c.capital ? c.capital[0] : 'N/A'}`);
          log(`👥 Dân số: ${c.population.toLocaleString()}`);
          log(`🌍 Khu vực: ${c.region}`);
        } else {
          log('❌ Không tìm thấy quốc gia này.', 'error');
        }
      } catch (e) {
        log('❌ Lỗi kết nối.', 'error');
      }
    },
  },

  // --- 6. EXCHANGE RATE ---
  exchange: {
    name: 'ExchangeRate API',
    filePath: './assets/codes/ExchangeRateAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Tỷ giá hối đoái 160+ tiền tệ.`,
        usage: `<ul><li><strong>E-commerce:</strong> Đổi giá tiền.</li><li><strong>Kế toán:</strong> Quy đổi doanh thu.</li></ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Endpoint: <code>v6.exchangerate-api.com</code>`,
        prosCons: `<ul><li style="color:#4caf50">Ưu: Tin cậy.</li><li style="color:#ce9178">Nhược: Phụ thuộc bên thứ 3.</li></ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Exchange rates for 160+ currencies.`,
        usage: `<ul><li><strong>E-commerce:</strong> Pricing.</li><li><strong>Accounting:</strong> Revenue.</li></ul>`,
        req: `<strong>Req:</strong> API Key. Endpoint: <code>v6.exchangerate-api.com</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Reliable.</li><li style="color:#ce9178">Cons: Dependency.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang lấy tỷ giá thực tế...', 'cmd');
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
            log(
              `✅ Tỷ giá: 1 ${base} = ${rate.toLocaleString()} ${target}`,
              'success'
            );
            log(
              `(Cập nhật lần cuối: ${data.time_last_update_utc.slice(0, 16)})`
            );
          } else {
            log('❌ API Key sai hoặc hết hạn.', 'error');
          }
        } else {
          log(`❌ Lỗi HTTP: ${res.status}`, 'error');
        }
      } catch (e) {
        log('❌ Lỗi kết nối.', 'error');
      }
    },
  },

  // --- 7. QR SERVER ---
  qr: {
    name: 'QR Server API',
    filePath: './assets/codes/QRServerAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> API thuộc nhóm Utility. Tạo mã QR từ văn bản, URL hoặc dữ liệu bất kỳ.`,
        usage: `<ul>
                            <li><strong>Thanh toán:</strong> VietQR chuyển khoản nhanh.</li>
                            <li><strong>Kết nối Wi-Fi:</strong> Quét để vào mạng không cần pass.</li>
                            <li><strong>Vé sự kiện:</strong> Check-in tự động.</li>
                            <li><strong>Tiếp thị:</strong> Dẫn tới trang khuyến mãi.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> Thư viện <code>requests</code>. Không cần Key.<br>
                      Endpoint: <code>api.qrserver.com/v1/create-qr-code</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50">Ưu: Miễn phí, không cần đăng ký, nhanh.</li>
                               <li style="color:#ce9178">Nhược: QR Tĩnh (không sửa được nội dung).</li>
                           </ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Utility API. Generate QR codes from text, URLs, or data.`,
        usage: `<ul><li><strong>Payments:</strong> VietQR.</li><li><strong>Wi-Fi:</strong> Passwordless login.</li></ul>`,
        req: `<strong>Req:</strong> Lib <code>requests</code>. No Key. Endpoint: <code>api.qrserver.com</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Free, fast.</li><li style="color:#ce9178">Cons: Static QR.</li></ul>`,
      },
    },
    action: async (code) => {
      const dataMatch = code.match(/my_data = "(.*?)"/);
      const myData = dataMatch ? dataMatch[1] : 'https://github.com';

      log(`>>> Đang tạo mã QR cho: "${myData}"`, 'cmd');
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        myData
      )}`;

      setTimeout(() => {
        log('✅ Đã tạo thành công (Click ảnh để Zoom):', 'success');

        const term = document.getElementById('console-output');
        const imgContainer = document.createElement('div');
        imgContainer.style.margin = '10px 0';

        const img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = '200px';
        img.style.border = '2px solid #fff';
        img.style.borderRadius = '8px';
        img.style.cursor = 'zoom-in';

        img.onclick = function () {
          const overlay = document.createElement('div');
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100vw';
          overlay.style.height = '100vh';
          overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
          overlay.style.zIndex = '99999';
          overlay.style.display = 'flex';
          overlay.style.justifyContent = 'center';
          overlay.style.alignItems = 'center';
          overlay.style.flexDirection = 'column';
          overlay.style.cursor = 'zoom-out';

          const bigImg = document.createElement('img');
          bigImg.src = url;
          bigImg.style.width = '400px';
          bigImg.style.height = '400px';
          bigImg.style.backgroundColor = 'white';
          bigImg.style.padding = '10px';
          bigImg.style.borderRadius = '15px';

          const text = document.createElement('p');
          text.innerHTML =
            '<i class="fa-solid fa-mobile-screen"></i> Quét mã trên màn hình';
          text.style.color = 'white';
          text.style.marginTop = '20px';
          text.style.fontSize = '1.2rem';

          overlay.appendChild(bigImg);
          overlay.appendChild(text);
          document.body.appendChild(overlay);
          overlay.onclick = () => document.body.removeChild(overlay);
        };
        imgContainer.appendChild(img);
        term.appendChild(imgContainer);
        term.scrollTop = term.scrollHeight;
      }, 500);
    },
  },

  // --- 8. URL SCAN ---
  urlscan: {
    name: 'URLScan.io',
    filePath: './assets/codes/URLScan.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Quét link để phát hiện mã độc, phishing và phân tích IP.`,
        usage: `<ul><li><strong>Bảo mật:</strong> Check link lạ.</li><li><strong>Phân tích:</strong> Xem host, IP.</li></ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Endpoint: <code>urlscan.io/api/v1/scan</code>`,
        prosCons: `<ul><li style="color:#4caf50">Ưu: An toàn.</li><li style="color:#ce9178">Nhược: Cần thời gian chờ.</li></ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Scan URLs for malware, phishing and IP analysis.`,
        usage: `<ul><li><strong>Security:</strong> Check links.</li><li><strong>Analysis:</strong> Host info.</li></ul>`,
        req: `<strong>Req:</strong> API Key. Endpoint: <code>urlscan.io/api/v1/scan</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Safe.</li><li style="color:#ce9178">Cons: Wait time.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang gửi yêu cầu quét tới URLScan.io...', 'cmd');
      const keyMatch = code.match(/api_key = "(.*?)"/);
      const targetMatch = code.match(/target_url = "(.*?)"/);
      const key = keyMatch ? keyMatch[1] : '';
      const target = targetMatch ? targetMatch[1] : 'google.com';

      try {
        const res = await fetch('https://urlscan.io/api/v1/scan/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'API-Key': key },
          body: JSON.stringify({ url: target, visibility: 'public' }),
        });

        if (res.status === 200) {
          const data = await res.json();
          log(`✅ Gửi yêu cầu thành công!`, 'success');
          log(`UUID: ${data.uuid}`);
          log(`🔗 Xem kết quả tại: ${data.result}`);
        } else if (res.status === 401) {
          log('❌ API Key không hợp lệ hoặc thiếu.', 'error');
        } else {
          log(`❌ Lỗi API: ${res.status}`, 'error');
        }
      } catch (e) {
        log(
          '❌ Lỗi kết nối (Bị chặn CORS). Hãy bật Extension Allow-CORS.',
          'error'
        );
      }
    },
  },

  // --- 9. OPENAI (CHATGPT) ---
  openai: {
    name: 'OpenAI API',
    filePath: './assets/codes/OpenAIAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> API truy cập LLM xử lý ngôn ngữ tự nhiên.`,
        usage: `<ul><li><strong>Chatbot:</strong> CSKH.</li><li><strong>Content:</strong> Viết bài.</li></ul>`,
        req: `<strong>Yêu cầu:</strong> API Key ($). Endpoint: <code>api.openai.com</code>`,
        prosCons: `<ul><li style="color:#4caf50">Ưu: Thông minh.</li><li style="color:#ce9178">Nhược: Trả phí.</li></ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Access LLMs for NLP tasks.`,
        usage: `<ul><li><strong>Chatbot:</strong> Support.</li><li><strong>Content:</strong> Writing.</li></ul>`,
        req: `<strong>Req:</strong> API Key ($). Endpoint: <code>api.openai.com</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Smart.</li><li style="color:#ce9178">Cons: Paid.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang gửi prompt tới OpenAI...', 'cmd');
      const keyMatch = code.match(/api_key="(.*?)"/);
      const inputMatch = code.match(/input="(.*?)"/);
      const key = keyMatch ? keyMatch[1] : '';
      const prompt = inputMatch ? inputMatch[1] : 'Hello';

      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
          }),
        });

        if (res.status === 200) {
          const data = await res.json();
          log('✅ Phản hồi từ ChatGPT:', 'success');
          log(data.choices[0].message.content);
        } else {
          const err = await res.json();
          log(`❌ Lỗi API: ${res.status}`, 'error');
        }
      } catch (e) {
        log('❌ Lỗi kết nối (CORS). Hãy bật Extension Allow-CORS.', 'error');
      }
    },
  },

  // --- 10. REMOVE BG ---
  removebg: {
    name: 'Remove.bg API',
    filePath: './assets/codes/RemoveBGAPI.py',
    langData: {
      vi: {
        def: `<strong>Mô tả:</strong> Giải pháp AI chuyên dùng để tách nền tự động. Nhận diện chính xác chủ thể (người, sản phẩm) và loại bỏ phông nền trong vài giây.`,
        usage: `<ul>
                            <li><strong>Thương mại điện tử:</strong> Tách nền ảnh sản phẩm.</li>
                            <li><strong>Ảnh thẻ:</strong> Thay phông nền xanh/trắng.</li>
                            <li><strong>Marketing:</strong> Tách layer làm banner.</li>
                            <li><strong>Cá nhân:</strong> Làm sticker, meme.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br>
                      <strong>Cách tạo Key:</strong> <code>remove.bg</code> > "Tools & API".<br>
                      Endpoint: <code>api.remove.bg/v1.0/removebg</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50">Ưu: Chất lượng xuất sắc, tốc độ nhanh.</li>
                               <li style="color:#ce9178">Nhược: Chi phí cao, Free chỉ tải ảnh nhỏ.</li>
                           </ul>`,
      },
      en: {
        def: `<strong>Description:</strong> AI-based background removal. Accurately detects subjects and handles complex details.`,
        usage: `<ul>
                            <li><strong>E-commerce:</strong> Product photos.</li>
                            <li><strong>ID Photos:</strong> Change backgrounds.</li>
                            <li><strong>Marketing:</strong> Banners.</li>
                        </ul>`,
        req: `<strong>Req:</strong> API Key. Endpoint: <code>api.remove.bg</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Excellent quality.</li><li style="color:#ce9178">Cons: Expensive.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang mở công cụ RemoveBG...', 'cmd');
      setTimeout(() => {
        currentToolMode = 'removebg';
        document.querySelector('.tool-header span').innerHTML =
          '<i class="fa-solid fa-wand-magic-sparkles"></i> AI Background Remover';
        document.getElementById('upload-stage').style.display = 'block';
        document.getElementById('result-stage').style.display = 'none';
        log('✅ Đã mở cửa sổ. Hãy chọn ảnh để xử lý.', 'success');
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
        def: `<strong>Mô tả:</strong> Dịch vụ OCR đám mây, chuyển hình ảnh scan/PDF thành văn bản text. Hỗ trợ tiếng Việt.`,
        usage: `<ul>
                            <li><strong>Số hóa:</strong> Chuyển hồ sơ giấy thành Word/Text.</li>
                            <li><strong>eKYC:</strong> Trích xuất thông tin CMND/CCCD.</li>
                            <li><strong>Dịch thuật:</strong> Quét menu, biển báo.</li>
                            <li><strong>Nhập liệu:</strong> Quét danh thiếp.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> API Key (Free). Thư viện <code>requests</code>.<br>
                      <strong>Cách tạo Key:</strong> <code>ocr.space/ocrapi</code>.<br>
                      Endpoint: <code>api.ocr.space/parse/image</code>`,
        prosCons: `<ul>
                               <li style="color:#4caf50">Ưu: Hỗ trợ tiếng Việt, Free hào phóng.</li>
                               <li style="color:#ce9178">Nhược: Phụ thuộc chất lượng ảnh.</li>
                           </ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Cloud OCR service. Converts images/PDFs to text.`,
        usage: `<ul><li><strong>Digitization:</strong> Paper to digital.</li><li><strong>eKYC:</strong> Extract ID info.</li></ul>`,
        req: `<strong>Req:</strong> Free Key. Endpoint: <code>api.ocr.space</code>`,
        prosCons: `<ul><li style="color:#4caf50">Pros: VN Support.</li><li style="color:#ce9178">Cons: Img dependent.</li></ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang mở công cụ OCR...', 'cmd');
      setTimeout(() => {
        currentToolMode = 'ocr';
        document.querySelector('.tool-header span').innerHTML =
          '<i class="fa-solid fa-file-invoice"></i> OCR Document Scanner';
        document.getElementById('upload-stage').style.display = 'block';
        document.getElementById('result-stage').style.display = 'none';
        log('✅ Đã mở cửa sổ. Hãy chọn tài liệu.', 'success');
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
        def: `<strong>Mô tả:</strong> Thư viện Python mã nguồn mở, cho phép sử dụng Google Translate API miễn phí.`,
        usage: `<ul>
                            <li><strong>Chatbot:</strong> Dịch tin nhắn đa ngôn ngữ.</li>
                            <li><strong>Bản địa hóa:</strong> Dịch file JSON/XML cho ứng dụng.</li>
                            <li><strong>Học tập:</strong> Tool học từ vựng.</li>
                            <li><strong>Phân tích:</strong> Dịch đánh giá để phân tích cảm xúc.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> Python & <code>googletrans</code>.<br>
                      <strong>Cài đặt:</strong> <code>pip install googletrans==4.0.0-rc1</code>.<br>
                      <strong>Cách dùng:</strong> Class <code>Translator</code>.`,
        prosCons: `<ul>
                               <li style="color:#4caf50">Ưu: Miễn phí, tận dụng data của Google.</li>
                               <li style="color:#ce9178">Nhược: Không ổn định (Unofficial), lỗi 429 nếu spam.</li>
                           </ul>`,
      },
      en: {
        def: `<strong>Description:</strong> Unofficial Python library for Google Translate API.`,
        usage: `<ul><li><strong>Chatbot:</strong> Multi-lang chat.</li><li><strong>Localization:</strong> App translation.</li></ul>`,
        req: `<strong>Req:</strong> Python lib. No Key.`,
        prosCons: `<ul><li style="color:#4caf50">Pros: Free.</li><li style="color:#ce9178">Cons: Unstable.</li></ul>`,
      },
    },
    action: async (code) => {
      const textMatch = code.match(/text = "(.*?)"/);
      const srcMatch = code.match(/src = "(.*?)"/);
      const destMatch = code.match(/dest = "(.*?)"/);

      const text = textMatch ? textMatch[1] : 'Hôm nay trời đẹp';
      const src = srcMatch ? srcMatch[1] : 'vi';
      const dest = destMatch ? destMatch[1] : 'en';

      log(`>>> Translating: '${text}' (${src} -> ${dest})...`, 'cmd');

      // Dùng MyMemory API thay thế để demo kết quả thật trên trình duyệt
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=${src}|${dest}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.responseData) {
          log(`Original: ${text}`);
          log(`Translated: ${data.responseData.translatedText}`, 'success');
        } else {
          throw new Error('No data');
        }
      } catch (e) {
        log('❌ Lỗi kết nối API dịch vụ.', 'error');
      }
    },
  },
};

// --- CORE FUNCTIONS ---

async function selectAPI(key) {
  currentKey = key;
  const data = demoData[key];

  document
    .querySelectorAll('.api-btn')
    .forEach((b) => b.classList.remove('active'));
  const clickedBtn = event
    ? event.currentTarget
    : document.querySelector(`button[onclick="selectAPI('${key}')"]`);
  if (clickedBtn) clickedBtn.classList.add('active');

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
    if (editor) editor.setValue(`# Error loading file.`);
  }

  renderInfoBox();
  document.getElementById('console-output').innerHTML =
    'C:\\Users\\Dev\\Projects> _';
}

function renderInfoBox() {
  const data = demoData[currentKey];
  if (!data || !data.langData) return;
  const content = data.langData[currentLang];

  const btnLabel =
    currentLang === 'vi'
      ? `<i class="fa-solid fa-earth-americas"></i> &nbsp; Translate to English`
      : `<i class="fa-solid fa-rotate-left"></i> &nbsp; Dịch sang Tiếng Việt`;

  document.getElementById('info-panel').innerHTML = `
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

function toggleLang() {
  currentLang = currentLang === 'vi' ? 'en' : 'vi';
  renderInfoBox();
}

function runSimulation() {
  log(`Running script: ${currentKey}_demo.py`, 'cmd');
  if (demoData[currentKey]) {
    const codeContent = editor ? editor.getValue() : '';
    demoData[currentKey].action(codeContent);
  }
}

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

// --- HÀM XỬ LÝ ẢNH (REAL API) ---
function processImage(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];

    // --- 1. OCR SPACE (REAL API) ---
    if (currentToolMode === 'ocr') {
      document.getElementById('upload-stage').style.display = 'none';
      document.getElementById('result-stage').style.display = 'block';
      const removeBgView = document.getElementById('removebg-view');
      if (removeBgView) removeBgView.style.display = 'none';

      const statusText = document.getElementById('status-text');
      statusText.innerText = '⏳ Đang gửi ảnh lên Server OCR.space...';
      statusText.style.color = '#e2e8f0';

      log(`GUI: Đã chọn file "${file.name}"`, 'cmd');

      // Gọi API thật
      const formData = new FormData();
      formData.append('file', file);
      formData.append('apikey', 'helloworld'); // Key Free
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');

      // Đóng cửa sổ sau 1s
      setTimeout(() => {
        statusText.innerHTML = `<i class="fa-solid fa-check-circle"></i> Upload xong. Đang xử lý...`;
        statusText.style.color = '#4CAF50';
        setTimeout(() => closeTool(), 500);
      }, 1000);

      // Fetch
      log('>>> Đang gọi API OCR Space (POST)...', 'cmd');
      fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ParsedResults && data.ParsedResults.length > 0) {
            log('✅ Đã nhận dạng thành công!', 'success');
            log('--- KẾT QUẢ THỰC TẾ ---', 'success');
            log(data.ParsedResults[0].ParsedText || '(Không có chữ trong ảnh)');
            log('-----------------------', 'success');
          } else {
            log('❌ Lỗi API hoặc không đọc được chữ.', 'error');
            if (data.ErrorMessage) log(`Chi tiết: ${data.ErrorMessage}`);
          }
        })
        .catch((e) => {
          log('❌ Lỗi kết nối OCR (Mạng/CORS).', 'error');
        });

      input.value = '';
    }

    // --- 2. REMOVE BG (REAL API) ---
    else {
      const objectURL = URL.createObjectURL(file);
      document.getElementById('upload-stage').style.display = 'none';
      document.getElementById('result-stage').style.display = 'block';

      const removeBgView = document.getElementById('removebg-view');
      if (removeBgView) removeBgView.style.display = 'flex';

      document.getElementById('img-original').src = objectURL;
      const imgResult = document.getElementById('img-result');
      imgResult.src = '';
      imgResult.style.opacity = '0.5';

      const statusText = document.getElementById('status-text');
      statusText.innerText = '⏳ Đang gửi ảnh lên Server Remove.bg...';
      statusText.style.color = '#e2e8f0';

      log(`GUI: Đã tải file "${file.name}"`, 'cmd');

      // Gọi API thật (Key demo)
      const apiKey = 'f8uU5eupXfvjoQoojq2RofN1';
      const formData = new FormData();
      formData.append('image_file', file);
      formData.append('size', 'auto');

      fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': apiKey },
        body: formData,
      })
        .then(async (response) => {
          if (response.ok) return response.blob();
          throw new Error(await response.text());
        })
        .then((blob) => {
          const resultUrl = URL.createObjectURL(blob);
          imgResult.src = resultUrl;
          imgResult.style.opacity = '1';
          statusText.innerHTML = '✅ Tách nền thành công! (Click ảnh để tải)';
          statusText.style.color = '#4CAF50';

          imgResult.onclick = () => {
            const a = document.createElement('a');
            a.href = resultUrl;
            a.download = 'no-bg.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        })
        .catch((e) => {
          log('❌ Lỗi RemoveBG: ' + e.message, 'error');
          statusText.innerText = '❌ Lỗi (Xem Console)';
          statusText.style.color = '#ff5f56';
          if (e.message.includes('Failed to fetch')) {
            log('⚠️ CẢNH BÁO: Trình duyệt đang chặn CORS.', 'cmd');
            log("👉 Hãy cài Extension 'Allow CORS' để chạy được.", 'cmd');
          }
        });
    }
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

function resetTool() {
  document.getElementById('file-upload').value = '';
  document.getElementById('upload-stage').style.display = 'block';
  document.getElementById('result-stage').style.display = 'none';
  document.getElementById('status-text').innerText = '⏳ Processing...';
  document.getElementById('img-original').src = '';
  document.getElementById('img-result').src = '';
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  document.getElementById('theme-icon').className = isLight
    ? 'fa-solid fa-sun'
    : 'fa-solid fa-moon';
  document.getElementById('theme-text').innerText = isLight
    ? 'Light Mode'
    : 'Dark Mode';
}

window.onload = () => {
  editor = CodeMirror.fromTextArea(document.getElementById('python-code'), {
    mode: 'python',
    theme: 'dracula',
    lineNumbers: true,
    indentUnit: 4,
    matchBrackets: true,
  });
  editor.setSize('100%', '100%');
  selectAPI('weather');
};
