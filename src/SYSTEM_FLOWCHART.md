# Sơ đồ hoạt động hệ thống (Mermaid)

Bạn có thể sao chép đoạn mã bên dưới và nhập vào công cụ draw.io (diagrams.net) để tạo và chỉnh sửa sơ đồ một cách trực quan.

1.  Sao chép toàn bộ nội dung trong khối mã bên dưới.
2.  Truy cập [https://app.diagrams.net/](https://app.diagrams.net/).
3.  Đi tới menu: **Arrange** > **Insert** > **Advanced** > **Mermaid...** (Hoặc **Sắp xếp** > **Chèn** > **Nâng cao** > **Mermaid...**).
4.  Dán nội dung bạn đã sao chép vào hộp thoại.
5.  Nhấn **Insert**. Sơ đồ sẽ được tự động vẽ ra.

```mermaid
graph LR
    A[Người dùng truy cập trang] --> B{Đã tải tệp lên?};
    B -- Chưa --> A;
    
    B -- Rồi --> C[Nhấn nút 'Phân tích'];
    C --> D{Tệp hợp lệ và có >= 2 file?};
    D -- Không --> E[Thông báo lỗi];
    E --> Z[Kết thúc];
    
    D -- Có --> F[Bắt đầu giải nén & chuẩn bị];
    F --> G(Bắt đầu vòng lặp so sánh);
    G --> H{Còn cặp tệp nào chưa so sánh?};
    
    H -- Không --> L[Tổng hợp và sắp xếp kết quả];
    L --> M[Lưu vào Local Storage];
    M --> N[Hiển thị báo cáo trên giao diện];
    N --> Z;
    
    H -- Có --> I[Lấy cặp tệp tiếp theo];
    I --> J[Clean code, Tokenize, Tính toán tương đồng];
    J --> G;

```