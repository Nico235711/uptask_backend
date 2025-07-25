import { transport } from "../config/nodemailer";
import "dotenv/config"

const linkToConfirmAccount = `${process.env.FRONTEND_URL}/auth/confirm-account`
const linkToResetPassword = `${process.env.FRONTEND_URL}/auth/new-password`

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendEmail = async (user: IEmail) => {
    await transport.sendMail({
      from: `Uptask - MERN <noreply@uptask.com>`,
      to: user.email,
      subject: "UpTask - Confimar cuenta",
      text: "UpTask - Confimar cuenta",
      html: `<p>Hola ${user.name}. Haz click en el siguiente enlace para confirmar tu cuenta: <a href="${linkToConfirmAccount}">Confirmar cuenta</a></p>
      <p>E ingresa el código: ${user.token}. Este token expira en 1 día</p>`,
    });
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    await transport.sendMail({
      from: `Uptask - MERN <noreply@uptask.com>`,
      to: user.email,
      subject: "UpTask - Establecer nueva contraseña",
      text: "UpTask - Establecer nueva contraseña",
      html: `<p>Hola ${user.name}. Ingresa el código: ${user.token} para poder cambiar tu contraseña. Este token expira en 1 día</p>`
    });
  };
}
