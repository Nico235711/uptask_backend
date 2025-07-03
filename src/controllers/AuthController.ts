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
        res.status(400).json({ message: "Token no válido" });
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
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      const isPassWordCorrect = await comparePassword(password, userExists.password)
      if (!isPassWordCorrect) {
        res.status(400).json({ message: "La contraseña es incorrecta" });
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
        res.status(400).json({ message: "La cuenta no ha sido confirmada, hemos enviado el token de validación a su email" });
        return;
      }
      res.status(201).json("Usuario autenticado");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static requestConfirmationToken = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const userExists = await User.findOne({ email });
      if (!userExists) {
        res.status(400).json({ message: "El usuario no existe" });
        return;
      }
      if (userExists.confirmed) {
        res.status(400).json({ message: "El usuario ya esta confirmado" });
        return;
      }
      const token = new Token();
      token.token = generateToken();
      token.user = userExists.id;
      await token.save()
      AuthEmail.sendEmail({
        email: email,
        name: userExists.name,
        token: token.token,
      });
      res.status(200).json("Hemos enviado un email para que confirme su cuenta");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const userExists = await User.findOne({ email });
      if (!userExists) {
        res.status(400).json({ message: "El usuario no existe" });
        return;
      }
      const token = new Token();
      token.token = generateToken();
      token.user = userExists.id;
      AuthEmail.sendPasswordResetToken({
        email: email,
        name: userExists.name,
        token: token.token,
      });
      await token.save()
      res.status(200).json("Hemos enviado un email para que reestablezca su contraseña");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        res.status(400).json({ message: "Token no válido" });
        return;
      }
      res.status(200).json("Token validado, Ingrese su nueva contraseña");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updatedPasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        res.status(400).json({ message: "Token no válido" });
        return;
      }
      const user = await User.findById(tokenExists.user)
      if (!user) {
        res.status(400).json({ message: "El usuario no existe" });
        return;
      }
      user.password = await hashPassword(req.body.password)
      await Promise.allSettled([ user.save(), tokenExists.deleteOne() ])
      res.status(201).json("La contraseña ha sido actualizada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
