import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';

import { Position, User } from 'src/entities/user.entity';
// import {Mailer}
import { Repository } from 'typeorm';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
  ListUserOutput,
  ForgotPasswordInput,
  LoginInput,
  LoginOutput,
  NewAccessTokenInput,
  NewAccessTokenOutput,
  RegisterUserInput,
  RegisterUserOutput,
} from './dto/auth.dto';
import { createError } from '../common/utils/createError';
import { hash } from 'bcrypt';
import {
  ACCESS_TOKEN_EXPIRED_IN,
  ACCESS_TOKEN_SECRET,
} from '../common/constants/constants';
// import { cpp, java, python, c } from 'compile-run';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  // TODO: thêm kiểm tra opt gửi về điện thoại
  async registerUser({
    password,
    email,
    name,
    username,
    confirmPassword,
  }: RegisterUserInput): Promise<RegisterUserOutput> {
    try {
      if (password !== confirmPassword)
        return createError('Input', 'Mật khẩu lặp lại không khớp');
      const user = await this.userRepo.findOne({
        where: {
          username,
        },
      });
      if (user) return createError('Input', 'Tài khoản đã được đăng kí');

      const userH = this.userRepo.create({
        password,
        email,
        name,
        username,
      });

      await this.userRepo.save(userH);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async login({ password, username }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          username,
        },
        select: ['id', 'password'],
      });
      if (!user)
        return createError('Input', 'Người dùng không tồn tại trên hệ thống');
      if (!(await user.checkPassword(password)))
        return createError('Input', 'Mật khẩu không đúng');

      const accessToken = sign(
        {
          userId: user.id,
        },
        this.configService.get<string>(ACCESS_TOKEN_SECRET),
        {
          expiresIn: this.configService.get<string>(ACCESS_TOKEN_EXPIRED_IN),
        },
      );

      return {
        ok: true,
        accessToken,
      };
    } catch (error) {
      console.log(error);

      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // danh sách người dùng
  async listUser(): Promise<ListUserOutput> {
    try {
      const users = await this.userRepo.find({
        where: {
          position: Position.Student,
        },
        select: ['email', 'id', 'name', 'phone', 'position', 'username'],
      });
      return {
        ok: true,
        users,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async newAccessToken({
    accessToken,
  }: NewAccessTokenInput): Promise<NewAccessTokenOutput> {
    try {
      const decoded = verify(
        accessToken,
        this.configService.get<string>(ACCESS_TOKEN_SECRET),
      );
      if (!decoded || !decoded['userId']) throw new JsonWebTokenError('');
      const newAccessToken = sign(
        {
          userId: decoded['userId'],
        },
        this.configService.get<string>(ACCESS_TOKEN_SECRET),
        {
          expiresIn: this.configService.get<string>(ACCESS_TOKEN_EXPIRED_IN),
        },
      );
      return {
        ok: true,
        accessToken: newAccessToken,
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
      const { confirmNewPassword, newPassword, oldPassword } = input;
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

  // TODO: Triển khai quên mật khẩu (khi chọn được dịch vụ SMS phù hợp)
  async forgotPassword(input: ForgotPasswordInput) {
    const { name } = input;
    try {
      const user = await this.userRepo.findOne({
        where: {
          username: name,
        },
      });
      if (!user) return createError('Input', 'Tài khoản không tồn tại');
      if (!user.email)
        return createError('Input', 'Tài khoản này chưa có email');
      const randomPassword = generateRandomPassword(8); // Độ dài mật khẩu 8 ký tự
      user.password = randomPassword;
      await this.userRepo.save(user);

      sendEmail(randomPassword, user.email);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
const generateRandomPassword = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

// Hàm gửi email với mật khẩu mới
async function sendEmail(newPassword, email) {
  const nodemailer = require('nodemailer');

  try {
    console.log(newPassword);
    // Tạo transporter
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'duytuongkhmt@gmail.com',
        pass: 'ayaozgozntxogrgy',
      },
    });

    // Cấu hình thông tin email
    let mailOptions = {
      from: 'duytuongkhmt@gmail.com',
      to: `${email}`,
      subject: 'Mật khẩu mới',
      text: `Mật khẩu mới của bạn là: ${newPassword}`,
    };

    // Gửi email
    let info = await transporter.sendMail(mailOptions);
    console.log('Email đã được gửi:', info.response);
  } catch (error) {
    console.log('Lỗi khi gửi email:', error);
  }
}
