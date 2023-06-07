import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
  LoginInput,
  LoginOutput,
  NewAccessTokenInput,
  NewAccessTokenOutput,
  RegisterUserInput,
  RegisterUserOutput,
} from './dto/auth.dto';
import { createError } from '../common/utils/createError';
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
  ) {
    // const sourcecode = `print("Hell0 W0rld!")`;
    // let resultPromise = python.runSource(sourcecode);
    // resultPromise
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // const sourcecode = `#include <iostream>
    // using namespace std;
    // int main() {
    //     cout << "Xin chào! Đây là chương trình C++ đầu tiên của bạn." << endl;
    //     // Thêm mã của bạn tại đây
    //     return 0;
    // }
    // `;
    // let resultPromise = cpp.runSource(sourcecode);
    // resultPromise
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    //   const sourcecode = `public class SumCalculator {
    //     public static void main(String[] args) {
    //         int number1 = 5;
    //         int number2 = 10;
    //         int sum = calculateSum(number1, number2);
    //         System.out.println("Tổng của hai số là: " + sum);
    //     }
    //     public static int calculateSum(int a, int b) {
    //         return a + b;
    //     }
    // }
    // `;
    // let resultPromise = java.runSource(sourcecode);
    // resultPromise
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

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
}
