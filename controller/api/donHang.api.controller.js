const donHangModel = require("../../model/donHang");
const khuyenMaiModel = require("../../model/khuyenMai");
const { DienThoai } = require("../../model/sanPham");
const thongBaoModel = require("../../model/thongBao");

// thêm don hang
exports.createDonHang = async (req, res, next) => {
  let soLuong = req.body.soLuong;
  let tongTien = req.body.tongTien;
  let idKH = req.body.idKH;
  let sp = req.body.sp;
  let idDiaChi = req.body.idDiaChi;
  let trangThaiThanhToan = req.body.trangThaiThanhToan;
  let ghiChu = req.body.ghiChu;
  let ngayDatHang = req.body.ngayDatHang;
  let ngayNhanHang = req.body.ngayNhanHang;
  let diaChiGiaoHang = req.body.diaChiGiaoHang;
  let trangThaiDonHang = req.body.trangThaiDonHang;
  let phuongThucThanhToan = req.body.phuongThucThanhToan;
  let idKM = req.body.idKM;

  if (idKM) {
    // Kiểm tra nếu có idKM được truyền vào
    const khuyenMai = await khuyenMaiModel.findOne({ _id: idKM }); // Lấy ra khuyến mại theo idKM được truyền vào trong create đơn hàng
    const updatedKhuyenMai = await khuyenMaiModel.findOneAndUpdate(
      // Tiến hành update khuyến mại đó
      { _id: khuyenMai._id },
      {
        soLuong: khuyenMai.soLuong - 1, // Trừ số lượng đi 1
        soLanApDung: khuyenMai.soLanApDung + 1, // Cộng số lần áp dụng lên 1
      },
      { new: true }
    );

    if (khuyenMai.soLuong === 1) {
      // Nếu số lượng của khuyến mại trước khi update = 1
      const updatedKhuyenMai = await khuyenMaiModel.findOneAndUpdate(
        { _id: khuyenMai._id },
        { trangThai: false }, // Tiến hành update trạng thái của khuyến mại đó là false, khuyến mại hết hiệu lực
        { new: true }
      );
    }
  }

  let tenDienThoai = [];

  try {
    for (const item of sp) {
      // Sử dụng vòng lặp for để lặp trong mảng sp
      // Tìm sản phẩm theo idSP
      const dienThoai = await DienThoai.findById(item.idSP); // Lấy ra điện thoại có id = item.idSP

      if (dienThoai) {
        tenDienThoai.push(dienThoai.tenDienThoai); // Tiến hành push tên điện thoại vào mảng tenDienThoai để khi create đơn hàng xong sẽ gửi thông báo cho user về danh sách các sản phẩm

        // Tìm đúng màu trong mauSchema
        const selectedMau = dienThoai.mauSchema.find(
          (mau) => mau._id.toString() === item.idMau.toString() // Từ điện thoại lấy ra được, tiến hành tìm màu của chiếc điện thoại đó,
          // tương ứng với idMau được truyền khi create donHang => (tem.idMau.toString())
        );

        if (selectedMau) {
          // Sau khi đã lấy ra được màu sắc
          // Cập nhật số lượng của màu
          selectedMau.soLuong -= item.soLuong; // Tiến hành trừ số lượng màu với số lượng khi người dùng mua sản phẩm đó => (item.soLuong)

          // Lưu lại sản phẩm với số lượng màu đã cập nhật
          await dienThoai.save(); // Tiến hành câp nhật lại điện thoại
        } else {
          return res
            .status(400)
            .json({ message: `Không tìm thấy màu với id ${item.idMau}` });
        }
      } else {
        return res
          .status(400)
          .json({ message: `Không tìm thấy sản phẩm với id ${item.idSP}` });
      }
    }

    let addFields = {
      soLuong: soLuong,
      tongTien: tongTien,
      idKH: idKH,
      sp: sp,
      idDiaChi: idDiaChi,
      trangThaiThanhToan: trangThaiThanhToan,
      ghiChu: ghiChu,
      ngayDatHang: ngayDatHang,
      ngayNhanHang: ngayNhanHang,
      diaChiGiaoHang: diaChiGiaoHang,
      trangThaiDonHang: trangThaiDonHang,
      phuongThucThanhToan: phuongThucThanhToan,
      idKM: idKM,
    };

    const formattedTongTien = tongTien.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    let addItems = await donHangModel.create(addFields); // Tiến hành tạo đơn hàng, với các trường được truyền vào

    await thongBaoModel.create({
      // Khi tạo đơn hàng thành công, tiến hành gửi thông báo cho user đã đặt đơn hàng
      idDonHang: addItems._id,
      idAccount: idKH,
      tieuDe: "Đặt hàng thành công!",
      noiDung: `Đơn hàng của bạn với mã đơn hàng ${
        addItems._id
      } đã được đặt thành công với tổng tiền là ${formattedTongTien}. Sản phẩm: ${tenDienThoai.join(
        ", "
      )}.`,
    });

    res
      .status(201)
      .json({ message: "Thêm đơn hàng thành công", newItem: addItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// lấy tất cả các dữ liệu
exports.listDonHang = async (req, res, next) => {
  try {
    const donHang = await donHangModel // Tiến hàng lấy tất cả đơn hàng
      .find()
      .populate("idKH") // Lấy ra thông tin của tất cả Khách hàng từ idKH
      .populate({
        path: "sp.idSP", // Lấy ra thông tin của tất cả sản phẩm từ idSP
        model: "DienThoai",
      })
      .populate("idDiaChi") // Lấy ra thông tin của tất cả địa chỉ từ idDiaChi
      .sort({ ngayDatHang: -1 }); // Sắp xếp những đơn hàng có ngayDatHang gần nhất lên trên đầu

    if (donHang.length > 0) {
      res.json({
        status: 200,
        msg: "Lấy dữ liệu đơn hang thành công",
        data: donHang,
      });
    } else {
      res.json({
        status: 204,
        msg: "Không có dữ liệu don hàng",
        data: [],
      });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};

exports.getDonHangByIDKH = async (req, res, next) => {
  try {
    // Lấy idKH từ params
    const idKH = req.params.idKH;

    // Tìm đơn hàng với idKH tương ứng, populate các trường liên quan và sắp xếp theo thứ tự ngược lại
    const donHang = await donHangModel
      .find({ idKH: idKH }) // Tiến hàng lấy tất cả đơn hàng theo idKH
      .populate("idKH") // Lấy ra thông tin của tất cả Khách hàng từ idKH
      .populate({
        path: "sp.idSP", // Lấy ra thông tin của tất cả sản phẩm từ idSP
        model: "DienThoai",
      })
      .populate("idDiaChi") // Lấy ra thông tin của tất cả địa chỉ từ idDiaChi
      .sort({ ngayDatHang: -1 }); // Sắp xếp những đơn hàng có ngayDatHang gần nhất lên trên đầu

    if (donHang.length > 0) {
      // Nếu đơn hàng lấy ra có độ dài lớn hơn 0
      res.json({
        status: 200,
        msg: "Lấy dữ liệu đơn hàng theo ID khách hàng thành công",
        data: donHang,
      });
    } else {
      res.json({
        // Nếu không lấy được đơn hàng
        status: 204,
        msg: "Không có dữ liệu đơn hàng cho ID khách hàng này",
        data: [],
      });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};

// Delete by ID
exports.deleteDonHang = async (req, res, next) => {
  try {
    await donHangModel.deleteOne({ _id: req.params.id }); // Tiến hành xóa đơn hàng theo ID đơn hàng
    res.json({ status: 200, msg: "Xóa don hang thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};

// cập nhật trạng thái đơn hàng
exports.updateDonHang = async (req, res, next) => {
  try {
    let trangThaiDonHang = req.body.trangThaiDonHang;
    let trangThaiThanhToan = req.body.trangThaiThanhToan; // Tiến hành update đơn hàng theo trạng thái đơn hàng và trạng thái thanh toán

    // Lấy thông tin đơn hàng hiện tại trước khi cập nhật
    const donHang = await donHangModel
      .findById(req.params.id)
      .populate("sp.idSP"); // Lấy ra đầy đủ thông tin của sản phẩm

    if (!donHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Lấy tên điện thoại từ mảng sản phẩm trong đơn hàng để thực hiện việc thông báo tên điện thoại đến user
    const tenDienThoai = donHang.sp.map((item) => item.idSP.tenDienThoai);

    // Cập nhật trạng thái đơn hàng
    let updatedDonHang = await donHangModel.findByIdAndUpdate(
      // Tiến hành update đơn với id đơn hàng được truyền vào và update trangThaiDonHang và trangThaiThanhToan
      req.params.id,
      {
        trangThaiDonHang: trangThaiDonHang,
        trangThaiThanhToan: trangThaiThanhToan,
      },
      { new: true }
    );

    let tieuDe;
    let noiDung;

    switch (trangThaiDonHang) {
      case "Đang xử lý": // Tiến hành gửi thông báo nếu đơn hàng đang xử lý
        tieuDe = "Đơn hàng đang xử lý!";
        noiDung = `Đơn hàng của bạn đang được xử lý. Mã đơn hàng: ${
          updatedDonHang._id
        }. Sản phẩm: ${tenDienThoai.join(", ")}.`;
        break;
      case "Đang giao hàng": // Tiến hành gửi thông báo nếu đơn hàng đang giao
        tieuDe = "Đơn hàng đang được giao!";
        noiDung = `Đơn hàng của bạn đang được giao. Mã đơn hàng: ${
          updatedDonHang._id
        }. Sản phẩm: ${tenDienThoai.join(", ")}.`;
        break;
      case "Đã giao hàng": // Tiến hành gửi thông báo nếu đơn hàng đã giao thành công
        tieuDe = "Đơn hàng đã được giao!";
        noiDung = `Đơn hàng của bạn đã được giao thành công. Mã đơn hàng: ${
          updatedDonHang._id
        }. Sản phẩm: ${tenDienThoai.join(", ")}.`;
        break;
      case "Đã hủy": // Tiến hành gửi thông báo nếu đơn hàng đã bị hủy
        tieuDe = "Đơn hàng đã bị hủy!";
        noiDung = `Đơn hàng của bạn đã bị hủy. Mã đơn hàng: ${
          updatedDonHang._id
        }. Sản phẩm: ${tenDienThoai.join(", ")}.`;

        for (const item of updatedDonHang.sp) {
          // Lặp qua mảng sp của mảng updatedDonHang
          const dienThoai = await DienThoai.findById(item.idSP); // tiến hành tìm điện thoại theo idSP của item

          if (dienThoai) {
            // Nếu điện thoại được tìm thấy
            const selectedMau = dienThoai.mauSchema.find(
              (mau) => mau._id.toString() === item.idMau.toString() // Tiến hành tìm màu của điện thoại đó theo idMau của item
            );

            if (selectedMau) {
              // Nếu tìm thấy màu tương ứng
              selectedMau.soLuong += item.soLuong; // Cộng lại số lượng của điện thoại có màu đã được tìm thấy với sô lượng của số lượng sản phẩm trong đơn hàng, vì đơn hàng đã bị hủy nên số lượng cần được cập nhật lại
              await dienThoai.save(); // Tiến hành update dienThoai
            } else {
              return res
                .status(400)
                .json({ message: `Không tìm thấy màu với id ${item.idMau}` });
            }
          } else {
            return res
              .status(400)
              .json({ message: `Không tìm thấy sản phẩm với id ${item.idSP}` });
          }
        }

        break;
      default:
        tieuDe = "Cập nhật đơn hàng";
        noiDung = `Đơn hàng của bạn đã được cập nhật. Mã đơn hàng: ${
          updatedDonHang._id
        }. Sản phẩm: ${tenDienThoai.join(", ")}.`;
        break;
    }

    // Tạo thông báo cho khách hàng
    await thongBaoModel.create({
      // tiến hành gửi thông báo đến user
      idDonHang: updatedDonHang._id,
      idAccount: updatedDonHang.idKH,
      tieuDe: tieuDe,
      noiDung: noiDung,
    });

    res.json({
      status: 200,
      message: "Cập nhật trạng thái đơn hàng thành công",
      updatedDonHang: updatedDonHang,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
