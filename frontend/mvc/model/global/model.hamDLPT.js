import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
import hamChung from "./model.hamChung.js";

import { PrimaryKeys_phanTan } from './databaseKey.js';

const hamDLPT = {
    PrimaryKeys_phanTan, // 👈 cho phép gọi ở nơi khác: hamChung.primaryKeys["cau_thu"]

    async get_danh_sach_mien() {
        return await get_danh_sach_mien();
    },
    async them_nguoiDung(formData) {
        return await them_nguoiDung(formData);
    },
    async sua_nguoiDung(formData) {
        return await sua_nguoiDung(formData);
    },
    async formXoa_nguoiDung(formData) {
        return await formXoa_nguoiDung(formData);
    },

    async them(data, table_name) {
        return await them(data, table_name)
    },
    async sua(data, table_name) {
        return await sua(data, table_name)
    },
    async xoa(keys, table_name) {
        return await xoa(keys, table_name);
    },
};

async function fetchCoToken(url, options = {}) {
    const token = localStorage.getItem("token");
    return await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        }
    });
}
// Hàm gọi API kiểm tra các API phụ
async function get_danh_sach_mien() {


    const url = GlobalStore.getLinkCongAPI() + "kiem-tra-api-phu";
    try {
        const response = await fetchCoToken(url);
        return await response.json();
    } catch (error) {
        console.error(`Lỗi khi lấy api kiểm tra miền:`, error);
        return [];
    }

}

async function them_nguoiDung(formData) {

    const form_nguoiDung_mien = {
        ma_mien: formData.ma_mien,

        ma_nguoi_dung: formData.ma_nguoi_dung,
        ho_ten: formData.ho_ten,
        gioi_tinh: formData.gioi_tinh,
        email: formData.email,
        so_dien_thoai: formData.so_dien_thoai,
        ngay_sinh: formData.ngay_sinh
    }
    const form_nguoiDung_toanQuoc = {
        ma_nguoi_dung: formData.ma_nguoi_dung,
        ma_mien: formData.ma_mien,
        ma_vai_tro: formData.ma_vai_tro
    }
    console.log(formData);
    console.log(form_nguoiDung_mien);
    console.log(form_nguoiDung_toanQuoc);
    // check miền có đang hoạt đông
    const trangThaiMienS = await get_danh_sach_mien();
    console.log(trangThaiMienS);
    console.log(formData.ma_mien);
    const trangThaiMien_dangChon = trangThaiMienS.filter(item => item.value === formData.ma_mien);
    console.log(trangThaiMien_dangChon);
    if (trangThaiMien_dangChon.status) {
        return 0;
    }
    // thêm 2 form vào bảng 
    await hamChung.them(form_nguoiDung_toanQuoc, "nguoi_dung_toan_quoc");
    await them(form_nguoiDung_mien, "nguoi_dung");
    return 1;
}


async function sua_nguoiDung(formData) {
    const data1TaiKhoan = await hamChung.layThongTinTheo_ID("tai_khoan", formData.ma_nguoi_dung);
    const form_nguoiDung_mien = {
        ma_mien: formData.ma_mien,

        ma_nguoi_dung: formData.ma_nguoi_dung,
        ho_ten: formData.ho_ten,
        gioi_tinh: formData.gioi_tinh,
        email: formData.email,
        so_dien_thoai: formData.so_dien_thoai,
        ngay_sinh: formData.ngay_sinh
    }
    const form_nguoiDung_toanQuoc = {
        ma_nguoi_dung: formData.ma_nguoi_dung,
        ma_mien: formData.ma_mien,
        ma_vai_tro: formData.ma_vai_tro
    }
    const formXoa_nguoiDung = {
        ma_nguoi_dung: formData.ma_nguoi_dung,
        ma_mien: formData.ma_mien,
    }
    const formXoa_taiKhoan = {
        ma_nguoi_dung: formData.ma_nguoi_dung,
        ma_mien: formData.ma_mien,
    }
    const formThem_taiKhoan = data1TaiKhoan;


    console.log(formData);
    console.log(form_nguoiDung_mien);
    console.log(form_nguoiDung_toanQuoc);

    // check miền có đang hoạt đông
    const trangThaiMienS = await get_danh_sach_mien();
    console.log(trangThaiMienS);
    console.log(formData.ma_mien);
    const data1NguoiDungToanQuoc = await hamChung.layThongTinTheo_ID("nguoi_dung_toan_quoc", formData.ma_nguoi_dung);
    const trangThaiMien_new = trangThaiMienS.filter(item => item.value === formData.ma_mien);
    const trangThaiMien_old = trangThaiMienS.filter(item => item.value === data1NguoiDungToanQuoc.ma_mien);

    console.log(trangThaiMien_new);
    if (trangThaiMien_new.status || trangThaiMien_old.status) {
        return 0;
    }
    // check 2 api đều hoạt động bình thường
    // th mã miền đã đổi // và 3 api đều bình thường 
    if (data1NguoiDungToanQuoc.ma_mien != formData.ma_mien) {
        // thêm dữ liệu xong sau đó mới xóa

        formXoa_nguoiDung.ma_mien = data1NguoiDungToanQuoc.ma_mien;
        formThem_taiKhoan.ma_mien = formData.ma_mien;
        console.log(formXoa_nguoiDung);
        console.log(formThem_taiKhoan);
        // cập nhật người dùng sang table khác
        await xoa(formXoa_taiKhoan, "tai_khoan");
        await xoa(formXoa_nguoiDung, "nguoi_dung");

        await them(form_nguoiDung_mien, "nguoi_dung");
        await them(formThem_taiKhoan, "tai_khoan");
        // cập nhật tài khoản




    }
    // trường hợp mã miền không đổi
    else {

        await sua(form_nguoiDung_mien, "nguoi_dung");
    }
    await hamChung.sua(form_nguoiDung_toanQuoc, "nguoi_dung_toan_quoc");
    return 1;
}
async function formXoa_nguoiDung(formData) {

}



