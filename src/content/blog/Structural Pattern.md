---
title: 'Structural Pattern'
pubDate: 2023-05-02
description: '结构型设计模式概览'
author: 'binlong Zhang'
tags: ["Design Pattern", "结构型模式", "设计模式"]
---

> 描述如何将类或者对象结合在一起，形成更大、更复杂的结构。
- 其包括 **类结构型模式** 和 **对象结构型模式**
- 类结构模式一般存在于继承和实现关系。对象结构模型关心类与对象的组合，通过关联关系实现。系统中尽量用关联关系代替继承关系，因此大部分结构性模式都是对象结构性模式

# Adapter

> - 适配器模式中定义包装类，包装不兼容接口的对象（适配者）
> - 适配器提供用户所需接口，将用户请求转化为适配者对应的调用，是的接口不兼容的类进行交互

## 结构

- Target
- Adapter
- Adaptee
- Client

![Adapter.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/1455047/1681228415108-69a3b412-6a3e-4b03-876c-03346ea95211.jpeg#averageHue=%23f4f2ef&clientId=ucdb3b667-bf5d-4&from=drop&id=u7f3cb8a3&originHeight=313&originWidth=724&originalType=binary&ratio=1&rotation=0&showTitle=false&size=24090&status=done&style=none&taskId=ub03b7e95-0079-4eee-971e-e7d265dee6a&title=)![Adapter_classModel.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/1455047/1681228536534-8f5338d2-ca8a-424d-b318-7c8641f04d81.jpeg#averageHue=%23f6f4f1&clientId=ucdb3b667-bf5d-4&from=drop&id=uce3868cd&originHeight=344&originWidth=663&originalType=binary&ratio=1&rotation=0&showTitle=false&size=24482&status=done&style=none&taskId=u1336d31a-7d41-4100-a407-15e7fc21725&title=)

## 特点

- 引入一个适配器复用现有适配者类，增强了类的透明性和复用性

---

- 类适配器是适配者的子类，因此可以在适配器类中置换一些适配者方法，是适配器类更灵活
- 对于不支持多继承的语言，适配这类一次只能适配一个适配者类，因此使用有局限

---

- 对象适配器可以把多个不同的适配者适配到同一目标
- 于对象适配器想置换适配者方法不太容易，一定要做需要先做一个适配者子类置换对应方法，再实现适配

## 场景

- 系统需要使用现有类，而其接口不符合系统需要
- java 的 JDBC

# Bridge

> - 对于两个维度变化的系统，将继承关系转换为关联关系，降低类与类之间的耦合，减少代码编写量
> - 也称为 **柄体(handle and body)模式** 或 **接口(Interface)模式**

## 结构

- Abstraction
- RefinedAbstraction
- Implementor
- ConcreteImplementor

![Bridge.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/1455047/1681230121463-af94d0b8-39d4-42b7-b22b-30b41494276f.jpeg#averageHue=%23f3efea&clientId=u47ad9d9d-7dd0-4&from=drop&id=ud1fc48bb&originHeight=393&originWidth=867&originalType=binary&ratio=1&rotation=0&showTitle=false&size=43797&status=done&style=none&taskId=u875363bb-4e7e-49a9-9e39-c8e14f73ed3&title=)

## 特点

- 将抽象化和实现化脱耦，使得二者独立变化，将强关联编程弱关联，最终使用关联而非继承
- 分离抽象接口及实现，桥接模式类似于多继承，但比多继承简单，是更好的解决方案
- 桥接模式可扩展性高，两个维度中任意扩展一个维度，不需要修改源系统
- 但会增加系统难度，对抽象设计要求更高

## 场景

- 当你想要划分和组织一个有几个功能变种大类
- 当你需要扩展一个类在几个独立正交的维度
- 当你需要在运行时切换实现时

---

- 系统需要在构件的抽象化角色和具体化角色之间增加更多的灵活性，避免在两个层次之间建立静态的继承联系，通过桥接模式可以使它们在抽象层建立一个关联关系
- 抽象化角色和实现化角色可以以继承的方式独立扩展而互不影响，在程序运行时可以动态将一个抽象化子类的对象和一个实现化子类的对象进行组合
- 对于那些不希望使用继承或因为多层次继承导致系统类的个数急剧增加的系统，桥接模式尤为适用

---

- 桥接模式和适配器模式用于设计的不同阶段，桥接模式用于系统的初步设计，对于存在两个独立变化维度的类可以将其分为抽象化和实现化两个角色，使它们可以分别进行变化；而在初步设计完成之后，当发现系统与已有类无法协同工作时，可以采用适配器模式。但有时候在设计初期也需要考虑适配器模式，特别是那些涉及到大量第三方应用接口的情况。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681265782893-b805ddf1-3b2a-4f45-b0e4-ee9b9a885e98.png#averageHue=%23585757&clientId=uee2d87a5-7e20-4&from=paste&id=u9b91a8e5&originHeight=480&originWidth=640&originalType=url&ratio=1&rotation=0&showTitle=false&size=88538&status=done&style=none&taskId=u033e1a87-5a83-43fa-b07e-1b31820ff1a&title=)

# Composite

> - 让你组合对象成为树结构 而后 使用这些结构工作好像他们是独立的对象
> - 仅用于你应用的一些核心模型可以被表示成树结构

## 结构

![structure-en-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681270382131-702709b0-c696-41c9-88d4-00299010f2c7.png#averageHue=%237b937c&clientId=u372b2196-cc6d-4&from=drop&id=u42ca1d29&originHeight=470&originWidth=400&originalType=binary&ratio=1&rotation=0&showTitle=false&size=10345&status=done&style=none&taskId=u93346f98-5256-4d46-939f-6d7bd1b4c81&title=)

## 特点

- 更方便的使用复杂的树结构（利用多态和递归）
- 符合 开闭原则
- 对于某些功能不同的类，很难提供统一接口，一些场景下过度的抽象使得接口难以理解

## 场景

- 当你实现对象们可以被组织成树形结构
- 当你想要客户端代码对待简单和复杂元素用统一的方法

# Decorator

> 提供另一种扩展类的方式，提供更高的灵活性，更符合单类单责任

## 结构

![structure-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681286654692-239a0f80-8673-4505-aa23-05b1f313062d.png#averageHue=%23859a86&clientId=u372b2196-cc6d-4&from=drop&id=ua9b5225f&originHeight=510&originWidth=500&originalType=binary&ratio=1&rotation=0&showTitle=false&size=16850&status=done&style=none&taskId=u1a852731-44b0-42b2-85f5-f9751764de6&title=)

## 特点

- 可以扩展一个对象而不用创造一个新类
- 可以在运行时添加或移除类的部分责任
- 可以组合几个行为通过包裹一个对象到多个装饰器中
- 可以划分一个复杂类，实现多个可能的变种行为为几个小的类
- 很难移除一个具体的wrapper
- 层级的初始配置代码可能看起来很丑陋

## 场景

- 当你需要赋值额外的行为给运行时对象，并且不修改使用对象
- 在一些无法继承的场景下扩展类

# Facade

> - 给库、框架、其他复杂类提供简单的接口
> - 外观提供了比直接用子系统更有限的功能，但是却简化了接口，给用户提供真正关心的功能

## 结构

![structure-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681291244307-dd04cd3e-49fb-42d3-8a6c-c2406fb9517d.png#averageHue=%23d7d7d6&clientId=u372b2196-cc6d-4&from=drop&id=uda2e88a0&originHeight=380&originWidth=600&originalType=binary&ratio=1&rotation=0&showTitle=false&size=14002&status=done&style=none&taskId=u942e582c-03d2-4078-ac13-58e6e203b01&title=)

## 特点

- 隔绝你的代码和复杂子系统
- 外观可能变成了与应用中所有类耦合的类

## 场景

- 当你需要简单调用一个复杂子系统
- 当你希望将子系统组织成层结构时

# Flyweight

> 为了能将更多对象放入RAM，可以共享对象们通用的状态

## 结构

![structure-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681295083281-efba75a5-c959-4eb4-80f4-70a4051aaa00.png#averageHue=%2392a492&clientId=u372b2196-cc6d-4&from=drop&id=u4808acbd&originHeight=410&originWidth=630&originalType=binary&ratio=1&rotation=0&showTitle=false&size=19630&status=done&style=none&taskId=u2148f03f-d066-40f4-aed5-202435de60a&title=)

## 特点

- 节省大量的RAM，但给cpu增加了负担，因此需要在cpu和RAM间权衡
- 增加代码复杂性

## 场景

- 只有当你的程序必须支撑巨大数量的对象，而导致RAM不足
- 游戏场景

# Proxy

> - 代理 控制了对原对象的访问，允许我们在调用某个对象前后额做一些事

## 结构

![structure-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681302848398-279ce6b8-03eb-4cc9-a919-71202a60b6dd.png#averageHue=%23849a85&clientId=u372b2196-cc6d-4&from=drop&id=ub76a9fdd&originHeight=390&originWidth=410&originalType=binary&ratio=1&rotation=0&showTitle=false&size=9662&status=done&style=none&taskId=u8c6526ea-c6a5-4081-afdf-e0df3c2d24e&title=)

- **代理类** 完成其责任之后会传递请求给服务对象，通常代理管理服务对象的生命周期
- **客户端 **无论和service或proxy工作都需要通过相同接口，如此更好使用proxy替换service

## 特点

- 可以控制服务对象不让客户端知道
- 管理服务对象的生命周期
- 即便服务对象没准备好或者不可用，代理仍旧正常工作
- 符合开闭 原则

---

- 代码会变得负责
- 响应服务会得到延迟

## 场景

- 懒初始化
- 访问控制
- 本地执行远程服务（远程代理）
- 日志请求
- 缓存请求
- 智能引用
