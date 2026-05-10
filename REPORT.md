# BÁO CÁO ĐỒ ÁN: HỆ THỐNG PHÁT HIỆN ĐẠO VĂN MÃ NGUỒN

---

# Chương 1. TỔNG QUAN VỀ ĐỀ TÀI

## 1.1. Tổng quan

### 1.1.1. Bối cảnh thực tiễn
Trong bối cảnh giáo dục đại học và các khóa học lập trình trực tuyến ngày càng phát triển, việc giảng dạy và đánh giá kỹ năng lập trình của sinh viên trở nên quan trọng hơn bao giờ hết. Tuy nhiên, giảng viên thường đối mặt với thách thức lớn trong việc đảm bảo tính trung thực trong các bài nộp. Sự phổ biến của các nguồn tài liệu mở, diễn đàn hỏi đáp và gần đây là các công cụ trí tuệ nhân tạo tạo sinh mã nguồn đã khiến cho vấn đề đạo văn mã nguồn trở nên phức tạp và khó kiểm soát. Việc chấm bài thủ công không chỉ tốn thời gian mà còn khó phát hiện các hành vi sao chép tinh vi.

### 1.1.2. Lý do chọn đề tài
Vấn đề đạo văn mã nguồn không chỉ ảnh hưởng đến sự công bằng trong đánh giá mà còn làm giảm chất lượng giáo dục, khi sinh viên không thực sự rèn luyện được kỹ năng giải quyết vấn đề. Một công cụ tự động, hiệu quả và minh bạch để phát hiện sự tương đồng trong mã nguồn là cực kỳ cần thiết. Việc xây dựng một hệ thống như vậy không chỉ giúp giảm tải công việc cho giảng viên mà còn khuyến khích môi trường học thuật liêm chính, thúc đẩy sinh viên tự lực trong học tập.

### 1.1.3. Vấn đề cần giải quyết
Đề tài này nhắm đến giải quyết các vấn đề cụ thể sau:
- **Phát hiện sự tương đồng mã nguồn:** Xây dựng một cơ chế có khả năng so sánh hàng loạt bài nộp và định lượng mức độ giống nhau giữa chúng.
- **Cung cấp bằng chứng trực quan:** Không chỉ đưa ra một con số, hệ thống cần hiển thị báo cáo chi tiết, so sánh mã nguồn song song và trực quan hóa dữ liệu qua ma trận để giảng viên dễ dàng đưa ra quyết định.
- **Giảm tải công việc thủ công:** Tự động hóa quy trình so sánh, giúp giảng viên tiết kiệm thời gian và tập trung vào việc giảng dạy chuyên môn.
- **Tăng cường tính minh bạch:** Cung cấp một công cụ khách quan để đánh giá tính nguyên bản của bài làm.

### 1.1.4. Mục tiêu đề tài
- Xây dựng một ứng dụng web hoàn chỉnh cho phép giảng viên tải lên một tệp nén chứa nhiều bài làm của sinh viên.
- Triển khai thuật toán so sánh dựa trên token (token-based matching) để phân tích và tính toán độ tương đồng giữa các tệp mã nguồn.
- Tạo ra giao diện báo cáo chi tiết, bao gồm danh sách các cặp tệp đáng ngờ, ma trận tương đồng trực quan, và màn hình so sánh mã nguồn song song.
- Bổ sung tính năng diễn giải thuật toán để người dùng có thể hiểu rõ cách hệ thống hoạt động.
- Hỗ trợ đa ngôn ngữ (Tiếng Anh và Tiếng Việt) và lưu trữ lịch sử các lần phân tích.

### 1.1.5. Phạm vi
- **Ngôn ngữ lập trình:** Hệ thống hỗ trợ các ngôn ngữ lập trình phổ biến dựa trên văn bản. Thuật toán tokenizer được thiết kế chung, hiệu quả với các ngôn ngữ như C, C++, C#, Java, Python, JavaScript.
- **Đầu vào:** Hệ thống chấp nhận đầu vào là một tệp nén duy nhất (`.zip`, `.rar`) chứa tất cả các tệp mã nguồn cần so sánh.
- **Giới hạn thuật toán:** Thuật toán tập trung vào việc so sánh dựa trên từ vựng và cấu trúc cú pháp (token-based). Nó có thể không phát hiện được các hình thức đạo văn tinh vi hơn như thay đổi tên biến hàng loạt một cách nhất quán hoặc thay đổi hoàn toàn logic thuật toán nhưng vẫn giữ nguyên đầu ra.

### 1.1.6. Ý nghĩa của đề tài
- **Ý nghĩa thực tiễn:** Cung cấp một công cụ hữu ích, miễn phí và dễ tiếp cận cho các giảng viên, cơ sở giáo dục để nâng cao chất lượng và tính minh bạch trong việc đánh giá các môn học lập trình.
- **Ý nghĩa khoa học:** Áp dụng và trực quan hóa các kỹ thuật xử lý ngôn ngữ tự nhiên cơ bản (tokenization, frequency analysis) vào một bài toán thực tế trong lĩnh vực giáo dục, tạo ra một công cụ không chỉ để "chấm bài" mà còn để "giáo dục" người dùng về cách hoạt động của thuật toán.

