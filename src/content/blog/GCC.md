---
title: 'GCC'
pubDate: 2021-04-04
description: 'GCC命令记录'
author: 'binlong Zhang'
tags: ["GCC", "tools", "C/C++", "编译"]
---
# 工作流程

1. 预处理 Preprocessing

> cpp预处理器，去注释，展开头文件，宏替换等
> gcc -E test.c -o test.i

2. 编译 Compilation

> gcc，将源代码文件编译成汇编语言代码
> gcc -S test.i -o test.s

3. 汇编 Assembly

> as, 将汇编语言代码编译成二进制文件
> gcc -c test.s -o test.o

4. 连接 Linking

> ld, 连接test.c代码中调用的库函数
> gcc -o test test.o

# 常用参数

- -v 查看版本
- -E 预处理
- -S 生成汇编文件
- -c 只编译，生成.o的目标文件
- -I 指定头文件所在路径
- -L 指定库文件所在路径
- -l 指定库文件的名字
- -o 指定生成的目标文件名字
- -g 包含调试信息，使用gdb调试需要添加-g参数
- -On n=0∼3 编译优化,n越大优化得越多
- -Wall 提示更多警告信息

> gcc -o test -Wall test.c
> gcc -o test test.c -D MAX=10

# 静态库和共享（动态）库

## Static library

> windows下.lib，linux下.a
> 静态库一般命名：前缀: lib + 库名称 + 后缀: .a

### 静态库制作流程

1. 将源文件编译为.o目标文件
2. 使用ar工具将.o文件打包为.a文件

> 使用ar工具需要添加参数rcs--->r更新、c创建、s建立索引
> 命令：ar rcs 静态库名 .o文件

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1674839219459-6e36db42-e73c-46bc-9d5d-05301d8de9a8.png#averageHue=%23f7f3f3&clientId=ubae4812d-8a87-4&from=paste&height=242&id=udb103834&name=image.png&originHeight=242&originWidth=334&originalType=binary&ratio=1&rotation=0&showTitle=false&size=324156&status=done&style=none&taskId=udec50304-e736-4f4f-9258-e51d0c1a1a0&title=&width=334)

### 静态库使用

> 将.a文件和头文件一起发布给用户

-L：指定要连接的库的所在目录
-l：指定链接时需要的静态库, 去掉前缀和后缀
-I: 指定main.c文件用到的头文件head.h所在的路径

> gcc -o main1 main.c -L./lib -l head -I./include

### 优缺点

- 优点
  - 函数库被打包到应用中，实现函数本地化，寻址方便，速度快
  - 移植方便
- 缺点
  - 系统资源消耗交大，每个进程都需要赋值一份静态库
  - 给程序更新、部署、发布带来麻烦

## Shared library

> 程序编译时并不会被连接到目标代码中, 而是在程序运行是才被载入. 不同的应用程序如果调用相同的库, 那么在内存里只需要有一份该共享库的拷贝, 规避了空间浪费问题.动态库在程序运行时才被载入, 也解决了静态库对程序的更新、部署和发布会带来麻烦. 用户只需要更新动态库即可, 增量更新
> 前缀lib + 库名称 + 后缀.so

### 共享库制作

1. 编译生成目标文件.o，加编译选项 -fPIC

> gcc -fpic -c fun1.c fun2.c
> -fpic创建与地址无关的编译程序(pic, position independent code), 目的就是为了能够在多个应用程序间共享

2. 生成共享库，此时加连接器选项 -shared 指定生成动态链接库

> gcc -shared fun1.o fun2.o -o libtest2.so

### 共享库使用

生成可执行文件时，跟静态库方式一样
gcc -o main1 main.c -L./lib -l head -I./include

---

当系统加载可执行代码时，需要知道依赖库的名字及所以来的库路径，因而需要系统的dynamic linker/loader

> ldd命令可以查看可执行的文件依赖的库文件---> ldd main
> 对于elf格式的可执行程序，是由ld-linux.so*来完成
> 其先后搜索elf文件的DT_RPATH段 --> 环境变量LD_LIBRARY_PATH -->  /etc/ld.so.cache文件列表 -->/lib/, /usr/lib目录

**_解决方案_**

- 拷贝自己制作的共享库到/lib或者/usr/lib
- 临时设置LD_LIBRARY_PATH（测试）
  - export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:库路径
- 永久设置, 把export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:库路径, 设置到∼/.bashrc文件中,然后
  - 执行. ~/.bashrc使配置文件生效(第一个.后面有一个空格)
  - 执行source ~/.bashrc配置文件生效
  - 退出当前终端, 然后再次登陆也可以使配置文件生效
- 永久设置,把export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:库路径，设置到/etc/profile文件中
- 将其添加到 /etc/ld.so.cache文件中
  - 编辑/etc/ld.so.conf文件, 加入库文件所在目录的路径
  - 运行sudo ldconfig -v, 该命令会重建/etc/ld.so.cache文件

### 优缺点

- 优点
  - 省内存
  - 部署方便，只需替换动态库，重启即可
- 缺点
  - 加载速度较慢
  - 移植性差，需要移植所有动态库
