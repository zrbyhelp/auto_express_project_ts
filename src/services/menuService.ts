import { Menu } from "../models/menu";

class MenuService{
    async createMenu(fid:string,key:string,type:string,name:string):Promise<Menu>{
        const menu = await Menu.create({fid,key,type,name});
        return menu;
    }
    async update(id:string,fid:string,key:string,type:string,name:string):Promise<void>{
        await Menu.update({fid,key,type,name},{
            where: {
                id:id
            }
        });
    }
    async findAll():Promise<Menu[]>{
        const menus = await Menu.findAll();
        return menus;
    }
    async del(id:string):Promise<void>{
        await Menu.destroy({
            where: {
                id:id
            }
        });
    }
}

export { MenuService };