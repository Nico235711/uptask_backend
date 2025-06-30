import nodemailer from "nodemailer";

const { SMTP_PORT, SMTP_HOST, SMTP_PASSWORD, SMTP_USER } = process.env

const nodemailerConfig = () => {
  return {
    host: SMTP_HOST,
    port: +SMTP_PORT!,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  };
};

export const transport = nodemailer.createTransport(nodemailerConfig())
