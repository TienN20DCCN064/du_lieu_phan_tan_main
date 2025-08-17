-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 17, 2025 at 06:55 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ql_nguoi_dung_all_all`
--

-- --------------------------------------------------------

--
-- Table structure for table `bang_dau`
--

CREATE TABLE `bang_dau` (
  `ma_bang_dau` varchar(50) NOT NULL,
  `ma_giai_dau` varchar(50) DEFAULT NULL,
  `ten_bang_dau` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cau_hinh_giai_dau`
--

CREATE TABLE `cau_hinh_giai_dau` (
  `ma_giai_dau` varchar(50) NOT NULL,
  `thoi_gian_moi_hiep` int NOT NULL DEFAULT '45',
  `so_hiep` int NOT NULL DEFAULT '2',
  `gioi_tinh_yeu_cau` enum('Nam','Nữ','Không phân biệt') NOT NULL DEFAULT 'Không phân biệt',
  `so_luong_cau_thu_toi_da_moi_doi` int NOT NULL,
  `so_luong_cau_thu_toi_thieu_moi_doi` int NOT NULL,
  `so_luong_doi_bong_toi_da_dang_ky` int NOT NULL,
  `ghi_chu` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cau_hinh_giao_dien`
--

CREATE TABLE `cau_hinh_giao_dien` (
  `ma_cau_hinh_giao_dien` varchar(50) NOT NULL,
  `ten_cau_hinh_giao_dien` varchar(255) DEFAULT NULL,
  `background` varchar(255) DEFAULT NULL,
  `ma_tran_dau` varchar(50) DEFAULT NULL,
  `is_dang_su_dung` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cau_thu`
--

CREATE TABLE `cau_thu` (
  `ma_cau_thu` varchar(50) NOT NULL,
  `ma_doi_bong` varchar(50) DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `ngay_sinh` date NOT NULL,
  `so_ao` int NOT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `gioi_tinh` enum('Nam','Nữ') DEFAULT NULL,
  `ma_vi_tri` varchar(50) NOT NULL,
  `trang_thai` enum('Hoạt động','Đã xoá') DEFAULT 'Hoạt động'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cau_thu_giai_dau`
--

CREATE TABLE `cau_thu_giai_dau` (
  `ma_cau_thu` varchar(50) NOT NULL,
  `ma_giai_dau` varchar(50) NOT NULL,
  `ma_doi_bong` varchar(50) DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `so_ao` int NOT NULL,
  `ma_vi_tri` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doi_bong`
--

CREATE TABLE `doi_bong` (
  `ma_doi_bong` varchar(50) NOT NULL,
  `ten_doi_bong` varchar(255) NOT NULL,
  `gioi_tinh` enum('Nam','Nữ') DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `ghi_chu` text,
  `ma_ql_doi_bong` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doi_bong_giai_dau`
--

CREATE TABLE `doi_bong_giai_dau` (
  `ma_doi_bong` varchar(50) NOT NULL,
  `ma_giai_dau` varchar(50) NOT NULL,
  `ma_bang_dau` varchar(50) DEFAULT NULL,
  `thoi_gian_dang_ky` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `trang_thai` enum('Chờ duyệt','Đã duyệt','Từ chối') DEFAULT 'Chờ duyệt',
  `ly_do_tu_choi` text,
  `ten_doi_bong` varchar(255) NOT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `hat_giong` enum('co','khong') NOT NULL DEFAULT 'khong',
  `ghi_chu` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `giai_dau`
--

CREATE TABLE `giai_dau` (
  `ma_giai_dau` varchar(50) NOT NULL,
  `ten_giai_dau` varchar(255) NOT NULL,
  `ngay_bat_dau` timestamp NOT NULL,
  `ngay_ket_thuc` timestamp NOT NULL,
  `ngay_bat_dau_dang_ky_giai` timestamp NOT NULL,
  `ngay_ket_thuc_dang_ky_giai` timestamp NOT NULL,
  `mo_ta` text,
  `ma_nguoi_tao` varchar(50) DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loai_trong_tai`
--

CREATE TABLE `loai_trong_tai` (
  `ma_loai_trong_tai` varchar(50) NOT NULL,
  `ten_loai_trong_tai` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_dung_toan_quoc`
--

CREATE TABLE `nguoi_dung_toan_quoc` (
  `ma_nguoi_dung` varchar(50) NOT NULL,
  `ma_mien` enum('BAC','TRUNG','NAM') NOT NULL,
  `ma_vai_tro` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `nguoi_dung_toan_quoc`
--

INSERT INTO `nguoi_dung_toan_quoc` (`ma_nguoi_dung`, `ma_mien`, `ma_vai_tro`) VALUES
('nd2', 'BAC', 'VT01'),
('nd3', 'BAC', 'VT02'),
('nd5', 'TRUNG', 'VT02'),
('ndtq_0002', 'TRUNG', 'VT02'),
('ndtq_0003', 'TRUNG', 'VT02'),
('ndtq_0004', 'TRUNG', 'VT02'),
('ndtq_0006', 'BAC', 'VT02'),
('ndtq_0007', 'BAC', 'VT01'),
('ndtq_0008', 'TRUNG', 'VT02');

-- --------------------------------------------------------

--
-- Table structure for table `quy_tac_tinh_diem`
--

CREATE TABLE `quy_tac_tinh_diem` (
  `ma_giai_dau` varchar(50) NOT NULL,
  `ma_vong_dau` varchar(50) NOT NULL,
  `diem_thang` int NOT NULL DEFAULT '3',
  `diem_hoa` int NOT NULL DEFAULT '1',
  `diem_thua` int NOT NULL DEFAULT '0',
  `tru_the_vang` int NOT NULL DEFAULT '1',
  `tru_the_do` int NOT NULL DEFAULT '3',
  `ghi_chu` text,
  `diem_ban_thang` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `san_van_dong`
--

CREATE TABLE `san_van_dong` (
  `ma_san` varchar(50) NOT NULL,
  `ma_giai_dau` varchar(50) DEFAULT NULL,
  `ten_san` varchar(255) NOT NULL,
  `dia_chi` text NOT NULL,
  `suc_chua` int NOT NULL,
  `mo_ta` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `su_kien_tran_dau`
--

CREATE TABLE `su_kien_tran_dau` (
  `ma_su_kien` varchar(50) NOT NULL,
  `ma_tran_dau` varchar(50) DEFAULT NULL,
  `thoi_diem` varchar(50) NOT NULL,
  `loai_su_kien` enum('Bàn thắng','Thẻ đỏ','Thẻ vàng') DEFAULT NULL,
  `ma_cau_thu` varchar(50) DEFAULT NULL,
  `ghi_chu` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tran_dau`
--

CREATE TABLE `tran_dau` (
  `ma_tran_dau` varchar(50) NOT NULL,
  `ma_giai_dau` varchar(50) DEFAULT NULL,
  `ma_doi_1` varchar(50) DEFAULT NULL,
  `ma_doi_2` varchar(50) DEFAULT NULL,
  `thoi_gian_dien_ra` timestamp NOT NULL,
  `ma_san` varchar(50) DEFAULT NULL,
  `trang_thai` enum('Chưa diễn ra','Đang diễn ra','Hoàn tất','Hủy') DEFAULT 'Chưa diễn ra',
  `ma_vong_dau` varchar(50) DEFAULT NULL,
  `so_ban_doi_1` int DEFAULT '0',
  `so_ban_doi_2` int DEFAULT '0',
  `ma_doi_thang` varchar(50) DEFAULT NULL,
  `ghi_chu` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trong_tai`
--

CREATE TABLE `trong_tai` (
  `ma_trong_tai` varchar(50) NOT NULL,
  `ma_giai_dau` varchar(50) DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `ngay_sinh` date NOT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `gioi_tinh` enum('Nam','Nữ') DEFAULT NULL,
  `ma_loai_trong_tai` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trong_tai_tran_dau`
--

CREATE TABLE `trong_tai_tran_dau` (
  `ma_tran_dau` varchar(50) NOT NULL,
  `ma_trong_tai` varchar(50) NOT NULL,
  `ma_loai_trong_tai` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vai_tro`
--

CREATE TABLE `vai_tro` (
  `ma_vai_tro` varchar(50) NOT NULL,
  `ten_vai_tro` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `vai_tro`
--

INSERT INTO `vai_tro` (`ma_vai_tro`, `ten_vai_tro`) VALUES
('VT01', 'ADMIN'),
('VT02', 'Quản Lý');

-- --------------------------------------------------------

--
-- Table structure for table `vi_tri_cau_thu`
--

CREATE TABLE `vi_tri_cau_thu` (
  `ma_vi_tri` varchar(50) NOT NULL,
  `ten_vi_tri` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vong_dau`
--

CREATE TABLE `vong_dau` (
  `ma_vong_dau` varchar(50) NOT NULL,
  `ma_giai_dau` varchar(50) DEFAULT NULL,
  `ten_vong_dau` varchar(255) NOT NULL,
  `mo_ta` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bang_dau`
--
ALTER TABLE `bang_dau`
  ADD PRIMARY KEY (`ma_bang_dau`),
  ADD KEY `ma_giai_dau` (`ma_giai_dau`);

--
-- Indexes for table `cau_hinh_giai_dau`
--
ALTER TABLE `cau_hinh_giai_dau`
  ADD PRIMARY KEY (`ma_giai_dau`);

--
-- Indexes for table `cau_hinh_giao_dien`
--
ALTER TABLE `cau_hinh_giao_dien`
  ADD PRIMARY KEY (`ma_cau_hinh_giao_dien`),
  ADD KEY `ma_tran_dau` (`ma_tran_dau`);

--
-- Indexes for table `cau_thu`
--
ALTER TABLE `cau_thu`
  ADD PRIMARY KEY (`ma_cau_thu`),
  ADD KEY `ma_doi_bong` (`ma_doi_bong`),
  ADD KEY `ma_vi_tri` (`ma_vi_tri`);

--
-- Indexes for table `cau_thu_giai_dau`
--
ALTER TABLE `cau_thu_giai_dau`
  ADD PRIMARY KEY (`ma_cau_thu`,`ma_giai_dau`),
  ADD KEY `ma_giai_dau` (`ma_giai_dau`),
  ADD KEY `ma_doi_bong` (`ma_doi_bong`),
  ADD KEY `ma_vi_tri` (`ma_vi_tri`);

--
-- Indexes for table `doi_bong`
--
ALTER TABLE `doi_bong`
  ADD PRIMARY KEY (`ma_doi_bong`),
  ADD KEY `ma_ql_doi_bong` (`ma_ql_doi_bong`);

--
-- Indexes for table `doi_bong_giai_dau`
--
ALTER TABLE `doi_bong_giai_dau`
  ADD PRIMARY KEY (`ma_doi_bong`,`ma_giai_dau`),
  ADD KEY `ma_giai_dau` (`ma_giai_dau`),
  ADD KEY `ma_bang_dau` (`ma_bang_dau`);

--
-- Indexes for table `giai_dau`
--
ALTER TABLE `giai_dau`
  ADD PRIMARY KEY (`ma_giai_dau`),
  ADD KEY `ma_nguoi_tao` (`ma_nguoi_tao`);

--
-- Indexes for table `loai_trong_tai`
--
ALTER TABLE `loai_trong_tai`
  ADD PRIMARY KEY (`ma_loai_trong_tai`);

--
-- Indexes for table `nguoi_dung_toan_quoc`
--
ALTER TABLE `nguoi_dung_toan_quoc`
  ADD PRIMARY KEY (`ma_nguoi_dung`),
  ADD KEY `ma_vai_tro` (`ma_vai_tro`);

--
-- Indexes for table `quy_tac_tinh_diem`
--
ALTER TABLE `quy_tac_tinh_diem`
  ADD PRIMARY KEY (`ma_giai_dau`,`ma_vong_dau`),
  ADD KEY `ma_vong_dau` (`ma_vong_dau`);

--
-- Indexes for table `san_van_dong`
--
ALTER TABLE `san_van_dong`
  ADD PRIMARY KEY (`ma_san`),
  ADD KEY `ma_giai_dau` (`ma_giai_dau`);

--
-- Indexes for table `su_kien_tran_dau`
--
ALTER TABLE `su_kien_tran_dau`
  ADD PRIMARY KEY (`ma_su_kien`),
  ADD KEY `ma_tran_dau` (`ma_tran_dau`),
  ADD KEY `ma_cau_thu` (`ma_cau_thu`);

--
-- Indexes for table `tran_dau`
--
ALTER TABLE `tran_dau`
  ADD PRIMARY KEY (`ma_tran_dau`),
  ADD KEY `ma_giai_dau` (`ma_giai_dau`),
  ADD KEY `ma_doi_1` (`ma_doi_1`),
  ADD KEY `ma_doi_2` (`ma_doi_2`),
  ADD KEY `ma_san` (`ma_san`),
  ADD KEY `ma_vong_dau` (`ma_vong_dau`),
  ADD KEY `ma_doi_thang` (`ma_doi_thang`);

--
-- Indexes for table `trong_tai`
--
ALTER TABLE `trong_tai`
  ADD PRIMARY KEY (`ma_trong_tai`),
  ADD KEY `ma_giai_dau` (`ma_giai_dau`),
  ADD KEY `ma_loai_trong_tai` (`ma_loai_trong_tai`);

--
-- Indexes for table `trong_tai_tran_dau`
--
ALTER TABLE `trong_tai_tran_dau`
  ADD PRIMARY KEY (`ma_tran_dau`,`ma_trong_tai`),
  ADD KEY `ma_trong_tai` (`ma_trong_tai`),
  ADD KEY `ma_loai_trong_tai` (`ma_loai_trong_tai`);

--
-- Indexes for table `vai_tro`
--
ALTER TABLE `vai_tro`
  ADD PRIMARY KEY (`ma_vai_tro`);

--
-- Indexes for table `vi_tri_cau_thu`
--
ALTER TABLE `vi_tri_cau_thu`
  ADD PRIMARY KEY (`ma_vi_tri`);

--
-- Indexes for table `vong_dau`
--
ALTER TABLE `vong_dau`
  ADD PRIMARY KEY (`ma_vong_dau`),
  ADD KEY `ma_giai_dau` (`ma_giai_dau`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bang_dau`
--
ALTER TABLE `bang_dau`
  ADD CONSTRAINT `bang_dau_ibfk_1` FOREIGN KEY (`ma_giai_dau`) REFERENCES `giai_dau` (`ma_giai_dau`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `cau_hinh_giai_dau`
--
ALTER TABLE `cau_hinh_giai_dau`
  ADD CONSTRAINT `cau_hinh_giai_dau_ibfk_1` FOREIGN KEY (`ma_giai_dau`) REFERENCES `giai_dau` (`ma_giai_dau`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cau_hinh_giao_dien`
--
ALTER TABLE `cau_hinh_giao_dien`
  ADD CONSTRAINT `cau_hinh_giao_dien_ibfk_1` FOREIGN KEY (`ma_tran_dau`) REFERENCES `tran_dau` (`ma_tran_dau`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `cau_thu`
--
ALTER TABLE `cau_thu`
  ADD CONSTRAINT `cau_thu_ibfk_1` FOREIGN KEY (`ma_doi_bong`) REFERENCES `doi_bong` (`ma_doi_bong`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `cau_thu_ibfk_2` FOREIGN KEY (`ma_vi_tri`) REFERENCES `vi_tri_cau_thu` (`ma_vi_tri`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `cau_thu_giai_dau`
--
ALTER TABLE `cau_thu_giai_dau`
  ADD CONSTRAINT `cau_thu_giai_dau_ibfk_1` FOREIGN KEY (`ma_cau_thu`) REFERENCES `cau_thu` (`ma_cau_thu`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cau_thu_giai_dau_ibfk_2` FOREIGN KEY (`ma_giai_dau`) REFERENCES `giai_dau` (`ma_giai_dau`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cau_thu_giai_dau_ibfk_3` FOREIGN KEY (`ma_doi_bong`) REFERENCES `doi_bong` (`ma_doi_bong`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `cau_thu_giai_dau_ibfk_4` FOREIGN KEY (`ma_vi_tri`) REFERENCES `vi_tri_cau_thu` (`ma_vi_tri`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `doi_bong`
--
ALTER TABLE `doi_bong`
  ADD CONSTRAINT `doi_bong_ibfk_1` FOREIGN KEY (`ma_ql_doi_bong`) REFERENCES `nguoi_dung_toan_quoc` (`ma_nguoi_dung`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `doi_bong_giai_dau`
--
ALTER TABLE `doi_bong_giai_dau`
  ADD CONSTRAINT `doi_bong_giai_dau_ibfk_1` FOREIGN KEY (`ma_doi_bong`) REFERENCES `doi_bong` (`ma_doi_bong`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `doi_bong_giai_dau_ibfk_2` FOREIGN KEY (`ma_giai_dau`) REFERENCES `giai_dau` (`ma_giai_dau`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `doi_bong_giai_dau_ibfk_3` FOREIGN KEY (`ma_bang_dau`) REFERENCES `bang_dau` (`ma_bang_dau`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `giai_dau`
--
ALTER TABLE `giai_dau`
  ADD CONSTRAINT `giai_dau_ibfk_1` FOREIGN KEY (`ma_nguoi_tao`) REFERENCES `nguoi_dung_toan_quoc` (`ma_nguoi_dung`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `nguoi_dung_toan_quoc`
--
ALTER TABLE `nguoi_dung_toan_quoc`
  ADD CONSTRAINT `nguoi_dung_toan_quoc_ibfk_1` FOREIGN KEY (`ma_vai_tro`) REFERENCES `vai_tro` (`ma_vai_tro`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `quy_tac_tinh_diem`
--
ALTER TABLE `quy_tac_tinh_diem`
  ADD CONSTRAINT `quy_tac_tinh_diem_ibfk_1` FOREIGN KEY (`ma_giai_dau`) REFERENCES `giai_dau` (`ma_giai_dau`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quy_tac_tinh_diem_ibfk_2` FOREIGN KEY (`ma_vong_dau`) REFERENCES `vong_dau` (`ma_vong_dau`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `san_van_dong`
--
ALTER TABLE `san_van_dong`
  ADD CONSTRAINT `san_van_dong_ibfk_1` FOREIGN KEY (`ma_giai_dau`) REFERENCES `giai_dau` (`ma_giai_dau`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `su_kien_tran_dau`
--
ALTER TABLE `su_kien_tran_dau`
  ADD CONSTRAINT `su_kien_tran_dau_ibfk_1` FOREIGN KEY (`ma_tran_dau`) REFERENCES `tran_dau` (`ma_tran_dau`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `su_kien_tran_dau_ibfk_2` FOREIGN KEY (`ma_cau_thu`) REFERENCES `cau_thu` (`ma_cau_thu`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `tran_dau`
--
ALTER TABLE `tran_dau`
  ADD CONSTRAINT `tran_dau_ibfk_1` FOREIGN KEY (`ma_giai_dau`) REFERENCES `giai_dau` (`ma_giai_dau`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tran_dau_ibfk_2` FOREIGN KEY (`ma_doi_1`) REFERENCES `doi_bong` (`ma_doi_bong`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tran_dau_ibfk_3` FOREIGN KEY (`ma_doi_2`) REFERENCES `doi_bong` (`ma_doi_bong`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tran_dau_ibfk_4` FOREIGN KEY (`ma_san`) REFERENCES `san_van_dong` (`ma_san`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tran_dau_ibfk_5` FOREIGN KEY (`ma_vong_dau`) REFERENCES `vong_dau` (`ma_vong_dau`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tran_dau_ibfk_6` FOREIGN KEY (`ma_doi_thang`) REFERENCES `doi_bong` (`ma_doi_bong`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `trong_tai`
--
ALTER TABLE `trong_tai`
  ADD CONSTRAINT `trong_tai_ibfk_1` FOREIGN KEY (`ma_giai_dau`) REFERENCES `giai_dau` (`ma_giai_dau`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `trong_tai_ibfk_2` FOREIGN KEY (`ma_loai_trong_tai`) REFERENCES `loai_trong_tai` (`ma_loai_trong_tai`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `trong_tai_tran_dau`
--
ALTER TABLE `trong_tai_tran_dau`
  ADD CONSTRAINT `trong_tai_tran_dau_ibfk_1` FOREIGN KEY (`ma_tran_dau`) REFERENCES `tran_dau` (`ma_tran_dau`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `trong_tai_tran_dau_ibfk_2` FOREIGN KEY (`ma_trong_tai`) REFERENCES `trong_tai` (`ma_trong_tai`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `trong_tai_tran_dau_ibfk_3` FOREIGN KEY (`ma_loai_trong_tai`) REFERENCES `loai_trong_tai` (`ma_loai_trong_tai`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `vong_dau`
--
ALTER TABLE `vong_dau`
  ADD CONSTRAINT `vong_dau_ibfk_1` FOREIGN KEY (`ma_giai_dau`) REFERENCES `giai_dau` (`ma_giai_dau`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