---

# Chương 2. CƠ SỞ LÝ THUYẾT

## 2.1. Tổng quan về công nghệ sử dụng trong hệ thống
Hệ thống được xây dựng trên một nền tảng web hiện đại, sử dụng các công nghệ hàng đầu trong hệ sinh thái JavaScript để đảm bảo hiệu suất, khả năng mở rộng và trải nghiệm người dùng tốt nhất:
- **Next.js & React:** Framework chính để xây dựng giao diện người dùng, tận dụng App Router để quản lý định tuyến và render phía máy chủ (Server-Side Rendering).
- **Tailwind CSS:** Framework CSS theo triết lý utility-first để xây dựng giao diện nhanh chóng, nhất quán và dễ dàng tùy chỉnh.
- **TypeScript:** Ngôn ngữ lập trình chính, giúp tăng cường độ tin cậy và dễ bảo trì cho mã nguồn.
- **JSZip:** Thư viện JavaScript dùng để đọc và giải nén các tệp `.zip` trực tiếp trên trình duyệt của người dùng.
- **Lucide React:** Bộ thư viện icon SVG nhẹ và nhất quán.

## 2.2. Kiến trúc Next.js trong hệ thống

### 2.2.1. Tổng quan Next.js
Next.js là một framework React được xây dựng bởi Vercel, cung cấp các tính năng mạnh mẽ cho các ứng dụng web sản xuất. Trong dự án này, chúng ta tận dụng các tính năng nổi bật của Next.js 14, đặc biệt là **App Router**. App Router cho phép tạo các ứng dụng được render phía máy chủ (server-rendered) theo mặc định, giúp cải thiện hiệu suất tải trang ban đầu và SEO. Các component có thể là Server Components (để xử lý logic ở máy chủ) hoặc Client Components (để xử lý tương tác người dùng trên trình duyệt), mang lại sự linh hoạt tối ưu.

### 2.2.2. Cấu trúc thư mục Next.js trong dự án
Dự án tuân thủ cấu trúc tiêu chuẩn của Next.js App Router:
- `src/app/`: Thư mục chính chứa các trang và định tuyến của ứng dụng.
  - `page.tsx`: Là trang chính (trang chủ) của ứng dụng, nơi chứa logic tải lên, phân tích và hiển thị kết quả.
  - `layout.tsx`: Định nghĩa layout chung cho toàn bộ ứng dụng, bao gồm thẻ `<html>`, `<body>`, và các provider chung như `LanguageProvider`.
  - `globals.css`: Chứa các biến màu sắc và style toàn cục của Tailwind CSS.
- `src/components/`: Chứa các component React tái sử dụng được, được phân chia thành các nhóm logic (ví dụ: `analysis-report`, `detailed-comparison`) và UI (`ui/button`, `ui/card`).
- `src/lib/`: Chứa các hàm tiện ích và logic chung, ví dụ: `i18n.ts` (quản lý đa ngôn ngữ), `utils.ts` (hàm tiện ích).
- `src/contexts/`: Chứa các React Context để quản lý trạng thái toàn cục, ví dụ: `LanguageContext`.

## 2.3. Firebase trong vai trò nền tảng xử lý và lưu trữ
*(Phần này không được áp dụng trong dự án hiện tại vì hệ thống lưu trữ dữ liệu vào `localStorage` của trình duyệt thay vì Firebase để đảm bảo tính riêng tư, tốc độ và khả năng hoạt động ngoại tuyến mà không cần kết nối máy chủ.)*

### 2.3.1. Firebase và vai trò trong dự án
*(N/A)*

### 2.3.2. Cấu trúc dữ liệu Firebase trong hệ thống
*(N/A)*

### 2.3.3. Lưu ý khi sử dụng Firebase
*(N/A)*

### 2.3.4. Kết luận
*(N/A)*

## 2.4. Tailwind CSS trong hệ thống

### 2.4.1. Tổng quan
Tailwind CSS là một framework CSS "utility-first", cung cấp các lớp CSS cấp thấp, có thể kết hợp để xây dựng bất kỳ thiết kế nào trực tiếp trong mã HTML (hoặc JSX). Thay vì viết CSS tùy chỉnh, chúng ta sử dụng các lớp có sẵn như `p-4` (padding), `flex`, `text-xl` (cỡ chữ) để tạo giao diện.

### 2.4.2. Cách Tailwind được áp dụng
Trong dự án này, Tailwind CSS được sử dụng rộng rãi trong tất cả các component. Các component từ `shadcn/ui` (như Button, Card, Table) cũng được xây dựng trên nền tảng Tailwind, cho phép tùy chỉnh giao diện một cách nhất quán. File `tailwind.config.ts` định nghĩa các tùy chỉnh về phông chữ và theme, trong khi `globals.css` chứa các biến màu HSL, giúp việc thay đổi bảng màu toàn cục trở nên dễ dàng.

