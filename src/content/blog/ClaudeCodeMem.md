---
title: 'Claude Code Memory'
pubDate: 2025-08-28
description: 'Claude Code的Memory系统设计'
author: 'binlong Zhang'
tags: ["Anthropic", "Memory System", "LLM Engieering", "AI Coding"]
---
> 注意：源码未开源，以下主要基于部分逆向/混淆源码片段综合分析，与真实实现可能存在出入
> 
> Coding场景的LLM系统记忆机制设计, 总的来说比较复杂，工程细节比较多，也不乏巧妙设计

> 优质材料推荐
>
> https://zhuanlan.zhihu.com/p/1935431442432778433
>
> https://southbridge-research.notion.site/claude-code-an-agentic-cleanroom-analysis
>
> https://github.com/shareAI-lab/analysis_claude_code?tab=readme-ov-file

| 层次     | 存储方式  | 访问速度 | 持久性   |
| -------- | --------- | -------- | -------- |
| 短期记忆 | 压缩摘要  | <100ms   | 单论会话 |
| 长期记忆 | CLAUDE.md | <1000ms  | 永久存储 |

# 短期记忆

> 上下文管理，会话级别的上下文存储

## 三级记忆预警

> 上下文包含：文件元信息，文件信息，用户query，历史对话，git操作，工具信息，error信息，图片等

