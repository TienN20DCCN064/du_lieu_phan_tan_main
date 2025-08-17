import hamChung from "../../../model/global/model.hamChung.js";
import hamDLPT from "../../../model/global/model.hamDLPT.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachNguoiDung,
    loadDanhSachNguoiDung_chuaCo_taiKhoan,
    loadDanhSachVaiTro
} from "../../../view/view_js/quanly_admin/nguoi_dung/tai_khoan.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maNguoiDung, tenDangNhap, matKhau, trangThai, maVaiTro, ngayTao, form
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    // await loadDanhSachNguoiDung();
    //await loadDanhSachVaiTro();
    await loadDanhSachNguoiDung_chuaCo_taiKhoan();
    await load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

async function load_viewTbody() {
    const data = await hamChung.layDanhSach("tai_khoan");
    viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản của người dùng "${item.ma_nguoi_dung}"?`)) {
        await hamDLPT.xoa({ ma_nguoi_dung: item.ma_nguoi_dung }, "tai_khoan");
        form.reset();
        load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const data1nguoiDungToanQuoc = await hamChung.layThongTinTheo_ID("nguoi_dung_toan_quoc", maNguoiDung.value);
    console.log(data1nguoiDungToanQuoc);

    let formData = {
        ma_nguoi_dung: maNguoiDung.value,
        ten_dang_nhap: tenDangNhap.value,
        ma_mien: data1nguoiDungToanQuoc.ma_mien,
        mat_khau: matKhau.value,
        trang_thai: trangThai.value,
        // ma_vai_tro: maVaiTro.value,
        ngay_tao: ngayTao.value
    };
    const formData_taiKhoan_all = {
        ma_nguoi_dung: maNguoiDung.value,
        ma_mien: data1nguoiDungToanQuoc.ma_mien,
        ma_vai_tro: maVaiTro.value,
    }
    const danhSachMien = await hamDLPT.get_danh_sach_mien();
    const danhSachMien_hoatDong = danhSachMien.filter(item => item.status === "Đang chạy");
    if (danhSachMien_hoatDong.length != 3) {
        alert("Server đang lỗi không thể cập nhật ");
        return;
    }



    // Kiểm tra nếu tên đăng nhâp đã tồn tại
    const dataTaiKhoan = await hamChung.layDanhSach("tai_khoan");

    if (maNguoiDung.disabled && tenDangNhap.disabled) {
        console.log(formData);
        await hamDLPT.sua(formData, "tai_khoan");
        alert("Sửa thành công!");
    } else {

        const tenDangNhapDaTonTai = dataTaiKhoan.some(item => item.ten_dang_nhap === tenDangNhap.value);
        if (tenDangNhapDaTonTai) {
            alert("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.");
            return;
        }
        await hamDLPT.them(formData, "tai_khoan");
        // await hamChung.them(formData_taiKhoan_all, "tai_khoan");
        alert("Thêm thành công!");
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}