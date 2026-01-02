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
        def: '<strong>Mô tả:</strong> Dịch vụ cung cấp dữ liệu thời tiết toàn cầu (nhiệt độ, độ ẩm, gió, mây...) cho hơn 200.000 thành phố.',
        usage: `<ul>
                            <li><strong>Ứng dụng dự báo:</strong> Hiển thị thời tiết hiện tại và dự báo 7 ngày tới.</li>
                            <li><strong>Nông nghiệp:</strong> Cảnh báo mưa bão để bảo vệ mùa màng.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>api.openweathermap.org/data/2.5/weather</code><br>
                      <strong>Cách lấy Key:</strong><br>
                      1. Truy cập <code>openweathermap.org</code> và đăng ký tài khoản.<br>
                      2. Vào menu tài khoản > chọn <strong>My API Keys</strong>.<br>
                      3. Copy Key mặc định (hoặc tạo mới).`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Dữ liệu chính xác, cập nhật liên tục, gói Free hào phóng.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Key mới tạo cần chờ 10-15 phút để kích hoạt.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Global weather data service (temp, humidity, wind...) for 200,000+ cities.',
        usage: `<ul>
                            <li><strong>Forecast Apps:</strong> Display current weather & forecasts.</li>
                            <li><strong>Agriculture:</strong> Storm warnings for crops.</li>
                        </ul>`,
        req: `<strong>Req:</strong> API Key. Lib <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>api.openweathermap.org/data/2.5/weather</code><br>
                      <strong>Get Key:</strong><br>
                      1. Go to <code>openweathermap.org</code> & Sign up.<br>
                      2. Go to Account menu > <strong>My API Keys</strong>.<br>
                      3. Copy the default Key.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Accurate data, real-time updates, generous Free tier.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> New keys take 10-15 mins to activate.</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang kết nối OpenWeatherMap (Full Data)...', 'cmd');
      const cityMatch = code.match(/city = "(.*?)"/);
      const keyMatch = code.match(/api_key = "(.*?)"/);
      const city = cityMatch ? cityMatch[1] : 'Ho Chi Minh City,VN';
      const key = keyMatch ? keyMatch[1] : '463ed506f10cd039c485cd8f2db2de19';

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=vi`;
        const res = await fetch(url);
        if (res.status === 200) {
          const data = await res.json();

          // Xử lý giờ
          const sunrise = new Date(
            data.sys.sunrise * 1000
          ).toLocaleTimeString();
          const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

          log('--------------------------------------------------');
          log(`📍 ĐỊA ĐIỂM:   ${data.name}, ${data.sys.country}`, 'success');
          log(
            `🌡️ NHIỆT ĐỘ:   ${data.main.temp}°C (Cảm giác: ${data.main.feels_like}°C)`
          );
          log(`☁️ MÔ TẢ:      ${data.weather[0].description.toUpperCase()}`);
          log('--------------------------------------------------');
          log(`💧 Độ ẩm:      ${data.main.humidity}%`);
          log(`🎈 Áp suất:    ${data.main.pressure} hPa`);
          log(
            `💨 Gió:        ${data.wind.speed} m/s (Hướng: ${data.wind.deg}°)`
          );
          log(`👁️ Tầm nhìn:   ${data.visibility} mét`);
          log(`🌅 Bình minh:  ${sunrise} | 🌇 Hoàng hôn: ${sunset}`);
          log('--------------------------------------------------');
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
        def: '<strong>Mô tả:</strong> Cơ sở dữ liệu phim ảnh lớn nhất do cộng đồng xây dựng. Cung cấp thông tin chi tiết về phim, diễn viên, poster, trailer.',
        usage: `<ul>
                            <li><strong>Web phim:</strong> Hiển thị poster, nội dung tóm tắt.</li>
                            <li><strong>Gợi ý phim:</strong> Hệ thống đề xuất dựa trên sở thích.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>api.themoviedb.org/3/search/movie</code><br>
                      <strong>Cách lấy Key:</strong><br>
                      1. Đăng ký tại <code>themoviedb.org</code>.<br>
                      2. Vào <strong>Settings</strong> > <strong>API</strong>.<br>
                      3. Chọn "Create" > "Developer" để lấy Key.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Dữ liệu khổng lồ, hỗ trợ tiếng Việt, miễn phí.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Cần khai báo thông tin ứng dụng khi đăng ký Key.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Largest community-built movie database. Provides details on films, actors, posters.',
        usage: `<ul>
                            <li><strong>Movie Sites:</strong> Show posters & plot summaries.</li>
                            <li><strong>Recommendations:</strong> Suggest films based on user taste.</li>
                        </ul>`,
        req: `<strong>Req:</strong> API Key. Lib <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>api.themoviedb.org/3/search/movie</code><br>
                      <strong>Get Key:</strong><br>
                      1. Sign up at <code>themoviedb.org</code>.<br>
                      2. Go to <strong>Settings</strong> > <strong>API</strong>.<br>
                      3. Click "Create" > "Developer" to generate Key.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Huge database, supports Vietnamese, free.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Requires app details registration.</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang tìm kiếm trên TMDB...', 'cmd');

      // Regex mới: Tìm dòng query = "..." hoặc query = '...'
      const queryMatch = code.match(/query\s*=\s*["'](.*?)["']/);

      const keyMatch = code.match(/api_key = "(.*?)"/);

      // Nếu đọc được tên phim từ code thì dùng, nếu không mới dùng 'Mưa đỏ'
      const query = queryMatch ? queryMatch[1] : 'Mưa đỏ';
      const key = keyMatch ? keyMatch[1] : '';

      log(`>>> Từ khóa tìm kiếm: "${query}"`, 'cmd'); // In ra để kiểm tra xem đã nhận đúng chưa

      try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${query}&language=vi-VN`;
        const res = await fetch(url);

        if (res.status === 200) {
          const data = await res.json();

          if (data.results && data.results.length > 0) {
            const m = data.results[0];
            log('--------------------------------------------------');
            log(
              `🎬 ${m.title.toUpperCase()} (${
                m.release_date ? m.release_date.split('-')[0] : 'N/A'
              })`,
              'success'
            );
            log(`⭐ Điểm: ${m.vote_average}/10 (Vote: ${m.vote_count})`);
            log(`📝 Nội dung: ${m.overview || 'Chưa có mô tả'}`);

            if (m.poster_path) {
              log('🖼️ Poster:');
              log(`https://image.tmdb.org/t/p/w200${m.poster_path}`, 'image');
            }
            log('--------------------------------------------------');
          } else {
            // Nếu API trả về rỗng (không tìm thấy phim)
            log(`❌ Không tìm thấy phim nào có tên: "${query}"`, 'error');
          }
        } else {
          log(`❌ Lỗi API: ${res.status}`, 'error');
        }
      } catch (e) {
        log('❌ Lỗi mạng hoặc sai Key.', 'error');
      }
    },
  },

  // --- 3. UNSPLASH ---
  unsplash: {
    name: 'Unsplash API',
    filePath: './assets/codes/UnsplashAPI.py',
    langData: {
      vi: {
        def: '<strong>Mô tả:</strong> Thư viện ảnh chất lượng cao miễn phí lớn nhất thế giới. Cho phép tìm kiếm và tải ảnh 4K.',
        usage: `<ul>
                            <li><strong>UI/UX:</strong> Ảnh placeholder cho demo website.</li>
                            <li><strong>Marketing:</strong> Tìm ảnh lifestyle thiết kế banner.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> Access Key. Thư viện <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>api.unsplash.com/search/photos</code><br>
                      <strong>Cách lấy Key:</strong><br>
                      1. Truy cập <code>unsplash.com/developers</code> > Đăng ký.<br>
                      2. Nhấn <strong>New Application</strong> > Đồng ý điều khoản.<br>
                      3. Copy mã tại dòng <strong>Access Key</strong>.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Ảnh xuất sắc, miễn phí bản quyền.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Giới hạn 50 request/giờ (Demo).</li>
                           </ul>`,
      },
      en: {
        def: "<strong>Description:</strong> World's largest free high-res photo library. Allows searching and downloading 4K images.",
        usage: `<ul>
                            <li><strong>UI/UX:</strong> Placeholders for web demos.</li>
                            <li><strong>Marketing:</strong> Lifestyle images for banners.</li>
                        </ul>`,
        req: `<strong>Req:</strong> Access Key. Lib <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>api.unsplash.com/search/photos</code><br>
                      <strong>Get Key:</strong><br>
                      1. Go to <code>unsplash.com/developers</code> > Register.<br>
                      2. Click <strong>New Application</strong> > Accept terms.<br>
                      3. Copy the <strong>Access Key</strong>.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Excellent quality, royalty-free.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Limited to 50 reqs/hour (Demo).</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang kết nối Unsplash API (Real)...', 'cmd');

      // Lấy từ khóa từ code người dùng nhập
      const queryMatch = code.match(/query = "(.*?)"/);
      const query = queryMatch ? queryMatch[1] : 'cyberpunk city';

      // SỬ DỤNG KEY MỚI CỦA BẠN
      const key = 'KQGzheP-PaJqEU4RGmykavjXFJh5afQZExqUl9IB2fQ';

      try {
        // Gọi API thật
        const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${key}`;
        const res = await fetch(url);

        if (res.status === 200) {
          const data = await res.json();

          if (data.results && data.results.length > 0) {
            const photo = data.results[0];

            log(
              `✅ Tìm thấy ${data.total} ảnh cho từ khóa "${query}".`,
              'success'
            );
            log('--------------------------------------------------');

            // Thông tin ảnh
            log(
              `📝 Mô tả:      ${
                photo.description || photo.alt_description || 'Không có'
              }`
            );
            log(
              `📅 Ngày tạo:    ${new Date(
                photo.created_at
              ).toLocaleDateString()}`
            );
            log(`❤️ Lượt thích:  ${photo.likes}`);
            log(`🎨 Màu chủ đạo: ${photo.color}`);

            // Thông tin tác giả
            log(`👤 Tác giả:     ${photo.user.name} (@${photo.user.username})`);
            if (photo.user.location)
              log(`📍 Đến từ:      ${photo.user.location}`);

            // Hiển thị ảnh và tính năng tải
            log('--------------------------------------------------');
            log('🖼️ Ảnh kết quả (Click để tải chất lượng gốc):');

            const term = document.getElementById('console-output');
            const imgContainer = document.createElement('div');
            const img = document.createElement('img');

            // Hiển thị ảnh (Regular)
            img.src = photo.urls.regular;
            img.style.maxWidth = '250px';
            img.style.borderRadius = '8px';
            img.style.border = '1px solid #555';
            img.style.marginTop = '10px';
            img.style.cursor = 'pointer';
            img.title = 'Click để tải ảnh Full HD về máy';

            // LOGIC TẢI ẢNH (BLOB)
            img.onclick = async () => {
              log(`⬇️ Đang tải ảnh gốc (${photo.id})...`, 'cmd');
              const statusText = document.createElement('div');
              statusText.innerText = '⏳ Đang tải...';
              imgContainer.appendChild(statusText);

              try {
                // Fetch ảnh gốc (Full HD) dưới dạng Blob
                const imageFetch = await fetch(photo.urls.full);
                const imageBlob = await imageFetch.blob();
                const imageURL = URL.createObjectURL(imageBlob);

                const link = document.createElement('a');
                link.href = imageURL;
                // Đặt tên file khi tải về
                link.download = `unsplash_${photo.id}_${query.replace(
                  /\s+/g,
                  '_'
                )}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                statusText.innerText = '✅ Tải xong!';
                statusText.style.color = '#4CAF50';
                log('✅ Đã lưu ảnh vào máy tính.', 'success');
              } catch (err) {
                statusText.innerText = '❌ Lỗi tải.';
                log('❌ Lỗi tải ảnh (CORS). Đang mở tab mới...', 'error');
                window.open(photo.urls.full, '_blank');
              }
            };

            imgContainer.appendChild(img);
            term.appendChild(imgContainer);
            term.scrollTop = term.scrollHeight;
          } else {
            log(`❌ Không tìm thấy ảnh nào cho từ khóa: "${query}"`, 'error');
          }
        } else if (res.status === 403) {
          log('❌ Lỗi 403: Key hết lượt (Rate Limit).', 'error');
        } else if (res.status === 401) {
          log('❌ Lỗi 401: Key không hợp lệ.', 'error');
        } else {
          log(`❌ Lỗi API: ${res.status}`, 'error');
        }
      } catch (e) {
        log('❌ Lỗi kết nối (Vui lòng kiểm tra mạng).', 'error');
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
        def: '<strong>Mô tả:</strong> API cung cấp dữ liệu quốc gia (tên, thủ đô, cờ, dân số, tiền tệ...).',
        usage: `<ul>
                            <li><strong>Form điền:</strong> Tự động điền mã vùng, địa chỉ.</li>
                            <li><strong>Giáo dục:</strong> Từ điển địa lý, Quiz.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> Thư viện <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>restcountries.com/v3.1/name/{name}</code><br>
                      <strong>Cách lấy Key:</strong><br>
                      ✅ API này hoàn toàn <strong>Miễn phí & Công khai</strong> (Public API).<br>
                      👉 Không cần đăng ký tài khoản hay tạo Key.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Không cần Key, miễn phí, dễ dùng.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Dữ liệu dân số cập nhật chậm.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> API providing country data (name, capital, flag, population...).',
        usage: `<ul>
                            <li><strong>Forms:</strong> Auto-fill codes, addresses.</li>
                            <li><strong>Education:</strong> Geography quiz.</li>
                        </ul>`,
        req: `<strong>Req:</strong> Lib <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>restcountries.com/v3.1/name/{name}</code><br>
                      <strong>Get Key:</strong><br>
                      ✅ This is a <strong>Public API</strong>.<br>
                      👉 No registration or Key required.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> No Key needed, free, easy.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Static population data.</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang kết nối tới server restcountries.com...', 'cmd');

      // Lấy tên nước từ code
      const nameMatch = code.match(/country_name = "(.*?)"/);
      const name = nameMatch ? nameMatch[1] : 'vietnam';

      try {
        // GỌI API THẬT
        const url = `https://restcountries.com/v3.1/name/${name}`;
        const res = await fetch(url);

        if (res.status === 200) {
          const data = await res.json();
          const c = data[0]; // Lấy kết quả đầu tiên

          log('--------------------------------------------------');
          log(
            `QUỐC GIA:    ${c.name.common.toUpperCase()} (${c.cca3})`,
            'success'
          );
          log(`Tên đầy đủ:  ${c.name.official}`);
          log('--------------------------------------------------');

          log(`🏛️ Thủ đô:    ${c.capital ? c.capital[0] : 'N/A'}`);
          log(`🌍 Khu vực:   ${c.region} (${c.subregion || 'N/A'})`);
          log(`👥 Dân số:    ${c.population.toLocaleString()} người`);
          log(`📐 Diện tích:  ${c.area.toLocaleString()} km²`);

          // Xử lý Ngôn ngữ
          const langs = c.languages
            ? Object.values(c.languages).join(', ')
            : 'N/A';
          log(`🗣️ Ngôn ngữ:  ${langs}`);

          // Xử lý Tiền tệ
          let currencyStr = 'N/A';
          if (c.currencies) {
            currencyStr = Object.values(c.currencies)
              .map((curr) => `${curr.name} (${curr.symbol})`)
              .join(', ');
          }
          log(`💰 Tiền tệ:   ${currencyStr}`);

          // Xử lý Múi giờ (Chỉ lấy 2 cái đầu cho gọn)
          const timezones = c.timezones
            ? c.timezones.slice(0, 2).join(', ') +
              (c.timezones.length > 2 ? '...' : '')
            : 'N/A';
          log(`clock Múi giờ:   ${timezones}`);

          // Link Google Maps
          if (c.maps && c.maps.googleMaps) {
            log(`📍 Bản đồ:    ${c.maps.googleMaps}`);
          }

          // --- HIỂN THỊ VÀ TẢI CỜ ---
          log('🏳️ Quốc kỳ (Click ảnh để tải về):');

          const term = document.getElementById('console-output');
          const imgContainer = document.createElement('div');
          const img = document.createElement('img');

          img.src = c.flags.png;
          img.style.width = '180px';
          img.style.border = '1px solid #555';
          img.style.marginTop = '5px';
          img.style.cursor = 'pointer';
          img.title = 'Click để tải ảnh lá cờ này về máy';

          // Logic tải ảnh
          img.onclick = async () => {
            log(`⬇️ Đang tải cờ ${c.name.common}...`, 'cmd');
            try {
              const imageFetch = await fetch(c.flags.png);
              const imageBlob = await imageFetch.blob();
              const imageURL = URL.createObjectURL(imageBlob);

              const link = document.createElement('a');
              link.href = imageURL;
              link.download = `flag_${c.name.common.replace(/\s+/g, '_')}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              log('✅ Tải thành công!', 'success');
            } catch (err) {
              log('❌ Lỗi tải ảnh (Browser chặn). Đang mở tab mới...', 'error');
              window.open(c.flags.png, '_blank');
            }
          };

          imgContainer.appendChild(img);
          term.appendChild(imgContainer);
          term.scrollTop = term.scrollHeight;

          log('--------------------------------------------------');
        } else {
          log(`❌ Không tìm thấy quốc gia: "${name}"`, 'error');
          log(
            '⚠️ Lưu ý: Tên quốc gia phải là Tiếng Anh (vd: vietnam, japan, germany...)',
            'cmd'
          );
        }
      } catch (e) {
        log('❌ Lỗi kết nối mạng.', 'error');
      }

      // Gợi ý từ khóa
      log(
        '💡 Gợi ý: vietnam, usa, japan, korea, france, germany, thailand, china',
        'cmd'
      );
    },
  },

  // --- 6. EXCHANGE RATE ---
  exchange: {
    name: 'ExchangeRate API',
    filePath: './assets/codes/ExchangeRateAPI.py',
    langData: {
      vi: {
        def: '<strong>Mô tả:</strong> Cung cấp tỷ giá hối đoái chính xác từ ngân hàng trung ương (160+ tiền tệ).',
        usage: `<ul>
                            <li><strong>TMĐT:</strong> Hiển thị giá theo tiền tệ khách hàng.</li>
                            <li><strong>Du lịch:</strong> Tính chi phí mua sắm.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>v6.exchangerate-api.com/v6/{KEY}/latest/{Base}</code><br>
                      <strong>Cách lấy Key:</strong><br>
                      1. Truy cập <code>exchangerate-api.com</code>.<br>
                      2. Nhập email vào ô "Get Free Key".<br>
                      3. Kiểm tra email để lấy Key.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Dữ liệu chuẩn, có gói Free vĩnh viễn.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Gói Free cập nhật tỷ giá 1 lần/ngày.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Accurate exchange rates for 160+ currencies.',
        usage: `<ul>
                            <li><strong>E-commerce:</strong> Local currency pricing.</li>
                            <li><strong>Travel:</strong> Cost calculation.</li>
                        </ul>`,
        req: `<strong>Req:</strong> API Key. Lib <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>v6.exchangerate-api.com/v6/{KEY}/latest/{Base}</code><br>
                      <strong>Get Key:</strong><br>
                      1. Go to <code>exchangerate-api.com</code>.<br>
                      2. Enter email in "Get Free Key".<br>
                      3. Check email to retrieve Key.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Accurate, Forever Free tier.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Free tier updates daily only.</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang kết nối ExchangeRate-API (Real)...', 'cmd');

      // Lấy thông tin từ code
      const keyMatch = code.match(/api_key = "(.*?)"/);
      const baseMatch = code.match(/base_currency = "(.*?)"/);
      const targetMatch = code.match(/target_currency = "(.*?)"/);

      // SỬ DỤNG KEY MỚI CỦA BẠN LÀM MẶC ĐỊNH
      const key = keyMatch ? keyMatch[1] : '1b3657202125ab2f83f0bde4';
      const base = baseMatch ? baseMatch[1] : 'USD';
      const target = targetMatch ? targetMatch[1] : 'VND';

      try {
        // GỌI API THẬT
        const url = `https://v6.exchangerate-api.com/v6/${key}/latest/${base}`;
        const res = await fetch(url);

        if (res.status === 200) {
          const data = await res.json();

          if (data.result === 'success') {
            // 1. Hiển thị Metadata
            log('--------------------------------------------------');
            log(`✅ TRẠNG THÁI:   Success (200 OK)`, 'success');
            log(
              `🕒 Cập nhật lúc: ${data.time_last_update_utc.replace(
                '+0000',
                '(UTC)'
              )}`
            );
            log(
              `🔜 Cập nhật sau: ${data.time_next_update_utc.replace(
                '+0000',
                '(UTC)'
              )}`
            );
            log(`🌎 Tiền tệ gốc:  ${data.base_code}`);
            log('--------------------------------------------------');

            // 2. Hiển thị tỷ giá cụ thể
            const rate = data.conversion_rates[target];
            if (rate) {
              log(`💰 TỶ GIÁ QUY ĐỔI:`, 'success');
              log(
                `1 ${base} = ${rate.toLocaleString('vi-VN')} ${target}`,
                'success'
              );
            } else {
              log(`❌ Không tìm thấy tỷ giá cho: ${target}`, 'error');
            }

            // 3. Hiển thị tổng quan thị trường
            log('--------------------------------------------------');
            log(`📊 Tham khảo các đồng tiền mạnh khác:`);
            const common = ['EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CNY'];
            common.forEach((c) => {
              if (data.conversion_rates[c]) {
                log(`- 1 ${base} = ${data.conversion_rates[c]} ${c}`);
              }
            });
            log(
              `(Tổng hỗ trợ: ${
                Object.keys(data.conversion_rates).length
              } loại tiền tệ)`
            );
            log('--------------------------------------------------');
          } else {
            log('❌ Lỗi từ API:', 'error');
            log(`Type: ${data['error-type']}`);
          }
        } else {
          log(`❌ Lỗi HTTP: ${res.status}`, 'error');
        }
      } catch (e) {
        log(
          '❌ Lỗi kết nối (Vui lòng kiểm tra mạng hoặc Extension CORS).',
          'error'
        );
      }
    },
  },

  // --- 7. QR SERVER ---
  qr: {
    name: 'QR Server API',
    filePath: './assets/codes/QRServerAPI.py',
    langData: {
      vi: {
        def: '<strong>Mô tả:</strong> Tạo mã QR nhanh từ văn bản, URL. Hỗ trợ tùy chỉnh kích thước.',
        usage: `<ul>
                            <li><strong>Thanh toán:</strong> QR chuyển khoản.</li>
                            <li><strong>Tiện ích:</strong> Chia sẻ Wi-Fi, Link.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> Thư viện <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>api.qrserver.com/v1/create-qr-code</code><br>
                      <strong>Cách lấy Key:</strong><br>
                      ✅ API này <strong>Miễn phí & Công khai</strong>.<br>
                      👉 Không cần đăng ký Key.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Miễn phí, không cần đăng ký.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Chỉ tạo QR tĩnh (không sửa được).</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Generate QR codes from text/URLs. Custom sizes supported.',
        usage: `<ul>
                            <li><strong>Payments:</strong> QR Transfers.</li>
                            <li><strong>Utility:</strong> Share Wi-Fi, Links.</li>
                        </ul>`,
        req: `<strong>Req:</strong> Lib <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>api.qrserver.com/v1/create-qr-code</code><br>
                      <strong>Get Key:</strong><br>
                      ✅ <strong>Public API</strong>.<br>
                      👉 No Key required.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Free, no registration.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Static QR only.</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      // Lấy dữ liệu từ code Python
      const dataMatch = code.match(/my_data = "(.*?)"/);
      const sizeMatch = code.match(/image_size = "(.*?)"/);

      const myData = dataMatch ? dataMatch[1] : 'https://facebook.com';
      const size = sizeMatch ? sizeMatch[1] : '300x300';

      log(`>>> Đang tạo mã QR cho: "${myData}"...`, 'cmd');

      try {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(
          myData
        )}`;

        // Gọi fetch để lấy dữ liệu ảnh và Header (để tính dung lượng)
        const res = await fetch(url);

        if (res.status === 200) {
          const blob = await res.blob(); // Lấy dữ liệu nhị phân
          const fileSizeKB = (blob.size / 1024).toFixed(2); // Tính KB
          const contentType = res.headers.get('Content-Type');
          const imgUrl = URL.createObjectURL(blob); // Tạo URL tạm từ blob

          log('--------------------------------------------------');
          log('✅ TẠO THÀNH CÔNG!', 'success');
          log(`File:       my_qrcode.png (Đã lưu vào bộ nhớ đệm)`);
          log(`Dung lượng: ${fileSizeKB} KB`);
          log(`Kích thước: ${size}`);
          log(`Loại ảnh:   ${contentType}`);
          log('--------------------------------------------------');

          // Hiển thị ảnh
          const term = document.getElementById('console-output');
          const imgContainer = document.createElement('div');
          imgContainer.style.margin = '10px 0';

          const img = document.createElement('img');
          img.src = imgUrl;
          img.style.maxWidth = '200px';
          img.style.border = '2px solid #fff';
          img.style.borderRadius = '8px';
          img.style.cursor = 'zoom-in';
          img.title = 'Click để phóng to / quét thử';

          // Tính năng phóng to để quét
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
            bigImg.src = imgUrl;
            bigImg.style.width = '300px';
            bigImg.style.height = '300px';
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
        } else {
          log(`❌ Lỗi API: ${res.status}`, 'error');
        }
      } catch (e) {
        log('❌ Lỗi kết nối mạng.', 'error');
      }
    },
  },

  // --- 8. URL SCAN ---
  urlscan: {
    name: 'URLScan.io API',
    filePath: './assets/codes/URLScan.py',
    langData: {
      vi: {
        def: '<strong>Mô tả:</strong> Quét và phân tích URL để phát hiện lừa đảo, mã độc.',
        usage: `<ul>
                            <li><strong>Bảo mật:</strong> Kiểm tra link lạ.</li>
                            <li><strong>Phân tích:</strong> Xem IP, Server trang web.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>urlscan.io/api/v1/scan/</code><br>
                      <strong>Cách lấy Key:</strong><br>
                      1. Đăng ký tại <code>urlscan.io</code>.<br>
                      2. Vào <strong>Settings & API</strong>.<br>
                      3. Chọn "Create new API Key".`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Phân tích sâu, an toàn tuyệt đối.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Phải chờ server quét (15-20s).</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Scan & analyze URLs for phishing/malware.',
        usage: `<ul>
                            <li><strong>Security:</strong> Check suspicious links.</li>
                            <li><strong>Analysis:</strong> Inspect Server/IP.</li>
                        </ul>`,
        req: `<strong>Req:</strong> API Key. Lib <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>urlscan.io/api/v1/scan/</code><br>
                      <strong>Get Key:</strong><br>
                      1. Sign up at <code>urlscan.io</code>.<br>
                      2. Go to <strong>Settings & API</strong>.<br>
                      3. Click "Create new API Key".`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Deep analysis, safe.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Wait time required (~15s).</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang gửi yêu cầu quét tới URLScan.io...', 'cmd');

      // Lấy thông tin từ code
      const keyMatch = code.match(/api_key = "(.*?)"/);
      const targetMatch = code.match(/target_url = "(.*?)"/);

      // KEY MỚI CỦA BẠN
      const key = keyMatch
        ? keyMatch[1]
        : '019b22ef-6974-7101-a540-727488790753';
      const target = targetMatch ? targetMatch[1] : 'https://google.com';

      try {
        // BƯỚC 1: GỬI YÊU CẦU QUÉT (POST)
        const res = await fetch('https://urlscan.io/api/v1/scan/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'API-Key': key },
          body: JSON.stringify({ url: target, visibility: 'public' }),
        });

        if (res.status === 200) {
          const data = await res.json();
          const uuid = data.uuid;

          log(`✅ Gửi yêu cầu thành công!`, 'success');
          log(`UUID: ${uuid}`);
          log(`⏳ Đang đợi server phân tích (15s)...`);

          // BƯỚC 2: ĐẾM NGƯỢC (Giả lập thời gian chờ server như code Python)
          let timeLeft = 15;
          const countdownLine = document.createElement('div');
          document.getElementById('console-output').appendChild(countdownLine);

          const timer = setInterval(async () => {
            countdownLine.innerText = `>>> Vui lòng đợi: ${timeLeft}s...`;
            countdownLine.style.color = '#e2e8f0';
            timeLeft--;

            if (timeLeft < 0) {
              clearInterval(timer);
              countdownLine.innerText = '>>> Đang tải báo cáo chi tiết...';

              // BƯỚC 3: LẤY KẾT QUẢ CHI TIẾT (GET)
              try {
                const resultRes = await fetch(
                  `https://urlscan.io/api/v1/result/${uuid}/`
                );
                if (resultRes.status === 200) {
                  const report = await resultRes.json();

                  const page = report.page || {};
                  const verdicts = report.verdicts || {};
                  const stats = report.stats || {};
                  const task = report.task || {};

                  log('--------------------------------------------------');
                  log('📊 KẾT QUẢ PHÂN TÍCH CHI TIẾT:', 'success');
                  log(`Tiêu đề:  ${page.title || 'N/A'}`);
                  log(`IP:       ${page.ip} (${page.country})`);
                  log(`Server:   ${page.server || 'N/A'}`);

                  // --- PHẦN MỚI: ĐÁNH GIÁ AN TOÀN ---
                  const overall = verdicts.overall || {};
                  const isMalicious = overall.malicious;
                  const score = overall.score || 0;

                  // Logic hiển thị giống Python: {'CÓ ⚠️' if malicious else 'KHÔNG ✅'}
                  const statusText = isMalicious ? 'CÓ ⚠️' : 'KHÔNG ✅';
                  log(
                    `🛡️ Độc hại:  ${statusText} (Điểm rủi ro: ${score})`,
                    isMalicious ? 'error' : 'success'
                  );

                  // --- PHẦN MỚI: THỐNG KÊ TÀI NGUYÊN ---
                  const resStats = stats.resourceStats || {};
                  const count = resStats.count || 0;
                  // Chuyển đổi byte sang KB giống Python (/ 1024)
                  const sizeKB = ((resStats.size || 0) / 1024).toFixed(2);

                  log(`📦 Tài nguyên: ${count} requests`);
                  log(`🌐 Tổng dung lượng: ${sizeKB} KB`);

                  // Hiển thị Screenshot
                  if (task.screenshotURL) {
                    log('📸 Screenshot:');
                    log(task.screenshotURL, 'image');
                  }

                  log('--------------------------------------------------');
                } else {
                  log('⚠️ Kết quả chưa sẵn sàng hoặc đang xử lý.');
                  log(`🔗 Link theo dõi: ${data.result}`);
                }
              } catch (err) {
                log('❌ Lỗi khi tải chi tiết báo cáo.', 'error');
              }
            }
          }, 1000);
        } else if (res.status === 400) {
          log('❌ Lỗi 400: URL không hợp lệ hoặc Scan thất bại.', 'error');
        } else if (res.status === 401) {
          log('❌ Lỗi 401: API Key sai hoặc thiếu.', 'error');
        } else {
          log(`❌ Lỗi API: ${res.status}`, 'error');
        }
      } catch (e) {
        log('❌ Lỗi kết nối (Bị chặn CORS).', 'error');
        log(
          "👉 Hãy bật Extension 'Allow CORS' để chạy được API này trên trình duyệt.",
          'cmd'
        );
      }
    },
  },

  // --- 9. OPENAI (CHATGPT) - SMART MOCK ---
  openai: {
    name: 'OpenAI API (ChatGPT)',
    filePath: './assets/codes/OpenAIAPI.py',
    langData: {
      vi: {
        def: '<strong>Mô tả:</strong> Cổng kết nối AI tạo sinh (GPT-3.5/4). Hỗ trợ chat, viết code, dịch thuật.',
        usage: `<ul>
                            <li><strong>Chatbot:</strong> CSKH tự động.</li>
                            <li><strong>Content:</strong> Viết bài, tóm tắt.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> Python, API Key (Có phí).<br>
                      <strong>Endpoint:</strong> <code>api.openai.com/v1/chat/completions</code><br>
                      <strong>Cách lấy Key:</strong><br>
                      1. Đăng ký tại <code>platform.openai.com</code>.<br>
                      2. Vào menu <strong>API Keys</strong>.<br>
                      3. Chọn "Create new secret key".`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Thông minh vượt trội, đa năng.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Tính phí theo token.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Generative AI gateway (GPT-3.5/4). Supports chat, coding, translation.',
        usage: `<ul>
                            <li><strong>Chatbot:</strong> Auto support.</li>
                            <li><strong>Content:</strong> Writing, summary.</li>
                        </ul>`,
        req: `<strong>Req:</strong> Python, API Key (Paid).<br>
                      <strong>Endpoint:</strong> <code>api.openai.com/v1/chat/completions</code><br>
                      <strong>Get Key:</strong><br>
                      1. Sign up at <code>platform.openai.com</code>.<br>
                      2. Go to <strong>API Keys</strong> menu.<br>
                      3. Click "Create new secret key".`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Superior intelligence.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Pay-per-token.</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang gửi prompt tới OpenAI (Model: gpt-3.5-turbo)...', 'cmd');

      const keyMatch = code.match(/api_key="(.*?)"/);
      const inputMatch = code.match(/user_input = "(.*?)"/);

      // Key hết hạn của bạn (để kích hoạt chế độ giả lập)
      const defaultKey =
        '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';
      const key =
        keyMatch && keyMatch[1].length > 10 ? keyMatch[1] : defaultKey;

      // Lấy câu hỏi người dùng nhập
      const prompt = inputMatch ? inputMatch[1] : 'Xin chào';

      try {
        // Gọi API thật trước
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'Bạn là trợ lý ảo hữu ích.' },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 200,
          }),
        });

        if (res.status === 200) {
          const data = await res.json();
          printOpenAIResult(data);
        } else if (res.status === 429) {
          // --- CHẾ ĐỘ GIẢ LẬP THÔNG MINH ---
          log(
            `⚠️ Tài khoản hết hạn mức (429). Kích hoạt chế độ MÔ PHỎNG NGỮ CẢNH...`,
            'cmd'
          );

          // Tạo nội dung giả lập dựa trên từ khóa trong câu hỏi
          let mockContent = '';
          const p = prompt.toLowerCase();

          if (
            p.includes('code') ||
            p.includes('python') ||
            p.includes('viết')
          ) {
            mockContent = `[MÔ PHỎNG] Dưới đây là ví dụ code Python bạn yêu cầu:\n\n\`\`\`python\ndef hello_world():\n    print("Hello from OpenAI!")\n\nhello_world()\n\`\`\`\n\nCode này định nghĩa một hàm đơn giản để in chuỗi ký tự ra màn hình.`;
          } else if (p.includes('tóm tắt') || p.includes('giải thích')) {
            mockContent = `[MÔ PHỎNG] Để trả lời câu hỏi "${prompt}", tôi xin tóm tắt như sau:\n\nĐây là một khái niệm quan trọng trong khoa học máy tính/đời sống. Nó giúp tối ưu hóa quy trình và nâng cao hiệu suất làm việc. (Đây là văn bản giả lập vì API Key hết hạn).`;
          } else if (p.includes('thơ') || p.includes('hát')) {
            mockContent = `[MÔ PHỎNG] Tặng bạn một đoạn thơ ngẫu hứng:\n\nTrăm năm trong cõi người ta\nCode không chạy được, thật là đắng cay.\nKey thì hết hạn hôm nay,\nChuyển sang giả lập, vẫn hay như thường!`;
          } else {
            mockContent = `[MÔ PHỎNG] Tôi đã nhận được câu hỏi: "${prompt}".\n\nLà một mô hình AI, tôi có thể giúp bạn giải đáp vấn đề này chi tiết. Tuy nhiên, do API Key hiện tại đang bị giới hạn, tôi chỉ có thể phản hồi mẫu này. Vui lòng nạp thêm credit để nhận câu trả lời thực tế!`;
          }

          setTimeout(() => {
            const mockData = {
              choices: [
                {
                  message: { content: mockContent },
                  finish_reason: 'stop',
                },
              ],
              usage: {
                prompt_tokens: prompt.length,
                completion_tokens: mockContent.length,
                total_tokens: prompt.length + mockContent.length,
              },
              model: 'gpt-3.5-turbo-simulated',
              id: 'chatcmpl-SimulatedResponse',
            };
            printOpenAIResult(mockData);
          }, 1500);
        } else {
          const err = await res.json();
          log(`❌ Lỗi API (${res.status}):`, 'error');
          if (err.error) log(`Chi tiết: ${err.error.message}`);
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
        def: '<strong>Mô tả:</strong> Công cụ AI tách nền ảnh tự động với độ chính xác cao (xử lý tốt cả tóc).',
        usage: `<ul>
                            <li><strong>TMĐT:</strong> Xóa nền ảnh sản phẩm.</li>
                            <li><strong>Thiết kế:</strong> Giảm thời gian cắt ghép thủ công.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>api.remove.bg/v1.0/removebg</code><br>
                      <strong>Cách lấy Key:</strong><br>
                      1. Đăng ký tại <code>remove.bg</code>.<br>
                      2. Vào <strong>Tools & API</strong> > <strong>API Key</strong>.<br>
                      3. Nhấn "New API Key" để tạo.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Cực nhanh, chính xác, tự động hóa 100%.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Tài khoản Free chỉ tải được ảnh nhỏ (Preview).</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> AI tool for automatic background removal with high precision.',
        usage: `<ul>
                            <li><strong>E-commerce:</strong> Remove product backgrounds.</li>
                            <li><strong>Design:</strong> Save manual masking time.</li>
                        </ul>`,
        req: `<strong>Req:</strong> API Key. Lib <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>api.remove.bg/v1.0/removebg</code><br>
                      <strong>Get Key:</strong><br>
                      1. Sign up at <code>remove.bg</code>.<br>
                      2. Go to <strong>Tools & API</strong> > <strong>API Key</strong>.<br>
                      3. Click "New API Key".`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Fast, accurate, fully automated.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Free account only allows small preview downloads.</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang mở công cụ RemoveBG...', 'cmd');
      setTimeout(() => {
        currentToolMode = 'removebg';
        document.querySelector('.tool-header span').innerHTML =
          '<i class="fa-solid fa-wand-magic-sparkles"></i> AI Background Remover';

        // Reset UI
        document.getElementById('upload-stage').style.display = 'block';
        document.getElementById('result-stage').style.display = 'none';

        // Thêm thông báo hướng dẫn
        log(
          '👉 Hướng dẫn: Chọn ảnh từ máy tính để hệ thống tự động tách nền và hiển thị số dư Credit.',
          'cmd'
        );
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
        def: '<strong>Mô tả:</strong> Chuyển đổi hình ảnh/PDF thành văn bản (OCR).',
        usage: `<ul>
                            <li><strong>Số hóa:</strong> Chuyển văn bản giấy sang file mềm.</li>
                            <li><strong>Trích xuất:</strong> Đọc biển số, CMND.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>api.ocr.space/parse/image</code><br>
                      <strong>Cách lấy Key:</strong><br>
                      1. Truy cập <code>ocr.space/ocrapi</code>.<br>
                      2. Nhập email để nhận Key miễn phí ngay lập tức.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Hỗ trợ tiếng Việt, miễn phí 25k req/tháng.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Kém hiệu quả với chữ viết tay xấu.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Convert images/PDFs to text (OCR).',
        usage: `<ul>
                            <li><strong>Digitization:</strong> Paper to digital text.</li>
                            <li><strong>Extraction:</strong> Read ID cards, plates.</li>
                        </ul>`,
        req: `<strong>Req:</strong> API Key. Lib <code>requests</code>.<br>
                      <strong>Endpoint:</strong> <code>api.ocr.space/parse/image</code><br>
                      <strong>Get Key:</strong><br>
                      1. Go to <code>ocr.space/ocrapi</code>.<br>
                      2. Enter email to get free Key instantly.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Supports Vietnamese, 25k free reqs/mo.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Poor with bad handwriting.</li>
                           </ul>`,
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
        def: '<strong>Mô tả:</strong> Thư viện Python dùng Google Translate API miễn phí.',
        usage: `<ul>
                            <li><strong>Chatbot:</strong> Dịch đa ngữ.</li>
                            <li><strong>Học tập:</strong> Tra từ điển.</li>
                        </ul>`,
        req: `<strong>Yêu cầu:</strong> Python & <code>googletrans</code>.<br>
                      <strong>Endpoint:</strong> <code>translate.google.com</code><br>
                      <strong>Cách lấy Key:</strong><br>
                      ✅ Thư viện này dùng endpoint công khai.<br>
                      👉 Không cần đăng ký API Key.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Miễn phí, hỗ trợ 100+ ngôn ngữ.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Không ổn định (Unofficial).</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Unofficial Python lib for Google Translate.',
        usage: `<ul>
                            <li><strong>Chatbot:</strong> Multi-lang chat.</li>
                            <li><strong>Learning:</strong> Dictionary.</li>
                        </ul>`,
        req: `<strong>Req:</strong> Python & <code>googletrans</code>.<br>
                      <strong>Endpoint:</strong> <code>translate.google.com</code><br>
                      <strong>Get Key:</strong><br>
                      ✅ Uses public endpoint.<br>
                      👉 No API Key required.`,
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Free, 100+ languages.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Unstable (Unofficial).</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      // Regex lấy thông tin (Code python mới không có src, nên ta mặc định src là 'vi' để gọi API MyMemory)
      const textMatch = code.match(/text = "(.*?)"/);
      const destMatch = code.match(/dest = "(.*?)"/);
      const srcMatch = code.match(/src = "(.*?)"/); // Có thể không có dòng này

      const text = textMatch ? textMatch[1] : 'Hôm nay trời đẹp quá';
      const dest = destMatch ? destMatch[1] : 'en';
      // Nếu không tìm thấy src trong code, mặc định là 'auto' (nhưng API MyMemory cần 'vi', ta giả lập logic này)
      const srcDisplay = srcMatch ? srcMatch[1] : 'auto';
      const srcApi = srcMatch ? srcMatch[1] : 'vi';

      log(`>>> Đang dịch: '${text}' (${srcDisplay} -> ${dest})...`, 'cmd');

      // Vì googletrans là Python lib, trên browser ta dùng MyMemory API thay thế để có kết quả thật
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=${srcApi}|${dest}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.responseData) {
          log('--------------------------------------------------');
          log('✅ KẾT QUẢ:', 'success');
          log(`Gốc:          ${text}`);
          log(`Dịch sang:    ${data.responseData.translatedText}`);
          log('--------------------------------------------------');

          // Giả lập thông tin phát hiện ngôn ngữ (để giống output Python)
          // Vì MyMemory API Free không trả về detect confidence, ta hiển thị mô phỏng dựa trên input
          if (srcDisplay === 'auto') {
            log(`🔍 Phát hiện ngôn ngữ gốc: ${srcApi} (Tiếng Việt)`);
            log(`ℹ️ Dữ liệu bổ sung: 0.98 (Confidence)`);
          } else {
            log(`🔍 Ngôn ngữ gốc: ${srcApi}`);
          }
          log('--------------------------------------------------');
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

  // Label cho nút bấm
  const btnLabel =
    currentLang === 'vi'
      ? `<i class="fa-solid fa-earth-americas"></i> &nbsp; English`
      : `<i class="fa-solid fa-rotate-left"></i> &nbsp; Tiếng Việt`;

  // CẤU TRÚC HTML MỚI: Header chứa Tiêu đề + Nút Dịch
  document.getElementById('info-panel').innerHTML = `
        <div class="info-header-container">
            <h2 class="info-title">${data.name}</h2>
            <button onclick="toggleLang()" class="translate-btn">
                ${btnLabel}
            </button>
        </div>

        <div class="info-grid">
            <div class="info-item">
                <h4>${
                  currentLang === 'vi' ? '1. Giới thiệu' : '1. Introduction'
                }</h4>
                <p>${content.def}</p>
                
                <br>
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

// --- HÀM XỬ LÝ ẢNH (REAL API - FULL INFO) ---
function processImage(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];

    // --- 1. OCR SPACE (CẬP NHẬT ĐỂ GIỐNG PYTHON) ---
    if (currentToolMode === 'ocr') {
      document.getElementById('upload-stage').style.display = 'none';
      document.getElementById('result-stage').style.display = 'block';
      const removeBgView = document.getElementById('removebg-view');
      if (removeBgView) removeBgView.style.display = 'none';

      const statusText = document.getElementById('status-text');
      statusText.innerText = '⏳ Đang gửi ảnh lên Server OCR.space...';
      statusText.style.color = '#e2e8f0';

      log(`GUI: Đã chọn file "${file.name}"`, 'cmd');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('apikey', 'helloworld'); // Key Free
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'true'); // Bật Overlay để giống code Python

      setTimeout(() => {
        statusText.innerHTML = `<i class="fa-solid fa-check-circle"></i> Upload xong. Đang xử lý...`;
        statusText.style.color = '#4CAF50';
        setTimeout(() => closeTool(), 500);
      }, 1000);

      log('>>> Đang gọi API OCR Space (POST)...', 'cmd');

      fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          // Kiểm tra lỗi giống Python: if result["IsErroredOnProcessing"]
          if (
            !data.IsErroredOnProcessing &&
            data.ParsedResults &&
            data.ParsedResults.length > 0
          ) {
            const parsedResult = data.ParsedResults[0];

            log('--------------------------------------------------');
            log('✅ ĐỌC THÀNH CÔNG!', 'success');
            log(`⏱️ Thời gian xử lý: ${data.ProcessingTimeInMilliseconds} ms`);
            log(`📄 Exit Code:       ${parsedResult.FileParseExitCode}`);
            log('--------------------------------------------------');
            log('--- NỘI DUNG VĂN BẢN ---', 'cmd');
            log(parsedResult.ParsedText || '(Không tìm thấy văn bản)');
            log('--------------------------------------------------');
          } else {
            log('❌ Lỗi xử lý hoặc không đọc được chữ.', 'error');
            if (data.ErrorMessage) log(`Chi tiết: ${data.ErrorMessage}`);
            if (data.ParsedResults && data.ParsedResults[0].ErrorMessage) {
              log(`Chi tiết: ${data.ParsedResults[0].ErrorMessage}`);
            }
          }
        })
        .catch((e) => {
          log('❌ Lỗi kết nối OCR (Mạng/CORS).', 'error');
        });

      input.value = '';
    }

    // --- 2. REMOVE BG (GIỮ NGUYÊN CODE ĐÃ SỬA TRƯỚC ĐÓ) ---
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
      statusText.innerText = '⏳ Đang xử lý trên server Remove.bg...';
      statusText.style.color = '#e2e8f0';

      log(`GUI: Đã tải file "${file.name}"`, 'cmd');

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
          if (response.ok) {
            const charged =
              response.headers.get('X-Remove-Bg-Charged-Credits') || 'N/A';
            const total =
              response.headers.get('X-Remove-Bg-Account-Credits') || 'N/A';

            log('--------------------------------------------------');
            log('✅ TÁCH NỀN THÀNH CÔNG!', 'success');
            log(`💰 Phí lần này:   ${charged} credits`);
            log(`🏦 Số dư còn lại: ${total} credits`);
            log('--------------------------------------------------');

            return response.blob();
          }
          throw new Error(await response.text());
        })
        .then((blob) => {
          const resultUrl = URL.createObjectURL(blob);
          imgResult.src = resultUrl;
          imgResult.style.opacity = '1';
          statusText.innerHTML = '✅ Xong! (Click ảnh để tải)';
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

// Hàm hiển thị kết quả OpenAI chuẩn (Dùng chung cho cả Real và Mock)
function printOpenAIResult(data) {
  log('✅ PHẢN HỒI TỪ CHATGPT:', 'success');
  log(data.choices[0].message.content);
  log('--------------------------------------------------');

  // Hiển thị Metadata
  log('📊 THỐNG KÊ TOKEN (Chi phí):', 'cmd');
  log(`- Prompt (Đầu vào):     ${data.usage.prompt_tokens} tokens`);
  log(`- Completion (Đầu ra):  ${data.usage.completion_tokens} tokens`);
  log(`- Tổng cộng:            ${data.usage.total_tokens} tokens`);

  log('\nℹ️ THÔNG TIN KHÁC:', 'cmd');
  log(`- Model thực thi:   ${data.model}`);
  log(`- Request ID:       ${data.id}`);
  log(`- Lý do dừng:       ${data.choices[0].finish_reason}`);
  log('--------------------------------------------------');
}
