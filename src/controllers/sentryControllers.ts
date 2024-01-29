import { UnitCommon } from "../unit";
export class SentryControllers{
    static sendUserFeedback(
        name: string = UnitCommon.ThrowIfNullOrEmpty("名称不能为空"),
        email: string = UnitCommon.ThrowIfNullOrEmpty("邮箱不能为空"),
        comments: string = UnitCommon.ThrowIfNullOrEmpty("内容不能为空")
    ){
        
    }
    
}
