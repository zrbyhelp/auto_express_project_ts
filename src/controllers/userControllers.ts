import { UserService } from '../services/userService';

export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }
  /**
   * 初始化admin用户
   */
  async initCreateAdminUser(): Promise<void> {
    if(await this.userService.getCount()===0){
      await this.userService.createUser( 'admin','123456');
    }
  }
  /**
   * 获取全部用户
   */
  async userCount(): Promise<number> {
     return await this.userService.getCount();
  }
}