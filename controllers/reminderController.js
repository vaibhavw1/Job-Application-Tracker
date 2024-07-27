const brevo = require('@getbrevo/brevo');
const axios = require('axios');
const Reminder = require('../models/reminder');

try {
    let defaultClient = brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_KEY;
} catch (error) {
    console.error('Error initializing Brevo API client:', error);
    // Handle or log the error appropriately
}

exports.remindAfterPost = async (req, res, next) => {
    try {
        const applicationId = req.body.applicationId;
        const date = req.body.date;
        const email = req.user.email;
        const d = new Date(date);
        const dUnix = Math.floor(d.getTime() / 1000);

        if ((Date.now() - dUnix) <= 0) {
            return res.status(400).json({ message: "Please enter after how many days the reminder should go off!", success: false });
        }

        let apiInstance = new brevo.TransactionalEmailsApi();
        let sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.subject = "{{params.subject}}";
        sendSmtpEmail.htmlContent = "<h1> Reminder to check your application </h1>";
        sendSmtpEmail.sender = { "name": "Admin", "email": "vaibhavwakde266@gmail.com" };
        sendSmtpEmail.to = [
            { "email": email, "name": "Subscriber" }
        ];
        sendSmtpEmail.params = { "subject": "reminder", "email": email };
        sendSmtpEmail.scheduledAt = d.toISOString();

        const returnData = await apiInstance.sendTransacEmail(sendSmtpEmail);

        const { id } = await Reminder.create({
            remindAfter: d.toDateString(),
            applicationId: applicationId
        });

        res.status(201).json({ message: "Reminder created", success: true, remindId: id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
}
