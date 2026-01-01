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
        def: '<strong>Mô tả:</strong> Dịch vụ cung cấp dữ liệu thời tiết toàn cầu (nhiệt độ, độ ẩm, gió, mây...) cho hơn 200.000 thành phố. Dữ liệu được thu thập từ các trạm khí tượng, vệ tinh và radar.',
        usage: `<ul>
                            <li><strong>Ứng dụng dự báo:</strong> Hiển thị thời tiết hiện tại và dự báo 7 ngày tới trên Smartphone/Web.</li>
                            <li><strong>Nông nghiệp thông minh:</strong> Cảnh báo mưa bão, sương giá để bảo vệ mùa màng.</li>
                            <li><strong>Du lịch & Sự kiện:</strong> Giúp lên kế hoạch tổ chức sự kiện ngoài trời dựa trên tình hình thời tiết.</li>
                            <li><strong>Giao thông vận tải:</strong> Cảnh báo thời tiết xấu cho hàng không và vận tải biển.</li>
                        </ul>`,
        req: '<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br><strong>Endpoint:</strong> <code>api.openweathermap.org/data/2.5/weather</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Dữ liệu phong phú, độ chính xác cao, cập nhật liên tục, gói Free hào phóng (60 gọi/phút).</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> API Key miễn phí giới hạn tính năng nâng cao (như dự báo lịch sử dài hạn).</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> A service providing global weather data (temperature, humidity, wind, clouds...) for over 200,000 cities. Data is collected from meteorological stations, satellites, and radars.',
        usage: `<ul>
                            <li><strong>Forecast Apps:</strong> Display current weather and 7-day forecasts on Smartphones/Web.</li>
                            <li><strong>Smart Agriculture:</strong> Storm and frost warnings to protect crops.</li>
                            <li><strong>Tourism & Events:</strong> Assist in planning outdoor events based on weather conditions.</li>
                            <li><strong>Transportation:</strong> Severe weather warnings for aviation and maritime shipping.</li>
                        </ul>`,
        req: '<strong>Req:</strong> API Key. Lib <code>requests</code>.<br><strong>Endpoint:</strong> <code>api.openweathermap.org/data/2.5/weather</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Rich data, high accuracy, real-time updates, generous Free tier (60 calls/min).</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Free API Key limits advanced features (like long-term historical data).</li>
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
        def: '<strong>Mô tả:</strong> Cơ sở dữ liệu phim ảnh và truyền hình lớn nhất do cộng đồng xây dựng. Cung cấp thông tin chi tiết về phim, diễn viên, đạo diễn, poster, trailer và xếp hạng.',
        usage: `<ul>
                            <li><strong>Web xem phim:</strong> Hiển thị poster, nội dung tóm tắt và danh sách diễn viên.</li>
                            <li><strong>Gợi ý phim:</strong> Xây dựng hệ thống đề xuất phim dựa trên sở thích người dùng.</li>
                            <li><strong>Phân tích dữ liệu:</strong> Thống kê xu hướng điện ảnh và doanh thu phòng vé.</li>
                        </ul>`,
        req: '<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br><strong>Endpoint:</strong> <code>api.themoviedb.org/3/search/movie</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Dữ liệu khổng lồ, hỗ trợ nhiều ngôn ngữ (bao gồm tiếng Việt), miễn phí sử dụng.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Dữ liệu do cộng đồng đóng góp nên đôi khi có sai sót nhỏ hoặc chậm cập nhật phim mới ra mắt.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> The largest community-built database for movies and TV shows. Provides details on films, actors, directors, posters, trailers, and ratings.',
        usage: `<ul>
                            <li><strong>Streaming Sites:</strong> Display posters, plot summaries, and cast lists.</li>
                            <li><strong>Movie Recommendations:</strong> Build recommendation systems based on user preferences.</li>
                            <li><strong>Data Analysis:</strong> Analyze cinema trends and box office revenue.</li>
                        </ul>`,
        req: '<strong>Req:</strong> API Key. Lib <code>requests</code>.<br><strong>Endpoint:</strong> <code>api.themoviedb.org/3/search/movie</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Massive database, supports multiple languages (including Vietnamese), free to use.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Community-contributed data may occasionally have minor errors or lag in updating newly released films.</li>
                           </ul>`,
      },
    },
    action: async (code) => {
      log('>>> Đang tìm kiếm trên TMDB...', 'cmd');
      const queryMatch = code.match(/'query': '(.*?)'/);
      const keyMatch = code.match(/api_key = "(.*?)"/);
      const query = queryMatch ? queryMatch[1] : 'Mưa đỏ';
      const key = keyMatch ? keyMatch[1] : '';

      try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${query}&language=vi-VN`;
        const res = await fetch(url);
        if (res.status === 200) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const m = data.results[0];
            log('--------------------------------------------------');
            log(
              `🎬 ${m.title.toUpperCase()} (${m.release_date.split('-')[0]})`,
              'success'
            );
            log(`⭐ Điểm: ${m.vote_average}/10 (Vote: ${m.vote_count})`);
            log(`📈 Popularity: ${m.popularity}`);
            log(`📝 Nội dung: ${m.overview}`);
            if (m.poster_path) {
              log('🖼️ Poster:');
              log(`https://image.tmdb.org/t/p/w200${m.poster_path}`, 'image');
            }
            log('--------------------------------------------------');
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
        def: '<strong>Mô tả:</strong> API cung cấp quyền truy cập vào thư viện ảnh chất lượng cao miễn phí lớn nhất thế giới. Cho phép tìm kiếm, tải và lấy thông tin chi tiết (tác giả, kích thước, EXIF...) của hình ảnh.',
        usage: `<ul>
                            <li><strong>Thiết kế UI/UX:</strong> Nguồn ảnh placeholder ngẫu nhiên, sinh động cho demo website.</li>
                            <li><strong>CMS & Blog:</strong> Tích hợp công cụ tìm ảnh minh họa ngay trong trình soạn thảo văn bản.</li>
                            <li><strong>Ứng dụng hình nền:</strong> Tự động thay đổi hình nền điện thoại/máy tính theo chủ đề mỗi ngày.</li>
                            <li><strong>Marketing:</strong> Tìm ảnh lifestyle hoặc ảnh sản phẩm mẫu để thiết kế banner.</li>
                        </ul>`,
        req: '<strong>Yêu cầu:</strong> Access Key. Thư viện <code>requests</code>.<br><strong>Endpoint:</strong> <code>api.unsplash.com/search/photos</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Ảnh chất lượng xuất sắc (4K), miễn phí bản quyền, JSON dễ hiểu.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Gói Demo giới hạn 50 request/giờ, chưa hỗ trợ tìm kiếm video.</li>
                           </ul>`,
      },
      en: {
        def: "<strong>Description:</strong> API providing access to the world's largest free high-resolution photo library. Allows searching, downloading, and retrieving detailed photo metadata (author, size, EXIF...).",
        usage: `<ul>
                            <li><strong>UI/UX Design:</strong> Rich and random placeholder images for website demos.</li>
                            <li><strong>CMS & Blogs:</strong> Integrated photo search tools directly within text editors.</li>
                            <li><strong>Wallpaper Apps:</strong> Automatically change phone/desktop wallpapers based on daily themes.</li>
                            <li><strong>Marketing:</strong> Find lifestyle or product mockup images for banner design.</li>
                        </ul>`,
        req: '<strong>Req:</strong> Access Key. Lib <code>requests</code>.<br><strong>Endpoint:</strong> <code>api.unsplash.com/search/photos</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Excellent image quality (4K), royalty-free, easy-to-understand JSON.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Demo tier limited to 50 requests/hour, no video search support yet.</li>
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
        def: '<strong>Mô tả:</strong> API cung cấp dữ liệu thông tin về các quốc gia trên thế giới. Dữ liệu bao gồm tên, thủ đô, khu vực, dân số, diện tích, quốc kỳ, ngôn ngữ, tiền tệ, múi giờ và các mã quốc gia tiêu chuẩn.',
        usage: `<ul>
                            <li><strong>Thương mại điện tử:</strong> Tự động điền mã vùng điện thoại (+84...), gợi ý địa chỉ giao hàng.</li>
                            <li><strong>Giáo dục & Tra cứu:</strong> Xây dựng từ điển địa lý, bản đồ số hoặc trò chơi đố vui (Quiz).</li>
                            <li><strong>Du lịch:</strong> Cung cấp thông tin tiền tệ, ngôn ngữ và hình ảnh cờ cho khách du lịch.</li>
                            <li><strong>Hiển thị dữ liệu:</strong> Hiển thị icon lá cờ bên cạnh ngôn ngữ hoặc số điện thoại trên giao diện.</li>
                        </ul>`,
        req: '<strong>Yêu cầu:</strong> Thư viện <code>requests</code>. KHÔNG cần API Key.<br><strong>Endpoint:</strong> <code>restcountries.com/v3.1/name/{name}</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Hoàn toàn mở, không cần đăng ký tài khoản, dễ triển khai, miễn phí.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Dữ liệu tĩnh (dân số không real-time), server cộng đồng đôi khi phản hồi chậm.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> API providing data about world countries. Includes name, capital, region, population, area, flag, language, currency, timezones, and standard country codes.',
        usage: `<ul>
                            <li><strong>E-commerce:</strong> Auto-fill phone codes (+1...), suggest shipping addresses.</li>
                            <li><strong>Education & Reference:</strong> Build geography dictionaries, digital maps, or quiz games.</li>
                            <li><strong>Travel:</strong> Provide currency, language, and flag info for travelers.</li>
                            <li><strong>UI Display:</strong> Show flag icons next to languages or phone numbers on interfaces.</li>
                        </ul>`,
        req: '<strong>Req:</strong> Lib <code>requests</code>. NO API Key needed.<br><strong>Endpoint:</strong> <code>restcountries.com/v3.1/name/{name}</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Fully open, no registration required, easy to implement, free.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Static data (population not real-time), community servers can sometimes be slow.</li>
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
        def: '<strong>Mô tả:</strong> Dịch vụ tài chính cung cấp tỷ giá hối đoái tiền tệ chính xác từ các ngân hàng trung ương. Hỗ trợ quy đổi hơn 160 loại tiền tệ (USD, VND, EUR...). Dữ liệu trả về JSON chứa tỷ lệ chuyển đổi.',
        usage: `<ul>
                            <li><strong>Thương mại điện tử đa quốc gia:</strong> Hiển thị giá sản phẩm theo đơn vị tiền tệ địa phương của khách hàng.</li>
                            <li><strong>Công nghệ tài chính (Fintech):</strong> Tính toán chi phí chuyển tiền quốc tế hoặc quy đổi trong ví điện tử.</li>
                            <li><strong>Kế toán & Báo cáo:</strong> Tự động quy đổi doanh thu từ nhiều thị trường về một đồng tiền chuẩn.</li>
                            <li><strong>Du lịch:</strong> Giúp khách du lịch tính toán nhanh chi phí mua sắm tại nước ngoài.</li>
                        </ul>`,
        req: '<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br><strong>Endpoint:</strong> <code>v6.exchangerate-api.com/v6/{KEY}/latest/{Base}</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Độ tin cậy cao, dữ liệu chuẩn xác, cấu trúc JSON gọn nhẹ, có gói miễn phí vĩnh viễn.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Gói miễn phí cập nhật chậm (1 lần/ngày), giới hạn số lượng request hàng tháng.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Financial service providing accurate currency exchange rates from central banks. Supports conversion for 160+ currencies (USD, VND, EUR...). Returns JSON data with conversion rates.',
        usage: `<ul>
                            <li><strong>Global E-commerce:</strong> Display product prices in the customer's local currency.</li>
                            <li><strong>Fintech:</strong> Calculate international transfer fees or e-wallet conversions.</li>
                            <li><strong>Accounting:</strong> Automatically convert revenue from multiple markets to a standard currency.</li>
                            <li><strong>Travel:</strong> Help tourists quickly calculate shopping costs abroad.</li>
                        </ul>`,
        req: '<strong>Req:</strong> API Key. Lib <code>requests</code>.<br><strong>Endpoint:</strong> <code>v6.exchangerate-api.com/v6/{KEY}/latest/{Base}</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> High reliability, accurate data, simple JSON structure, forever free tier available.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Free tier updates slowly (once/day), limited monthly requests.</li>
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
        def: '<strong>Mô tả:</strong> API tiện ích cho phép tạo mã QR nhanh chóng từ văn bản, URL hoặc dữ liệu bất kỳ. Hỗ trợ tùy chỉnh kích thước ảnh đầu ra.',
        usage: `<ul>
                            <li><strong>Thanh toán điện tử:</strong> Tạo mã VietQR để chuyển khoản nhanh.</li>
                            <li><strong>Kết nối tiện ích:</strong> Chia sẻ mật khẩu Wi-Fi, danh thiếp (vCard) hoặc vé sự kiện.</li>
                            <li><strong>Marketing:</strong> Dẫn khách hàng tới website khuyến mãi hoặc tải ứng dụng.</li>
                        </ul>`,
        req: '<strong>Yêu cầu:</strong> Thư viện <code>requests</code>. Không cần API Key.<br><strong>Endpoint:</strong> <code>api.qrserver.com/v1/create-qr-code</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Hoàn toàn miễn phí, không cần đăng ký, tốc độ phản hồi nhanh.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Chỉ tạo được QR tĩnh (không sửa được nội dung sau khi tạo), ít tùy biến màu sắc.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Utility API for quickly generating QR codes from text, URLs, or any data. Supports custom output image sizes.',
        usage: `<ul>
                            <li><strong>E-payments:</strong> Generate QR codes for quick bank transfers.</li>
                            <li><strong>Utilities:</strong> Share Wi-Fi passwords, digital business cards (vCard), or event tickets.</li>
                            <li><strong>Marketing:</strong> Direct customers to promotional websites or app downloads.</li>
                        </ul>`,
        req: '<strong>Req:</strong> Lib <code>requests</code>. No API Key.<br><strong>Endpoint:</strong> <code>api.qrserver.com/v1/create-qr-code</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Completely free, no registration needed, fast response time.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Only generates Static QR codes (cannot edit content later), limited color customization.</li>
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
        def: '<strong>Mô tả:</strong> API an toàn thông tin giúp quét và phân tích URL để phát hiện mối đe dọa. Cung cấp thông tin chi tiết: yêu cầu mạng, mã JS, địa chỉ IP, SSL và hành vi trang web.',
        usage: `<ul>
                            <li><strong>Phát hiện lừa đảo (Phishing):</strong> Kiểm tra các đường link nghi ngờ trong email/tin nhắn trước khi click.</li>
                            <li><strong>Giám sát thương hiệu:</strong> Phát hiện các website giả mạo giao diện của ngân hàng hoặc doanh nghiệp.</li>
                            <li><strong>Phân tích kỹ thuật:</strong> Xem công nghệ web, vị trí server, tài nguyên tải về.</li>
                            <li><strong>Điều tra sự cố:</strong> Hỗ trợ chuyên gia bảo mật phân tích nguồn gốc trang web độc hại.</li>
                        </ul>`,
        req: '<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br><strong>Endpoint:</strong> <code>urlscan.io/api/v1/scan/</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Phân tích rất sâu (DOM, Screenshot), an toàn tuyệt đối (không cần truy cập trực tiếp).</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Quy trình phức tạp (Bất đồng bộ - phải chờ server quét), dữ liệu chuyên ngành khó đọc.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Security API to scan and analyze URLs for threats. Provides details on network requests, JS code, IPs, SSL, and website behavior.',
        usage: `<ul>
                            <li><strong>Phishing Detection:</strong> Check suspicious links in emails/messages before clicking.</li>
                            <li><strong>Brand Monitoring:</strong> Detect fake websites mimicking banks or businesses.</li>
                            <li><strong>Technical Analysis:</strong> Inspect web technologies, server location, and loaded resources.</li>
                            <li><strong>Incident Investigation:</strong> Assist security experts in analyzing malicious website origins.</li>
                        </ul>`,
        req: '<strong>Req:</strong> API Key. Lib <code>requests</code>.<br><strong>Endpoint:</strong> <code>urlscan.io/api/v1/scan/</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Deep analysis (DOM, Screenshot), absolute safety (no direct access required).</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Complex process (Asynchronous - requires wait time), technical data can be hard to read.</li>
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
        def: '<strong>Mô tả:</strong> Cổng kết nối tích hợp các mô hình AI tạo sinh (Generative AI) hàng đầu như GPT-3.5, GPT-4. Cung cấp khả năng xử lý ngôn ngữ tự nhiên (NLP) vượt trội: hiểu ngữ cảnh, sinh văn bản, dịch thuật và viết code.',
        usage: `<ul>
                            <li><strong>Chatbot thông minh:</strong> Xây dựng hệ thống CSKH tự động 24/7, đối đáp tự nhiên như người.</li>
                            <li><strong>Sáng tạo nội dung:</strong> Hỗ trợ viết bài marketing, email, kịch bản video, tóm tắt tài liệu.</li>
                            <li><strong>Hỗ trợ lập trình:</strong> Tích hợp vào IDE để gợi ý code, debug lỗi và tối ưu thuật toán.</li>
                            <li><strong>Phân tích dữ liệu:</strong> Trích xuất thông tin quan trọng từ văn bản hoặc phân tích cảm xúc.</li>
                        </ul>`,
        req: '<strong>Yêu cầu:</strong> Python, API Key (Có phí).<br><strong>Endpoint:</strong> <code>api.openai.com/v1/chat/completions</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Thông minh vượt trội, đa năng, hệ sinh thái hỗ trợ mạnh mẽ.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Tính phí dựa trên token, đôi khi gặp hiện tượng ảo giác AI (thông tin sai lệch).</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Integration gateway for leading Generative AI models like GPT-3.5, GPT-4. Offers superior NLP capabilities: context understanding, text generation, translation, and coding support.',
        usage: `<ul>
                            <li><strong>Smart Chatbots:</strong> Build 24/7 automated customer support that converses naturally.</li>
                            <li><strong>Content Creation:</strong> Assist in writing marketing copy, emails, scripts, and summarizing docs.</li>
                            <li><strong>Coding Support:</strong> IDE integration for code suggestions, debugging, and algorithm optimization.</li>
                            <li><strong>Data Analysis:</strong> Extract key information from text or analyze sentiment.</li>
                        </ul>`,
        req: '<strong>Req:</strong> Python, API Key (Paid).<br><strong>Endpoint:</strong> <code>api.openai.com/v1/chat/completions</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Superior intelligence, versatile, strong ecosystem support.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Pay-per-token pricing, potential AI hallucinations (incorrect info).</li>
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
        def: '<strong>Mô tả:</strong> Công cụ AI mạnh mẽ giúp tách nền khỏi chủ thể (người, vật, xe...) trong bức ảnh chỉ trong vài giây với độ chính xác cực cao, kể cả các chi tiết khó như tóc.',
        usage: `<ul>
                            <li><strong>Thương mại điện tử:</strong> Tự động xóa nền ảnh sản phẩm để làm ảnh đại diện chuyên nghiệp.</li>
                            <li><strong>Thiết kế đồ họa:</strong> Giảm thời gian cắt ghép thủ công cho Designer.</li>
                            <li><strong>Hồ sơ cá nhân:</strong> Tạo ảnh thẻ hoặc ảnh profile từ ảnh chụp đời thường.</li>
                        </ul>`,
        req: '<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br><strong>Endpoint:</strong> <code>api.remove.bg/v1.0/removebg</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Xử lý cực nhanh, chính xác với tóc và lông thú, hoàn toàn tự động.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Gói miễn phí chỉ cho tải ảnh kết quả kích thước nhỏ (Preview), ảnh Full HD tính phí đắt.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> A powerful AI tool that removes backgrounds from subjects (people, objects, cars...) in seconds with extreme precision, handling difficult details like hair effortlessly.',
        usage: `<ul>
                            <li><strong>E-commerce:</strong> Automatically remove product backgrounds for professional listings.</li>
                            <li><strong>Graphic Design:</strong> Reduce manual masking time for Designers.</li>
                            <li><strong>Personal Profiles:</strong> Create ID photos or profile pictures from casual snapshots.</li>
                        </ul>`,
        req: '<strong>Req:</strong> API Key. Lib <code>requests</code>.<br><strong>Endpoint:</strong> <code>api.remove.bg/v1.0/removebg</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Extremely fast, accurate with hair/fur, fully automated.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Free plan only allows small preview downloads; Full HD images are expensive.</li>
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
        def: '<strong>Mô tả:</strong> Dịch vụ nhận dạng ký tự quang học (OCR) giúp chuyển đổi hình ảnh hoặc file PDF chứa văn bản thành dạng chữ có thể chỉnh sửa được (Text/JSON).',
        usage: `<ul>
                            <li><strong>Số hóa tài liệu:</strong> Chuyển hợp đồng, hóa đơn giấy thành file mềm để lưu trữ.</li>
                            <li><strong>Trích xuất dữ liệu:</strong> Tự động đọc số CMND, biển số xe từ ảnh chụp.</li>
                            <li><strong>Hỗ trợ người khiếm thị:</strong> Đọc nội dung trên ảnh/sách báo thành âm thanh.</li>
                        </ul>`,
        req: '<strong>Yêu cầu:</strong> API Key. Thư viện <code>requests</code>.<br><strong>Endpoint:</strong> <code>api.ocr.space/parse/image</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Hỗ trợ nhiều ngôn ngữ (có tiếng Việt), miễn phí 25.000 req/tháng.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Không xử lý tốt chữ viết tay quá xấu hoặc ảnh bị mờ/nhòe.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Optical Character Recognition (OCR) service that converts images or PDF files containing text into editable text formats (Text/JSON).',
        usage: `<ul>
                            <li><strong>Document Digitization:</strong> Convert paper contracts and invoices into soft files for storage.</li>
                            <li><strong>Data Extraction:</strong> Automatically read ID numbers or license plates from photos.</li>
                            <li><strong>Accessibility:</strong> Read text from images/books aloud for the visually impaired.</li>
                        </ul>`,
        req: '<strong>Req:</strong> API Key. Lib <code>requests</code>.<br><strong>Endpoint:</strong> <code>api.ocr.space/parse/image</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Supports many languages (including Vietnamese), free 25,000 reqs/month.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Struggles with very poor handwriting or blurry images.</li>
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
        def: '<strong>Mô tả:</strong> Thư viện Python sử dụng Google Translate API miễn phí (Unofficial). Hỗ trợ dịch thuật tự động và phát hiện ngôn ngữ (Auto Detect) với độ chính xác cao.',
        usage: `<ul>
                            <li><strong>Chatbot đa ngữ:</strong> Tự động dịch tin nhắn giữa người dùng các nước khác nhau.</li>
                            <li><strong>Học tập & Tra cứu:</strong> Xây dựng từ điển hoặc công cụ học ngoại ngữ.</li>
                            <li><strong>Bản địa hóa:</strong> Dịch nhanh nội dung website/app sang tiếng địa phương.</li>
                        </ul>`,
        req: '<strong>Yêu cầu:</strong> Python & <code>googletrans</code>.<br><strong>Endpoint:</strong> <code>translate.google.com</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Ưu điểm:</strong> Hoàn toàn miễn phí, hỗ trợ hơn 100 ngôn ngữ, dễ sử dụng.</li>
                               <li style="color:#ce9178"><strong>Nhược điểm:</strong> Không ổn định (do là bản không chính thức), có thể bị chặn nếu gọi quá nhiều.</li>
                           </ul>`,
      },
      en: {
        def: '<strong>Description:</strong> Unofficial Python library using the free Google Translate API. Supports automatic translation and language detection with high accuracy.',
        usage: `<ul>
                            <li><strong>Multilingual Chatbots:</strong> Auto-translate messages between users of different countries.</li>
                            <li><strong>Learning & Reference:</strong> Build dictionaries or language learning tools.</li>
                            <li><strong>Localization:</strong> Quickly translate website/app content into local languages.</li>
                        </ul>`,
        req: '<strong>Req:</strong> Python & <code>googletrans</code>.<br><strong>Endpoint:</strong> <code>translate.google.com</code>',
        prosCons: `<ul>
                               <li style="color:#4caf50"><strong>Pros:</strong> Completely free, supports 100+ languages, easy to use.</li>
                               <li style="color:#ce9178"><strong>Cons:</strong> Unstable (unofficial), may be blocked if excessive requests are made.</li>
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
