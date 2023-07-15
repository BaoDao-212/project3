import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import {
  ChangePersonalInfoInput,
  ChangePasswordInput,
  ChangePersonalInfoOutput,
  ChangePasswordOutput,
  GetInfoOutput,
} from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }

  async getInfo(input: User): Promise<GetInfoOutput> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id: input.id,
        },
      });
      if (!user) return createError('Input', 'Người dùng không hợp lệ');
      return {
        ok: true,
        user: input,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async changePersonalInfo(
    currentUser: User,
    input: ChangePersonalInfoInput,
  ): Promise<ChangePersonalInfoOutput> {
    try {
      const { newName, newEmail, newPhone } = input;
      const user = await this.userRepo.findOne({
        where: { id: currentUser.id },
        select: ['id'],
      });

      //kiem tra User ton tai khong
      if (!user) createError('Input', 'Người dùng không tồn tại');

      //kiem tra tên mới trống trống hay khong
      if (!newName)
        return createError('Input', 'Tên người dùng không được bỏ trống');
      user.name = newName;

      //Kiem tra email mới trống hay khong
      if (!newEmail)
        return createError('Input', 'Email không được bỏ trống');
      user.email = newEmail;

      //kiem tra SĐT mới trống hay khong
      if (!newPhone)
        return createError('Input', 'SĐT không được bỏ trống');
      user.phone = newPhone;

      await this.userRepo.save(user);
      return {
        ok: true,
        // 'message': 'Thay đổi thông tin thành công'
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async changePassword(
    currentUser: User,
    input: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    try {
      const { oldPassword, newPassword, confirmNewPassword } = input;
      const user = await this.userRepo.findOne({
        where: { id: currentUser.id },
        select: ['password', 'id'],
      });

      //kiem tra User ton tai khong
      if (!user) createError('Input', 'Người dùng không tồn tại');

      //kiem tra mat khau hien tai dung hay khong
      if (!(await user.checkPassword(oldPassword)))
        return createError('Input', 'Mật khẩu hiện tại không đúng');

      //Kiem tra mat khau moi va mat khau nhap lai co trung nhau hay khong
      if (newPassword !== confirmNewPassword)
        return createError('Input', 'Mật khẩu lặp lại không khớp');

      //kiem tra mat khau cu va mat khau moi co trung nhau khong
      if (await user.checkPassword(newPassword))
        return createError(
          'Input',
          'Mật khẩu mới không được trùng mật khẩu cũ',
        );

      user.password = newPassword;
      await this.userRepo.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
