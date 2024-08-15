const donHangModel = require('../model/donHang');
const accountModel = require('../model/account');

exports.home = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const doanhThu = await this.tongDoanhThu(startDate, endDate);
    const nguoiDung = await this.tongNguoiDung();
    const donHang = await this.tongDonHang(startDate, endDate);
    const donHuy = await this.donHangDaHuy(startDate, endDate);
    const soLuongSP = await this.soLuongSPBanRa(startDate, endDate);
    const topSPDoanhThuCao = await this.topSPDoanhThuCao(startDate, endDate);
    const topSPBanChay = await this.topSPBanChay(startDate, endDate);
    const topNguoiDungMuaNhieuNhat = await this.topNguoiDungMuaNhieuNhat(startDate, endDate);
    
    account = req.session.account;
    res.render("home/home", {
      title: "Home",
      account: account,
      doanhThu,
      nguoiDung,
      donHang,
      donHuy,
      soLuongSP,
      topSPDoanhThuCao,
      topSPBanChay,
      topNguoiDungMuaNhieuNhat
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Có lỗi xảy ra");
  }
};

exports.tongDoanhThu = async () => {
  const doanhThu = await donHangModel.aggregate([
    { $match: { trangThaiDonHang: "Đã giao hàng" } },
    { $group: { _id: null, total: { $sum: "$tongTien" } } }
  ]);
  return doanhThu[0]?.total || 0;
};

exports.tongNguoiDung = async () => {
  const soNguoiDung = await accountModel.countDocuments();
  return soNguoiDung;
};

exports.tongDonHang = async () => {
  const soDonHang = await donHangModel.countDocuments();
  return soDonHang;
};

exports.donHangDaHuy = async () => {
  const soDonHuy = await donHangModel.countDocuments({ trangThaiDonHang: ["Chờ xác nhận","Đang xử lý"] });
  return soDonHuy;
};

exports.soLuongSPBanRa = async () => {
  const sanPhamDaBan = await donHangModel.aggregate([
    { $match: { trangThaiDonHang: "Đã giao hàng" } },
    { $unwind: "$sp" },
    { $group: { _id: null, totalSold: { $sum: "$sp.soLuong" } } }
  ]);
  return sanPhamDaBan[0]?.totalSold || 0;
};





exports.topSPBanChay = async (startDate, endDate) => {
  const query = { trangThaiDonHang: "Đã giao hàng" };
  
  if (startDate && endDate) {
    query.ngayGiaoHang = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const topSellingProducts = await donHangModel.aggregate([
    { $match: query },
    { $unwind: "$sp" },
    { 
      $lookup: {
        from: "DienThoai", 
        localField: "sp.idSP",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    { $unwind: "$productDetails" },
    { 
      $group: { 
        _id: "$sp.idSP", 
        tenSP: { $first: "$productDetails.tenDienThoai" }, 
        hinhAnh: { $first: "$productDetails.hinhAnh" }, 
        soLuongBan: { $sum: "$sp.soLuong" } 
      }
    },
    { $sort: { soLuongBan: -1 } },
    { $limit: 5 }
  ]);

  return topSellingProducts;
};


exports.topSPDoanhThuCao = async (startDate, endDate) => {
  const query = { trangThaiDonHang: "Đã giao hàng" };
  
  if (startDate && endDate) {
    query.ngayGiaoHang = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const result = await donHangModel.aggregate([
    { $match: query },
    { $unwind: "$sp" },
    {
      $group: {
        _id: "$sp.idSP",
        totalQuantity: { $sum: "$sp.soLuong" },
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
        doanhThu: {
          $multiply: [
            "$totalQuantity",
            { $arrayElemAt: ["$productDetails.mauSchema.giaTien", 0] }
          ]
        }
      }
    },
    { $sort: { doanhThu: -1 } },
    { $limit: 10 }
  ]);

  return result;
};



exports.topNguoiDungMuaNhieuNhat = async (startDate, endDate) => {
  const query = { trangThaiDonHang: "Đã giao hàng" };
  
  if (startDate && endDate) {
    query.ngayGiaoHang = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const topUsers = await donHangModel.aggregate([
    { $match: query },
    { $unwind: "$sp" },
    { 
      $group: {
        _id: { userId: "$idKH", productId: "$sp.idSP" },
        soLuong: { $sum: "$sp.soLuong" }, 
        tongTien: { $sum: "$tongTien" }
      }
    },
    { 
      $lookup: {
        from: "Account", 
        localField: "_id.userId",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    { $unwind: "$userDetails" },
    { 
      $lookup: {
        from: "DienThoai", 
        localField: "_id.productId",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    { $unwind: "$productDetails" },
    { 
      $group: {
        _id: "$_id.userId",
        tenNguoi: { $first: "$userDetails.taiKhoan" },
        soLuong: { $sum: "$soLuong" },
        tongTien: { $sum: "$tongTien" },
        sanPham: { $push: { tenSP: "$productDetails.tenDienThoai", soLuong: "$soLuong" } }
      }
    },
    { $sort: { tongTien: -1 } },
    { $limit: 5 }
  ]);

  return topUsers;
};

