const fs = require('node:fs');

const contact = async (req, res) => {
    try {
        const { 
            
            name,
            email,
            subject,
            description,
        } = req.body;
        console.log(req.body)

        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            // host: 'business66.web-hosting.com',
            port: 465, // 465 for SSL or 587 for STARTTLS
            secure: true, // Use true for 465, false for other ports
            auth: {
                user: 'info@flyinspectors.com',
                pass: 'rhri wubo gmks kizy',
                // user: 'mailsend@flyinspectors.com', // Your email
                // pass: '-VV6jcEThhWT', // Your email password or app password
            },
        });

        var mailOptions = {
            from: email,
            to: `info@flyinspectors.com`,
            //   to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
            // text: text,
            subject: subject,
            html: `
                <p>სახელი: ${name}</p>
                <p>ემაილი: ${email}</p>
                <p>სათური: ${subject}</p>
                <p>აღწერა: ${description}</p>
                `
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong while getting cars!");
    }
};

module.exports = {contact}