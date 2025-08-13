import hamChung from "../../../model/global/model.hamChung.js";
import hamDLPT from "../../../model/global/model.hamDLPT.js";
import { getElementIds, viewTbody, fillForm, loadDanhSachMien, loadDanhSachMien_chon_viewbody } from "../../../view/view_js/quanly_admin/nguoi_dung/nguoiDung.view.js";

const {
    btnLuuThayDoi,
    btnTaiLaiTrang,
    maNguoiDung,
    maMien,
    maVaiTro,
    hoTen,
    gioiTinh,
    email,
    soDienThoai,
    ngaySinh,
    form,
    maMien_chon_viewbody,
    // gioiTinh_chon_viewbody
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachMien();
    await loadDanhSachMien_chon_viewbody();
    load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maMien_chon_viewbody.addEventListener("change", load_viewTbody);
    // gioiTinh_chon_viewbody.addEventListener("change", load_viewTbody);
});

async function load_viewTbody() {
    const data = await hamChung.layDanhSach("nguoi_dung");
    viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {

    const data1NguoiDungToanQuoc = await hamChung.layThongTinTheo_ID("nguoi_dung_toan_quoc", item.ma_nguoi_dung);
    // const form_nguoiDung_mien = item;
    // form_nguoiDung_mien.ma_mien = data1NguoiDungToanQuoc.ma_mien;

    const form__xoa_nguoiDung_mien = {
        ma_nguoi_dung: item.ma_nguoi_dung,
        ma_mien: data1NguoiDungToanQuoc.ma_mien,
    }
    const form_xoa_nguoiDung_toanQuoc = {
        ma_nguoi_dung: item.ma_nguoi_dung
    }



    console.log(form__xoa_nguoiDung_mien);
    console.log(form_xoa_nguoiDung_toanQuoc);
    // đầu tiên kiểm tra xem tồn tại trong 2 cái không đã
    const data1NguoiDung_theoMien = await hamChung.layThongTinTheo_ID("nguoi_dung", item.ma_nguoi_dung);
    // không tim thấy
    if (data1NguoiDung_theoMien.message) {
        alert("Người dùng hiện không tìm thấy theo miền !");
        return;
    }




    if (confirm(`Bạn có chắc chắn muốn xóa người dùng ${item.ma_nguoi_dung}?`)) {
        await hamDLPT.xoa(form__xoa_nguoiDung_mien, "nguoi_dung");
        await hamChung.xoa(form_xoa_nguoiDung_toanQuoc, "nguoi_dung_toan_quoc");
        form.reset();
        load_viewTbody();
    }
}
async function getMien_theo_maNguoiDung(maNguoDung) {
    const data1NguoiDungToanQuoc = await hamChung.layThongTinTheo_ID("nguoi_dung_toan_quoc", maNguoDung);
    return data1NguoiDungToanQuoc.ma_mien;
}
async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let formData = {
        ma_nguoi_dung: maNguoiDung.value,
        ma_mien: maMien.value,
        ma_vai_tro: maVaiTro.value,
        ho_ten: hoTen.value,
        gioi_tinh: gioiTinh.value,
        email: email.value,
        so_dien_thoai: soDienThoai.value,
        ngay_sinh: ngaySinh.value
    };
    const danhSachMien = await hamDLPT.get_danh_sach_mien();
    const danhSachMien_hoatDong = danhSachMien.filter(item => item.status === "Đang chạy");
    // check gmail đã tồn tại chưa
    const dataNguoiDung = await hamChung.layDanhSach("nguoi_dung");


    if (maNguoiDung.value === "") {

        formData.ma_nguoi_dung = await hamChung.taoID_theoBang("nguoi_dung_toan_quoc");
        console.log("miền hoạt  đông " + danhSachMien_hoatDong.length);
        console.log("form " + formData);
        if (danhSachMien_hoatDong.length != 3) {
            alert("Server đang lỗi không thể thêm ");
            return;
        }


        console.log(dataNguoiDung);
        const isEmailExists = dataNguoiDung.some(item => item.email === formData.email);
        if (isEmailExists) {
            alert("Email đã tồn tại!");
            return;
        }

        const add_check = await hamDLPT.them_nguoiDung(formData);
        if (add_check === 0) {
            alert("Lỗi khi thêm!");
            return
        }
        if (add_check === 1) {
            alert("Thêm thành công");
            return
        }
    } else {
        // với sửa nếu ko thấy người dùng thì thông báo server lỗi và reload lại
        const data1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", maNguoiDung.value);
        console.log(data1NguoiDung);
        if (data1NguoiDung.message) {
            alert("Server lỗi! Thông tin người dùng không thể sửa");
            location.reload();
            return;
        }
        // đủ miền thì chỉ cần check gmail 

        if (danhSachMien_hoatDong.length == 3) {
            const isEmailExists = dataNguoiDung.some(item => item.email === formData.email && item.ma_nguoi_dung !== formData.ma_nguoi_dung);
            if (isEmailExists) {
                alert("Email đã tồn tại!");
                return;
            }
        }
        // ko đủ miền
        else {
            // trường hợp này là miền đang sửa thì vẫn còn hoạt động
            const mien_banDau = await getMien_theo_maNguoiDung(maNguoiDung.value);
            const email_banDau = data1NguoiDung.email;
            if (email_banDau != email.value) {
                alert("Server lỗi! Không thể sửa email");
                return;
            }
            if (mien_banDau != maMien.value) {
                alert("Server lỗi! Không thể sửa miền");
                return;
            }
        }

        const put_check = await hamDLPT.sua_nguoiDung(formData);
        if (put_check === 0) {
            alert("Lỗi khi sửa!");
            return
        }
        if (put_check === 1) {
            alert("Sửa thành công!");
            return
        }

    }

    //    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}