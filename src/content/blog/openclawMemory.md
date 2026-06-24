---
title: 'Openclaw Memory'
pubDate: 2026-05-25
description: 'openclaw memory解析'
author: 'binlong Zhang'
tags: ["LLM Engieering", "Memory System",  "Agent"]
---
> 本来这部分内容应该放在 [Talk Something about Openclaw](/blog/somethingaboutopenclaw/)，但介于那边篇幅过长，把这块单独摘出来解析吧




openclaw记忆控制是交由主LLM完成，但其主LLM模型

- 通常是基于通用任务设计，无法为memory做专门设计/微调
- 需要在 任务执行效率 和 记忆效果 之前trade-off

### active memory

**存储后端**

- builtin：内置 SQLite-based 存储（默认）
- qmd：外部 QMD 存储后端

#### memory files

| 文件路径                 | 描述                                                                                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `memory/YYYY-MM-DD.md` | Daily log (append-only). Read today + yesterday at session start.                                                                                                             |
| `MEMORY.md`            | Curated long-term memory. If both MEMORY.md and memory.md exist at the workspace root, OpenClaw loads both. Only load in the main, private session (never in group contexts). |
| `DREAMS.md` (optional) | Dream Diary and dreaming sweep summaries for human review, including grounded historical backfill entries.                                                                    |

- 每个智能体对应一个SQLite `~/.openclaw/memory/<agentId>.sqlite`
- 监听记忆文件变动（1.5s防抖延迟）同步操作会在会话启动、执行搜索或按固定间隔触发，并以异步方式运行。会话记录会根据增量阈值触发后台同步。
- the embedding provider/model、endpoint fingerprint、chunking params等配置发生变化，会异步进行索引重建(别名切换)

```js
// agents.defaults.compaction.memoryFlush
// 当contextWindow - reserveTokensFloor - softThresholdTokens = context时触发
{
  agents: {
    defaults: {
      compaction: {
        reserveTokensFloor: 20000,
        memoryFlush: {
          enabled: true,
          softThresholdTokens: 4000, 
          systemPrompt: "Session nearing compaction. Store durable memories now.",
          prompt: "Write any lasting notes to memory/YYYY-MM-DD.md; reply with NO_REPLY if nothing to store.",
        },
      },
    },
  },
}
```
