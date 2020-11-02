import { getRepository } from "typeorm";
import { hash } from "bcryptjs";
import User from "../models/User";
import AppError from "../errors/AppError";

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkDuplicateEmail = await usersRepository.findOne({
      where: { email },
    });

    if (checkDuplicateEmail) {
      throw new AppError("email is equal to another user");
    }

    const hashedPass = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPass,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
