test


# 模型、迁移与种子
```shell
npm i -g sequelize-cli

npm i sequelize mysql2

sequelize init
```

生成一个文件与三个文件夹

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


# 接口数据格式
> status
> 当前接口是否成功
> > true: 表示成功
> 
> > false: 表示失败
> 
> message
> > 当前接口的提示信息
> 
> data
> > 当前接口返回的数据