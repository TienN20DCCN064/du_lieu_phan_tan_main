import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import hamDLPT from "/frontend/mvc/model/global/model.hamDLPT.js";
//C:\Users\vanti\Desktop\mvc_project\frontend\mvc\controller\EditFormData.controller.js
import FORM from "/frontend/mvc/controller/EditFormData.controller.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maNguoiDung: document.getElementById("maNguoiDung"),
        maMien: document.getElementById("maMien"),
        maVaiTro: document.getElementById("maVaiTro"),
        hoTen: document.getElementById("hoTen"),
        gioiTinh: document.getElementById("gioiTinh"),
        email: document.getElementById("email"),
        soDienThoai: document.getElementById("soDienThoai"),
        ngaySinh: document.getElementById("ngaySinh"),
        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
        maMien_chon_viewbody: document.getElementById("maMien_chon_viewbody"),
        // gioiTinh_chon_viewbody: document.getElementById("gioiTinh_chon_viewbody"),
    };
}

async function getMien_theo_maNguoiDung(maNguoDung) {
    const data1NguoiDungToanQuoc = await hamChung.layThongTinTheo_ID("nguoi_dung_toan_quoc", maNguoDung);
    return data1NguoiDungToanQuoc.ma_mien;
}
export async function viewTbody(data, onEdit, onDelete) {
    const { tableBody, maMien_chon_viewbody } = getElementIds();
    //  if (maMien_chon_viewbody && maMien_chon_viewbody.value === "not_truong") {
    //     data = data.filter(item => !item.ma_truong);
    // }
    console.log(data);
    let data_theoMien = [];

    if (maMien_chon_viewbody && maMien_chon_viewbody.value !== "All") {
        data_theoMien = [];
        for (const item of data) {
            const mienNguoiDung = await getMien_theo_maNguoiDung(item.ma_nguoi_dung);
            if (mienNguoiDung === maMien_chon_viewbody.value) {
                data_theoMien.push(item);
            }
        }
    } else {
        // Nếu chọn All thì giữ nguyên dữ liệu
        data_theoMien = data;
    }


    // if (gioiTinh_chon_viewbody && gioiTinh_chon_viewbody.value !== "All") {
    //     data = data.filter(item => item.gioi_tinh === gioiTinh_chon_viewbody.value);
    // }
    tableBody.innerHTML = "";

    for (const item of data_theoMien) {
        let tenMien = "---";
        let tenVaiTro = "---";
        let tenDangNhap = "---";
        const data1NguoiDungToanQuoc = await hamChung.layThongTinTheo_ID("nguoi_dung_toan_quoc", item.ma_nguoi_dung);
        const data1TaiKhoan = await hamChung.layThongTinTheo_ID("tai_khoan", item.ma_nguoi_dung);
        if (data1NguoiDungToanQuoc) {
            if (data1NguoiDungToanQuoc.ma_mien) {
                tenMien = data1NguoiDungToanQuoc.ma_mien;
            }
            if (data1NguoiDungToanQuoc.ma_vai_tro) {
                const data1VaiTro = await hamChung.layThongTinTheo_ID("vai_tro", data1NguoiDungToanQuoc.ma_vai_tro);
                tenVaiTro = data1VaiTro.ten_vai_tro;
            }
        }
        if (data1TaiKhoan.ma_nguoi_dung) {
            console.log(data1TaiKhoan);
            tenDangNhap = data1TaiKhoan.ten_dang_nhap;
        }
        // console.log("item", item.ngay_sinh);
        // console.log("formattedDate", FORM.formatDateT_to_Date(item.ngay_sinh));
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_nguoi_dung}</td>
            <td>${tenDangNhap}</td>
            <td>${tenMien}</td>
            <td>${tenVaiTro}</td>
            
            <td>${item.ho_ten ?? "---"}</td>
            <td>${item.gioi_tinh ?? "---"}</td>
            <td>${item.email ?? "---"}</td>
            <td>${item.so_dien_thoai ?? "---"}</td>
            <td>${FORM.formatDateT_to_Date(item.ngay_sinh) ?? "---"}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export async function fillForm(item) {
    const { maNguoiDung, maMien, hoTen, gioiTinh, email, soDienThoai, ngaySinh } = getElementIds();
    const maMien_theoNguoiDung = await getMien_theo_maNguoiDung(item.ma_nguoi_dung);
    const data1NguoiDungToanQuoc = await hamChung.layThongTinTheo_ID("nguoi_dung_toan_quoc", item.ma_nguoi_dung);

    maNguoiDung.value = item.ma_nguoi_dung;
    console.log(maMien_theoNguoiDung);
    maMien.value = maMien_theoNguoiDung;
    maVaiTro.value = data1NguoiDungToanQuoc.ma_vai_tro;
    hoTen.value = item.ho_ten;
    gioiTinh.value = item.gioi_tinh;;
    email.value = item.email;
    soDienThoai.value = item.so_dien_thoai;
    ngaySinh.value = FORM.formatDateT_to_Date(item.ngay_sinh);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachMien() {
    const selectElement = document.getElementById("maMien");
    selectElement.innerHTML = '<option value="">-- Chọn Miền --</option>';
    const dataMien = await hamDLPT.get_danh_sach_mien();
    const dataMien_hoatDong = dataMien.filter(item => item.status === "Đang chạy");
    console.log(dataMien_hoatDong);
    dataMien_hoatDong.forEach(item => {
        const option = document.createElement("option");
        option.value = item.value;
        option.textContent = `${item.value} - ${item.name}`;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachMien_chon_viewbody() {
    const selectElement = document.getElementById("maMien_chon_viewbody");
    selectElement.innerHTML = '<option value="All">-- Chọn Miền --</option>';
    const dataMien = await hamDLPT.get_danh_sach_mien();
    const dataMien_hoatDong = dataMien.filter(item => item.status === "Đang chạy");
    console.log(dataMien_hoatDong);
    dataMien_hoatDong.forEach(item => {
        const option = document.createElement("option");
        option.value = item.value;
        option.textContent = `${item.value} - ${item.name}`;
        selectElement.appendChild(option);
    });
}