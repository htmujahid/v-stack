import "dotenv/config"
import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: process.env["SMTP_HOST"] ?? "localhost",
  port: Number(process.env["SMTP_PORT"] ?? 1025),
  secure: process.env["SMTP_SECURE"] === "true",
  auth: process.env["SMTP_USER"]
    ? {
        user: process.env["SMTP_USER"],
        pass: process.env["SMTP_PASSWORD"],
      }
    : undefined,
})

type SendEmailOptions = {
  to: string
  subject: string
  text: string
}

export async function sendEmail({ to, subject, text }: SendEmailOptions) {
  await transporter.sendMail({
    from: process.env["SMTP_FROM"] ?? "v-stack <no-reply@localhost>",
    to,
    subject,
    text,
  })
}
