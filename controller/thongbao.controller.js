require('dotenv').config();
const axios = require('axios');
const { google } = require('google-auth-library');

exports.home = (req, res, next) => {
    const user = req.session.Account;
    res.render('thongbao/home_thongbao', { title: "Gửi thông báo", user: user, message: "" });
};

exports.sendNotification = async (req, res) => {
    try {
        const { tieu_de, noi_dung } = req.body;
        // Gửi thông báo qua API
        await sendFirebaseNotification(tieu_de, noi_dung, '/topics/FpolyPhone');
        const message = 'Thông báo đã được gửi thành công';
        // Trả về phản hồi JSON chứa thông điệp thành công
        res.status(200).json({ success: true, message: message });
    } catch (error) {
        console.error('Error sending notification:', error);
        // Trả về phản hồi JSON nếu có lỗi
        res.status(500).json({ success: false, message: 'Error sending notification' });
    }
};

async function sendFirebaseNotification(tieuDe, noiDung, to) {
    const fcmUrl = 'https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send';

    const client = new google.auth.JWT({
        email: process.env.CLIENT_EMAIL,
        key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/firebase.messaging']
    });

    const accessToken = await client.authorize();

    const notificationData = {
        message: {
            topic: to,
            notification: {
                title: tieuDe,
                body: noiDung
            },
            data: {
                story_id: "story_12345"
            }
        }
    };

    try {
        const response = await axios.post(fcmUrl, notificationData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken.access_token}`
            }
        });

        console.log('Firebase notification sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending Firebase notification:', error.response ? error.response.data : error.message);
        throw error;
    }
}
