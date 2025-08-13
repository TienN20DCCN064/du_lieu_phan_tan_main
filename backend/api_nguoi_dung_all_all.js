
const express = require("express");
const mysql = require("mysql2");    // kết nối trực tiếp với mysql
const cors = require("cors");   // cho phép các tài nguyên được tải từ một tên miền khác với tên miền mà trang web đang chạy
const jwt = require("jsonwebtoken");
const moment = require("moment");
const bcrypt = require('bcrypt');

const axios = require("axios");

require("dotenv").config(); // Đọc biến môi trường từ .env

const app = express();       // tạo 1 ứng dụng express
const port = 4000;           // api chạy trên cổng
app.use(cors());

app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ql_nguoi_dung_all_all",
});
// Danh sách API cho 3 miền
const API_SERVERS = [
    { value: "BAC", name: "Miền Bắc", url: "http://localhost:4001" },
    { value: "TRUNG", name: "Miền Trung", url: "http://localhost:4002" },
    { value: "NAM", name: "Miền Nam", url: "http://localhost:4003" }
];

// Kiểm tra kết nối
db.connect((err) => {
    if (err) {
        console.error("Không thể kết nối cơ sở dữ liệu:", err);
        return;
    }
    console.log("Kết nối cơ sở dữ liệu thành công!");
});

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token không được cung cấp" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

        req.user = user;
        next();
    });
}
const tables_not_token = {

    // "nguoi_dung": ["ma_nguoi_dung"],                        // Người dùng
    // "tai_khoan": ["ma_nguoi_dung"],                         // Tài khoản (dùng chung mã người dùng)


    //"truong": ["ma_truong"],                                // Trường học
    "vai_tro": ["ma_vai_tro"],                              // Vai trò người dùng
    "nguoi_dung_toan_quoc": ["ma_nguoi_dung"],                        // Người dùng
    "doi_bong": ["ma_doi_bong"],                            // Đội bóng
    "vi_tri_cau_thu": ["ma_vi_tri"],                        // Vị trí cầu thủ
    "cau_thu": ["ma_cau_thu"],                              // Cầu thủ

    "loai_trong_tai": ["ma_loai_trong_tai"],                // Loại trọng tài
    "trong_tai": ["ma_trong_tai"],                          // Trọng tài

    "giai_dau": ["ma_giai_dau"],                            // Giải đấu
    "cau_hinh_giai_dau": ["ma_giai_dau"],                   // Cấu hình giải đấu
    "vong_dau": ["ma_vong_dau"],                            // Vòng đấu (đã chuyển sang dùng mã vòng đấu làm PK)
    "bang_dau": ["ma_bang_dau"],                            // Bảng đấu (đã chuyển sang dùng mã bảng đấu làm PK)
    "san_van_dong": ["ma_san"],                             // Sân vận động

    "doi_bong_giai_dau": ["ma_doi_bong", "ma_giai_dau"],    // Đội bóng tham gia giải
    "cau_thu_giai_dau": ["ma_cau_thu", "ma_giai_dau"],      // Cầu thủ tham gia giải
    "trong_tai_tran_dau": ["ma_tran_dau", "ma_trong_tai"],  // Phân công trọng tài trận

    "tran_dau": ["ma_tran_dau"],                            // Trận đấu
    "su_kien_tran_dau": ["ma_su_kien"],                     // Sự kiện trận đấu

    "bang_xep_hang_vong_dau": ["ma_giai_dau", "ma_vong_dau", "ma_doi_bong"], // BXH vòng đấu
    "quy_tac_tinh_diem": ["ma_giai_dau", "ma_vong_dau"],    // Quy tắc tính điểm
    "cau_hinh_giao_dien": ["ma_cau_hinh_giao_dien"],                // Cấu hình giao diện người dùng
    "yeu_cau_tao_giai_dau": ["ma_yeu_cau"],
};

// get : /api/{name_table}/{id_tbale}

