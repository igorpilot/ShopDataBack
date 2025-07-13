import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Ігнорувати помилки сертифікатів
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP connection error:", error);
      } else {
        console.log("SMTP connection successful");
      }
    });
  }

  async sendActivationMail(to, link) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: to,
        subject: "Активація акаунта ",
        html: `<div> <h1>Для активації акаунта перейдіть за посиланням</h1><a href="${link}">${link}</a></div>`,
      });

      console.log("✅ Лист успішно відправлено:", info.response);
    } catch (error) {
      console.error("❌ Помилка при надсиланні листа:", error);
    }
  }

  async sendMailForReset(to, link) {
    try {
      const mailOptions = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: to,
        subject: "Відновлення пароля",
        html: `<div> <h1>Перейдіть за посиланням для відновлення пароля: </h1><a href="${link}">${link}</a></div>`,
      });
      console.log("✅ Лист успішно відправлено:", mailOptions.response);
    } catch (error) {
      console.error("❌ Помилка при надсиланні листа:", error);
    }
  }
}

export default new MailService();
