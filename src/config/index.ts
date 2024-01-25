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
      name:"api-test"
    },
    production: {
      database: {
        username: "root",
        password: "MC+ywLivM4wg22k8GR6Niw==",
        database: "nodesever",
        host: "127.0.0.1",
        dialect : "mysql",
        port:3306,
        logging: false
      },
      port:13000,
      name:"api"
    }
  }

  import { Options } from "sequelize";
  interface EnvironmentConfig {
    database: Options;
    port: number;
    name:string
  }
  
  interface ConfigJson {
    development: EnvironmentConfig;
    production: EnvironmentConfig;
  }
const environment = process.env.NODE_ENV || 'development';
export default environment==='development' ? configJson.development:configJson.production;