| 触发条件 | 显示信息                                  | 系统行为(用户透明)      | 预估对话轮数 |
| -------- | ----------------------------------------- | ----------------------- | ------------ |
| Normal   | 用户主动触发<br>/compact 命令         | 触发[消息智能压缩算法](#消息智能压缩算法)    | -            |
| Warning  | Token使用率>60%<br>记忆使用量较高     | 增加监控频率            | 25~30        |
| Urgent   | Token使用率>80%<br>建议手动清理       | 额外Token检查，压缩预热 | 8~12         |
| Critical | Token使用率>92%<br>记忆已满，正在整理 | 触发[消息智能压缩算法](#消息智能压缩算法)    | -            |

## 消息智能压缩算法

> 平均70-80%的长度减少，95%以上关键信息保留

### 触发条件

- 上下文使用率>92%

> 源自多目标优化：用户体验*0.4+性能开销*0.3+信息保真*0.2+压缩频率*0.1

- 消息条数>20条
- 花费>5$ (存疑)

### 消息压缩

> - 场景专用的压缩结构设计
> - 专用压缩模型

- Coding场景设计的8段式压缩结构
  1. Primary Request and Intent (主要请求和意图)
  2. Key Technical Concepts (关键技术概念)
  3. Files and Code Sections (文件和代码段)
  4. Errors and fixes (错误和修复)
  5. Problem Solving (问题解决)
  6. All user messages (所有用户消息)
  7. Pending Tasks (待处理任务)
  8. Current Work (当前工作)
- 专用压缩模型(J7)

```js
// 8段式消息智能压缩Prompt
// 文件位置: improved-claude-code-5.mjs:44771-44967
// 功能：生成结构化的压缩提示词
function AU2(A) {
  // 基础压缩提示模板
  let basePrompt = `Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.
This summary should be thorough in capturing technical details, code patterns, and architectural decisions that would be essential for continuing development work without losing context.

Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points. In your analysis process:

1. Chronologically analyze each message and section of the conversation. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
     - file names
     - full code snippets
     - function signatures
     - file edits
  - Errors that you ran into and how you fixed them
  - Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.

Your summary should include the following sections:

1. Primary Request and Intent: Capture all of the user's explicit requests and intents in detail
2. Key Technical Concepts: List all important technical concepts, technologies, and frameworks discussed.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Pay special attention to the most recent messages and include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List all errors that you ran into, and how you fixed them. Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
5. Problem Solving: Document problems solved and any ongoing troubleshooting efforts.
6. All user messages: List ALL user messages that are not tool results. These are critical for understanding the users' feedback and changing intent.
6. Pending Tasks: Outline any pending tasks that you have explicitly been asked to work on.
7. Current Work: Describe in detail precisely what was being worked on immediately before this summary request, paying special attention to the most recent messages from both user and assistant. Include file names and code snippets where applicable.
8. Optional Next Step: List the next step that you will take that is related to the most recent work you were doing. IMPORTANT: ensure that this step is DIRECTLY in line with the user's explicit requests, and the task you were working on immediately before this summary request. If your last task was concluded, then only list next steps if they are explicitly in line with the users request. Do not start on tangential requests without confirming with the user first.

If there is a next step, include direct quotes from the most recent conversation showing exactly what task you were working on and where you left off. This should be verbatim to ensure there's no drift in task interpretation.

Here's an example of how your output should be structured:

<example>
<analysis>
[Your thought process, ensuring all points are covered thoroughly and accurately]
</analysis>

<summary>
1. Primary Request and Intent:
   [Detailed description]

2. Key Technical Concepts:
   - [Concept 1]
   - [Concept 2]
   - [...]

3. Files and Code Sections:
   - [File Name 1]
      - [Summary of why this file is important]
      - [Summary of the changes made to this file, if any]
      - [Important Code Snippet]
   - [File Name 2]
      - [Important Code Snippet]
   - [...]

4. Errors and fixes:
    - [Detailed description of error 1]:
      - [How you fixed the error]
      - [User feedback on the error if any]
    - [...]

5. Problem Solving:
   [Description of solved problems and ongoing troubleshooting]

6. All user messages: 
    - [Detailed non tool use user message]
    - [...]

7. Pending Tasks:
   - [Task 1]
   - [Task 2]
   - [...]

8. Current Work:
   [Precise description of current work]

9. Optional Next Step:
   [Optional Next step to take]

</summary>
</example>

Please provide your summary based on the conversation so far, following this structure and ensuring precision and thoroughness in your response. 

There may be additional summarization instructions provided in the included context. If so, remember to follow these instructions when creating the above summary. Examples of instructions include:
<example>
## Compact Instructions
When summarizing the conversation focus on typescript code changes and also remember the mistakes you made and how you fixed them.
</example>

<example>
# Summary instructions
When you are using compact - please focus on test output and code changes. Include file reads verbatim.
</example>

`;

  // 如果有附加指令，则追加
  if (A && A.trim() !== "") {
    return basePrompt + `\n\nAdditional Instructions:\n${A}`;
  }
  
  return basePrompt;
}
```

### 压缩质量验证

> Claude Code 使用多维度评分体系来量化压缩质量，确保在减少上下文长度的同时最大程度保留关键信息。

**信息保留率验证**

> *压缩评分公式*设计基于四个维度：
> $$
> \text{压缩评分} = 0.3 \cdot SC + 0.4 \cdot KP + 0.2 \cdot CC + 0.1 \cdot CR \cdot \begin{cases} 50 & \text> {if } CR < 0.15 \\ 100 & \text{else} \end{cases}
> $$
> 各维度定义如下：
> - **SC (Section Completeness)** = 8段结构完整率
> - **KP (Key Info Preservation)** = $\sum_{i \in I_0} \frac{\text{保存率}_i}{4}$，$Info$ = {文件名、错误信息、用> 户指令、技术关键词}
> - **CC (Context Continuity)** = $min(100, \text{连续因子} \times 20)$，连续词 = {首尾/然后/接来/下一步/...}
> - **CR (Compression Ratio)** = 压缩比例
> 
> 根据压缩评分和压缩结果生成改进建议(推测借助LLM)
>
>（改进意见推测用于：1.后续修复逻辑 2.数据采集 ）

**优雅降级**

| 处理方案 | 触发条件 | 备注 |
|---------|---------|------|
| 重新压缩 | 压缩评分70~79 | 1. 采用改进意见<br>2. 提升关键信息保留权重<br>3. 降低压缩比例 |
| 片段保留 | 某些段落信息丢失严重 | 压缩摘要+原关键信息片段 |
| 直接截断 | 多次压缩不达标 | 保留最近30%的消息历史 |



### 关键信息恢复

**智能文件恢复**
- 文件相关性计算
> $$
> \text{FileScore} = 0.35 \cdot TS + 0.25 \cdot FS + 0.2 \cdot OS + 0.15 \cdot FTS + 0.05 \cdot RS
> $$
> 
> $$
> TS = \begin{cases}
> 100 & \text{if } hour \leq 1 \\
> 90 & \text{if } 1 < hour \leq 6 \\
> 75 & \text{if } 6 < hour \leq 24 \\
> \max(10, 75 \cdot e^{-0.1(hour-24)}) & \text{if } hour > 24
> \end{cases}
> $$
> 
> $$
> FS = min(100, min(80, \text{总操作数} \times 5) + min(20, \text{近1h操作数} \times 10))
> $$
> 
> $$
> OS = \begin{cases}
> 15 + op^w + 10 \times op^e + 3 \times op^r + \begin{cases} 25, & op^{last} = \text{写} \\ 15, & op^{last} = > \text{编辑} \\ 0, & \text{other} \end{cases}
> \end{cases}
> $$
> $$
> \text{其中：}op^w = \text{写频数，}op^e = \text{编辑频数，}op^r = \text{读操作数，}op^{last} = \text{最新操作}
> $$
> 
> 
> $$
> FTS = \begin{cases}
> 75 \sim 100 & \text{各类代码文件} \\
> 50 \sim 70 & \text{各类配置文件} \\
> 20 \sim 45 & \text{各类文档} \\
> 30 & \text{未知}
> \end{cases}
> $$
> 
> 
> $$
> RS = \text{RelevanceScore}=min(100, 50+\sum^{3}_{i=1}{Path_i*S_i}+\text{关键文件名}\cdot 25)
> $$
> $$
> \text{其中：}\begin{cases}
> Path_1\text{标识是否源码目录，}S_1=30 \\
> Path_2\text{标识是否组件目录，}S_2=20 \\
> Path_3\text{标识是否测试目录，}S_3=10
> \end{cases}
> $$

- 恢复文件选取
> $$
> \max \sum^{\text{所选文件}}_{f=\text{文件评分}}{f} \text{ ,s.t.}\begin{cases}
> token^{\text{所选文件}}<token^{\text{可用}} \\
> \text{文件数}<20 \\
> \text{单文件}<8k
> \end{cases}
> $$
> 经典0-1背包优化问题求解

**待办事项恢复**
<br>
重要信息补充(丰富8段式结构中的待办事项)


# 长期记忆

> 基于 CLAUDE.md 的项目级持久化记忆系统



| 阶段 | 产品形态 | 方案 | 备注 |
|------|----------|------|------|
| **记忆提取** | • `/init` 生成项目基础信息<br>• `#+内容` 添加<br>• 用户主动要求记住偏好 | • 用户主动编辑<br>• 用户Query请求LLM提取 | 从对话和项目中识别值得长期保存的知识 |
| **记忆存储** | • 全局级别(/etc)<br>• 代码库级(项目目录)<br>• 用户级别(用户目录)<br>• 用户项目偏好(CLAUDE.local.md) | 多级CLAUDE.md文件 | 分层组织，支持项目级和子目录级配置 |
| **记忆检索** | `/memory` 命令查看当前记忆 | • 启动时，从当前目录向根目录搜索载入<br>• 子目录中的文件，读到相关目录再载入 | 智能加载相关上下文 |
| **记忆应用** | 对用户透明，用户可主动询问触发 | • 通过上下文的方式引入<br>• 读到的记忆内容做语义级覆盖 | 自动融入工作流程 |

# 记忆应用

**上下文拼装**

| 策略 | Token预算 | 备注 |
|------|-----------|------|
| **系统提示** | 5% | 内置Prompt+长期记忆<br>多级CLAUDE.md装载，并做语义级别覆盖 |
| **压缩摘要**（短期记忆） | 20% | [消息智能压缩算法](#消息智能压缩算法) |
| **文件内容** | 45% | 文件内容+安全装配Prompt<br>安全装配 防止恶意注入 |
| **最近消息** | 30% | 消息优先级排序<br>1. 用户消息>其他<br>2. 错误/修复信息>其他<br>3. 时间戳排序 |


