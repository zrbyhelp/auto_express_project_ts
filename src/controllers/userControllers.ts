import { User } from '../models/user';
import { UserService } from '../services/userService';
import { UnitCommon } from '../unit';

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
  async findUserByNameAndPassword(
    name: string = UnitCommon.ThrowIfNullOrEmpty("账号不能为空"),
    password: string = UnitCommon.ThrowIfNullOrEmpty("密码不能为空")
  ): Promise<User>{
    const user =await this.userService.findByName(name);
    if(!user){
      UnitCommon.ThrowIfNullOrEmpty("账号没有找到")
    }
    if(!user.comparePassword(password)){
      UnitCommon.ThrowIfNullOrEmpty("密码错误")
    }
    return user;
  }
}