import { User } from '../models/user';

class UserService{
    /**
     * 创建用户
     * @param name 用户名
     * @param password 密码6-32
     * @returns 
     */
    async createUser(name: string, password: string,type:string): Promise<User> {
        const user = await User.create({ name, password ,type});
        return user;
    }
    async findByName(name:string): Promise<User|null> {
        const user = await User.findOne({where:{name}});
        return user;
    }
    /**
     * 获取当前用户数量
     * @returns 用户数
     */
    async getCount():Promise<number>{
        return await User.count();
    }
}
export { UserService };