const tables = {

    // "nguoi_dung": ["ma_nguoi_dung"],                        // Người dùng
    // "tai_khoan": ["ma_nguoi_dung"],                         // Tài khoản (dùng chung mã người dùng)


    //"truong": ["ma_truong"],                                // Trường học
    "vai_tro": ["ma_vai_tro"],                              // Vai trò người dùng
    "nguoi_dung_toan_quoc": ["ma_nguoi_dung"],                        // Người dùng
    "doi_bong": ["ma_doi_bong"],                            // Đội bóng
    "vi_tri_cau_thu": ["ma_vi_tri"],                        // Vị trí cầu thủ
    "cau_thu": ["ma_cau_thu"],                              // Cầu thủ

    "loai_trong_tai": ["ma_loai_trong_tai"],                // Loại trọng tài
    "trong_tai": ["ma_trong_tai"],                          // Trọng tài

    "giai_dau": ["ma_giai_dau"],                            // Giải đấu
    "cau_hinh_giai_dau": ["ma_giai_dau"],                   // Cấu hình giải đấu
    "vong_dau": ["ma_vong_dau"],                            // Vòng đấu (đã chuyển sang dùng mã vòng đấu làm PK)
    "bang_dau": ["ma_bang_dau"],                            // Bảng đấu (đã chuyển sang dùng mã bảng đấu làm PK)
    "san_van_dong": ["ma_san"],                             // Sân vận động

    "doi_bong_giai_dau": ["ma_doi_bong", "ma_giai_dau"],    // Đội bóng tham gia giải
    "cau_thu_giai_dau": ["ma_cau_thu", "ma_giai_dau"],      // Cầu thủ tham gia giải
    "trong_tai_tran_dau": ["ma_tran_dau", "ma_trong_tai"],  // Phân công trọng tài trận

    "tran_dau": ["ma_tran_dau"],                            // Trận đấu
    "su_kien_tran_dau": ["ma_su_kien"],                     // Sự kiện trận đấu

    "bang_xep_hang_vong_dau": ["ma_giai_dau", "ma_vong_dau", "ma_doi_bong"], // BXH vòng đấu
    "quy_tac_tinh_diem": ["ma_giai_dau", "ma_vong_dau"],    // Quy tắc tính điểm
    "cau_hinh_giao_dien": ["ma_cau_hinh_giao_dien"],                // Cấu hình giao diện người dùng
    "yeu_cau_tao_giai_dau": ["ma_yeu_cau"],
};

const tables_phanTan = {
    "nguoi_dung": ["ma_nguoi_dung"],                        // Người dùng
    "tai_khoan": ["ma_nguoi_dung"],
}




//////////////////////////////////// PHÂN TÁN  /////////////////////////////////// PHÂN TÁN/////////////////////////////////// PHÂN TÁN

// 🔹 Hàm kiểm tra API nào đang hoạt động
async function kiemTraApiPhu() {
    let results = [];

    for (let server of API_SERVERS) {
        try {
            const pingRes = await axios.get(`${server.url}/api/ping`, { timeout: 2000 });
            results.push({
                name: server.name,
                value: server.value,
                url: server.url,
                status: "Đang chạy",
                pingData: pingRes.data
            });
        } catch (err) {
            results.push({
                name: server.name,
                url: server.url,
                status: "Không chạy được"
            });
        }
    }

    return results;
}