### 2.4.3. Ưu điểm đối với hệ thống phát hiện đạo văn
- **Tốc độ phát triển:** Xây dựng giao diện phức tạp như bảng biểu, báo cáo, ma trận trở nên nhanh hơn rất nhiều mà không cần rời khỏi file component.
- **Tính nhất quán:** Đảm bảo một ngôn ngữ thiết kế đồng nhất trên toàn bộ ứng dụng.
- **Khả năng tùy chỉnh cao:** Dễ dàng điều chỉnh theme (màu sắc, khoảng cách, bo góc) để phù hợp với yêu cầu.
- **Tối ưu hóa hiệu suất:** Tự động loại bỏ các CSS không sử dụng trong quá trình build, giúp tệp CSS cuối cùng có dung lượng rất nhỏ.

## 2.5. Cơ sở lý thuyết về xử lý mã nguồn trong phát hiện đạo văn

### 2.5.1. Chuẩn hóa mã nguồn (Normalization)
Đây là bước tiền xử lý quan trọng đầu tiên. Mục đích là loại bỏ những yếu tố không ảnh hưởng đến logic của chương trình, giúp việc so sánh trở nên chính xác hơn. Trong hệ thống này, quá trình chuẩn hóa bao gồm:
- **Loại bỏ comment:** Các khối bình luận (`/* ... */`) và bình luận trên dòng (`// ...` hoặc `# ...`) bị xóa bỏ.
- **Loại bỏ khoảng trắng thừa:** Các dòng trống, khoảng trắng và ký tự xuống dòng thừa được loại bỏ.

### 2.5.2. Tokenization
Sau khi được chuẩn hóa, mã nguồn được phân tách thành một chuỗi các "token". Token là đơn vị cú pháp nhỏ nhất có ý nghĩa trong một ngôn ngữ lập trình. Quá trình này được thực hiện bằng biểu thức chính quy (Regex) để nhận diện:
- **Từ khóa:** `if`, `else`, `for`, `while`...
- **Bezeichner (Identifiers):** Tên biến, tên hàm (`myVar`, `calculateSum`).
- **Toán tử:** `+`, `-`, `*`, `/`, `=`, `==`, `&&`...
- **Dấu câu:** `(`, `)`, `{`, `}`, `[`, `]`, `;`, `,`...
- **Hằng số:** Số (`123`, `3.14`), chuỗi (`"hello"`).

## 2.6. Các thuật toán thường dùng trong phát hiện đạo văn

### 2.6.1. Token-based Matching
Đây là thuật toán chính được sử dụng trong dự án. Sau khi có chuỗi token từ hai tệp mã nguồn, thuật toán hoạt động như sau:
1.  **Tạo bản đồ tần suất (Frequency Map):** Đếm số lần xuất hiện của mỗi token trong mỗi tệp.
2.  **Tìm phần giao (Intersection):** Xác định các token chung xuất hiện ở cả hai tệp. Với mỗi token chung, lấy số lần xuất hiện nhỏ nhất (min-frequency). Tổng của các giá trị này là kích thước của tập giao.
3.  **Tính toán độ tương đồng:** Sử dụng công thức **Sørensen–Dice coefficient**:
    `Similarity = (2 * |Intersection|) / (|TokensA| + |TokensB|)`
    Trong đó `|Intersection|` là tổng số token chung, `|TokensA|` và `|TokensB|` là tổng số token của mỗi tệp.

### 2.6.2. LCS – Longest Common Subsequence
Thuật toán tìm chuỗi con chung dài nhất (không nhất thiết phải liên tiếp) giữa hai chuỗi token. Tỉ lệ giữa độ dài của chuỗi con chung dài nhất và độ dài của chuỗi ban đầu có thể được dùng làm thước đo sự tương đồng.

### 2.6.3. AST – Abstract Syntax Tree
Một phương pháp phức tạp hơn, trong đó mã nguồn được phân tích và chuyển thành một cấu trúc cây gọi là Cây cú pháp trừu tượng. Việc so sánh hai cây này có thể phát hiện sự tương đồng về cấu trúc logic của chương trình, ngay cả khi tên biến và thứ tự câu lệnh đã bị thay đổi.

## 2.7. Tổng kết chương
Chương này đã trình bày các nền tảng lý thuyết và công nghệ cốt lõi của dự án. Sự kết hợp giữa framework web hiện đại Next.js, triết lý utility-first của Tailwind CSS và thuật toán so sánh dựa trên token đã tạo nên một hệ thống mạnh mẽ, hiệu quả và dễ sử dụng để giải quyết bài toán phát hiện đạo văn mã nguồn.

---

# Chương 3. NỘI DUNG THỰC HIỆN

