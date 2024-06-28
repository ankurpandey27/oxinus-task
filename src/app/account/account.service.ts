import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '../auth/entity/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}
  async findByEmail(email: string): Promise<AccountEntity | undefined> {
    return await this.accountRepository.findOne({ where: { email: email } });
  }
  async findById(id: string): Promise<AccountEntity | undefined> {
    return await this.accountRepository.findOne({
      where: { id: id },
    });
  }

  async updateAccount(updateData: any): Promise<any> {
    const { id } = updateData;
    if (!id) {
      throw new Error('User id is required');
    }

    const checkUser = await this.findById(id);

    if (!checkUser) {
      throw new Error('User not found');
    }

    const data = {
      role: updateData.role,
      is_active: true,
      phone: updateData.phone,
      birthday_date: updateData.birthday_date,
      first_name: updateData.first_name,
      last_name: updateData.last_name,
    };
    const accountRepository = await this.accountRepository;
    await accountRepository.update({ id: id }, data);
    return data;
  }

  // Fetch all accounts with pagination
  async fetchAllAccounts(
    limit: number,
    offset: number,
  ): Promise<AccountEntity[]> {
    const accountRepository = await this.accountRepository;
    return accountRepository.find({
      take: limit,
      skip: offset,
    });
  }

  // Fetch account by userId
  async fetchAccount(userId: string): Promise<AccountEntity | undefined> {
    if (!userId) {
      throw new Error('User id is required');
    }

    const checkUser = await this.findById(userId);

    if (!checkUser) {
      throw new Error('User not found');
    }
    const accountRepository = await this.accountRepository;
    return this.findById(userId);
  }

  // Delete account by userId
  async deleteAccount(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User id is required');
    }

    const checkUser = await this.findById(userId);

    if (!checkUser) {
      throw new Error('User not found');
    }
    const accountRepository = await this.accountRepository;
    await accountRepository.delete({ id: userId });
  }
}
