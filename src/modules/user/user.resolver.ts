import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.servive';
import { Roles } from '../auth/role.decorator';
import { CurrentUser } from '../auth/user.decorator';
import { User } from 'src/entities/user.entity';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
  GetInfoOutput,
} from './user.dto';

@ApiTags('Account')
@Controller('/account')
@ApiSecurity('admin')
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({
    summary: 'info user',
  })
  @Roles(['Any'])
  @Get('info')
  @ApiOkResponse({ type: GetInfoOutput })
  async getInfo(@CurrentUser() input: User) {
    console.log(input);
    return this.userService.getInfo(input);
  }
  // Đây là phần để cấp quyền truy cập cho từng loại người dùng vào hệ thống ở đây 
  //thay đổi mật khẩu thì yêu cầu ai cũng có quyền này nên mình sẽ đặt là Any
  //Tạm thời các phần đều cho quyền Any để dễ dàng test hệ thống sau này sẽ fix sau
  @Roles(['Any'])
  // Định nghĩa cho loại đầu ra là Post với /change-password là route của nó
  // Nó sẽ kết hợp với phần route của phần cái này(@Controller('/account')) là accout để tạo thành /account/change-password 
  @Post('/change-password')
  // Định nghĩa đầu ra cho API này
  @ApiOkResponse({ type: ChangePasswordOutput })
  async changePassword(
    // Phần này mình tạo ra để kiểm tra account hiện tại đang do ai truy cập, nó trả về user của bạn đang dùng
    @CurrentUser() user: User,
    // Phần này định nghĩa trước đó ở user.dto.ts
    @Body() input: ChangePasswordInput,
  ) {
    // gọi đến hàm changePassword được viết ở user.service.ts 
    // phải định nghĩa userService trước ở bên trên nha( private readonly userService: UserService)
    return this.userService.changePassword(user, input);
  }
}