// 🔹 API kiểm tra trạng thái các API phụ
app.get("/api/kiem-tra-api-phu", async (req, res) => {
    const results = await kiemTraApiPhu();
    res.json(results);
});
// 🔹 API đăng nhập chỉ trả về API thành công đầu tiên
app.post("/api/dang-nhap", async (req, res) => {
    const { ten_dang_nhap, mat_khau } = req.body;

    if (!ten_dang_nhap || !mat_khau) {
        return res.status(400).json({ message: "Thiếu tên đăng nhập hoặc mật khẩu" });
    }

    // Lấy danh sách API đang chạy
    const results = await kiemTraApiPhu();
    const apisOnline = results.filter(api => api.status === "Đang chạy");

    if (apisOnline.length === 0) {
        return res.status(503).json({ message: "Không có API nào đang hoạt động" });
    }

    // Duyệt từng API cho đến khi đăng nhập thành công
    for (let api of apisOnline) {
        try {
            const response = await axios.post(`${api.url}/api/dang-nhap`, {
                ten_dang_nhap,
                mat_khau
            });

            const user = response.data;
            const token = jwt.sign(
                { ma_nguoi_dung: user.ma_nguoi_dung },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // Nếu thành công → trả kết quả và dừng
            return res.json({
                message: "Đăng nhập thành công",
                token,
                api_name: api.name,
                api_url: api.url,
                data: response.data
            });
        } catch (err) {
            // Bỏ qua nếu thất bại, thử API tiếp theo
            continue;
        }
    }

    // Nếu tất cả API đều thất bại
    return res.status(401).json({ message: "Đăng nhập thất bại trên tất cả API" });
});

Object.entries(tables_phanTan).forEach(([table, keys]) => {
    // ===== GET một bản ghi theo khóa chính =====
    const idParams = keys.map((_, i) => `id${i + 1}`).join("/:");
    // GET - Lấy tất cả dữ liệu từ các API phụ
    app.get(`/api/${table}`, async (req, res) => {
        try {
            // Lấy danh sách API phụ đang chạy
            const apiList = await kiemTraApiPhu();
            const apisOnline = apiList.filter(api => api.status === "Đang chạy");

            if (apisOnline.length === 0) {
                return res.status(503).json({ message: "Không có API phụ nào đang chạy" });
            }

            let allData = [];

            // Lấy dữ liệu từ từng API phụ
            for (let api of apisOnline) {
                try {
                    const response = await axios.get(`${api.url}/api/${table}`);
                    allData = allData.concat(response.data); // Gom dữ liệu
                } catch (err) {
                    console.warn(`Lỗi lấy dữ liệu từ ${api.name} cho bảng ${table}: ${err.message}`);
                    continue; // Bỏ qua nếu API phụ lỗi
                }
            }

            res.json(allData);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: `Lỗi khi lấy dữ liệu từ các API phụ cho bảng ${table}` });
        }
    });


    app.get(`/api/${table}/:${idParams}`, async (req, res) => {
        try {
            const apiList = await kiemTraApiPhu();
            const apisOnline = apiList.filter(api => api.status === "Đang chạy");

            if (apisOnline.length === 0) {
                return res.status(503).json({ message: "Không có API phụ nào đang chạy" });
            }

            // Duyệt từng API phụ cho tới khi tìm thấy bản ghi
            for (let api of apisOnline) {
                try {
                    const response = await axios.get(`${api.url}/api/${table}/${keys.map((_, i) => req.params[`id${i + 1}`]).join("/")}`);
                    if (response.data) {
                        return res.json(response.data);
                    }
                } catch (err) {
                    console.warn(`Không tìm thấy dữ liệu trong ${api.name} cho bảng ${table}: ${err.message}`);
                    continue; // thử API phụ tiếp theo
                }
            }

            // Nếu không API nào trả dữ liệu
            res.status(404).json({ message: `Không tìm thấy dữ liệu trong ${table} từ các API phụ` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: `Lỗi khi lấy dữ liệu theo khóa chính cho bảng ${table}` });
        }
    });


    // POST - Tạo mới dữ liệu dựa vào ma_mien chỉ để chọn server
    app.post(`/api/${table}`, async (req, res) => {
        try {
            // api phụ ko có thuộc tính ma_mien
            const { ma_mien, ...data } = req.body; // tách ma_mien ra, data còn lại là gửi lên API phụ

            if (!ma_mien) {
                return res.status(400).json({ message: "Thiếu ma_mien trong body" });
            }

            // Tìm server phụ theo mã miền
            const server = API_SERVERS.find(s => s.value === ma_mien);

            if (!server) {
                return res.status(404).json({ message: `Không tìm thấy server cho miền ${ma_mien}` });
            }

            // Kiểm tra server có đang chạy không
            try {
                await axios.get(`${server.url}/api/ping`, { timeout: 2000 });
            } catch (err) {
                return res.status(503).json({ message: `Server ${server.name} không hoạt động` });
            }

            // Gọi POST tới API phụ với data không chứa ma_mien
            console.log(data);
            console.log(`${server.url}/api/${table}`);

            const response = await axios.post(`${server.url}/api/${table}`, data);

            res.status(201).json({ message: "Tạo dữ liệu thành công", data: response.data });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: `Lỗi khi push dữ liệu cho bảng ${table}`, error: err.message });
        }
    });




    // PUT - Cập nhật bản ghi theo ID
    app.put(`/api/${table}/:${idParams}`, async (req, res) => {
        try {
            const { ma_mien, ...data } = req.body;
            if (!ma_mien) return res.status(400).json({ message: "Thiếu ma_mien" });

            const server = API_SERVERS.find(s => s.value === ma_mien);
            if (!server) return res.status(404).json({ message: `Không tìm thấy server cho miền ${ma_mien}` });

            await axios.get(`${server.url}/api/ping`, { timeout: 2000 });

            const idPath = keys.map((k, i) => req.params[`id${i + 1}`]).join("/");
            const response = await axios.put(`${server.url}/api/${table}/${idPath}`, data);

            res.json({ message: "Cập nhật thành công", data: response.data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: `Lỗi khi cập nhật ${table}`, error: err.message });
        }
    });

    app.delete(`/api/${table}/:${idParams}`, async (req, res) => {
        try {
            const idPath = keys.map((k, i) => req.params[`id${i + 1}`]).join("/");

            const apiList = await kiemTraApiPhu();
            const apisOnline = apiList.filter(api => api.status === "Đang chạy");

            if (apisOnline.length === 0) {
                return res.status(503).json({ message: "Không có API phụ nào đang chạy" });
            }

            let results = [];

            for (let api of apisOnline) {
                try {
                    const response = await axios.delete(`${api.url}/api/${table}/${idPath}`);
                    results.push({
                        server: api.name,
                        success: true,
                        deleted: response.data.deleted,
                        message: response.data.message
                    });
                } catch (err) {
                    results.push({
                        server: api.name,
                        success: false,
                        message: err.response?.data?.message || err.message
                    });
                }
            }

            res.json({
                message: "Xóa bản ghi trên tất cả API phụ",
                results
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: `Lỗi khi xóa ${table} trên tất cả API phụ`, error: err.message });
        }
    });





});





