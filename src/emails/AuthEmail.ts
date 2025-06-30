import { transport } from "../config/nodemailer";

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
      html: `<p>Hola ${user.name}. Haz click en el siguiente enlace para confirmar tu cuenta: <a href="#">Confirmar cuenta</a></p>
      <p>Tu token de acceso es: ${user.token}. Este token expira en 10 minutos</p>`,
    });
  };
}
