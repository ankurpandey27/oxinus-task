import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('/updateAccount')
  async updateAccount(@Body() data: any) {
    return this.accountService.updateAccount(data);
  }

  @Get('/fetchAccount')
  async fetchAccount(@Body() userId: string) {
    return await this.accountService.fetchAccount(userId);
  }

  @Get('/fetchAllAccount')
  async fetchAllAccount(@Body() limit: number, offset: number) {
    return await this.accountService.fetchAllAccounts(limit, offset);
  }

  @Delete('/deleteAccount')
  async deleteAccount(@Body() userId: string) {
    return await this.accountService.deleteAccount(userId);
  }
}