//////////////////////////////////// PHÂN TÁN  /////////////////////////////////// PHÂN TÁN/////////////////////////////////// PHÂN TÁN

Object.entries(tables_not_token).forEach(([table, keys]) => {
    app.get("/api_not_token", async (req, res) => {
        try {
            const apiList = [];

            for (const [table, keys] of Object.entries(tables)) {
                const columns = await getTableColumns(table);

                // Tạo bodyExample với tất cả cột (trừ auto_increment nếu muốn)
                const bodyExample = {};
                for (const col of columns) {
                    bodyExample[col] = `${col}`;
                }

                const idParams = keys.map((_, i) => `id${i + 1}`).join("/:");

                apiList.push({
                    tableName: table,
                    endpoints: {
                        getAll: { path: `/api/${table}`, httpType: "GET" },
                        getOne: { path: `/api/${table}/:${idParams}`, httpType: "GET" },
                    }
                });
            }

            res.json(apiList);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Lỗi khi lấy thông tin API" });
        }
    });

    // GET - Lấy tất cả dữ liệu
    app.get(`/api_not_token/${table}`, (req, res) => {
        db.query(`SELECT * FROM ??`, [table], (err, results) => {
            if (err) return res.status(500).send(`Lỗi khi lấy dữ liệu từ ${table}`);
            res.json(results);
        });
    });

    // GET - Lấy một bản ghi theo khóa chính
    app.get(`/api_not_token/${table}/:${keys.map((_, i) => `id${i + 1}`).join("/:")}`, (req, res) => {
        const conditions = keys.map((key, i) => `?? = ?`).join(" AND ");
        const params = [table, ...keys.flatMap((key, i) => [key, req.params[`id${i + 1}`]])];

        db.query(`SELECT * FROM ?? WHERE ${conditions}`, params, (err, results) => {
            if (err) return res.status(500).send(`Lỗi khi lấy dữ liệu từ ${table}`);
            if (results.length === 0) return res.status(404).send(`Không tìm thấy dữ liệu trong ${table}`);
            res.json(results[0]);
        });
    });
});



