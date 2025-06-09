const fs = require('fs');
const nodemailer = require('nodemailer');

const emailSend = async (req, res) => {
    try {
        const { 
            passportImage,
            ticketImage,
            otherImage,
            signature,
            userId,
            firstName,
            lastName,
            phone,
            email,
            city,
            address,
            problem,
            flightNumber,
            date,
            select,
            description,
        } = req.body;
        
        const transporter = nodemailer.createTransport({
            // host: 'smtp.example.com', // SMTP server address (e.g., smtp.gmail.com for Gmail)
            // host: 'mail.flyinspectors.com',
            host: 'business66.web-hosting.com',
            port: 465, // 465 for SSL or 587 for STARTTLS
            secure: true, // Use true for 465, false for other ports
            auth: {
                user: 'mailsend@flyinspectors.com', // Your email
                // pass: 'ha5Pm!!7Y&!3', // Your email password or app password
                // user: 'mailsend@flyinspectors.co.uk', // Your email
                pass: '-VV6jcEThhWT', // Your email password or app password
            },
        });

        const mailOptions = {
            from: 'mailsend@flyinspectors.com',
            replyTo: `${email}`,
            to: `team@flyinspectors.com`,
            subject: `Compensation Form - ${userId}`,
            attachments: [
                {
                    filename: 'pasport-image.jpg',
                    path: String(passportImage)
                },
                {
                    filename: 'ticket-image.jpg',
                    path: String(ticketImage)
                },
                {
                    filename: 'other-image.jpg',
                    path: String(otherImage)
                },
                {
                    filename: 'signature.png',
                    path: String(signature)
                }
            ],
            // text: 'Hello, this is a test email!',
            html: `
                <p>ID: ${userId}</p>
                <p>First Name: ${firstName}</p>
                <p>Last Name: ${lastName}</p>
                <p>Phone: ${phone}</p>
                <p>E-mail: ${email}</p>
                <br />
                <p>City: ${city}</p>
                <p>Address: ${address}</p>
                <br />
                <p>Problem: ${problem}</p>
                <p>Flight Number: ${flightNumber}</p>
                <p>Flight Date: ${date}</p>
                <p>Select: ${select}</p>
                <p>Description: ${description}</p>
            `
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                return res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).send('Email sent successfully');
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send("Something went wrong while sending the email!");
    }
};

module.exports = { emailSend };























// const fs = require('fs');
// const nodemailer = require('nodemailer');

// const emailSend = async (req, res) => {
//     try {
//         const { 
//             passportImage,
//             ticketImage,
//             otherImage,
//             signature,
//             userId,
//             firstName,
//             lastName,
//             phone,
//             email,
//             city,
//             address,
//             problem,
//             flightNumber,
//             date,
//             select,
//             description,
//         } = req.body;
        
//         // Assuming passportImage, ticketImage, otherImage, and signature are file paths or base64 encoded
//         console.log('dataaaa::::', req.body);

//         var transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.gmail_user,
//                 pass: process.env.gmail_pass
//             }
//         });

//         // var attachments = []
        
//         // if (passportImage && fs.existsSync(passportImage)) {
//         //     console.log('ertiiii')
//         //     attachments.push({
//         //         filename: 'pasport-image.jpg',
//         //         path: passportImage
//         //     });
//         // } else {
//         //     console.log('oriiiiiii')
//         //     console.error('Passport image path is invalid:', passportImage);
//         // }

//         // if (ticketImage && fs.existsSync(ticketImage)) {
//         //     attachments.push({
//         //         filename: 'ticket-image.jpg',
//         //         path: ticketImage
//         //     });
//         // } else {
//         //     console.error('Ticket image path is invalid:', ticketImage);
//         // }

//         // if (otherImage && fs.existsSync(otherImage)) {
//         //     attachments.push({
//         //         filename: 'other-image.jpg',
//         //         path: otherImage
//         //     });
//         // } else {
//         //     console.error('Other image path is invalid:', otherImage);
//         // }

//         // if (signature && fs.existsSync(signature)) {
//         //     attachments.push({
//         //         filename: 'signature.png',
//         //         path: signature
//         //     });
//         // } else {
//         //     console.error('Signature image path is invalid:', signature);
//         // }
//         // console.log(attachments)

