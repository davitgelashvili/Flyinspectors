const fs = require('node:fs');

const contact = async (req, res) => {
    try {
        const { name, email, subject, description } = req.body;
        console.log(req.body);

        const nodemailer = require("nodemailer");

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "info@flyinspectors.com",
                pass: "rhri wubo gmks kizy", // App password
            },
        });

        const mailOptions = {
            from: email,
            to: "info@flyinspectors.com",
            subject: subject,
            html: `
          <p>სახელი: ${name}</p>
          <p>ემაილი: ${email}</p>
          <p>სათაური: ${subject}</p>
          <p>აღწერა: ${description}</p>
        `,
        };

        // ✅ await-ით გაგზავნა
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        // ✅ აუცილებლად დაბრუნე პასუხი
        return res.status(200).json({ message: "მაილი წარმატებით გაიგზავნა" });

    } catch (error) {
        console.error("შეცდომა:", error);
        return res.status(500).json({ message: "მეილის გაგზავნა ვერ მოხერხდა" });
    }
};


module.exports = { contact }