import { Request, Response } from "express";
import User from "../models/User";
import { comparePassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;
      // evitar duplicados
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(400).json({ message: "El usuario ya existe" });
        return;
      }
      // creo el usuario
      const user = new User(req.body);
      // hasheo la contraseña
      user.password = await hashPassword(password);
      // genero un token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      // envio el mail
      AuthEmail.sendEmail({
        email: email,
        name: user.name,
        token: token.token,
      });
      await Promise.allSettled([user.save(), token.save()]);
      res.status(201).json("Cuenta creada, revise su email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }
      const user = await User.findById(tokenExists.user);
      if (!user) {
        const error = new Error("Usuario no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }
      user.confirmed = true;
      await Promise.allSettled([await user.save(), tokenExists.deleteOne()])
      res.status(201).json("Usuario confirmado");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const userExists = await User.findOne({ email });
      if (!userExists) {
        const error = new Error("Usuario no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }
      if (!userExists.confirmed) {
        const token = new Token()
        token.token = generateToken()
        token.user = userExists.id
        await token.save()
        AuthEmail.sendEmail({
          email: email,
          name: userExists.name,
          token: token.token,
        })
        const error = new Error("La cuenta no ha sido confirmada, revise su email para confirmarla");
        res.status(400).json({ error: error.message });
        return;
      }
      const isPassWordCorrect = await comparePassword(password, userExists.password)
      if (!isPassWordCorrect) {
        const error = new Error("La contraseña es incorrecta");
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(201).json("Usuario autenticado");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
