import { ServiceWhitelistService } from "../services/serviceWhitelistService";
import { UnitCommon, KeyCommon } from "../unit";
import { ZrError } from "../zrError";
export class ServiceWhitelistControllers{
    private service: ServiceWhitelistService;
    constructor() {
      this.service = new ServiceWhitelistService();
    }

    async newAdd(host:string= UnitCommon.ThrowIfNullOrEmpty("host不能为空")):Promise<string>{
        if(await this.service.findByHost(host)) throw new ZrError("该链接已经添加");
        const data =await this.service.create(host);
        const key = data.key;
        return KeyCommon.create(key);
    }
}