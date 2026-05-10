# Sơ Đồ Use Case - Hệ Thống Kiểm Tra Đạo Văn Code

Tài liệu này mô tả các trường hợp sử dụng (Use Case) chính của hệ thống, thể hiện sự tương tác giữa người dùng (Giảng viên) và các chức năng của ứng dụng.

## Hướng dẫn sử dụng với Draw.io (Diagrams.net)

Đoạn mã bên dưới được viết bằng cú pháp **Mermaid**. Bạn có thể nhập trực tiếp vào công cụ draw.io để tạo và chỉnh sửa sơ đồ một cách trực quan.

1.  Sao chép toàn bộ nội dung trong khối mã bên dưới.
2.  Truy cập [https://app.diagrams.net/](https://app.diagrams.net/).
3.  Đi tới menu: **Arrange** > **Insert** > **Advanced** > **Mermaid...** (Hoặc **Sắp xếp** > **Chèn** > **Nâng cao** > **Mermaid...**).
4.  Dán nội dung bạn đã sao chép vào hộp thoại.
5.  Nhấn **Insert**. Sơ đồ sẽ được tự động vẽ ra.

## Sơ Đồ

```mermaid
graph TD
    subgraph "Hệ Thống Kiểm Tra Đạo Văn"
        UC1("Tải lên tệp bài tập (.zip)")
        UC2("Phân tích đạo văn")
        UC3("Xem báo cáo phân tích")
        UC4("Xem so sánh chi tiết")
        UC5("Quản lý lịch sử")
        UC6("Thay đổi ngôn ngữ")

        subgraph "Chức năng báo cáo"
            UC3_1("Xem tổng quan")
            UC3_2("Xem danh sách chi tiết")
            UC3_3("Xem ma trận tương đồng")
            UC3_4("Lọc kết quả")
        end
        
        subgraph "Chức năng so sánh chi tiết"
            UC4_1("Xem mã nguồn song song")
            UC4_2("Xem diễn giải thuật toán")
        end

        subgraph "Chức năng lịch sử"
            UC5_1("Xem lại báo cáo cũ")
            UC5_2("Xóa một mục lịch sử")
            UC5_3("Xóa toàn bộ lịch sử")
        end
    end

    Actor("Giảng viên")

    Actor -- "1. Tải tệp" --> UC1
    UC1 -- "2. Bắt đầu" --> UC2
    UC2 -- "3. Hiển thị" --> UC3
    
    UC3 -- "<<include>>" --> UC3_1
    UC3 -- "<<include>>" --> UC3_2
    UC3 -- "<<include>>" --> UC3_3
    UC3 -- "<<include>>" --> UC3_4

    UC3_2 -- "<<extend>>" --> UC4
    UC3_3 -- "<<extend>>" --> UC4
    
    UC4 -- "<<include>>" --> UC4_1
    UC4 -- "<<include>>" --> UC4_2

    Actor --- UC5
    UC5 -- "<<include>>" --> UC5_1
    UC5 -- "<<include>>" --> UC5_2
    UC5 -- "<<include>>" --> UC5_3
    
    Actor --- UC6
    
    style Actor fill:#f9f,stroke:#333,stroke-width:2px
```

## Mô Tả Chi Tiết

### 1. Tác nhân (Actor)

*   **Giảng viên**: Người dùng chính của hệ thống, thực hiện việc tải lên, phân tích và xem kết quả đạo văn.

### 2. Các Use Case

| ID | Use Case | Mô Tả |
| :--- | :--- | :--- |
| **UC1** | Tải lên tệp bài tập | Giảng viên chọn và tải lên một tệp nén (`.zip`, `.rar`) chứa các tệp mã nguồn của sinh viên. |
| **UC2** | Phân tích đạo văn | Sau khi tệp được tải lên, giảng viên yêu cầu hệ thống bắt đầu quá trình so sánh và phân tích đạo văn giữa các tệp. |
| **UC3** | Xem báo cáo phân tích | Hệ thống hiển thị một báo cáo tổng quan sau khi phân tích xong. Bao gồm: <br> - **UC3.1**: Thống kê tổng quan (tổng số bài, số cặp nghi ngờ). <br> - **UC3.2**: Danh sách chi tiết các cặp tệp được so sánh cùng độ tương đồng. <br> - **UC3.3**: Ma trận tương đồng trực quan. <br> - **UC3.4**: Chức năng lọc kết quả theo ngưỡng tương đồng. |
| **UC4** | Xem so sánh chi tiết | Từ danh sách hoặc ma trận, giảng viên có thể chọn một cặp tệp cụ thể để xem so sánh sâu hơn. Bao gồm: <br> - **UC4.1**: So sánh mã nguồn song song. <br> - **UC4.2**: Đọc diễn giải chi tiết về các bước của thuật toán. |
| **UC5** | Quản lý lịch sử | Giảng viên có thể quản lý lịch sử các lần phân tích đã thực hiện. Bao gồm: <br> - **UC5.1**: Mở lại một báo cáo đã phân tích trước đây. <br> - **UC5.2**: Xóa một mục cụ thể khỏi lịch sử. <br> - **UC5.3**: Xóa toàn bộ lịch sử phân tích. |
| **UC6** | Thay đổi ngôn ngữ | Giảng viên có thể chuyển đổi giao diện giữa Tiếng Việt và Tiếng Anh. |