## 3.1. Tổng quan hệ thống
Ứng dụng được thiết kế như một công cụ đơn trang (Single Page Application - SPA) với toàn bộ logic xử lý diễn ra phía client (trình duyệt người dùng). Điều này giúp đảm bảo tính riêng tư (mã nguồn không được tải lên bất kỳ máy chủ nào) và tốc độ phản hồi nhanh.
**Luồng dữ liệu chính:**
1.  **Tải lên:** Người dùng chọn hoặc kéo thả một tệp `.zip`.
2.  **Giải nén:** Thư viện `JSZip` đọc và giải nén tệp ngay trên trình duyệt.
3.  **Phân tích:** Một vòng lặp kép so sánh từng cặp tệp mã nguồn.
    - Mã nguồn được làm sạch và tách token.
    - Độ tương đồng được tính toán bằng thuật toán Token-based Matching.
4.  **Hiển thị báo cáo:** Kết quả được hiển thị qua các component React, bao gồm thống kê, danh sách chi tiết, và ma trận tương đồng.
5.  **Lưu trữ:** Kết quả phân tích được lưu vào `localStorage` của trình duyệt để người dùng có thể xem lại sau này.

## 3.2. Chức năng chính của hệ thống

### 3.2.1. Nhóm cấu hình hệ thống
- `package.json`: Quản lý các gói phụ thuộc (dependencies) của dự án như `react`, `next`, `tailwindcss`, `jszip`, và các script để chạy, build, và lint dự án.
- `tailwind.config.ts`: Cấu hình cho Tailwind CSS, bao gồm theme màu sắc, phông chữ, và các plugin.
- `next.config.js`: Cấu hình cho Next.js, ví dụ như các quy tắc cho việc build và tối ưu hóa hình ảnh.

### 3.2.2. Nhóm src/app – Hệ thống route và luồng trang
- `page.tsx`: Là trang chính của ứng dụng, quản lý trạng thái của việc tải tệp, quá trình phân tích, và hiển thị kết quả hoặc lịch sử. Đây là component trung tâm điều phối toàn bộ luồng hoạt động.
- `layout.tsx`: Định nghĩa cấu trúc HTML gốc, nạp phông chữ từ Google Fonts, và bọc toàn bộ ứng dụng trong `LanguageProvider` để quản lý đa ngôn ngữ.

### 3.2.3. Nhóm src/components – Giao diện tái sử dụng
- `AnalysisReport`: Component chính hiển thị toàn bộ báo cáo sau khi phân tích, bao gồm các thẻ thống kê, và các tab cho danh sách và ma trận.
- `SimilarityMatrix`: Hiển thị ma trận so sánh chéo, với màu sắc biểu thị mức độ tương đồng.
- `DetailedList` (trong `plagiarism-report.tsx`): Hiển thị danh sách các cặp tệp được so sánh, sắp xếp theo độ tương đồng giảm dần.
- `DetailedComparison`: Màn hình so sánh chi tiết giữa hai tệp, bao gồm các tab cho mã nguồn và diễn giải văn bản.
- `AlgorithmExplanation`: Component hiển thị diễn giải chi tiết về các bước của thuật toán.
- `AssignmentUpload`: Component xử lý giao diện kéo-thả và chọn tệp.
- `HistoryList`: Component hiển thị danh sách các lần phân tích đã được lưu trong `localStorage`.

### 3.2.4. Nhóm src/lib – Logic xử lý và các hàm tiện ích
- `i18n.ts`: Chứa các chuỗi văn bản dịch thuật cho hai ngôn ngữ Anh và Việt.
- `utils.ts`: Chứa hàm `cn` để kết hợp các class của Tailwind CSS một cách có điều kiện.
- `types/plagiarism.ts`: Định nghĩa các kiểu dữ liệu TypeScript cho kết quả phân tích, giúp mã nguồn chặt chẽ và dễ hiểu hơn.

### 3.2.5. Nhóm styles – Quản lý định dạng giao diện
- `src/app/globals.css`: File CSS toàn cục. Nó chứa các chỉ thị `@tailwind` và định nghĩa các biến màu CSS (dưới dạng HSL) cho cả theme sáng và tối. Toàn bộ hệ thống màu sắc của ứng dụng được quản lý tại đây.

### 3.2.6. Nhóm docs – Tài liệu đính kèm
- `README.md`: Hướng dẫn cơ bản về dự án.
- `USECASE.md`: Sơ đồ và mô tả các trường hợp sử dụng của hệ thống.
- `REPORT.md`: Chính là tệp báo cáo này.
- `TESTING.md`: Quy trình và các trường hợp kiểm thử cho ứng dụng.

### 3.2.7. Nhóm .next – Kết quả build
Đây là thư mục được Next.js tự động tạo ra trong quá trình phát triển (`dev`) và build sản phẩm (`build`). Nó chứa các kết quả đã được tối ưu hóa và không nên được chỉnh sửa thủ công.

