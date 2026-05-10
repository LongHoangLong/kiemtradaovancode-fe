# Sơ Đồ Use Case - Hệ Thống Kiểm Tra Đạo Văn Code

Tài liệu này mô tả các trường hợp sử dụng (Use Case) chính của hệ thống, thể hiện sự tương tác giữa người dùng (Giảng viên) và các chức năng của ứng dụng.

## Hướng dẫn sử dụng với Draw.io (Diagrams.net)

Đoạn mã bên dưới được viết bằng cú pháp **Mermaid**. Bạn có thể nhập trực tiếp vào công cụ draw.io để tạo và chỉnh sửa sơ đồ một cách trực quan.

1.  Sao chép toàn bộ nội dung trong khối mã bên dưới.
2.  Truy cập [https://app.diagrams.net/](https://app.diagrams.net/).
3.  Đi tới menu: **Arrange** > **Insert** > **Advanced** > **Mermaid...** (Hoặc **Sắp xếp** > **Chèn** > **Nâng cao** > **Mermaid...**).
4.  Dán nội dung bạn đã sao chép vào hộp thoại.
5.  Nhấn **Insert**. Sơ đồ sẽ được tự động vẽ ra.

## Mã nguồn sơ đồ Mermaid

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
            UC4_3("Xem mô phỏng thuật toán")
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
    UC4 -- "<<include>>" --> UC4_3

    Actor --- UC5
    UC5 -- "<<include>>" --> UC5_1
    UC5 -- "<<include>>" --> UC5_2
    UC5 -- "<<include>>" --> UC5_3
    
    Actor --- UC6
    
    style Actor fill:#f9f,stroke:#333,stroke-width:2px
```
