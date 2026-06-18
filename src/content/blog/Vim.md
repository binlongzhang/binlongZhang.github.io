---
title: 'Vim'
pubDate: 2022-04-04
description: '简要介绍 Vim 的用法和常见命令'
author: 'binlong Zhang'
tags: ["Vim", "tools", "编辑器"]
---


>   帮助文档 -- vimtutor

# 模式

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1674816781426-4870888f-b78f-4c56-90e0-26f8ab24a6af.png#averageHue=%23fbfbfb&clientId=u46ee56d0-7d42-4&from=paste&height=292&id=ua5397485&name=image.png&originHeight=292&originWidth=356&originalType=binary&ratio=1&rotation=0&showTitle=false&size=416849&status=done&style=none&taskId=ubd88c0a6-9d2d-4fdb-9b8e-3a845ae4bc4&title=&width=356) 

# 基本命令

## 命令模式

| ZZ | 保存退出 |
| --- | --- |
|  |  |
| gg=G | 代码格式化 |
| set nu | 设置显示行号 |
|  |  |
| k,  j,  h,  l (上,下,左,右) | 光标移动 |
| gg, G | 光标移动到文件首、尾 |
| 0, $ | 光标移动到行首、尾 |
| nG | 行转跳，到n行 |
|  |  |
| x, X | 删除光标后/前的字符 |
|  dd/ndd | 删除光标所在行/后n行 |
| ndd | 从当前光标删除n行 |
| v/ctrl+v | 使用h、j、k、l移动选择内容, 然后删除/编辑。其中ctrl+v是列模式, v为非列模式 |
|  |  |
| u | 撤销 |
|  |  |
| yy/nyy | 赋值当前行/n行 |
| p/P | 所在位置下一行/上一行粘贴 |
| r/R | 替换当前字符/当前行后的字符 |
|  |  |
| **/xxxx，？xxx** | **从当前位置搜索，n/N分别向上/下** |
|  |  |
| i, a | 光标前/后插入 |
| I, A | 行首/尾插入 |
| o, O | 光标所在行下/上创建一行 |
| s, S | 删除光标后/所在当前行，从当前位置/行插入 |

## 末行状态

> 命令模式下输入(:)切换至末行模式；
> 两次ESC，Backspace或回车键切回命令模式

| q/q! | 退出/强制退出 |
| --- | --- |
| w | 写入 |
| wq | 写入并退出 |
| x | 同上 |
|  |  |
| :s/old/new/ | 光标所在行的第一个old替换为new |
| :s/old/new/g | 光标所在行的所有old替换为new |
| :%s/old/new/g | 当前文件的所有old替换为new |
| :%s/old/new/gc | 同上，但是每次替换需要用户确认 |
|  |  |
| ctrl + u/d/f/b | 向下/上/前/后翻页 |
| !shell 命令 | 末行模式下执行shell命令 |

## Vim配置文件

- 用户级别配置文件 ~/.vimrc
- 系统级别配置文件 /etc/vim/vimrc