### 3.2.8. Tổng hợp vai trò từng phần
| Phần | Vai trò |
| :--- | :--- |
| `src/app` | Định tuyến và các trang chính của ứng dụng |
| `src/components` | Các khối giao diện người dùng tái sử dụng |
| `src/lib` | Các hàm tiện ích, định nghĩa kiểu, và dữ liệu tĩnh |
| `src/contexts` | Quản lý trạng thái toàn cục (ngôn ngữ) |
| `package.json` | Quản lý gói phụ thuộc và script |
| `tailwind.config.ts` | Cấu hình Tailwind CSS |

## 3.3. Phân tích luồng hoạt động của hệ thống

### 3.3.1. Người dùng truy cập giao diện
Khi người dùng mở ứng dụng, Next.js sẽ render `layout.tsx` và `page.tsx`. Trang chủ (`page.tsx`) sẽ được hiển thị.

### 3.3.2. Hệ thống đọc dữ liệu từ Local Storage
Ngay khi component `Home` (`page.tsx`) được mount, một `useEffect` hook sẽ được kích hoạt để đọc chuỗi JSON từ khóa `plagiarismHistory` trong `localStorage`. Nếu có dữ liệu, nó sẽ được parse và lưu vào state `history`, sau đó component `HistoryList` sẽ hiển thị danh sách này.

### 3.3.3. Hiển thị nội dung qua component
Dữ liệu (kết quả phân tích hoặc lịch sử) được lưu trong state của `page.tsx`. Dựa trên trạng thái hiện tại (đang chờ tải tệp, đang phân tích, hay đang xem báo cáo), các props sẽ được truyền xuống các component con (`AssignmentUpload`, `AnalysisReport`, `HistoryList`) để render giao diện phù hợp.

### 3.3.4. Người dùng chuyển trang
Về bản chất, đây là một ứng dụng đơn trang. Việc "chuyển trang" (ví dụ, từ màn hình chính sang màn hình báo cáo, hay sang màn hình so sánh chi tiết) thực chất là sự thay đổi trạng thái bên trong component `page.tsx` và `AnalysisReport.tsx`. Các component sẽ render lại dựa trên trạng thái mới, tạo ra cảm giác chuyển trang mà không cần tải lại toàn bộ trang web.

## 3.4. Các trang (views) chính

### 3.4.1. Trang chủ (Home Page)
Giao diện chính khi người dùng truy cập. Bao gồm khu vực tải tệp (`AssignmentUpload`) và danh sách lịch sử phân tích (`HistoryList`).

### 3.4.2. Trang báo cáo (Report View)
Được hiển thị sau khi quá trình phân tích hoàn tất. Trang này do `AnalysisReport` quản lý, bao gồm các thẻ thống kê, và hai tab chính là "Danh sách chi tiết" (`DetailedList`) và "Ma trận tương đồng" (`SimilarityMatrix`).

### 3.4.3. Trang so sánh chi tiết (Detailed View)
Được hiển thị khi người dùng nhấp vào "Xem chi tiết" từ trang báo cáo. Giao diện này do `DetailedComparison` quản lý, cung cấp hai tab: so sánh mã nguồn song song và diễn giải thuật toán bằng văn bản.

## 3.5. Phân tích hoạt động xử lý tệp .zip
*(Phần này thay cho Firebase)*

### 3.5.1. Khởi tạo JSZip
Khi người dùng chọn một tệp `.zip`, sự kiện `onChange` trên thẻ input sẽ kích hoạt hàm `handleFileChange`. Sau đó, khi người dùng nhấn "Phân tích", hàm `handleAnalysis` sẽ gọi `JSZip.loadAsync(file)` để bắt đầu đọc tệp nén trong bộ nhớ.

### 3.5.2. Đọc và xử lý tệp
Hàm `handleAnalysis` lặp qua từng tệp bên trong đối tượng zip (`zip.files`). Với mỗi cặp tệp, nó thực hiện các bước sau:
1.  Đọc nội dung tệp dưới dạng chuỗi ký tự.
2.  Gọi các hàm `cleanCode`, `tokenize`, `createTokenMap`.
3.  Tính toán độ tương đồng.
4.  Lưu kết quả so sánh vào một mảng.
5.  Cập nhật thanh tiến trình (progress bar).
Cuối cùng, mảng kết quả được sắp xếp, tổng hợp và lưu vào state để hiển thị cho người dùng, đồng thời được lưu vào `localStorage`.

## 3.6. Tổng kết chương
Chương này đã đi sâu vào việc triển khai thực tế của hệ thống. Từ kiến trúc tổng quan, vai trò của từng thành phần mã nguồn, cho đến luồng hoạt động chi tiết của các chức năng chính. Hệ thống được xây dựng hoàn toàn phía client, sử dụng các thư viện JavaScript mạnh mẽ để mang lại trải nghiệm người dùng nhanh chóng, riêng tư và hiệu quả.

---

# Chương 4. ĐẠO VĂN MÃ NGUỒN: NHÌN NHẬN TOÀN CẦU

