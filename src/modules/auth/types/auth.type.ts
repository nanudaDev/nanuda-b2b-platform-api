import { Admin } from '../../../modules/admin';
import { CompanyUser } from 'src/modules/company-user/company-user.entity';

export class Auth {
  token: string;
  user: Admin | CompanyUser;
}
