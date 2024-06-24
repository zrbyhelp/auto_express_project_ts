

const configJson:ConfigJson = {
    development: {
      database: {
        username: "root",
        password: "MC+ywLivM4wg22k8GR6Niw==",
        database: "nodesever",
        host: "127.0.0.1",
        dialect : "mysql",
        port:3306,
        logging: false
      },
      port:3000,
      name:"api-test",
      sentryDsn:"https://eefe502c29559c7ad85b8feb0e51ff5c@o4504376998363136.ingest.sentry.io/4506636094013440"
    },
    production: {
      database: {
        username: "root",
        password: "MC+ywLivM4wg22k8GR6Niw==",
        database: "nodesever",
        host: "192.168.1.90",
        dialect : "mysql",
        port:3306,
        logging: false
      },
      port:process.env.PORT || 13000,
      name:"api",
      sentryDsn:"https://eefe502c29559c7ad85b8feb0e51ff5c@o4504376998363136.ingest.sentry.io/4506636094013440"
    },
    type:"service"
  }

  import { Options } from "sequelize";
  interface EnvironmentConfig {
    database: Options;
    port: number|string;
    name:string;
    sentryDsn:string;
  }
  
  interface ConfigJson {
    development: EnvironmentConfig;
    production: EnvironmentConfig;
    //表示模块功能类型
    type:string;
  }
const environment = process.env.NODE_ENV || 'development';
export default environment==='development' ? configJson.development:configJson.production;