## 4.1. Khái niệm và bản chất đạo văn mã nguồn
Đạo văn mã nguồn là hành vi sử dụng, sao chép, hoặc trình bày mã nguồn của người khác như là của mình mà không có sự cho phép hoặc ghi nhận tác giả một cách phù hợp. Các hình thức đạo văn bao gồm:
- **Sao chép trực tiếp:** Copy-paste toàn bộ hoặc một phần lớn mã nguồn.
- **Sao chép có chỉnh sửa:** Thay đổi tên biến, tên hàm, định dạng lại mã nguồn hoặc thêm các comment giả để che giấu.
- **Sao chép logic:** Viết lại thuật toán hoặc logic của người khác bằng cách diễn đạt khác nhưng vẫn giữ nguyên cấu trúc và ý tưởng cốt lõi.
- **Sử dụng lại mã nguồn không phép:** Sử dụng các thư viện hoặc đoạn mã có bản quyền mà không tuân thủ giấy phép.

## 4.2. Xu hướng đạo văn mã nguồn quốc tế
Trên thế giới, vấn đề đạo văn mã nguồn ngày càng trở nên nghiêm trọng, đặc biệt với sự bùng nổ của các khóa học online (MOOCs) và các kho mã nguồn mở như GitHub. Nhiều nghiên cứu đã chỉ ra rằng một tỉ lệ đáng kể sinh viên trong các ngành khoa học máy tính đã từng thực hiện hành vi này ở một mức độ nào đó. Các trường đại học lớn đã và đang phải đầu tư vào các công cụ phát hiện đạo văn chuyên dụng và xây dựng các chính sách liêm chính học thuật chặt chẽ hơn.

## 4.3. Nguyên nhân toàn cầu dẫn đến đạo văn mã nguồn
- **Áp lực học tập và thời gian:** Sinh viên đối mặt với khối lượng bài tập lớn và thời hạn gấp rút.
- **Sự phổ biến của mã nguồn mở:** Việc tìm thấy lời giải hoặc mã nguồn tương tự trên Internet (GitHub, Stack Overflow) quá dễ dàng.
- **Sự phát triển của AI:** Các công cụ như GitHub Copilot hay ChatGPT có thể tạo ra mã nguồn hoàn chỉnh chỉ từ một vài mô tả, tạo ra một hình thức đạo văn mới khó phát hiện hơn.
- **Thiếu hiểu biết:** Một số sinh viên không nhận thức rõ ràng về ranh giới giữa việc "tham khảo" và "đạo văn".

## 4.4. Tác động học thuật và khoa học
Đạo văn mã nguồn làm xói mòn giá trị của việc học tập, biến việc giải bài tập thành một cuộc đối phó thay vì một quá trình rèn luyện tư duy. Về lâu dài, nó tạo ra một thế hệ lập trình viên thiếu kỹ năng giải quyết vấn đề từ gốc rễ, ảnh hưởng đến chất lượng nguồn nhân lực của ngành công nghệ. Trong nghiên cứu khoa học, đạo văn có thể dẫn đến những hậu quả nghiêm trọng hơn, làm mất uy tín của nhà nghiên cứu và các công trình khoa học.

---

# Chương 5. TỔNG QUAN VỀ ĐẠO VĂN MÃ NGUỒN TRONG VÀ NGOÀI NƯỚC

## 5.1. Khái quát vấn đề đạo văn mã nguồn
Đạo văn mã nguồn là một hiện tượng phổ biến trong giáo dục lập trình toàn cầu. Nó không chỉ là một vấn đề về gian lận thi cử mà còn phản ánh những thách thức trong phương pháp giảng dạy, áp lực học tập và sự thay đổi của công nghệ. Việc đối phó với vấn đề này đòi hỏi một cách tiếp cận đa chiều, từ công nghệ, chính sách cho đến giáo dục nhận thức.

## 5.2. Tình hình đạo văn mã nguồn trên thế giới
Nhiều quốc gia có nền giáo dục tiên tiến đã sớm nhận ra vấn đề và có những hành động quyết liệt. Các trường đại học thường có các "Bộ quy tắc danh dự" (Honor Code) rất nghiêm ngặt. Họ sử dụng các công cụ thương mại như Turnitin hoặc các hệ thống mã nguồn mở nổi tiếng như MOSS (Measure of Software Similarity) của Đại học Stanford. Nhận thức về liêm chính học thuật được coi là một phần quan trọng trong chương trình đào tạo.

## 5.3. Tình hình đạo văn mã nguồn trong nước
Tại Việt Nam, vấn đề đạo văn mã nguồn cũng rất phổ biến nhưng có thể chưa được quan tâm đúng mức. Việc kiểm tra vẫn còn phụ thuộc nhiều vào kinh nghiệm và sự tận tâm của từng giảng viên. Các công cụ tự động chưa được áp dụng rộng rãi, một phần vì chi phí, một phần vì rào cản ngôn ngữ và kỹ thuật. Nhận thức của sinh viên về bản quyền và liêm chính học thuật đôi khi còn hạn chế.

