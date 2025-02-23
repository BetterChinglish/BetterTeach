# express项目创建与运行
安装express脚手架
```shell
  npm i -g express-generator
```

然后创建api项目
```shell
  express --no-view api
```

进入项目
```shell
  cd api
```

安装依赖包
```shell
  npm i
```


安装nodemon
```shell
  npm i nodemon -g
```

修改package.json的start
```json
{
  "scripts": {
    "start": "nodemon ./bin/www"
  }
}
```

运行
```shell
  npm start
```

# mysql数据库安装
## 直接电脑安装mysql
网上搜教程即可

## 使用docker
api文件夹下创建docker-compose.yml
```yml
version: '3.8'

services:
  mysql:
    image: mysql:8.3.0
    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_LOWER_CASE_TABLE_NAMES=0
    ports:
      - "3306:3306"
    volumes:
      - ./data/mysql:/var/lib/mysql
```

安装运行
```shell
  docker-compose up
```

# ORM-sequelize的基本使用
即数据库关系模型, 相当于一些封装好的方法去操作数据库

安装
```shell
  npm i -g sequelize-cli
    
  npm i sequelize mysql2
    
  sequelize init
```
模型、迁移与种子

上述代码将生成一个文件与三个文件夹

> cnfig/config.json
> 配置文件，用于配置数据库连接
> 
> models
> 模型文件夹，用于存放模型文件，其实就是表的定义
> 
> migrations
> 迁移文件夹，用于存放迁移文件，其实就是表的结构变更，如生成表、删除表、增加列等
> 
> seeders
> 种子文件夹，用于存放种子文件，其实就是表的初始数据，即增删改查

修改config.json, 配置数据库连接，其中database是数据库名，需要自己先创建一个用于该项目的数据库
```json
{
  "development": {
    "username": "root",
    "password": "root",
    "database": "api_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "api_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "api_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

sequelize其实就是生成model, 通过model生成migration和seed文件

然后运行migration与seed文件, 分别进行增删表和增删改查

使用sequelize-cli创建模型（创建表）
```shell
    # 生成一个表叫Articles的模型文件article.js，这里Article写单数，自动生成复数格式，即Articles
    # 两个字段，一个是title，类型是字符串，一个是content，类型是文本
    sequelize model:generate --name Article --attributes title:string,content:text
```

运行迁移文件
```shell
    # 应该是通过model文件生成一个migration文件，migration文件中包含了创建表的sql语句
    sequelize db:migrate
```

生成种子文件
```shell
    # article是表名对应的模型文件名，通过模型文件，生成一个用于操作表的种子文件
    sequelize seed:generate --name article
```

运行种子文件
```shell
    # 运行种子文件，增删改查
    sequelize db:seed --seed 20250216162405-article
```


# 接口数据格式规范设定
> status
> 当前接口是否成功
> > true: 表示成功
> 
> > false: 表示失败
> 
> message
> > 当前接口的提示信息, 对应报文响应状态码
> 
> data
> > 当前接口返回的数据
> 
> errors
> > 数组, 接口返回的错误信息
> 
> 
> 
> 




# 项目开发流程

## 1. 编写需求文档
本项目是一个在线课程项目, 需要列出需要实现哪些功能模块等

## 2. 根据需求文档进行原型设计与ui设计

    根据需求文档, 进行数据库的设计与ui的布局与效果等

如课程有分类, 需要一个表存放课程的类型:

> id: 主键
> name：类别名，如前端课程、java后端课程、python数据分析等
> sort：排序id

再如具体某个课程, 需要一个表存放课程的详细信息
> id
> categoryId
> userId
> name
> image
> recommended
> introductory
> content
> likesCount
> chaptersCount

...

章节表

点赞表

用户表



## 3. 确定数据库的表,字段,以及接口地址和数据

## 4. 前端mock开发, 后端接口开发

## 5. mock地址修改为真实接口地址

## 6. 测试, 部署上线


# 只有一条数据的表
例如项目的一些基本信息, 只有一条数据, 如网站的标题, 关键字, 描述等

这种表的开发一般是放一条默认数据，然后提供查询和更新两个接口即可