//         var mailOptions = {
//             // from: email,
//             // to: 'team@flyinspectors.com, dato9613@gmail.com',
//             // subject: `${firstName} - NEW CLIENT`,
//             from: 'team@flyinspectors.com',
//             to: 'team@flyinspectors.com',
//             subject: 'NEW CLIENT',
//             attachments: [
//                 {
//                     filename: 'pasport-image.jpg',
//                     path: String(passportImage)
//                 },
//                 {
//                     filename: 'ticket-image.jpg',
//                     path: String(ticketImage)
//                 },
//                 {
//                     filename: 'other-image.jpg',
//                     path: String(otherImage)
//                 },
//                 {
//                     filename: 'signature.png',
//                     path: String(signature)
//                 }
//             ],
//             html: `
//                 <h1>მოგესალმებით</h1>
//                 <p>სახელი: ${firstName}</p>
//                 <p>გვარი: ${lastName}</p>
//                 <p>ID: ${userId}</p>
//                 <p>ტელ: ${phone}</p>
//                 <p>ემაილი: ${email}</p>
//                 <p>ქალაქი: ${city}</p>
//                 <p>მისამართი: ${address}</p>
//                 <p>პრობლემა: ${problem}</p>
//                 <p>ფრენის ნომერი: ${flightNumber}</p>
//                 <p>დრო: ${date}</p>
//                 <p>select: ${select}</p>
//                 <p>აღწერა: ${description}</p>
//             `
//         };

//         transporter.sendMail(mailOptions, function(error, info){
//             if (error) {
//                 console.log(error);
//                 return res.status(500).send('Error sending email');
//             } else {
//                 console.log('Email sent: ' + info.response);
//                 return res.status(200).send('Email sent successfully');
//             }
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         return res.status(500).send("Something went wrong while sending the email!");
//     }
// };

// module.exports = { emailSend };













// // const fs = require('node:fs');

// // const emailSend = async (req, res) => {
// //     try {
// //         const { 
// //             passportImage,
// //             ticketImage,
// //             otherImage,
// //             signature,
// //             userId,
// //             firstName,
// //             lastName,
// //             phone,
// //             email,
// //             city,
// //             address,
// //             problem,
// //             flightNumber,
// //             date,
// //             select,
// //             description,
// //         } = req.body;
// //         console.log(1111,req.body)

// //         var nodemailer = require('nodemailer');

// //         var transporter = nodemailer.createTransport({
// //             service: 'gmail',
// //             auth: {
// //                 user: process.env.gmail_user,
// //                 pass: process.env.gmail_pass
// //             }
// //         });

// //         var mailOptions = {
// //             from: email,
// //             to: 'team@flyinspectors.com, dato9613@gmail.com',
// //             // text: text,
// //             subject: `${firstName} - NEW CLIENT`,
// //             attachments: [
// //                 {
// //                     filename: 'pasport-image.jpg',
// //                     path: String(passportImage)
// //                 },
// //                 {
// //                     filename: 'ticket-image.jpg',
// //                     path: String(ticketImage)
// //                 },
// //                 {
// //                     filename: 'other-image.jpg',
// //                     path: String(otherImage)
// //                 },
// //                 {
// //                     filename: 'signature.png',
// //                     path: String(signature)
// //                 }
// //             ],
// //             html: `
// //                 <h1>მოგესალმებით</h1>
// //                 <p>სახელი: ${firstName}</p>
// //                 <p>გვარი: ${lastName}</p>
// //                 <p>იუზერის ID: ${userId}</p>
// //                 <p>ტელ: ${phone}</p>
// //                 <p>ემაილი: ${email}</p>
// //                 <p>ქალაქი: ${city}</p>
// //                 <p>მისამართი: ${address}</p>
// //                 <p>პრობლემა: ${problem}</p>
// //                 <p>ფრენის ნომერი: ${flightNumber}</p>
// //                 <p>დრო: ${date}</p>
// //                 <p>select: ${select}</p>
// //                 <p>აღწერა: ${description}</p>
// //                 `
// //         };

// //         transporter.sendMail(mailOptions, function(error, info){
// //         if (error) {
// //             console.log(error);
// //         } else {
// //             console.log('Email sent: ' + info.response);
// //         }
// //         });
// //     } catch (error) {
// //         console.log(error)
// //         return res.status(500).send("Something went wrong while getting cars!");
// //     }
// // };

// // module.exports = {emailSend}


// const nodemailer = require('nodemailer');

// // Create a transporter using SMTP
// const transporter = nodemailer.createTransport({
//     // host: 'smtp.example.com', // SMTP server address (e.g., smtp.gmail.com for Gmail)
//     host: 'mail.flyinspectors.com',
//     port: 465, // 465 for SSL or 587 for STARTTLS
//     secure: true, // Use true for 465, false for other ports
//     auth: {
//         user: 'mailsend@flyinspectors.com', // Your email
//         pass: 'Mdri@$@t{tMX', // Your email password or app password
//     },
// });

// // Email options
// const mailOptions = {
//     from: 'dato9613@gmail.com', // Sender's email
//     to: 'team@flyinspectors.com', // Receiver's email
//     subject: 'Test Email from Nodemailer',
//     text: 'Hello, this is a test email!',
//     html: '<b>Hello, this is a test email!</b>', // HTML body
// };

// // Send the email
// transporter.sendMail(mailOptions, (error, info) => {
// if (error) {
// console.error('Error sending email:', error);
// } else {
// console.log('Email sent successfully:', info.response);
// }
// });