---
title: 'Behavioral Pattern'
pubDate: 2023-05-03
description: '行为型设计模式概览'
author: 'binlong Zhang'
tags: ["Design Pattern", "行为型模式", "设计模式"]
---
# Chain of Resposibility

> - 收到请求后，每个处理者均对请求进行处理，或者将其传递给链上的下一个处理者
> - 责任链将特定行为转换为_handlers,_而后各责任被摘取成拥有单独方法的类，进而请求沿着这条路检查

## 结构

![structure-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681306000442-30f754c3-8d5a-414c-88a9-9e1697504025.png#averageHue=%23f28f7f&clientId=udcddbdf5-ada7-4&from=drop&id=u54f8f984&originHeight=430&originWidth=380&originalType=binary&ratio=1&rotation=0&showTitle=false&size=14569&status=done&style=none&taskId=uadbddc8d-8828-4419-a186-ba4279f0220&title=)

## 特点

- 可以控制请求处理的顺序
- 符合单责任原则、开闭原则
- 一些请求可能最终无法处理

## 场景

- 当你的程序期待处理不同种类的请求，用不同方式，但是期待的请求类型和顺序是未知的
- 当你有必要以特定的顺序执行几个handlers
- 当handlers和他们的顺序在运行时会改变

# Interpreter

> 解释器模式为某个语言 定义他的语法表示，并定义一个解释器用来处理这个语法

## 结构

![3115781-e3bdbdbe5f35dd9f.webp](https://cdn.nlark.com/yuque/0/2023/webp/1455047/1681366274044-a0ae6c4b-cb22-405e-be07-4b545a7f613d.webp#averageHue=%23f0f0f0&clientId=udcddbdf5-ada7-4&from=drop&id=u20e50f00&originHeight=518&originWidth=886&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17934&status=done&style=none&taskId=u92cc974d-52e8-4c45-93a0-da32c3e0d9b&title=)

- Context 用来存储解释器上下文环境，包括解释器之外的一些全局信息
- AbstractExpression 为抽象语法树中的所有节点共享
- TreminalExpression&NontermialExpression解释器的具体实现
- client客户

## 特点

- 有抽象的父类，便于扩展

---

- 可用场景少
- 复杂文法难以维护

## 场景

- 编译器
- 规则引擎
- 正则表达式

# Command

> - 转换请求称为独立的包含请求相关信息的对象，如此就可以将请求作为方法参数，延迟，排队等

## 结构

![structure-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681307479285-1c31df67-5789-4c44-a83a-ba72e70b6242.png#averageHue=%23889c88&clientId=udcddbdf5-ada7-4&from=drop&id=u031a0985&originHeight=390&originWidth=640&originalType=binary&ratio=1&rotation=0&showTitle=false&size=14770&status=done&style=none&taskId=u4fdc61e7-c91d-48f2-a5b2-f83e4204c25&title=)
![example.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681308595469-743cab69-05db-46f4-bab3-50b4045b9794.png#averageHue=%238ca18f&clientId=udcddbdf5-ada7-4&from=drop&id=u2c9db820&originHeight=600&originWidth=640&originalType=binary&ratio=1&rotation=0&showTitle=false&size=19293&status=done&style=none&taskId=ue0a22091-5786-40bc-a593-11a56358271&title=)

| Invoker          | Button                      |
| ---------------- | --------------------------- |
| Comand           | Command                     |
| Concrete Command | copy/cut/paste/undo Command |
| Receiver         | Editor                      |
| Client           | Application                 |

## 特点

- 解耦出发和执行的操作类(按钮 和 操作，并用命令连接)
- 开闭原则
- 实现撤销恢复，延迟执行
- 将一组简单命令组合成复杂命令

---

- 代码会复杂，因为你在发送者和接受者之间增加了一个全新层次

## 场景

- 需要通过操作来参数化对象
- 你想要将操作放入队列中、操作的执行或远程执行操作
- 希望实现回滚

# Iterator

> 在不暴露底层表现形式的情况下，遍历集合中元素

## 结构

![structure-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681312142377-34d7fdf7-f2f2-44b2-ab9e-1033b9c74be6.png#averageHue=%23ebebea&clientId=udcddbdf5-ada7-4&from=drop&id=u59294b28&originHeight=390&originWidth=520&originalType=binary&ratio=1&rotation=0&showTitle=false&size=12199&status=done&style=none&taskId=u2c1f50d4-0cd1-4dc2-9f21-ff0359c7f91&title=)

## 特点

- 符合单依职责原则，开闭原则
- 可以并行遍历同一个集合（迭代器包含自身状态）

---

- 如果只有简单的集合，则没有必要
- 对于某些集合，使用迭代器可能会低效

## 场景

- 集合背后为复杂数据结构，希望对客户隐藏（处于便利或安全考虑）
- 减少重复的 遍历代码
- 遍历不同甚至无法预知的数据结构

# Mediator

> 减少对象之间混乱无序的依赖关系，限制对象之间的交互，迫使他们通过中介者合作

## 结构

![structure-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681313615476-11a06de9-2bc0-4cd6-b3a1-43f0992a647e.png#averageHue=%238b9e8b&clientId=udcddbdf5-ada7-4&from=drop&id=ubc32b8b3&originHeight=430&originWidth=520&originalType=binary&ratio=1&rotation=0&showTitle=false&size=14638&status=done&style=none&taskId=u33dde885-36be-451d-8c3d-1a50e4c050a&title=)

## 特点

- 单一职责原则、开闭原则
- 减轻应用中多个组件间耦合，可以更方便的复用各个组件

---

- 一段时间后中介者可能会演化为上帝对象

## 场景

- 一些对象和其他对象紧密耦合导致难以修改
- 组件因为过于依赖其他组件而无法在不同场景复用
- 为了能在不同场景下复用一些基本行为，导致你需要大量创建组件子类

# Memento

> - 允许不暴露对象实现细节的情况下保存和回复对象之前的状态
> - 建议将对象状态存储在memento的特殊对象中，禁止其他无关对象直接访问memento，必须通过受限的接口与之交互
>
> 1. 对象自己产生历史对象
> 2. 严格封装，确保历史不被修改

## 结构

- **Originator**类可以生成自身状态的快照,也可以在需要时通过快照恢复自身状态
- **Memento**是原发器状态快照的值对象,通常做法是将备忘录设为不可变的， 并通过构造函数一次性传递数据。
- **Caretaker(负责人)**仅知道 “何时” 和 “为何” 捕捉原发器的状态，以及何时恢复状态。负责人通过保存备忘录栈来记录原发器的历史状态。 当原发器需要回溯历史状态时， 负责人将从栈中获取最顶部的备忘录， 并将其传递给原发器的恢复 （restoration） 方法。

![基于嵌套类](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681315313028-5d386756-9df7-466a-bc8d-efc35d69a7c1.png#averageHue=%23899d88&clientId=udcddbdf5-ada7-4&from=drop&id=u7fbfecd5&originHeight=310&originWidth=580&originalType=binary&ratio=1&rotation=0&showTitle=true&size=10305&status=done&style=none&taskId=u60d0f82e-65b9-4e16-91b9-574b17d972c&title=%E5%9F%BA%E4%BA%8E%E5%B5%8C%E5%A5%97%E7%B1%BB "基于嵌套类")![基于接口实现](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681315656661-4818ec9e-efc5-4993-8788-98c3c46009e7.png#averageHue=%23839a85&clientId=udcddbdf5-ada7-4&from=drop&id=u9e86eb9b&originHeight=350&originWidth=560&originalType=binary&ratio=1&rotation=0&showTitle=true&size=9217&status=done&style=none&taskId=u83cce312-5178-4a74-82c1-7fc436537b9&title=%E5%9F%BA%E4%BA%8E%E6%8E%A5%E5%8F%A3%E5%AE%9E%E7%8E%B0 "基于接口实现")
![更严格的封装](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681315902544-f5644261-34f7-4876-bffb-e11350cce1b1.png#averageHue=%238fa390&clientId=udcddbdf5-ada7-4&from=drop&id=u2ca91732&originHeight=340&originWidth=590&originalType=binary&ratio=1&rotation=0&showTitle=true&size=10574&status=done&style=none&taskId=ub244deb5-f691-4e00-846e-07eb8264cdb&title=%E6%9B%B4%E4%B8%A5%E6%A0%BC%E7%9A%84%E5%B0%81%E8%A3%85 "更严格的封装")

## 特点

- 在不破坏封装的前提下创建对象状态快照
- 可以通过让Caretaker维护原发器状态历史记录简化Originator

---

- 创建过于频繁，将消耗大量内存
- Caretaker必须完整跟踪原发器声明周期
- 动态编程语言不能确保备忘录不被修改（PHP、Python）

## 场景

- 需要使用快照回复之前的状态
- 直接访问对象成员变量、获取器等导致的封装破裂

# Observer

> 允许定义一种订阅机制，可以在对象事件发生时候通知多个观察该对象的其他对象

## 结构

![structure-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681316771722-aa802089-8095-45bb-8c3d-fd89b24acca5.png#averageHue=%238c9f8c&clientId=udcddbdf5-ada7-4&from=drop&id=u1900b108&originHeight=330&originWidth=620&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17289&status=done&style=none&taskId=u0fc8f94f-20d9-4ca6-b237-041bebda93e&title=)

## 特点

- 开闭原则
- 可以在运行时候建立对象之间的联系

---

- 订阅者通知的顺序是随机的

## 场景

- 当一个对象的状态改变需要改变其他对象，或实际对象是事前位置或动态变化的
- 当应用中的一些对象必须观察到其他对象时

# State

> - 能让对象内部状态发生变化时改变行为，看上去好像类改变了一样

## 结构

![structure-zh-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681317384447-7f56c443-4fbf-4ad2-a8c0-577f5c2658c1.png#averageHue=%2396a897&clientId=udcddbdf5-ada7-4&from=drop&id=ucbcb67bc&originHeight=430&originWidth=540&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17982&status=done&style=none&taskId=ub03d3b4c-338a-45eb-931a-d00b792e59b&title=)

## 特点

- 单一职责原则，开闭原则，消除臃肿的状态机条件语句简化上下文

---

- 如果状态很少，则会小题大做

## 场景

- 对象需要根据自身状态有不同行为，且同时状态数量多且频繁变更
- 某个类需要根据成员变量值改变自身行为，且大量条件语句
- 相似状态和基于条件的状态机转换中有许多重复代码

# Strategy

> 让你定义一系列算法，并将他们放入独立的类中，以便于算法对象能相互替换

## 结构

![structure-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681353256548-9ca178f6-b11e-49c9-b857-fceda82c40c7.png#averageHue=%23899c88&clientId=udcddbdf5-ada7-4&from=drop&id=uc5f065ac&originHeight=390&originWidth=450&originalType=binary&ratio=1&rotation=0&showTitle=false&size=13052&status=done&style=none&taskId=u9f648628-0472-43c6-a692-b89fe885b8b&title=)

## 特点

- 可以在运行时切换对象内的算法
- 将算法实现和使用隔离
- 使用组合代替继承
- 开闭原则

---

- 算法极少改变，没必要引入，会使得程序复杂
- 客户端必须了解策略间的不同----其需要选择合适的策略
- 许多现代编程语言都支持函数类型，允许你在一组匿名函数中实现不同版本的算法。如此使用这些函数的方式就和使用策略对象完全相同，无需借助额外的接口

## 场景

- 当你想使用对象中各种不同的算法变体，并希望能在运行时切换算法
- 当你有许多在执行某些行为时略有不同的相似类时
- 算法在上下文的逻辑不是很重要，如此可以将业务逻辑与具体算法隔离
- 当类中使用了复杂条件运算符以在同一算法的不同变体中切换

# Template

> 在超类中定义了一个算法框架，允许子类在不修改结构的情况下重写算法特定步骤

## 结构

![structure-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681355269130-b3769a4c-f8e3-406b-8493-a84ee9be63a2.png#averageHue=%2397a998&clientId=udcddbdf5-ada7-4&from=drop&id=u5dcdebad&originHeight=380&originWidth=350&originalType=binary&ratio=1&rotation=0&showTitle=false&size=6335&status=done&style=none&taskId=u3e9c2191-5c8f-4cf5-9f8e-3e8c8074818&title=)

## 特点

- 你可以允许客户端重写一个大型算法的特定部分，使得算法其他部分修改对其影响很小
- 将重复代码取到一个超类中

---

- 部分客户端收到算法框架限制
- 通过子类移植默认步骤实现可能违反里氏替换原则
- 模板方法步骤越多，就越难维护

## 场景

- 当你只希望客户端扩展某个特定算法步骤，而不是整个算法
- 当多个类算法除了有一些细微的不同之外，其他几乎完全一样时

# Visitor

> 将算法和作用的对象隔离
> 访问者模式建议将新行为放入名为访问者的独立类中，而非整合到已有类中。

## 结构

![structure-zh-indexed.png](https://cdn.nlark.com/yuque/0/2023/png/1455047/1681356585030-43afef08-0e66-4504-9958-0a933815d7a6.png#averageHue=%23819882&clientId=udcddbdf5-ada7-4&from=drop&id=u77d7703c&originHeight=560&originWidth=520&originalType=binary&ratio=1&rotation=0&showTitle=false&size=18471&status=done&style=none&taskId=u74313ec3-f4ed-4541-a9ee-a2f15185d0a&title=)

## 特点

- 开闭原则，单一职责原则
- 访问者对象可以在各种对象交互时收集一些有用信息

---

- 每次元素层次结构中添加或移除一个类，你都要更新所有访问者
- 在访问者与某个元素交互时，他们可能没有访问元素私有变量的方法和权限

## 场景

- 你需要对一个复杂对象结构中的元素执行某些操作
- 清理辅助行为的业务逻辑
- 某个行为仅在类惩戒结构中的一些类中有意义，其他类中没意义时
