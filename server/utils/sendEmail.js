const nodeMailer=require("nodemailer");

const sendEmail=async(options)=>{

    let testAccount=await nodeMailer.createTestAccount();

    //connect with the smtp server
   
    const transporter=nodeMailer.createTransport({
        //service:process.env.SMTP_SERVICE,
        host:process.env.SMTP_HOST,
        port:587,
        auth:{
            user: 'pansy29@ethereal.email',
            pass: '8ynr2qrrxh9JFg1VDQ'
        }
    });

    const mailOptions={
        from:"pansy29@ethereal.email",
        to:options.email,
        subject:options.subject,
        text:options.message,
    };

    await transporter.sendMail(mailOptions);

};

module.exports=sendEmail;