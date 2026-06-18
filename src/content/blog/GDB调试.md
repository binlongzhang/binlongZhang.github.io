---
title: 'GDB'
pubDate: 2021-04-04
description: 'GDB使用'
author: 'binlong Zhang'
tags: ["GDB", "tools", "C/C++", "调试"]
---
GDB（GNU Debugger）是GCC的调试工具

# 生成调试信息

GDB主要调试的是C/C++的程序。首先在编译时, 必须要把调试信息加到可执行文件中。使用编译器（cc/gcc/g++）的 -g 参数实现
注意：-g 是在可执行程序中加入源码信息，并非将整个源文件嵌入可执行程序。因此调试时候源文件必须仍旧存在；

```bash
gcc -g hello.c -o hello
# 如果没有-g, 你将看不见程序的函数名、变量名, 所代替的全是运行时的内存地址
```

# 启动gdb

```bash
# 启动gdb
gdb program

# 设置运行参数
set args hello world
show args
```

# 显示源码

```bash
list 		# 打印当前行后面的程序
list - 	# 打印当前文件开始出的源程序
list file: lineNum # 显示file文件下第n行
list file: func		 # 显示file文件的func函数

set listsize n		 # 设置一次显示源代码的行数
show listsize			 # 查看当前listsize的设置
```

# 设置断点

```bash
b n					# n对应行号断点
b func			# func函数处断点
b file:n
b file:func
b test.c:8 if intValue == 5	# 条件断点

info break	# 断点信息

disable m n | m-n # 关闭断点
enable  m n | m-n	# 打开断点
delete m n | m-n 	# 删除断点
```

# 调试代码

```bash
run			# 停在第一个断点
start		# 停在第一条语句

next		# 单步跟踪，不进入函数体

step		# 单步，函数调用进入函数体内
finish	# 退出进入的函数，如果无效，可能是设置有断点 

until		# 退出循环体
continue# 运行到下一个断点处
```

# 追踪变量

```bash
print var 		# 打印变量


display var		# 持续显示变量
info display	# display相关信息
# 关闭/打开持续显示变量
disable display m n | m-n
enable display m n | m-n


delete display m n | m-n
undisplay m n | m-n

ptype var   		# 查看变量var的类型
p var 					# 打印变量var的值
set var i=1     # 修改变量参数
```

# 多进程调试

```c
show follow-fork-mode
set follow-fork-mode [parent(默认) | child]
```

```c
show detach-on-fork
set detach-on-fork [on(默认) | off]
```

```c
info inferiors
inferior id
detach inferiors id
```
