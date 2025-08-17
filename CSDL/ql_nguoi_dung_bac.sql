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
-- Database: `ql_nguoi_dung_bac`
--

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `ma_nguoi_dung` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `ho_ten` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `gioi_tinh` enum('Nam','Nữ') COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `so_dien_thoai` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `ngay_sinh` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`ma_nguoi_dung`, `ho_ten`, `gioi_tinh`, `email`, `so_dien_thoai`, `ngay_sinh`) VALUES
('nd2', 'Lê Văn TIẽn ttt', 'Nam', 'nd1ttt@gmail.com', '01234897855', '2025-07-14'),
('ndtq_0007', 'Lê Văn TIên', 'Nam', '11111@gmail.com', '01234897855', '2025-07-29');

-- --------------------------------------------------------

--
-- Table structure for table `tai_khoan`
--

CREATE TABLE `tai_khoan` (
  `ma_nguoi_dung` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `ten_dang_nhap` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `mat_khau` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `trang_thai` enum('Hoạt động','Bị khóa') COLLATE utf8mb4_vietnamese_ci DEFAULT 'Bị khóa',
  `ngay_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `tai_khoan`
--

INSERT INTO `tai_khoan` (`ma_nguoi_dung`, `ten_dang_nhap`, `mat_khau`, `trang_thai`, `ngay_tao`) VALUES
('nd2', 'bac1', '$2b$10$umfPIAiqDzMCxaFOfNCoQejuiUDfQ443qjZ0FnLgfzrb7ZW8IfA5m', 'Hoạt động', '2025-08-13 17:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`ma_nguoi_dung`);

--
-- Indexes for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  ADD PRIMARY KEY (`ma_nguoi_dung`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  ADD CONSTRAINT `fk_tai_khoan_B_nguoi_dung_B` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