Object.entries(tables).forEach(([table, keys]) => {
    // GET - Lấy tất cả dữ liệu
    // const moment = require("moment");

    function convertToYYYYMMDD(isoString) {
        if (typeof isoString === "string" && !isNaN(Date.parse(isoString))) {
            return new Date(isoString).toISOString().split("T")[0]; // YYYY-MM-DD
        }
        return isoString; // Nếu không phải ngày hợp lệ, giữ nguyên
    }

    function convertToMySQLDate(dateString) {
        if (typeof dateString === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString; // Nếu đã là YYYY-MM-DD thì giữ nguyên
        }
        if (typeof dateString === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(dateString)) {
            return dateString.split("T")[0]; // Cắt bỏ phần giờ để lưu vào MySQL
        }
        return dateString; // Nếu không hợp lệ, giữ nguyên
    }
    // Chuyển ISO string hoặc Date về dạng datetime-local (YYYY-MM-DDTHH:mm)
    function convertToDatetimeLocal(dateInput) {
        let date = dateInput;
        if (typeof dateInput === "string" && !isNaN(Date.parse(dateInput))) {
            date = new Date(dateInput);
        }
        if (date instanceof Date && !isNaN(date)) {
            // Lấy phần YYYY-MM-DDTHH:mm
            return date.toISOString().slice(0, 16);
        }
        return dateInput;
    }// ...existing code...
    // Chuyển từ dạng datetime-local (YYYY-MM-DDTHH:mm) sang timestamp MySQL (YYYY-MM-DD HH:mm:ss)
    function convertToMySQLTimestamp(datetimeLocal) {
        if (typeof datetimeLocal === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(datetimeLocal)) {
            // Thêm :00 cho giây
            return datetimeLocal.replace("T", " ") + ":00";
        }
        // Nếu là dạng đầy đủ ISO, cắt lấy phần ngày giờ
        if (typeof datetimeLocal === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(datetimeLocal)) {
            const d = new Date(datetimeLocal);
            return d.toISOString().replace("T", " ").slice(0, 19).replace("Z", "");
        }
        return datetimeLocal;
    }

    app.get("/api", async (req, res) => {
        try {

            const apiList = [];

            for (const [table, keys] of Object.entries(tables)) {
                const columns = await getTableColumns(table);

                // Tạo bodyExample với tất cả cột (trừ auto_increment nếu muốn)
                const bodyExample = {};
                for (const col of columns) {
                    bodyExample[col] = `${col}`;
                }

                const idParams = keys.map((_, i) => `id${i + 1}`).join("/:");

                apiList.push({
                    tableName: table,
                    endpoints: {
                        getAll: { path: `/api/${table}`, httpType: "GET" },
                        getOne: { path: `/api/${table}/:${idParams}`, httpType: "GET" },
                        create: { path: `/api/${table}`, httpType: "POST", bodyExample },
                        update: { path: `/api/${table}/:${idParams}`, httpType: "PUT", bodyExample },
                        delete: { path: `/api/${table}/:${idParams}`, httpType: "DELETE" }
                    }
                });
            }
            // ====== 2. API đăng nhập ======
            // ====== 2. API đăng nhập (đúng code của bạn) ======
            apiList.push({
                name: "dangNhap",
                endpoints: {
                    login: {
                        path: "/api/dang-nhap",
                        httpType: "POST",
                        bodyExample: {
                            ten_dang_nhap: "admin",
                            mat_khau: "123456"
                        },
                        description: "Đăng nhập, trả về JWT token và thông tin người dùng"
                    }
                }
            });
            // ====== 3. API Cloudinary ======
            apiList.push({
                name: "imageCloudinary",
                endpoints: {
                    uploadImage: { path: "/api/imageCloudinary", httpType: "POST" },
                    getImage: { path: "/api/imageCloudinary/:public_id", httpType: "GET" },
                    updateImage: { path: "/api/imageCloudinary/:public_id", httpType: "PUT" },
                    deleteImage: { path: "/api/imageCloudinary/:public_id", httpType: "DELETE" }
                }
            });
            // ====== 4. API Flask gửi email ======
            apiList.push({
                name: "sendEmail",
                endpoints: {
                    send: {
                        path: "/api/send-email",
                        httpType: "POST",
                        bodyExample: {
                            email_receiver: "test@example.com",
                            message: "<p>Nội dung email</p>",
                            subject: "Tiêu đề"
                        }
                    }
                }
            });

            // ====== 5. API Flask tạo trận đấu ======
            apiList.push({
                name: "taoTranDau",
                endpoints: {
                    getFormats: {
                        path: "http://localhost:5001/api_taoTranDau",
                        httpType: "GET"
                    },
                    chiaBang: {
                        path: "http://localhost:5001/api_taoTranDau/chia-bang",
                        httpType: "POST",
                        bodyExample: {
                            teams: ["Đội A", "Đội B", "Đội C"],
                            danh_sach_doi_hat_dong: ["Đội A"],
                            bangs: ["Bảng A", "Bảng B"],
                            random: true
                        }
                    },
                    vongTron: {
                        path: "http://localhost:5001/api_taoTranDau/vong-tron",
                        httpType: "POST",
                        bodyExample: {
                            teams: ["Đội A", "Đội B", "Đội C"]
                        }
                    },
                    loaiTrucTiep: {
                        path: "http://localhost:5001/api_taoTranDau/loai-truc-tiep",
                        httpType: "POST",
                        bodyExample: {
                            teams: ["Đội A", "Đội B", "Đội C", "Đội D"],
                            randomize: false
                        }
                    }
                }
            });






            res.json(apiList);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Lỗi khi lấy thông tin API" });
        }
    });




    app.get("/api", (req, res) => {
        const apiList = Object.entries(tables).map(([table, columns]) => {
            const idParams = columns.map((_, i) => `id${i + 1}`).join(":");
            return {
                getAll: `/api/${table}`,
                getOne: `/api/${table}/:${idParams}`,
                create: `/api/${table}`,
                update: `/api/${table}/:${idParams}`,
                delete: `/api/${table}/:${idParams}`,
            };
        });

        apiList.push(
            { uploadImage: "/api/imageCloudinary" },
            { getImage: "/api/imageCloudinary/:public_id" },
            { updateImage: "/api/imageCloudinary/:public_id" },
            { deleteImage: "/api/imageCloudinary/:public_id" }
        );

        res.json(apiList);
    });

    /// nếu ko xử lý ngaỳ thì nó trả về dạng :  :::::   "ngay_tao": "2025-03-22T13:53:18.000Z"
    app.get(`/api/${table}`, verifyToken, (req, res) => {
        db.query(`SELECT * FROM ??`, [table], (err, results) => {
            if (err) return res.status(500).send(`Lỗi khi lấy dữ liệu từ ${table}`);

            // Kiểm tra và xử lý các trường ngày tháng
            const updatedResults = results.map(row => {
                Object.keys(row).forEach(key => {
                    let value = row[key];

                    // Nếu là object (có thể là kiểu Date của MySQL), chuyển thành chuỗi ISO
                    if (value instanceof Date) {
                        value = value.toISOString();
                    }

                    console.log(`Trước: ${key} =`, value); // Debug giá trị trước khi sửa

                    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
                        row[key] = convertToDatetimeLocal(moment.utc(value).add(1, 'day').toISOString());
                        console.log(`Sau: ${key} =`, row[key]); // Debug giá trị sau khi sửa
                    }
                });
                return row;
            });

            res.json(updatedResults);
        });
    });

    // GET - Lấy một bản ghi theo khóa chính
    app.get(`/api/${table}/:${keys.map((_, i) => `id${i + 1}`).join("/:")}`, verifyToken, (req, res) => {
        const conditions = keys.map((key, i) => `?? = ?`).join(" AND ");
        const params = [table, ...keys.flatMap((key, i) => [key, req.params[`id${i + 1}`]])];

        db.query(`SELECT * FROM ?? WHERE ${conditions}`, params, (err, results) => {
            if (err) return res.status(500).send(`Lỗi khi lấy dữ liệu từ ${table}`);
            if (results.length === 0) return res.status(404).send(`Không tìm thấy dữ liệu trong ${table}`);

            let row = results[0];
            Object.keys(row).forEach(key => {
                let value = row[key];

                if (value instanceof Date) {
                    value = value.toISOString();
                }

                console.log(`Trước: ${key} =`, value); // Debug giá trị trước khi sửa

                if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
                    row[key] = convertToDatetimeLocal(moment.utc(value).add(1, 'day').toISOString());
                    console.log(`Sau: ${key} =`, row[key]); // Debug giá trị sau khi sửa
                }
            });

            res.json(row);
        });
    });

    app.delete(`/api/${table}/:${keys.map((_, i) => `id${i + 1}`).join("/:")}`, verifyToken, (req, res) => {

        const conditions = keys.map((key) => `\`${key}\` = ?`).join(" AND ");
        const params = [...keys.map((key, i) => req.params[`id${i + 1}`])];

        const sql = `DELETE FROM \`${table}\` WHERE ${conditions}`;
        console.log("SQL Query:", sql, "Params:", params); // Debug

        db.query(sql, params, (err) => {
            if (err) return res.status(500).send(`Lỗi khi xóa từ ${table}: ${err.message}`);
            res.send(`Xóa từ ${table} thành công`); // ✅ Phải có
        });

    });

    app.put(`/api/${table}/:${keys.map((_, i) => `id${i + 1}`).join("/:")}`, verifyToken, async (req, res) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send("Không có dữ liệu để cập nhật.");
        }

        // Chuyển đổi dữ liệu ngày tháng sang định dạng MySQL (YYYY-MM-DD)
        Object.keys(req.body).forEach(key => {
            req.body[key] = convertToMySQLTimestamp(req.body[key]);
        });
        // Nếu cập nhật bảng tai_khoan và có mật khẩu mới thì băm mật khẩu
        if (table === "tai_khoan" && req.body.mat_khau) {
            try {
                req.body.mat_khau = await hashPassword(req.body.mat_khau);
            } catch (error) {
                return res.status(500).send("Lỗi khi băm mật khẩu");
            }
        }

        const updates = Object.keys(req.body).map(key => `\`${key}\` = ?`).join(", ");
        const values = [...Object.values(req.body), ...keys.map((_, i) => req.params[`id${i + 1}`])];

        const conditions = keys.map(key => `\`${key}\` = ?`).join(" AND ");
        const sql = `UPDATE \`${table}\` SET ${updates} WHERE ${conditions}`;

        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).send(`Lỗi khi cập nhật ${table}: ${err.message}`);
            }
            if (result.affectedRows === 0) {
                return res.status(404).send(`Không tìm thấy bản ghi để cập nhật.`);
            }
            res.status(200).end(); // Thành công, không gửi nội dung

        });
    });



    app.post(`/api/${table}`, verifyToken, async (req, res) => {
        // Chuyển đổi dữ liệu ngày tháng sang định dạng MySQL (YYYY-MM-DD)
        Object.keys(req.body).forEach(key => {
            req.body[key] = convertToMySQLTimestamp(req.body[key]); // Chuyển đổi nếu là ngày hợp lệ
        });
        // Nếu là bảng tai_khoan, băm mật khẩu trước khi lưu
        if (table === "tai_khoan" && req.body.mat_khau) {
            try {
                req.body.mat_khau = await hashPassword(req.body.mat_khau);
            } catch (error) {
                return res.status(500).send("Lỗi khi băm mật khẩu");
            }
        }
        const columns = Object.keys(req.body);
        const values = Object.values(req.body);

        if (columns.length === 0) return res.status(400).send("Không có dữ liệu để thêm.");

        const sql = `INSERT INTO \`${table}\` (${columns.map(col => `\`${col}\``).join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`;

        db.query(sql, values, (err) => {
            if (err) return res.status(500).send(`Lỗi khi thêm vào ${table}: ${err.message}`);
            res.status(201).send(`Thêm vào ${table} thành công`);
            //res.send(`Xóa từ ${table} thành công`); // ✅ Phải có
        });
    });


});

// tạo 1 api lấy cấu hình giao diện không cần đăng nhập 

function getTableColumns(tableName) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ORDER BY ORDINAL_POSITION
        `;
        db.query(sql, [db.config.database, tableName], (err, results) => {
            if (err) return reject(err);
            resolve(results.map(row => row.COLUMN_NAME));
        });
    });
}

async function hashPassword(password) {
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;  // có giá trị mặc định nếu env không có
    return await bcrypt.hash(password, saltRounds);
}


// // Khởi động server
// app.listen(port, () => {
//     console.log(`Server đang chạy tại http://localhost:${port}`);
// });
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