## 5.4. Nhận xét chung
Sự khác biệt chính giữa bối cảnh trong và ngoài nước nằm ở mức độ đầu tư vào công cụ và tính hệ thống của các chính sách. Trong khi các nước phát triển xem đây là một vấn đề cần giải quyết bằng cả công nghệ và quy chế, thì ở Việt Nam, nó vẫn còn được xem là một "cuộc chiến" thầm lặng của các giảng viên. Tuy nhiên, với sự phát triển của ngành CNTT, nhu cầu về một giải pháp hiệu quả và dễ tiếp cận tại Việt Nam là rất lớn.

---

# Chương 6. CÔNG CỤ VÀ PHƯƠNG PHÁP PHÁT HIỆN ĐẠO VĂN MÃ NGUỒN

## 6.1. Phương pháp kỹ thuật
- **So sánh dựa trên thuộc tính (Attribute-based):** So sánh các chỉ số thống kê của mã nguồn, ví dụ như số dòng code, số lượng toán tử, độ phức tạp Cyclomatic. Phương pháp này nhanh nhưng dễ bị "đánh lừa".
- **So sánh dựa trên cấu trúc (Structure-based):** Đây là nhóm phương pháp phổ biến nhất, bao gồm cả Token-based matching (như trong dự án này), so sánh cây cú pháp trừu tượng (AST), và so sánh đồ thị phụ thuộc chương trình (PDG). Các phương pháp này có độ chính xác cao hơn vì chúng phân tích cấu trúc của chương trình.
- **So sánh ngữ nghĩa (Semantic-based):** Phương pháp tiên tiến nhất, cố gắng hiểu "ý nghĩa" và hành vi của chương trình. Ví dụ, nó có thể phát hiện hai chương trình là tương đương ngay cả khi chúng sử dụng hai thuật toán sắp xếp khác nhau để đạt cùng một mục tiêu. Phương pháp này rất phức tạp và đòi hỏi nhiều tài nguyên tính toán.

## 6.2. Công cụ phát hiện đạo văn
- **MOSS (Measure of Software Similarity):** Một trong những công cụ nổi tiếng và hiệu quả nhất, được sử dụng rộng rãi trong giới học thuật. Nó hoạt động dựa trên thuật toán so khớp k-gram và miễn phí cho mục đích giáo dục.
- **JPlag:** Một công cụ mạnh mẽ khác, hỗ trợ nhiều ngôn ngữ và sử dụng phương pháp so sánh dựa trên token. Nó cung cấp giao diện web để xem kết quả chi tiết.
- **Turnitin:** Một dịch vụ thương mại rất phổ biến, chủ yếu dùng để phát hiện đạo văn trong các bài luận, nhưng cũng có các mô-đun để kiểm tra mã nguồn.

## 6.3. Giới hạn
Không có công cụ nào là hoàn hảo. Các hạn chế chung bao gồm:
- **Dương tính giả (False Positives):** Hệ thống có thể báo động nhầm với các đoạn mã mẫu do giảng viên cung cấp hoặc các thư viện chuẩn.
- **Âm tính giả (False Negatives):** Các kỹ thuật che giấu tinh vi (ví dụ: thay đổi logic, sử dụng các cấu trúc ngôn ngữ khác nhau để làm cùng một việc) có thể qua mặt được các thuật toán so sánh dựa trên cấu trúc.
- **Khó phát hiện đạo văn ý tưởng:** Nếu một sinh viên chỉ lấy "ý tưởng" thuật toán và tự viết lại hoàn toàn, hầu hết các công cụ sẽ không thể phát hiện được.

---

# Chương 7. GIẢI PHÁP TRIỂN KHAI HỆ THỐNG PHÁT HIỆN ĐẠO VĂN

## 7.1. Giải pháp về chính sách và quy trình học thuật
- **Quy định rõ ràng:** Các trường học cần có những quy định cụ thể về liêm chính học thuật, định nghĩa rõ ràng thế nào là đạo văn và các hình thức xử lý tương ứng.
- **Giáo dục nhận thức:** Tổ chức các buổi nói chuyện, hội thảo để nâng cao nhận thức của sinh viên về tầm quan trọng của tính trung thực và cách trích dẫn nguồn đúng cách.
- **Thiết kế bài tập sáng tạo:** Đưa ra các đề bài mở, yêu cầu sự sáng tạo cá nhân cao để hạn chế khả năng sao chép lời giải có sẵn.

## 7.2. Giải pháp kỹ thuật cho hệ thống phát hiện đạo văn
- **Kết hợp nhiều thuật toán:** Một hệ thống lý tưởng có thể kết hợp cả so sánh dựa trên token và so sánh dựa trên cây cú pháp (AST) để tăng độ chính xác.
- **Cải thiện giao diện người dùng:** Cung cấp các công cụ lọc và phân loại kết quả mạnh mẽ hơn, và trực quan hóa dữ liệu một cách thông minh để giúp giảng viên nhanh chóng xác định các trường hợp đáng ngờ nhất.
- **Hỗ trợ tệp mẫu (Boilerplate Code):** Cho phép giảng viên tải lên một tệp mã nguồn mẫu. Hệ thống sẽ bỏ qua sự tương đồng giữa bài nộp của sinh viên và tệp mẫu này.

