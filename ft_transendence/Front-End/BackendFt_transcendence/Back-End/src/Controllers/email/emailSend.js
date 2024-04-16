import  nodemailer from 'nodemailer';

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    secure: true, // Use secure connection (TLS)
    tls: {
        rejectUnauthorized: false // Ignore unauthorized certificates (use this cautiously)
    }
});

//send a confirmation code to the client's email
export default function CheckEmail(clientEmail, confirmEmailCode) {

    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: clientEmail,
            subject: 'Confirm Email',
            text: 'Hi, this is a test email Confirm your email address on the site\n [' + confirmEmailCode + "]",
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                let obj = { "status": false, "message": error };
                reject(obj);
            } else {
                let obj = { "status": true, "message": info.response };
                resolve(obj);
            }
        });
    });
}

