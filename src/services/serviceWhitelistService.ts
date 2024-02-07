import { ServiceWhitelist } from "../models/serviceWhitelist";

export class ServiceWhitelistService {
    /**
     * 创建服务白名单
     * @param host 
     * @returns 
     */
    async create(host: string): Promise<ServiceWhitelist> {
        const serviceWhitelist = await ServiceWhitelist.create({ host });
        return serviceWhitelist;
    }
    /**
     * 通过host查询数据
     * @param host 
     * @returns 
     */
    async findByHost(host: string): Promise<ServiceWhitelist| null> {
        return ServiceWhitelist.findByPk(host);
    }
}