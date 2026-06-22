---
title: '速读Google白皮书Agent Tools '
pubDate: 2026-01-02
description: 'Google 白皮书AgentTools学习笔记'
author: 'binlong Zhang'
tags: ["Agent", "LLM Engieering", "Agent Tool", "mcp"]
---
[https://drive.google.com/file/d/1ENMUDzybOzxnycQQxNh5sE9quRd0s3Sd/view](https://drive.google.com/file/d/1ENMUDzybOzxnycQQxNh5sE9quRd0s3Sd/view)

## Introduction: Models, Tools and Agents

> 全文简介，信息量较少

## Tools and tool calling

> 介绍了下llm的工具和google的sdk，没啥信息量

## Understanding the Model Context Protocol （MCP）

> 简单介绍了mcp，内容量远小于mcp的specification

- 文章提到了mcpServer的Prompt功能等价于将外部信息注入模型上下文，这意味着
  - agent是否要支持该功能
  - 支持的话，这里需要安全&功能影响 审核
- 文章提到mcp定义的功能除tool外很少实现/使用，其价值有待进一步观察
  - 提到某些功能有安全风险
  - client的root
    - 文章表示实践中root的使用暂不明确(有失偏颇)
    - 实际至少对于AI-IDE本地部署的mcp还是有用
    - 感觉claude是AI-IDE起家，所以也就了这个功能
- 为llm与外界交互的安全提供了交互范式（Human-in-the-Loop），即用户批准（尽管还不够安全)

## Model Context Protocol: For and Against

> 一些对mcp理解

- 文章提到mcp的监管/审核/部署/认证，这创造了诞生平台的机会（类似应用商店，赚个保护费）
- 文章认为mcp促进了Agentic AI mesh的建设
- 文章提到企业级应用mcp存在
  - 细粒度的Authentication & Authorization
  - Identity Management Ambiguity
  - Lack of Native Observability
- 文章认为mcp的性能和扩展性瓶颈
  - mcp信息过多会导致llm (上下文工程问题)
    - 上下文中模型丢失用户意图/重要细节信息
    - 无法精准选中工具
    - 影响模型推理能力
  - 有状态的协议管理影响横向扩展
  - google认为mcp工具数量爆炸将来可能通过RAG-Like检索解决
    - 其也提出了**向量攻击**的风险(恶意注入特定向量导致检索/匹配策略失效)

## Security in MCP

> 全篇最有价值的章节，提了一些mcp的风险&应对策略。这里重点提下风险，详细的应对建议读原文

- 动态能力注入风险
  - mcp的运行时装载提供了灵活性，但没有强制Server的变更要通知client引入了安全风险
  - 这个问题不好解决，需要非常健壮的client设计，包括
    - client安全：隔离client和Server，严防恶意Server对client破坏
    - 操作安全：要规定允许tool的能力边界，还要防止恶意Server功能的伪造/变更
      - toolList应该默认关闭，仅打开允许使用的，并进行最小权限限制
    - 风险mcpServer显式通知用户
  - 可能是mcp迟迟不支持流式的原因？
- 工具遮挡 (Shadowing)
  - 除工具信息爆炸导致llm错误选择之外，还要防止恶意Server对正常Server的覆盖
- 恶意工具定义和上下文消耗
  - 设置工具上下文注入限制&检查
  - 工具上下文注入时需要安全审核
- 敏感信息泄露
  - 所以需要（Human-in-the-Loop）
  - mcp的很多能力，尤其Elicitation可能进一步增加该风险
- 不支持访问限制
  - 要实现细粒度的授权控制，且采用最小授权设计

## Conclusion

> 总结了下，提了个观点

**mcp未来在企业环境中的形态可能/应该并非纯粹的开源协议，而是一个融合了多层管理和控制的组件**
