import { Menu } from '../models/menu';
import { MenuService } from '../services/menuService';
import { UnitCommon } from '../unit';

export class MenuControllers{
    private menuService: MenuService;
    constructor() {
      this.menuService = new MenuService();
    }
    async findAll(): Promise<Menu[]> {
        return this.menuService.findAll();
    }
    async del(id:string=UnitCommon.ThrowIfNullOrEmpty("id不能为空")): Promise<void> {
         this.menuService.del(id);
    }
    async update(
        id:string=UnitCommon.ThrowIfNullOrEmpty("id不能为空"),
        fid:string,
        key:string,
        type:string=UnitCommon.ThrowIfNullOrEmpty("类型不能为空"),
        name:string =UnitCommon.ThrowIfNullOrEmpty("名称不能为空")
    ): Promise<void>{
        await this.menuService.update(id,fid,key,type,name);
    }
    async create(
        fid:string,
        key:string,
        type:string=UnitCommon.ThrowIfNullOrEmpty("类型不能为空"),
        name:string =UnitCommon.ThrowIfNullOrEmpty("名称不能为空")
      ): Promise<Menu>{
        const menu =await this.menuService.createMenu(fid,key,type,name);
        return menu;
      }
}