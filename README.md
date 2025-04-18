
[toc]

# 1 express项目创建与运行
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

# 2 mysql数据库安装
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


# 3 接口数据格式规范设定
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




# 4 项目开发流程

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


# 5 只有一条数据的表
例如项目的一些基本信息, 只有一条数据, 如网站的标题, 关键字, 描述等

这种表的开发一般是放一条默认数据，然后提供查询和更新两个接口即可


# 6 一些统计数据的接口
可以使用echarts，查看需要的图标的数据格式

并根据数据格式创建接口返回对应格式的数据


# 7 登陆

1. 用户输入账号、密码、邮箱等登陆数据，并发送给后端
2. 基础验证，确认需要的数据传过来了
3. 接受login数据，可以自定义一个数据进行接受而非直接接受email或username
4. 通过login的数据去查询数据库，判断用户是否存在
5. 如果存在，判断密码是否正确
6. 密码正确，还需要判断是否为管理员
7. 使用jwt签名，生成token

## 7.1 jwt使用
安装
```shell
  npm i jsonwebtoken
```

使用
```js
const token = jwt.sign({
  data: 'foobar'
}, 'secret', { expiresIn: '1h' });
```

第一个参数是个对象，放自己要加密的数据

第二个参数是加密的秘钥

第三个参数是一些配置，这里配置了过期时间expiresIn为1小时

## 使用dotenv在运行进程里存放jwt的加密字符串
不应该直接写字符串
```js
const token = jwt.sign({
  data: 'foobar'
}, 'secret', { expiresIn: '1h' });
```

使用dotenv
安装
```shell
  npm i dotenv
```

在项目根目录下创建.env文件
```env
SECRET=123456
```

在代码中使用
```js
const token = jwt.sign({
  data: 'foobar'
}, process.env.SECRET, { expiresIn: '1h' });
```

## 使用crypto模块生成jwt的加密字符串
```js
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'));
```

