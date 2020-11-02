import { getRepository } from "typeorm";
import path from "path";
import fs from "fs";
import User from "../models/User";
import config from "../config/upload";
import AppError from "../errors/AppError";

interface Request {
  userId: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ userId, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(userId);
    if (!user) throw new AppError("not user", 401);

    if (user.avatar) {
      const userAvatarFile = path.join(config.directory, user.avatar);
      const userAvatarExistis = await fs.promises.stat(userAvatarFile);

      if (userAvatarExistis) {
        await fs.promises.unlink(userAvatarFile);
      }
    }

    user.avatar = avatarFilename;
    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
