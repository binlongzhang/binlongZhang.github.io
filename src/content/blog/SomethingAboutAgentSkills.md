---
title: 'Something about Agent Skills'
pubDate: 2026-02-05
description: 'Agent Skills调研总结'
author: 'binlong Zhang'
tags: ["Anthropic", "LLM Engineering", "AI Coding", "Agent", "Agent Skills"]
---
> 近期调研了 Anthropic 推出的 Agent Skills 功能，将调研内容整理分享。

> **注意**：
>
> - 本文中默认通用大模型针对通用任务，agent 针对特定领域，而 skills 则针对任务。
>   （这与 Anthropic 官方定义的 Agent 为通用任务，skill 针对特定领域略有出入，但不影响核心论点。）
> - 由于 Anthropic 代表产品为 Claude Code，因此本文中可能会混用 Anthropic 和 Claude，意思相同。

# Agent Skill 概述

> AI 整理，参考下简单了解下其发展即可

| 时间            | 事件                                         | 说明 / 详细内容                                                                                                                                                          | 进展           |
| --------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| 2025/10/16      | Anthropic 正式发布 Agent Skills 功能         | Anthropic 在其官网与工程博客上首次公开发布 "Agent Skills"（也称 Claude Skills）功能。Skills 是包含指令、脚本与资源的文件夹结构，可让 Claude 动态加载并高效执行特定任务。 | 官方发布公告   |
| 2025/10/16-17   | 媒体报道与行业关注                           | 技能功能在多家媒体获得报道，包括行业媒体介绍其作为 Claude 执行业务任务的模块化能力，以及在 Claude.ai、Claude Code、API 等平台的初期可用性。                              | 媒体报道       |
| 2025/10/20      | 社区反馈与 SDK 支持讨论                      | 在开发者社区（如 Reddit）出现初步讨论，关注 Claude Agent SDK 与 Skills 的集成支持情况；确认官方文档描述支持多平台。                                                      | 社区反馈       |
| 2025/10/21      | 社区生态建设：MCP Server for Skills          | 开源者发布基于 Anthropic Skills 的 MCP Server，让 Skills 能跨平台运行、连接到如 Cursor 等工具，提升生态互操作性。                                                        | 社区开发       |
| 2025/12/18      | Agent Skills 发布为开放标准（Open Standard） | Anthropic 正式把 Agent Skills 拆分为开放标准，发布规范与 SDK，使得 Skills 能跨平台、跨供应商采用，而不仅限于 Claude 产品线。                                             | 官方升级       |
| 2025-12 中下旬  | 多方采用与社区拓展                           | VS Code、Cursor 等开发工具显示早期支持 Agent Skills 标准；GitHub 上有官方与社区示例 Skill 库发布，涵盖文档处理、开发工具等领域。                                         | 社区与产业响应 |
| 2025-12-18 之后 | 行业报道强调开放标准的重要性                 | 多个科技媒体与分析报道聚焦于 Skills 开放标准对于 AI agent 生态的推动意义，并探讨其跨平台潜力。                                                                           | 产业分析       |
| 2026-1-19       | Coze 2.0 正式支持 Skills                     | Coze 2.0 推出 Skills、长期任务对以往经验进行封装，还全球首次上线了技能商店。                                                                                             | 友商跟进       |
| 2026-1-30       | MemOS 跟进 Skill                             | MemOS 已支持 Skill，用于将长期对话中沉淀的任务经验，转化为可复用、可执行的 Agent 能力单元。                                                                              | 竞品发力       |

<br>

## Why Agent Skill?

> - Claude is powerful, but real work requires procedural knowledge and organizational context
> - Agents with access to a set of skills can extend their capabilities based on the task they're working on.

面向组织场景，针对过程知识，扩展 Agent 在特定任务上的能力。

## What is Agent Skill?

