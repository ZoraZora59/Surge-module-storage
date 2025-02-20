Surge Module Storage Service

***本项目95%以上的代码由[Trae](https://www.trae.ai/home)编辑器的Builder功能生成，在此感谢支持。***

## 1. 功能：为MacOS上的SurgeAPP提供模块访问服务

用于拓展Surge的规则、节点、策略组等


## 2. 前后端可独立部署

独立部署后端也可以直接通过Header中添加鉴权字段的方式，直接通过API对Surge的模块进行增加、编辑、删除操作

前端的部署可能需要修改`frontend/vite.config.ts`中的该项配置`server.proxy.target`来对接到你部署的后端接口。
```
    base: '/',
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8080', // 修改这里为你的后端接口地址
          changeOrigin: true,
          secure: false
        }
      }
    },
```
## 依赖环境

服务开发时使用当时能获取到的最新的Go版本（1.23.5），npm:（10.9.2），node（23.7.0）
