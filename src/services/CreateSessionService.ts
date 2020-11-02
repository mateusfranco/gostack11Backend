import { getRepository } from "typeorm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import User from "../models/User";
import authConfig from "../config/auth";
import AppError from "../errors/AppError";

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateSessionService {
  async execute({ email, password }: Request): Promise<Response> {
    const userRepositoy = getRepository(User);

    const currentUser = await userRepositoy.findOne({ where: { email } });

    if (!currentUser) {
      throw new AppError("incorrent email and password combination", 401);
    }
    const passwordMatched = await compare(password, currentUser.password);
    if (!passwordMatched) {
      throw new AppError("incorrent email and password combination", 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: currentUser.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user: currentUser, token };
  }
}

export default CreateSessionService;