> - [https://agentskills.io/home](https://agentskills.io/home)
> - [https://github.com/agentskills/agentskills](https://github.com/agentskills/agentskills)
>
> December 18, 2025 cluade推出跨平台开放标准Agent Skills

### Dev 视角

一组封装的经验/知识，以文件目录的形式呈现。

```bash
my-skill-name/
├── SKILL.md (required，Yaml头 + md内容)     # Required: instructions + metadata
├── reference/ (optional documentation)       # Optional: documentation
├── examples.md (optional examples)
├── scripts/                                  # Optional: executable code
│   └── helper.py (optional utility)
└── assets/                                   # Optional: templates, resources
    └── template.txt (optional template)
```

| 文件名      | 说明                                             | 要求 |
| ----------- | ------------------------------------------------ | ---- |
| SKILL.md    | 核心文档，包括元信息(默认装载)和指令(触发时装载) | 必选 |
| references/ | 可读的额外文档(必要时)                           | 可选 |
| scripts/    | 运行所需的可执行代码                             | 可选 |
| assets/     | 包含所需的静态资源                               | 可选 |

核心文件 SKILL.md 示例

````yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
license: Apache-2.0
metadata:
  author: example-org
  version: "1.0"
compatibility: Requires git, docker, jq, and access to the internet
allowed-tools: Read, Grep, Glob  # (非必选，仅 Claude Code 支持，控制内置工具的调用)
---

# Your Skill Name

## Instructions

Provide clear, step-by-step guidance for Claude.

For advanced usage, see [reference.md](reference.md).

Run the helper script:

```bash
python scripts/helper.py input.txt
```

## Examples

Show concrete examples of using this Skill.

````

使用时，由 LLM 自动触发，并渐进式展开。

![Agent Skills Workflow](./SomethingAboutAgentSkills/agent-skills-workflow.png)

---

*推荐的集成方式*

- **Filesystem-based agents** operate within a computer environment (bash/unix) and represent the most capable option. Skills are activated when models issue shell commands like `cat /path/to/my-skill/SKILL.md`. Bundled resources are accessed through shell commands.
- **Tool-based agents** function without a dedicated computer environment. Instead, they implement tools allowing models to trigger skills and access bundled assets. The specific tool implementation is up to the developer.

**兼容 Skills 需求**

- **Discover skills** in configured directories
- **Load metadata** (name and description) at startup
- **Match user tasks** to relevant skills
- **Activate skills** by loading full instructions
- **Execute scripts and access resources** as needed

### 产品视角

> Agent Skills are **modular capabilities** that extend Claude's functionality.
>
> Each Skill packages instructions, metadata, and optional resources (scripts, templates) that Claude uses automatically when relevant.

***通过封装指令、元信息、资源等为 Agent 模块化提供能力/增强（可认为是轻量级、Agentic workflow）***

> 一些 Agent Skills 的 demo
>
> [https://github.com/anthropics/skills/tree/main/skills](https://github.com/anthropics/skills/tree/main/skills)

<u>其中 **skill-creator** 尤其值得注意，其一只脚已经迈入了 **Self-Evolving**</u>

> 关于 Self-Evolving AI Agent 感兴趣的可阅读：
>
> Fang J, Peng Y, Zhang X, et al. A comprehensive survey of self-evolving ai agents: A new paradigm bridging foundation models and lifelong agentic systems[J]. arXiv preprint arXiv:2508.07407, 2025.
>
> [https://youtu.be/kS1MJFZWMq4](https://youtu.be/kS1MJFZWMq4)
>
> Coze 对其也进行了跟进，且水准很高。后续子标题会详细介绍



#### Claude Family

##### Claude.ai
> [https://www.youtube.com/watch?v=IoqpBKrNaZI&feature=youtu.be](https://www.youtube.com/watch?v=IoqpBKrNaZI&feature=youtu.be)


Both pre-built Agent Skills and custom Skills:

- **Pre-built Agent Skills**: These Skills are already working **behind the scenes when you create documents**. Claude uses them without requiring any setup.
- **Custom Skills**: **Upload your own Skills as zip files** through Settings > Features. Available on Pro, Max, Team, and Enterprise plans with code execution enabled. Custom Skills are individual to each user; they are not shared organization-wide and cannot be centrally managed by admins.


##### Claude Code

- Only Custom Skills. 
- Filesystem-based and don't require API uploads.

| 类型            | 使用方式             |
| --------------- | -------------------- |
| Personal Skills | 私人设置             |
| Project Skills  | 与项目绑定           |
| Plugin Skills   | 绑定在插件，用于共享 |

> **Claude Code 2.1.3** 合并 slash command 和 skill 以降低用户理解成本：
>
> [https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#213](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#213)



##### Claude API
![Claude.ai Skills](./SomethingAboutAgentSkills/claude-ai.png)

- Both pre-built Agent Skills and custom Skills.
    - Specify the relevant `skill_id` in the `container` parameter along with the code execution tool.

```python
import anthropic

client = anthropic.Anthropic()

# Step 1: Use a Skill to create a file
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create an Excel file with a simple budget spreadsheet"
    }],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# Step 2: Extract file IDs from the response
def extract_file_ids(response):
    file_ids = []
    for item in response.content:
        if item.type == 'bash_code_execution_tool_result':
            content_item = item.content
            if content_item.type == 'bash_code_execution_result':
                for file in content_item.content:
                    if hasattr(file, 'file_id'):
                        file_ids.append(file.file_id)
    return file_ids

# Step 3: Download the file using Files API
for file_id in extract_file_ids(response):
    file_metadata = client.beta.files.retrieve_metadata(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )
    file_content = client.beta.files.download(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )
    # Step 4: Save to disk
    file_content.write_to_file(file_metadata.filename)
    print(f"Downloaded: {file_metadata.filename}")
```

- 请求限制
    - 每次请求最大skills数 = 8
    - 上传skill最大尺寸8MB
    - YAML格式限制(略)
- 执行容器限制
    - 禁止网路通信
    - 无运行时安装包
    - 每次请求刷新容器


##### Claude Agent SDK

Supports custom Skills through filesystem-based configuration.

- Include "Skill" in your `allowed_tools` configuration
- Configure `settingSources`/`setting_sources` to load Skills from the filesystem

| 类型            | 使用方式             |
| --------------- | -------------------- |
| Personal Skills | 私人设置             |
| Project Skills  | 与项目绑定           |
| Plugin Skills   | 绑定在插件，用于共享 |

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    options = ClaudeAgentOptions(
        cwd="/path/to/project",  # Project with .claude/skills/
        setting_sources=["user", "project"],  # Load Skills from filesystem
        allowed_tools=["Skill", "Read", "Write", "Bash"]  # Enable Skill tool
    )
  
    async for message in query(
        prompt="Help me process this PDF document",
        options=options
    ):
        print(message)

asyncio.run(main())
```


#### OpenClaw

> [https://openclaw.ai/](https://openclaw.ai/)
>
> 支持，并大量应用 Skills：
> 
> [https://github.com/openclaw/openclaw/tree/main/skills](https://github.com/openclaw/openclaw/tree/main/skills)


*生效/覆盖策略*

| 模式                 | 来源                                                    | 优先级(命名冲突覆盖) |
| -------------------- | ------------------------------------------------------- | -------------------- |
| Bundled skills       | shipped with the install                                | 低                   |
| Managed/local skills | `~/.openclaw/skills`                                | 中                    |
| Workspace skills     | `<workspace>/skills`                                  | 高                   |
| Extra skills         | `~/.openclaw/openclaw.json` `skills.load.extraDirs` | 低                   |

多 agent 场景
- 每个 agent 有其 workspace，其中的 skill 为 agent 独占
- 多 agent 可采用 `extraDirs` 和 `ManagedSkill` 实现共享

**格式/兼容性/特性**
- 跟随 AgentSkills 的 spec
- 其解析器支持 skill 装载时过滤

```yaml
---
name: nano-banana-pro
description: Generate or edit images via Gemini 3 Pro Image
metadata: {
    "openclaw": {
        "requires": {
             "bins": ["uv"],
             "env": ["GEMINI_API_KEY"],
             "config": ["browser.enabled"]
         },
        "primaryEnv": "GEMINI_API_KEY",
    },
}
---
```

**Skill-creator**

> [https://github.com/openclaw/openclaw/tree/main/skills/skill-creator](https://github.com/openclaw/openclaw/tree/main/skills/skill-creator)

*项目结构*
```bash
skill-creator/
├── scripts/
│   ├── init_skill.py
│   ├── package_skill.py
│   └── quick_validate.py
├── license.txt
└── SKILL.md
```

*SKILL.md 核心内容*
```yaml
---
name: skill-creator
description: Create or update AgentSkills. Use when designing, structuring, or packaging skills with scripts, references, and assets.
---

... 忽略一部分 ...

## Skill Creation Process

Skill creation involves these steps:

1. Understand the skill with concrete examples
2. Plan reusable skill contents (scripts, references, assets)
3. Initialize the skill (run init_skill.py)
4. Edit the skill (implement resources and write SKILL.md)
5. Package the skill (run package_skill.py)
6. Iterate based on real usage

... 忽略一部分 ...

### Step 6: Iterate

After testing the skill, users may request improvements. Often this happens right after using the skill, with fresh context of how the skill performed.

**Iteration workflow:**
1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Identify how SKILL.md or bundled resources should be updated
4. Implement changes and test again
```

**生态**

提供公共 skills 托管注册平台： [clawhub](https://www.clawhub.com/) & clawhub CLI



#### Coze

> [https://www.coze.cn/](https://www.coze.cn/)

调用
![Coze Skills](./SomethingAboutAgentSkills/coze.png)


管理
![Coze Skill mngr](./SomethingAboutAgentSkills/coze-skill-mngr.png)
![Coze Skill entrance](./SomethingAboutAgentSkills/coze-skill-entrance.png)



> [https://code.coze.cn/home?from=coze_skill/](https://code.coze.cn/home?from=coze_skill/)
> ![Coze Skill ffmpeg](./SomethingAboutAgentSkills/coze-ffmpeg-skills.png)

#### MemOS

> [https://www.memtensor.com.cn/](https://www.memtensor.com.cn/)

- 率先在记忆系统中引入 skill
- 将结构化记忆封装/转化为 Skill，为记忆在 LLM 中的拼接/使用提供了一个思路
> **当前 LLM 外挂记忆系统存在痛点**：概念太多，dev 理解成本很高，合理使用难度大
>
> 其通过将记忆直接封装为 skill（直接固化记忆的使用模式）从而降低使用成本
- 某种意义上实现了 Claude 规划的自动评估/进化的 skill

![memOS Skill memory](./SomethingAboutAgentSkills/mem-os-progress.png)

```python
# Add Messages
data = {
    "user_id": "memos_user_123",
    "conversation_id": "0127",
    "messages": [
      {"role": "user", "content": "下周我要去成都玩，帮我规划一个5天的出行计划，我喜欢不走回头路的特种兵出行，帮我标注路途中值得品尝的美食。"},
      {"role": "assistant", "content": "...此处省略..."},
      {"role": "user", "content": "我比较喜欢逛文化景点，商场什么的不太感兴趣。"},
      {"role": "assistant", "content": "...此处省略..."},
      {"role": "user", "content": "帮我在规划的时候，提前确认一下天气和温度，方便我准备行李。"},
      {"role": "assistant", "content": "...此处省略..."}
    ]
}
```

MemOS 接收到请求后，会依次完成以下处理，生成技能（Skill）文件：
- **智能切片**：识别历史对话中的任务边界，**切分出任务文本块**
- **聚类提取**：将**同类型的任务文本块聚类**，结合用户的历史记忆，**提取出结构化的技能文本**
- **技能转化**：将技能文本**转化为可运行、可被识别的 Skill 文件**

![MemOS Models](./SomethingAboutAgentSkills/mem-os-models.png)

> 以上为 memOS 当前支持的模型列表，不一定 skill 采用的模型就在列表中，但八九不离十。
>
> 通用的 case，官网 demo 和实际跑出的不一致，可能是
> - 为吞吐在效果上有所牺牲
> - demo 仅为了说明
> - 不同级别用户提供不同效果。

*Skill.md 生成准实时，该条耗时 <10s*

```markdown
---
name: 旅行行程规划
description: 为用户设计个性化的旅行计划，包含行程安排和美食推荐
---

## Procedure

1. 确定旅行目的地和时间 
2. 收集用户偏好和兴趣 
3. 设计不走回头路的行程路线 
4. 标注沿途值得品尝的美食 
5. 根据用户兴趣添加景点或活动

## Experience

1. 优先选择用户兴趣相关的活动
2. 确保行程的多样性和灵活性

## User Preferences

- 用户偏好不走回头路的行程
- 文化景点优先于购物场所

## Examples

### Example 1

# 旅行计划示例

## 行程安排
- **第一天**: 到达目的地，入住酒店，参观文化景点A
- **第二天**: 游览文化景点B，品尝当地美食X
...

## 美食推荐
- **地点一**: 美食X，地址...
- **地点二**: 美食Y，地址...
```

*Search Memory*

```python
# 请求
data = {
  "query": "清明节我打算去云南，帮我规划7天的行程。",
  "user_id": "memos_user_123",
  "conversation_id": "0301",
  "include_skill": True  # 开启召回skill
}

# 响应
{
    'skill_detail_list': [
        {
            'id': '0b3087f3-bc21-4f38-b45c-c8caec99e63b',
            # 对于不支持skill的客户端，给出value支持用户将其拼装为prompt
            'skill_value': {
                'name': '行程规划准备',
                'description': '在规划行程时，提前确认目的地的天气和温度，以便准备合适的行李',
                'procedure': '1. 确定目的地和行程日期 2. 查询目的地的天气预报和温度信息 3. 根据天气和温度调整行李清单 4. 准备和打包行李',
                'experience': ['提前了解目的地天气可以避免不必要的行李', '根据天气调整行李可以提高旅行的舒适度'],
                'preference': ['用户倾向于在行程规划中提前确认天气信息', '偏好根据天气信息进行行李准备'],
                'examples': ['### 行程规划准备示例\n\n- **目的地**: 北京\n- **行程日期**: 2023年10月1日 - 2023年10月7日\n- **天气预报**: 晴天，温度15-20°C\n- **行李清单**:\n  - 轻便外套\n  - 长裤\n  - 运动鞋\n  - 太阳镜\n'],
                'script': None,
                'others': None
            },
            # skill文件
            'skill_url': 'https://memos-algorithm.oss-cn-shanghai.aliyuncs.com/skill_memory/3f7786e4-04da-4555-919d-2d2d448498d0/行程规划准备.zip',
            'skill_type': 'SkillMemory',
            'create_time': 1769949169409,
            'conversation_id': '0127',
            'status': 'activated',
            'confidence': 0.99,
            'tags': ['行程规划', '天气查询', '行李准备'],
            'update_time': 1769949169555,
            'relativity': 0.5620191360083745
        }
    ]
}
```

<br>

### Trendency

**Follower：**

> Code、Agent、AI Infra、AI engineering framework（Spring AI）

![Skill follower](./SomethingAboutAgentSkills/skill-follower.png)
![Skill Spring AI](./SomethingAboutAgentSkills/spring-AI-skill.png)

**Skill 市场/平台：**
  - [https://skillsmp.com/](https://skillsmp.com/)
  ![Skill Market](./SomethingAboutAgentSkills/skill-market.png)
  - [https://www.agentskillsmarket.space/](https://www.agentskillsmarket.space/)
  - [https://www.clawhub.com/](https://www.clawhub.com/)



# Agent Skills 工作原理

**Progressive disclosure context + VM environment**

![Progressive Disclosure](./SomethingAboutAgentSkills/progressive-disclosure.png)

**Progressive disclosure context**

- Level 1: Metadata (always loaded in system prompt)
    ```yaml
    ---
    name: pdf-processing
    description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
    ---
    ```
- Level 2: Instructions (loaded when triggered)
    ```python
    # PDF Processing

    ## Quick start

    Use pdfplumber to extract text from PDFs:

    import pdfplumber

    with pdfplumber.open("document.pdf") as pdf:
        text = pdf.pages[0].extract_text()


    For advanced form filling, see [FORMS.md](FORMS.md).
    ```
- Level 3: Resources and code (loaded as needed)
    ``` bash
    pdf-skill/
    ├── SKILL.md (main instructions)
    ├── FORMS.md (form-filling guide)
    ├── REFERENCE.md (detailed API reference)
    └── scripts/
        └── fill_form.py (utility script)
    ```


| Level                 | When Loaded             | Token Cost            | Content                                                               |
| --------------------- | ----------------------- | --------------------- | --------------------------------------------------------------------- |
| Level 1: Metadata     | Always (at startup)     | ~100 tokens per Skill | name and description from YAML frontmatter                            |
| Level 2: Instructions | When Skill is triggered | Under 5k tokens       | SKILL.md body with instructions and guidance                          |
| Level 3+: Resources   | As needed               | Effectively unlimited | Bundled files executed via bash without loading contents into context |

![Context Loading](./SomethingAboutAgentSkills/context-loading.png)
![agent-skills-workflow](./SomethingAboutAgentSkills/agent-skills-workflow.png)


# 关于 Agent Skills 一些想法

## Q&A

1. MCP(尤其针对 Prompt 和 Tool) 与 Agent Skills 什么关系？
    - 二者诞生方式、环境相似
    - **官方说法**：MCP 负责执行，Agent Skills 负责指导调度
    - **功能上**二者并非绝对互斥，但从应用/逻辑层可以将二者隔离开
    - MCP 号称模型上下文协议，在其推出和发展过程中逐渐变成了模型上下文**交互**协议，而 Agent Skills 更像是模型上下文**指挥**协议
2. 如何看待**Agent Skills**与**LLM**记忆的关系？**
    - 可以认为是一种基于过程知识的记忆
    > Skills extend Claude's capabilities by packaging your expertise into composable resources for Claude
    - 目前更多基于先验/实验设计 Skill，手动写入系统
    - 后期有做成全自动化的想法，且大概率已经在初步尝试
    > Looking further ahead, we hope to enable agents to create, edit, and evaluate Skills on their own, letting them codify their own patterns of behavior into reusable capabilities.
    >
    > [https://youtu.be/kS1MJFZWMq4](https://youtu.be/kS1MJFZWMq4)
3. **为什么 Anthropic 要推 Agent Skill？**
   1. 代码场景中派生出来的抽象，和 MCP 相似，觉得不错就往外推了
   2. 缓解 MCP 设计时候忽略的工具/上下文爆炸问题
        > - 相较于 MCP 的宣传，Skill 着重强调了 **Token 消耗**
        > - 理论上 MCP 也能实现类似 Skill 的功能，其可以扩展 Prompt 规范和使用指导给 McpServer 补充新的功能
        > - 但其没有在 MCP 上补全，而是选择新开标准，可能因为：
        >    - 功能上二者并非互斥，但从应用/逻辑层可以将二者隔离开
        >    - **所有人都需要新概念**
        >    - 不愿承认 MCP 设计不完善
    4. 为**自进化 Agent** 铺路（感觉 Agent 一直是 Claude 的优势和发力点）
    5. 所有人都需要新概念，把盘子做大
4. 如何看待观点**"Skill 是 Claude 不愿承认其 MCP 设计缺陷的产物"**
    - 有一定的道理，但尚无法定论
    - 相较于 MCP 的宣传，Skill 确实着重强调了 Token 消耗
    - 功能层面 MCP 确实具备覆盖 Skill 功能的能力
    - 但也不排除其在为自进化 Agent 铺路（感觉 Agent 一直是 Claude 的优势和发力点）
5. 如何看待各公众号常见标题 **"不要搞 agent 了，现在流行 skills", "no Agent, Skill Now"**
    - **完全错误，标题党**，二者不是一个层面的东西（这种标题的公众号建议直接拉黑，以免以后看到浪费时间）
    - agent 的开发是完整的系统工程（重量级），相比之下 skill 更轻量级的增强（插件）
    - agent 通常是领域/方向级的，而 skill 更多是任务级
6. 如何看待观点 **"skill 可能会和 mcp 一样，开发者远大于使用者，造出一大堆没人用的轮子"**
    - 从个性化（针对个人/企业/组织）的角度，只要能复用就有价值
    - 从复用比例角度，skills 的成本更低，因此复用比例大概率比 mcp 更低


## Conclusion

- **user-tailor 的上下文工程**
- **Anthropic 风格强烈**
  - 贴合其 Code can do Everything 理念
  - 基于文件系统的存储形式，简单但也直接继承其的优越性，很符合程序员思维模式
    > 最初应该是Cluade的特色(记忆、插件等都在用该方案)？现已经被很多Agent沿用
  - 与 MCP 感觉类似，像是从 Coding 场景中派生出的抽象
- 相较于 Agent，Skills 更像是**轻量级的工具/workflow**
- 暂无法确定是中间产物还是最终形态（个人比较倾向于前者）



## Viewpoint

- 单纯跟支持 skill 并不难，难的是将相关组件完善，让其真正能用、好用（包括 exec sandbox、Skill Creator 等）
    > Skill Creater就不用说了，而执行沙盒即便Claude现阶段也还存在很多限制(估计主要是安全方面，顺带一提，目前mcp实际在安全层面也有很多待完善的点)
- 技术积累/产品爆发是没有捷径可走的，所有偷的"懒"都会成为将来的"债"
    > 比如，如若没有llm Coding的积累，skill Creater想做好不是一件容易的事
- AI/LLM 肉眼可见的带来了一大波行业制定行业标准/规则的机会
- 目前 LLM 相关赛道产物，突出一个"**绝对快，相对准**"。只要提出想法，就会有人帮你实现/创造应用场景
- LLM 的卷也促使头部厂形成了不同 style 分化（claude-编程，google-多模，deepseek-数学/工程），跟进/创新需要思路明确，全跟是不太现实的
