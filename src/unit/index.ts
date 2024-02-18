import { ZrError } from "../zrError";
import crypto from "crypto"

import fs  from 'fs';
import path from "path";
import jwt from "jsonwebtoken";
import express, { NextFunction ,Request ,Response} from "express";
import { ServiceWhitelistControllers } from "../controllers/serviceWhitelistControllers";
import { logger } from "../log";
export class UnitCommon {
    static ThrowIfNullOrEmpty(errorMessage: string):never {
        throw new ZrError(errorMessage);
  }
  static readFromFile(filePath:string) {
    return fs.readFileSync(filePath, 'utf-8');
    
  };
}
export class Jwt{
  private static secret = "977dfa8f-e885-48c9-bef3-10220ac42d48";
  static sign(data:any):string{
    return jwt.sign(data,Jwt.secret, { expiresIn: '1h' });
  }
  //jwt登陆权限管理
  static authenticateToken(req:Request, res:Response, next:NextFunction){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json();
    }
    jwt.verify(token, Jwt.secret, (err, user) => {
      if (err) {
        return res.status(403).json();
      }
      req.app.set("user",user);
      next();
    });
  }
}
export class KeyCommon {
    //证书验证
  static async authenticate(req:Request, res:Response, next:NextFunction){
      let host = req.socket.remoteAddress;
      if (host?.substring(0, 7) == "::ffff:") {
        host = host.substring(7);
      }
      console.log(host)
      const keyName =await new ServiceWhitelistControllers().getKey(host);
      if(!keyName){
        return res.status(401).json();
      }
      let key;
      try {
         key = UnitCommon.readFromFile(path.join(KeyCommon.keyFile,`${keyName}.pem`))
      } catch (error) {
        throw new ZrError("证书丢失");
      }
      let body;
      if (req.method === 'GET') {
          body = req.query;
      } else if (req.method === 'POST') {
          body = req.body;
      } 
      const encryptedData = body.encryptedData;
      const v = body.v;
      const k = body.k;
      if(!encryptedData||!v||!k){
        return res.status(401).json();
      }
      const backData = KeyCommon.serviceDecrypt({encryptedData,v,k},key)
      req.app.set("iv",v);
      req.app.set("asekey",backData.asekey);
      if (req.method === 'GET') {
          req.query =JSON.parse(backData.data);
      } else if (req.method === 'POST') {
          req.body = JSON.parse(backData.data);
      } 
   
      logger.info(`========================================================================= 
客户端：${host} 
访问地址：${req.protocol}://${req.headers.host}${req.originalUrl} 
数据：${backData.data} 
========================================================================================================= 
      `);
      next();
  }
  //服务器返回数据
  static serviceSend(data:object,req:Request, res:Response){
    res.send(KeyCommon.serviceCrypt(JSON.stringify(data),req.app.get("asekey"),req.app.get("iv")))
  }
  static get keyFile():string{
    const keyDirectory = path.join(__dirname, '../key');
    if (!fs.existsSync(keyDirectory)) {
      fs.mkdirSync(keyDirectory, { recursive: true });
    }
    return keyDirectory;
  }
  // 使用RSA公钥加密
  static rsaEncrypt(data:string,publicKey:string) {
    return crypto.publicEncrypt({ key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data)).toString('base64');
  }

  // 使用RSA私钥解密
  static rsaDecrypt(data:string,privateKey:string) {
    return crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data, 'base64')).toString('utf-8');
  }
  // 使用AES加密
  static aesEncrypt(data:string, key:string,iv:Buffer=crypto.randomBytes(16)) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'base64'), iv);

    let encrypted = cipher.update(data, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return { encryptedData: encrypted, iv: iv.toString('base64') };
  }

  // 使用AES解密
  static aesDecrypt(encryptedData:string, key:string, iv:string) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'base64'), Buffer.from(iv, 'base64'));
    let decrypted = decipher.update(encryptedData, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }


  static create(key:string):string{
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // RSA密钥长度
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    fs.writeFileSync(path.join(KeyCommon.keyFile,`${key}.pem`), privateKey);
    return publicKey;
  }
  static getKey(fileName:string){
    const keyFile = path.join(KeyCommon.keyFile, fileName);
    if (!fs.existsSync(keyFile)) {
      throw new ZrError("密钥文件丢失。");
    }
    const key = UnitCommon.readFromFile(keyFile);
    return key;
  }


  /**
   * 客服端加密传输数据
   * @param publicKey 公钥
   * @param data 待加密数据
   * @param aesKey 随机生成的key
   * @returns 
   */
  static clientCrypt(publicKey:string,data:object,aesKey:string):CryptData{
    const { encryptedData, iv } = KeyCommon.aesEncrypt(JSON.stringify(data), aesKey);
    const encryptedWithRSA = KeyCommon.rsaEncrypt(aesKey,publicKey);
    return { encryptedData: encryptedData, v: iv, k: encryptedWithRSA };
  }
  /**
   * 客户端解密数据
   * 服务器返回的数据会根据传递的数据进行相同的加密所以asekey与发送的时候使用一个，iv在发送加密的时候会生成出来
   * @param encryptedData 待解密数据
   * @param asekey 与加密发送的相同
   * @param iv 与加密发送的相同
   * @returns 
   */
  static clientDecrypt(encryptedData:string,asekey:string,iv:string){
    try{
      const data = KeyCommon.aesDecrypt(encryptedData,asekey,iv);
      return data;
    }catch{
      throw new ZrError("解密失败")
    }
  }
  /**
   * 服务器返回数据加密
   * @param data 待加密数据
   * @param asekey 与服务器解密得出
   * @param iv 与接收的iv相等
   * @returns 
   */
  static serviceCrypt(data:string,asekey:string,iv:string){
    const encryptedData = KeyCommon.aesEncrypt(data,asekey,Buffer.from(iv, 'base64'));
    return encryptedData;
  }
  /**
   * 服务器解密传入数据
   * @param cryptData 传入的数据
   * @param privateKey 服务器私钥
   * @returns 
   */
  static serviceDecrypt(cryptData:CryptData,privateKey:string){
    try{
      const asekey = KeyCommon.rsaDecrypt(cryptData.k,privateKey);
      const data = KeyCommon.aesDecrypt(cryptData.encryptedData,asekey,cryptData.v);
      return {data,asekey};
    }catch{
      throw new ZrError("解密失败")
    }
  }
}
interface CryptData {
  encryptedData: string, v: string, k: string 
}