## 7.3. Giải pháp đối phó với mã nguồn sinh bởi AI
Đây là một thách thức lớn và mới. Các hướng tiếp cận có thể bao gồm:
- **Phát hiện mã nguồn do AI tạo ra:** Phát triển các mô hình AI khác để học cách nhận diện "văn phong" hoặc các mẫu đặc trưng của mã nguồn do máy tạo ra.
- **Thay đổi cách đánh giá:** Thay vì chỉ chấm điểm dựa trên mã nguồn cuối cùng, có thể yêu cầu sinh viên trình bày, giải thích về mã nguồn của mình, hoặc theo dõi quá trình viết mã qua các commit trên Git.
- **Chấp nhận và tích hợp:** Coi các công cụ AI như một trợ lý lập trình (như máy tính cầm tay trong môn toán) và thay đổi yêu cầu của bài tập để tập trung vào các kỹ năng ở cấp độ cao hơn như thiết kế hệ thống, phân tích yêu cầu, và kiểm thử.

---

# Chương 8. KẾT LUẬN

## 8.1. Kết luận tổng hợp
Đề tài đã hoàn thành mục tiêu đề ra là xây dựng thành công một hệ thống phát hiện đạo văn mã nguồn hoàn chỉnh dưới dạng một ứng dụng web. Hệ thống có giao diện thân thiện, hiện đại, hỗ trợ đa ngôn ngữ và cung cấp một bộ công cụ phân tích và báo cáo trực quan. Bằng cách áp dụng thuật toán so sánh dựa trên token và xử lý toàn bộ trên trình duyệt của người dùng, ứng dụng đã giải quyết được các yêu cầu cốt lõi về hiệu quả, tính minh bạch và bảo mật dữ liệu.

## 8.2. Hạn chế và rủi ro của hệ thống
- **Độ chính xác của thuật toán:** Thuật toán token-based có thể không phát hiện được các trường hợp đạo văn tinh vi về mặt logic. Nó cũng có thể nhầm lẫn với các đoạn code giống nhau do yêu cầu của đề bài.
- **Hiệu năng với dữ liệu lớn:** Vì toàn bộ quá trình giải nén và phân tích được thực hiện trên trình duyệt, hệ thống có thể hoạt động chậm hoặc gặp sự cố nếu tệp `.zip` chứa số lượng tệp quá lớn (hàng trăm tệp) hoặc các tệp có dung lượng quá cao.
- **Giới hạn về ngôn ngữ:** Mặc dù tokenizer được thiết kế chung, nó có thể không hoạt động tối ưu với các ngôn ngữ có cú pháp quá khác biệt mà không có sự tinh chỉnh.

## 8.3. Định hướng phát triển tiếp theo
- **Hỗ trợ thêm thuật toán:** Tích hợp thêm phương pháp so sánh dựa trên Cây cú pháp trừu tượng (AST) để tăng cường khả năng phát hiện đạo văn cấu trúc.
- **Cải thiện hiệu năng:** Nghiên cứu sử dụng Web Workers để chạy quá trình phân tích trong một luồng riêng biệt, tránh làm "đơ" giao diện người dùng khi xử lý dữ liệu lớn.
- **Triển khai trên nền tảng đám mây:** Xây dựng một phiên bản có máy chủ backend (ví dụ: sử dụng Firebase Functions) để xử lý các tác vụ nặng, cho phép phân tích các bộ dữ liệu lớn hơn.
- **Tính năng loại trừ mã nguồn mẫu:** Cho phép giảng viên cung cấp mã nguồn mẫu để hệ thống bỏ qua khi so sánh.
- **Tích hợp AI:** Sử dụng các mô hình ngôn ngữ lớn để diễn giải sự tương đồng và phát hiện các trường hợp đạo văn logic.

## 8.4. Tự đánh giá
Đề tài đã được hoàn thành ở mức độ tốt, đáp ứng đầy đủ các yêu cầu và mục tiêu đã đề ra. Các chức năng từ cơ bản đến nâng cao đều được triển khai một cách chỉn chu. Mã nguồn được tổ chức sạch sẽ, tuân thủ các chuẩn hiện đại của phát triển web. Tuy nhiên, vẫn còn những hạn chế về mặt thuật toán và hiệu năng có thể được cải thiện trong tương lai.

## 8.5. Kết luận cuối cùng
Hệ thống phát hiện đạo văn mã nguồn được xây dựng trong đề tài này là một công cụ mạnh mẽ và hữu ích, có khả năng ứng dụng thực tế cao trong môi trường giáo dục. Nó không chỉ là một sản phẩm phần mềm mà còn là một minh chứng cho việc áp dụng các công nghệ web hiện đại để giải quyết những bài toán có ý nghĩa trong thực tiễn. Dự án mở ra nhiều hướng phát triển tiềm năng để trở thành một giải pháp toàn diện hơn trong tương lai.
