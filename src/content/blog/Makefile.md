---
title: 'Makefile'
pubDate: 2022-04-04
description: '简要介绍 Makefile 的用法和常见命令'
author: 'binlong Zhang'
tags: ["Makefile", "tools", "C/C++", "构建"]
---
# 基本规则

```bash
目标: 依赖
(tab)命令

# 目标： 生成的目标文件
# 依赖： 目标文件由哪些文件生成
# 命令： 由依赖文件生成目标文件的命令
```

# 工作原理

- 要生成目标，首先检查依赖中所有文件是否都存在

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1674907554592-5c161503-6cf6-4feb-900c-c0e51705ff08.png#averageHue=%23faf2ed&clientId=ued2fc77f-a240-4&from=paste&height=151&id=u6952ad12&name=image.png&originHeight=151&originWidth=393&originalType=binary&ratio=1&rotation=0&showTitle=false&size=237995&status=done&style=none&taskId=u2b16dc90-09b8-42eb-b4e2-ae686c80d07&title=&width=393)

- 若所有依赖都存在，检查规则中的目标是否需要更新，依赖被更新，相应的目标也需要更新

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1674907634339-78865234-1887-499f-affb-ea9eb4a26512.png#averageHue=%23fcf4f1&clientId=ued2fc77f-a240-4&from=paste&height=164&id=ue9275f28&name=image.png&originHeight=164&originWidth=305&originalType=binary&ratio=1&rotation=0&showTitle=false&size=200651&status=done&style=none&taskId=ufc552b9b-3544-4c8b-b064-a84d70ea6b6&title=&width=305)

# 语法

- **普通变量**
  - 用=定义
  - 使用 $(变量名)
- **预定义变量**

```makefile
CC=gcc
CPPFLAGS:	C预处理的选项 -I
CFLAGS: 	C编译器的选项 -Wall -g -c
LDFLAGS:	链接器选项 -L -l
```

- **自动变量**
  - $@	表示规则中的目标
  - $<	表示规则中的第一个条件
  - $^	表示规则中的所有条件, 组成一个列表, 以空格隔开, 如果这个列表中有重复的项则消除重复项。
- **模式规则**
  - 至少在规则的目标定义中要包含 '%',  '%' 表示一个或多个, 在依赖条件中同样可以使用'%' , 依赖条件中的 '%' 的取值取决于其目标
- **makefile函数**
  - wildcard - 查找指定目录下的指定类型的文件
  - patsubst - 匹配替换

```makefile
src=$(wildcard *.c)
obj=$(patsubst %.c,%.o, $(src)) 
```

- **makefile清理操作**
  - 清除编译生成的中间.o文件和最终目标文件
  - 如果当前目录下有同名clean文件/没有依赖因而默认为最新,则不执行clean对应的命令，可以通过声明伪目标解决
    - 伪目标声明:  声明目标为伪目标之后, makefile将不会检查该目标是否存在或者该目标是否需要更新
      - .PHONY:clean
  - **clean命令中的特殊符号	**
    - “-”此条命令出错,make也会继续执行后续的命令
    - rm -f: 强制执行, 比如若要删除的文件不存在使用-f 不会报错
    - “@”不显示命令本身, 只显示结果
- **其他**
  - make 默认执行第一个出现的目标, 可通过make dest指定要执行的目标(make clean)
  - make -f : -f执行一个makefile文件名称

# 示例

```bash
src=$(wildcard ./*.c)
object=$(patsubst %.c, %.o $(src))
traget=main
CC=gcc
CPPFLAGS=-I./

$(target):$(object)
$(CC) -o $@ $^

%.o:%.c
$(CC) -o $@ -c $< $(CPPFLAGS)

.PHONY:clean
clean:
-rm -f $(target) $(object)
```