async function them(data, table_name) {
    if (!data) {
        console.error("Dữ liệu không hợp lệ!");
        alert("Dữ liệu không hợp lệ!");
        return;
    }

    const url = `${GlobalStore.getLinkCongAPI()}${table_name}`;

    try {
        const response = await fetchCoToken(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        const text = await response.text();
        const resData = (text.trim().startsWith("{") || text.trim().startsWith("[")) ? JSON.parse(text) : { message: text };

        console.log("Thêm thành công:", resData.message || "Thành công");
        // alert(resData.message || "Thêm dữ liệu thành công.");
    } catch (error) {
        console.error("Có lỗi xảy ra khi thêm:", error.message);
        alert(`Lỗi: ${error.message}`);
    }
}
async function sua(data, table_name) {
    // console.log(PrimaryKeys_phanTan);
    const primaryKeys_phanTan = PrimaryKeys_phanTan[table_name];


    if (!data) {
        console.error("Dữ liệu không hợp lệ!");
        alert("Dữ liệu không hợp lệ!");
        return;
    }

    if (!primaryKeys_phanTan) {
        console.error(`Bảng ${table_name} không hợp lệ.`);
        alert("Bảng không hợp lệ!");
        return;
    }

    const keyValues = primaryKeys_phanTan.map(key => data[key]);
    if (keyValues.some(value => value === undefined)) {
        console.error("Thiếu thông tin khóa chính!", data);
        alert("Thiếu thông tin khóa chính!");
        return;
    }

    const idPath = keyValues.join("/");
    const url = `${GlobalStore.getLinkCongAPI()}${table_name}/${idPath}`;

    try {
        const response = await fetchCoToken(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        const text = await response.text();
        const resData = text.trim().startsWith("{") || text.trim().startsWith("[")
            ? JSON.parse(text)
            : { message: text };

        console.log("Sửa thành công:", resData.message || "Thành công");
        // alert(resData.message || "Sửa dữ liệu thành công.");
    } catch (error) {
        console.error("Có lỗi xảy ra khi sửa:", error.message);
        alert(`Lỗi: ${error.message}`);
    }
}

async function xoa(keys, table_name) {
    const primaryKeys_phanTan = PrimaryKeys_phanTan[table_name];
    console.log("table_name:", table_name);
    console.log("PrimaryKeys_phanTan:", PrimaryKeys_phanTan);
    console.log("primaryKeys_phanTan:", PrimaryKeys_phanTan[table_name]);

    if (!primaryKeys_phanTan) {
        console.error(`Bảng ${table_name} không hợp lệ.`);
        alert("Bảng không hợp lệ!");
        return;
    }

    if (!keys || typeof keys !== "object") {
        console.error("Thiếu thông tin khóa chính để xóa!", keys);
        alert("Thiếu thông tin khóa chính để xóa!");
        return;
    }

    const keyValues = primaryKeys_phanTan.map(key => keys[key]);

    if (keyValues.some(value => value === undefined || value === null)) {
        console.error("Thiếu thông tin khóa chính!", keys);
        alert("Thiếu thông tin khóa chính!");
        return;
    }

    const idPath = keyValues.join("/");
    const url = `${GlobalStore.getLinkCongAPI()}${table_name}/${idPath}`;

    try {
        const response = await fetchCoToken(url, {
            method: 'DELETE'
        });

        const text = await response.text();
        const resData = text.trim().startsWith("{") || text.trim().startsWith("[")
            ? JSON.parse(text)
            : { message: text };

        console.log("Xóa thành công:", resData.message || "Thành công");
        // alert(resData.message || "Xóa dữ liệu thành công.");
    } catch (error) {
        console.error("Có lỗi xảy ra khi xóa:", error.message);
        alert(`Lỗi: ${error.message}`);
    }
}



export default hamDLPT;