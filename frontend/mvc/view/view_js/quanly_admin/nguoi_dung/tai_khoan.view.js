import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import FORM from "/frontend/mvc/controller/EditFormData.controller.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maNguoiDung: document.getElementById("maNguoiDung"),
        tenDangNhap: document.getElementById("tenDangNhap"),
        matKhau: document.getElementById("matKhau"),
        trangThai: document.getElementById("trangThai"),
        maVaiTro: document.getElementById("maVaiTro"),
        ngayTao: document.getElementById("ngayTao"),
        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, onEdit, onDelete) {
    const { tableBody } = getElementIds();
    tableBody.innerHTML = "";
    for (const item of data) {
        const row = document.createElement("tr");
        const data1VaiTro = await hamChung.layThongTinTheo_ID("vai_tro", item.ma_vai_tro);
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_nguoi_dung}</td>
            <td style="text-align: center;">${item.ten_dang_nhap}</td>
            <td style="text-align: center;">****</td>
            <td style="text-align: center;">${item.trang_thai == "Hoạt động" ? "Hoạt Động" : "Bị Khóa"}</td>
            <td style="text-align: center;">${data1VaiTro.ten_vai_tro}</td>
            <td style="text-align: center;">${FORM.formatDateT_to_Date(item.ngay_tao)}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export async function fillForm(item) {
    const { maNguoiDung, tenDangNhap, matKhau, trangThai, maVaiTro, ngayTao } = getElementIds();
    await loadDanhSachNguoiDung();
    maNguoiDung.value = item.ma_nguoi_dung;
    tenDangNhap.value = item.ten_dang_nhap;
    matKhau.value = item.mat_khau;
    trangThai.value = item.trang_thai;
    maVaiTro.value = item.ma_vai_tro;
    ngayTao.value = FORM.formatDateT_to_Date(item.ngay_tao);
    maNguoiDung.setAttribute("disabled", true);
    tenDangNhap.setAttribute("disabled", true);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachNguoiDung() {
    const selectElement = document.getElementById("maNguoiDung");
    selectElement.innerHTML = '<option value="">-- Chọn Người Dùng --</option>';
    const data = await hamChung.layDanhSach("nguoi_dung");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_nguoi_dung;
        option.textContent = `${item.ma_nguoi_dung} - ${item.ho_ten}`;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachNguoiDung_chuaCo_taiKhoan() {
    const selectElement = document.getElementById("maNguoiDung");
    selectElement.innerHTML = '<option value="">-- Chọn Người Dùng --</option>';
    const data = await hamChung.layDanhSach("nguoi_dung");
    const dataTaiKhoan = await hamChung.layDanhSach("tai_khoan");
    // Lọc ra những người dùng đã có tài khoản
    const maNguoiDungDaCoTaiKhoan = dataTaiKhoan.map(item => item.ma_nguoi_dung);
    const dataChuaCoTaiKhoan = data.filter(item => !maNguoiDungDaCoTaiKhoan.includes(item.ma_nguoi_dung));
    // Lọc ra những người dùng chưa có tài khoản
    dataChuaCoTaiKhoan.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_nguoi_dung;
        option.textContent = `${item.ma_nguoi_dung} - ${item.ho_ten}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachVaiTro() {
    const selectElement = document.getElementById("maVaiTro");
    selectElement.innerHTML = '<option value="">-- Chọn Vai Trò --</option>';
    const data = await hamChung.layDanhSach("vai_tro");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vai_tro;
        option.textContent = `${item.ten_vai_tro}`;
        selectElement.appendChild(option);
    });
}