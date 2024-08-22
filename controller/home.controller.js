const donHangModel = require("../model/donHang");
const accountModel = require("../model/account");

exports.home = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const doanhThu = await this.tongDoanhThu(startDate, endDate);
    const nguoiDung = await this.tongNguoiDung(startDate, endDate);
    const donHang = await this.tongDonHang(startDate, endDate);
    const donHuy = await this.donHangDaHuy(startDate, endDate);
    const soLuongSP = await this.soLuongSPBanRa(startDate, endDate);
    const topSPDoanhThuCao = await this.topSPDoanhThuCao(startDate, endDate);
    const topSPBanChay = await this.topSPBanChay(startDate, endDate);
    const topNguoiDungMuaNhieuNhat = await this.topNguoiDungMuaNhieuNhat(
      startDate,
      endDate
    );

    account = req.session.account;
    res.render("home/home", {
      title: "Home",
      account: account,
      startDate, // Pass startDate to the view
      endDate, 
      doanhThu,
      nguoiDung,
      donHang,
      donHuy,
      soLuongSP,
      topSPDoanhThuCao,
      topSPBanChay,
      topNguoiDungMuaNhieuNhat,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Có lỗi xảy ra");
  }
};

exports.tongDoanhThu = async (startDate, endDate) => {
  const query = { trangThaiDonHang: "Đã giao hàng" };

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    query.ngayNhanHang = { $gte: start, $lte: end };
  }

  const doanhThu = await donHangModel.aggregate([
    { $match: query },
    { $group: { _id: null, total: { $sum: "$tongTien" } } },
  ]);

  return doanhThu[0]?.total || 0;
};

exports.tongNguoiDung = async (startDate, endDate) => {
  const query = { trangThaiDonHang: "Đã giao hàng" };

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    query.ngayNhanHang = { $gte: start, $lte: end };
  }

  const uniqueUsers = await donHangModel.distinct("idKH", query);
  return uniqueUsers.length;
};

exports.tongDonHang = async (startDate, endDate) => {
  const query = { trangThaiDonHang: "Đã giao hàng" };

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    query.ngayNhanHang = { $gte: start, $lte: end };
  }

  const soDonHang = await donHangModel.countDocuments(query);
  return soDonHang;
};

exports.donHangDaHuy = async (startDate, endDate) => {
  const query = { trangThaiDonHang: ["Chờ xác nhận", "Đang xử lý"] };

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    query.ngayNhanHang = { $gte: start, $lte: end };
  }

  const soDonHuy = await donHangModel.countDocuments(query);
  return soDonHuy;
};

exports.soLuongSPBanRa = async (startDate, endDate) => {
  const query = { trangThaiDonHang: "Đã giao hàng" };

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    query.ngayNhanHang = { $gte: start, $lte: end };
  }

  const sanPhamDaBan = await donHangModel.aggregate([
    { $match: query },
    { $unwind: "$sp" },
    { $group: { _id: null, totalSold: { $sum: "$sp.soLuong" } } },
  ]);

  return sanPhamDaBan[0]?.totalSold || 0;
};

exports.topSPBanChay = async (startDate, endDate) => {
  const query = { trangThaiDonHang: "Đã giao hàng" };

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    query.ngayNhanHang = { $gte: start, $lte: end };
  }

  const topSellingProducts = await donHangModel.aggregate([
    { $match: query },
    { $unwind: "$sp" },
    {
      $lookup: {
        from: "DienThoai",
        localField: "sp.idSP",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $group: {
        _id: "$sp.idSP",
        tenSP: { $first: "$productDetails.tenDienThoai" },
        hinhAnh: { $first: "$productDetails.hinhAnh" },
        soLuongBan: { $sum: "$sp.soLuong" },
      },
    },
    { $sort: { soLuongBan: -1 } },
    { $limit: 5 },
  ]);

  return topSellingProducts;
};

exports.topSPDoanhThuCao = async (startDate, endDate) => {
  const query = { trangThaiDonHang: "Đã giao hàng" };

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    query.ngayNhanHang = { $gte: start, $lte: end };
  }

  const result = await donHangModel.aggregate([
    { $match: query },
    { $unwind: "$sp" },
    {
      $group: {
        _id: "$sp.idSP",
        totalQuantity: { $sum: "$sp.soLuong" },
        totalRevenue: { $sum: { $multiply: ["$sp.soLuong", "$sp.giaTien"] } },
      },
    },
    {
      $lookup: {
        from: "DienThoai",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $project: {
        _id: 1,
        tenSP: "$productDetails.tenDienThoai",
        hinhAnh: "$productDetails.hinhAnh",
        doanhThu: "$totalRevenue",
      },
    },
    { $sort: { doanhThu: -1 } },
    { $limit: 10 },
  ]);

  return result;
};


exports.topNguoiDungMuaNhieuNhat = async (startDate, endDate) => {
  const query = { trangThaiDonHang: "Đã giao hàng" };

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    query.ngayNhanHang = { $gte: start, $lte: end };
  }

  const topUsers = await donHangModel.aggregate([
    { $match: query },
    { $unwind: "$sp" },
    {
      $group: {
        _id: { userId: "$idKH", productId: "$sp.idSP" },
        soLuong: { $sum: "$sp.soLuong" },
        tongTien: { $sum: { $multiply: ["$sp.soLuong", "$sp.giaTien"] } }, // Tính tổng tiền dựa trên số lượng và giá của từng sản phẩm
      },
    }
    ,
    {
      $lookup: {
        from: "Account",
        localField: "_id.userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },
    {
      $lookup: {
        from: "DienThoai",
        localField: "_id.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $group: {
        _id: "$_id.userId",
        tenNguoi: { $first: "$userDetails.taiKhoan" },
        soLuong: { $sum: "$soLuong" },
        tongTien: { $sum: "$tongTien" },
        sanPham: {
          $push: { tenSP: "$productDetails.tenDienThoai", soLuong: "$soLuong" },
        },
      },
    },
    { $sort: { tongTien: -1 } },
    { $limit: 5 },
  ]);

  return topUsers;
};
