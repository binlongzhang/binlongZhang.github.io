---
title: 'Creational Pattern'
pubDate: 2023-05-01
description: '创建型设计模式概览'
author: 'binlong Zhang'
tags: ["Design Pattern", "创建型模式", "设计模式"]
---
# Simple Factory

> - 也叫 Static Factory Method 模式
> - 根据参数的不同返回不同类的实例
> - 被创建的实例通常有共同的 父类

## 结构

- Factory
  - 负责创建所有实例
- Product
  - 所有创建对象的父类
  - 描述所有实例公共接口
- Concrete Product
  - 具体的产品，是Producet的实例

![SimpleFactory.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/1455047/1681218004203-3f930946-d85f-412e-aff8-1198d08b8ca0.jpeg#averageHue=%23ebe3d4&clientId=ub6f56dad-1e85-4&from=drop&id=ua46767ed&originHeight=422&originWidth=675&originalType=binary&ratio=1&rotation=0&showTitle=false&size=33349&status=done&style=none&taskId=u4ac61315-22a9-4dd8-967c-18517d4d6d6&title=)

## 特点

- 工厂类必须含有判断逻辑来决定什么时候创建何种产品类
- 工厂类集中了所有产品创建逻辑，一旦无法工作，整个系统都受影响
- 一定程度增加系统开销
- 工厂方法是静态方法，造成工厂无法形成基于继承的结构

## 场景

- 工厂类负责创建的对象少
- 客户端只知道传入工厂类的参数，对如何创建对象不关心

# Factory Method

> - 也叫 工厂模式、虚构造器模式、多态工厂模式
> - 工厂父类定义创建产品对象的共有接口，工厂子类负责生产产品对象
> - 将产品实例化延迟到子类完成，由子类决定实例化何种产品

## 结构

- Product
- Concrete Product
- Factory
- Concrete Factory

![FactoryMethod.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/1455047/1681218955328-f5971c10-dab2-43c3-80ba-6b0fe5555d49.jpeg#averageHue=%23f4f2ee&clientId=u01bce83c-b30e-4&from=drop&id=udcc7e515&originHeight=401&originWidth=598&originalType=binary&ratio=1&rotation=0&showTitle=false&size=27833&status=done&style=none&taskId=u8432d579-10c0-4a0e-8f65-8d31a02bef6&title=)

## 特点

- 所有的具体工厂都具有同一抽象父类
- 在系统加入新产品时，无需修改抽象的工厂类和抽象的产品接口，只需要添加一个具体的工厂和产品即可
- 扩展性好，完全符合 **开闭原则**
- 增加系统复杂性，带来额外开销，增加系统理解难度
- 仅返回一个具体产品，会违背工厂的用于，从而退化。同样的，如果只有一个具体工厂，也会退化为简单工厂模式

## 场景

- 类不需要知道他所需要的对象的类，只要知道对应的工厂即可
- 将创建对象的任务委托给工厂子类中的一个，可以根据需要动态指定_（将工厂类类名存储在配置文件或数据库中）_

![loger.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/1455047/1681219705242-21f2d33f-83fa-4c35-b02a-76020415a2cb.jpeg#averageHue=%23f5f2ee&clientId=u01bce83c-b30e-4&from=drop&id=ue5577f84&originHeight=525&originWidth=882&originalType=binary&ratio=1&rotation=0&showTitle=false&size=55366&status=done&style=none&taskId=u3b21b7e1-37d5-4783-af44-bdf274fc28c&title=)

# Abstract Factory

> - 工厂方法模式中，具体的工厂负责审查具体的产品，每个工厂对应一个具体产品，有时候，我们需要一个共产提供多个产品
> - 引入两个概念
>   - 产品等级结构，即产品的继承结构
>   - 产品族，同一工厂生产的，谓语不同产品等级中的一组产品
> - 适用于系统提供的工厂所需生产的不是简单对象，而是位于不同产品结构中不同类型的具体产品
> - 与工厂方法模式相比，最大区别在于其针对一个产品等级结构，而抽象工厂模式则面对多个产品等级结构

## 结构

- Abstract Factory
- Concrete Factory
- Abstract Product
- Product

![AbatractFactory.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/1455047/1681220759736-054877eb-bcd2-4282-b2ae-4244a1ebb50d.jpeg#averageHue=%23f5f3f0&clientId=u01bce83c-b30e-4&from=drop&id=uf4f7beeb&originHeight=574&originWidth=835&originalType=binary&ratio=1&rotation=0&showTitle=false&size=56351&status=done&style=none&taskId=u5c509659-0a15-4823-984b-94d4e5694f4&title=)

## 特点

- 隔离了具体类生成，更换一个具体工厂相对容易，实现了一定程度上高内聚，低耦合
- 一个产品族的对象被设计一起工作，能保证客户端始终使用同一产品族产品
- 增加新的具体工厂和产品族很方便，无需修改系统，符合 **开闭原则**
- 难以扩展产生新的种类产品，由于抽象类定义了所有可能的产品集合，如此扩展需要扩展所有工厂的子类

## 场景

- 系统不依赖于产品类实例如何创建、组合和表达
- 系统有多余一个产品族，且每次只是用一个产品族
- 同一产品族的产品一起使用，磁约束必须在系统设计中体现
- 需要更换界面主题，包括界面中的按钮，文本框、背景色等等

# Builder

> 复杂对象由于内部组合部件过程复杂，因此，往往外部化到一个建造者对象里，其直接返回给用户完整的产品对象，用户不关心其属性及组装方式

## 结构

- Builder
- Concrete Builder
- Director
- Product

![Builder.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/1455047/1681222114014-01909f62-e3db-4c0f-a057-d06792e5f3ce.jpeg#averageHue=%23f2f0eb&clientId=u01bce83c-b30e-4&from=drop&id=uecdb4be6&originHeight=338&originWidth=713&originalType=binary&ratio=1&rotation=0&showTitle=false&size=35827&status=done&style=none&taskId=u14bcea85-324e-488d-bcf4-a7fcf6dacf4&title=)

## 特点

- 指挥者针对抽象的builder组织产品，客户只要知道具体的建造者类型，就可以通过调用指挥者获得产品
- 客户不必知道产品细节，解耦产品与产品的创建，相同创建过程创建不同产品
- 具体的建造者相对独立**用户使用不同建造者构建不同产品**
- 新增建造者无需修改源代码，扩展方便，符合 **开闭原则**
- 创建产品一般有较多共同点，组成部分相似，**不适合产品差异大则不适合**
- **产品内部变化复杂，**可能需要定义具体的建造者实现变化，导致系统庞大

## 场景

- 产品对象有复杂内部结构，通常包含多个成员属性，产品属性相互依赖要指定顺序
- 对象创建过程独立于创建该对象的类
- 游戏软件中，地图包括天空、地面、背景等组成部分，人物角色包括人体、服装、装备等组成部分

![KFCBuilder.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/1455047/1681223552475-c1639b42-e4c7-498c-a843-a52c4da18437.jpeg#averageHue=%23f6f3ef&clientId=ue71ce78c-4bbe-4&from=drop&id=uc165e617&originHeight=570&originWidth=782&originalType=binary&ratio=1&rotation=0&showTitle=false&size=47028&status=done&style=none&taskId=ub84107de-d566-4bd1-82c7-6e14a1c3af8&title=)

# Singleton

> - 某些类，只能有一个实例。全局变量可以确保对象随时被访问，但无法防止我们实例化多个对象
> - 让类自身负责保存其唯一实例，如此确保没有其他实例被创建，并提供一个访问该对象的方法
> - 单例模式确保一个类只有一个实例，并向系统提供这个实例

## 结构

![Singleton.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/1455047/1681225182875-2ddad5f0-3665-415e-a0b9-ebf55121c232.jpeg#averageHue=%23ece2d2&clientId=ue71ce78c-4bbe-4&from=drop&id=uf472b467&originHeight=273&originWidth=550&originalType=binary&ratio=1&rotation=0&showTitle=false&size=20887&status=done&style=none&taskId=u3d7a995a-c023-4e50-bc7c-33c39b0e65d&title=)

## 特点

- 确保一个类仅有一个实例，并提供一个访问它的全局访问点
- 拥有私有构造函数，确保用户无法将其实例化
- 包含静态私有成员变量和静态共有工厂方法，工厂方法检测视力存在性，并实例化自己
- 提供唯一实例受控访问，严格控制用户访问，节约系统资源
- 也可以扩展至允许指定个数的对象实例
- 没有抽象层不好扩展，单例类责任过重
- 单例对象的生命周期以及被GC回收下次又要实例化或者对象状态丢失等问题

## 场景

- 只需要一个实例对象
- 只允许访问一个公共访问点
- 如果一个类有多个实例共存，则需要扩展为多例模式

# Prototype

> - 当我们需要复制一个对象时，创建对象并依此赋值使得代码冗余，而且很多时候许多属性不对外公开
> - 原型模式委托复制过程给实际被复制的对象，该模式为要复制的类声明一个通用接口
> - 一个支持复制的对象被叫做 prototype

## 结构

![Basic implenmentation](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681268077403-948d265b-64dd-44d5-9764-6ffc517af7b2.png#averageHue=%236b6a69&clientId=u8435178a-30e0-4&from=drop&id=ud707caa3&originHeight=410&originWidth=520&originalType=binary&ratio=1&rotation=0&showTitle=true&size=17154&status=done&style=none&taskId=uf67977a3-dd3a-4ed1-951c-5befbddfeb2&title=Basic%20implenmentation "Basic implenmentation")
![Prototype registry implementation](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681268101525-ac2b2dae-5afe-40df-b879-9464e04895d6.png#averageHue=%23656565&clientId=u8435178a-30e0-4&from=drop&id=ued8f6983&originHeight=490&originWidth=550&originalType=binary&ratio=1&rotation=0&showTitle=true&size=19154&status=done&style=none&taskId=u62d48ed1-a317-46bd-b98b-3b87de9d515&title=Prototype%20registry%20implementation "Prototype registry implementation")

## 特点

- 你可以复制一个对象不耦合其具体类，帮助你摆脱重复初始化，使得生产复杂对象更方便
- 在处理复杂对象的预设配置时，除了继承之外的替代品
- 复制有循环引用的对象将会很麻烦

## 场景

- 当你的代码不应该依赖于具体你想拷贝的类对象
- 当你想减少子类数量，他们的不同仅仅是在初始化方式上有所不同_（通常来说，当你有一个复杂对象要初始化多次，你可以设计配置类来用于初始化复杂对象）_
