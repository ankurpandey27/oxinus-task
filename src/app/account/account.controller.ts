import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '@utility';
import { RolesGuard } from '../auth/gaurd';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/updateAccount')
  async updateAccount(@Body() data: any) {
    return this.accountService.updateAccount(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/fetchAccount')
  async fetchAccount(@Body() userId: string) {
    return await this.accountService.fetchAccount(userId);
  }

  @Get('/fetchAllAccount')
  async fetchAllAccount(@Body() limit: number, offset: number) {
    return await this.accountService.fetchAllAccounts(limit, offset);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/deleteAccount')
  async deleteAccount(@Body() userId: string) {
    return await this.accountService.deleteAccount(userId);
  }
}
