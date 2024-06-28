import { ROLES } from '@constants';
import { SetMetadata } from '@nestjs/common';

export const Role = (...role: ROLES[]) => SetMetadata('role', role);
