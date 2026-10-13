const fs = require('node:fs');
const { sendMail } = require('../utils/mailer');

const contact = async (req, res) => {
    try {
        const { name, email, subject, description } = req.body;
        console.log(req.body);

        const mailOptions = {
            // from ყოველთვის საკუთარი, ავთენტიფიცირებული დომენია — თორემ ვიზიტორის
            // მისამართით გაგზავნა SPF/DKIM-ს არღვევს და დომენს spam-ში აგდებს.
            // ვიზიტორის მისამართი replyTo-ში მიდის, რომ პასუხი პირდაპირ მას მისწვდეს.
            from: '"Flyinspectors" <info@flyinspectors.com>',
            replyTo: email,
            to: "info@flyinspectors.com",
            subject: subject,
            text: `სახელი: ${name}\nემაილი: ${email}\nსათაური: ${subject}\nაღწერა: ${description}`,
            html: `
          <p>სახელი: ${name}</p>
          <p>ემაილი: ${email}</p>
          <p>სათაური: ${subject}</p>
          <p>აღწერა: ${description}</p>
        `,
        };

        // SMTP კონფიგურაცია და პაროლი utils/mailer.js-შია; პაროლის ცვლილებაზე
        // sendMail თავად იღებს ახალს ბაზიდან (იხ. isAuthError-ის ხელახალი ცდა).
        const info = await sendMail(mailOptions);
        console.log("Email sent:", info.response);

        // ✅ აუცილებლად დაბრუნე პასუხი
        return res.status(200).json({ message: "მაილი წარმატებით გაიგზავნა" });

    } catch (error) {
        console.error("შეცდომა:", error);
        return res.status(500).json({ message: "მეილის გაგზავნა ვერ მოხერხდა" });
    }
};


module.exports = { contact }