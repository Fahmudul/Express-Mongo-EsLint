import nodemailer from 'nodemailer';
import config from '../config';
export const sendEmail = async (options: any) => {
  console.log('from send email', { options });
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: config.NODE_ENV !== 'development',
    auth: {
      user: 'hasanhasib12h@gmail.com',
      pass: 'uwzjpmelzddbrgag',
    },
  });
  await transporter.sendMail(
    {
      from: 'fahmudul7890@gmail.com',
      to: options.email,
      subject: 'Reset password link',
      text: 'Reset password link',
      html: `<a href="${options.resetPasswordLink}">Reset password link</a>`,
    },
    (error, info) => {
      if (error) {
        console.log("error", error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    },
  );
};
