# 基于 Node.js 的 lts镜像
FROM node:20.11.0 AS build
# 定义环境变量
ENV WORKDIR=/app
# 创建应用程序文件夹并分配权限给 node 用户
RUN mkdir -p $WORKDIR && chown -R node:node $WORKDIR
# 设置工作目录
WORKDIR $WORKDIR
# 复制 package.json 到工作目录
COPY --chown=node:node package.json $WORKDIR/
# 安装依赖
RUN npm install && npm cache clean --force
# 复制其他文件
COPY --chown=node:node  . .
RUN npm run build



FROM node:20.11.0
# 定义环境变量
ENV WORKDIR=/app
# 设置工作目录
WORKDIR $WORKDIR
COPY --from=build /app/build $WORKDIR
# 设置版本标签
LABEL version="1.1"
# 定义环境变量
ENV PORT=3001
ENV NODE_ENV=production
EXPOSE $PORT    

# 复制 package.json 到工作目录
COPY --chown=node:node package.json $WORKDIR/
# 安装依赖
RUN npm install && npm cache clean --force
# 应用程序启动命令
CMD node index.js