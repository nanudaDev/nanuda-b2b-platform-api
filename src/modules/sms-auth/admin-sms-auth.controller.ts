import { Controller, UseGuards, Body, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER } from 'src/core';
import { AdminSendMessageDto } from './dto';
import { SmsAuthService } from './sms-auth.service';

@Controller()
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiTags('ADMIN SMS SERVICE')
export class AdminSmsController {
  constructor(private readonly smsService: SmsAuthService) {}

  /**
   * send message to admin
   * @param adminSendMessageDto
   * @param req
   */
  @Post('/admin/send-message')
  async sendMessage(
    @Body() adminSendMessageDto: AdminSendMessageDto,
    @Req() req,
  ) {
    return await this.smsService.sendAdminMessage(adminSendMessageDto, req);
  }
}
