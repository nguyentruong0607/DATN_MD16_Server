require('dotenv').config();
const axios = require('axios');
exports.home = (req,res,next)=>{
    const user = req.session.Account;
    res.render('thongbao/home_thongbao',{title: "Gửi thông báo" , user :  user,message:""});
}
exports.sendNotification = async (req, res) => {
    try {
        const { tieu_de, noi_dung } = req.body;
        // Gửi thông báo qua API
        await sendFirebaseNotification(tieu_de, noi_dung, '/topics/FpolyPhone');
        const message ='Thông báo đã được gửi thành công';
        // Trả về phản hồi JSON chứa thông điệp thành công
        res.status(200).json({ success: true, message: message });
    } catch (error) {
        console.error('Error sending notification:', error);
        // Trả về phản hồi JSON nếu có lỗi
        res.status(500).json({ success: false, message: 'Error sending notification' });
    }
};
async function sendFirebaseNotification(tieuDe, noiDung, to) {
    const fcmUrl = 'https://fcm.googleapis.com/v1/projects/fpolyphone-10302/messages:send';
    const fcmKey = process.env.FCM_KEY;

    const notificationData = {
        data: {
            tieu_de: tieuDe,
            noi_dung: noiDung
        },
        to: to
    };
    try {
        const response = await axios.post(fcmUrl, notificationData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${fcmKey}`
            }
        });

        console.log('Firebase notification sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending Firebase notification:', error.response ? error.response.data : error.message);
        throw error;
    }
}
