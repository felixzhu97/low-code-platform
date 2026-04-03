# 本地 LLM 配置（页面生成）

本说明介绍如何配置本地大模型，以便在不使用第三方 API 的情况下通过自然语言生成页面。

**English:** [Local LLM setup](../en/local-llm-setup.md)

## 概述

平台通过 **Ollama** 在本地运行模型。编辑器中的「AI 生成」会将你的描述发给本地模型，模型返回 JSON 页面 Schema，并在画布上渲染。

## 1. 安装 Ollama

- **macOS / Linux**：[https://ollama.com](https://ollama.com) 下载并安装。
- **Windows**：同一官网下载安装程序。

安装后 Ollama 通常会在后台运行；若未运行，请手动启动（见步骤 2）。

## 2. 启动 Ollama（若未运行）

在终端执行：

```bash
ollama serve
```

默认 API 地址为 `http://localhost:11434`。使用 AI 生成期间请保持该进程运行。

## 3. 拉取模型

针对**页面 / 组件生成**（输出 JSON Schema），建议使用偏代码 / 结构的模型：

```bash
ollama pull codellama
```

其他可选（越大通常质量越好，占用内存 / 显存越多）：

- `ollama pull codellama` — 体积与质量较均衡（推荐）。
- `ollama pull qwen2.5-coder` — 结构化 / 代码输出较强。
- `ollama pull llama3.2` — 通用模型，也可尝试做页面。
- `ollama pull mistral` — 较小、较快。

查看已安装模型：

```bash
ollama list
```

## 4. 在应用中使用

1. 打开低代码编辑器，点击 **AI 生成**（闪光图标）。
2. **AI 提供方** 选择 **Ollama (local)**。
3. **API Key** 留空（Ollama 不使用）。
4. 若 Ollama 不在本机，可配置 **Base URL**（例如 `http://192.168.1.10:11434`）。默认为 `http://localhost:11434`。
5. 可在 **Model** 中填写已拉取的模型名（例如 `codellama`）。默认一般为 `codellama`。
6. 输入**页面描述**（例如：「带邮箱、密码和提交按钮的登录页」），点击**生成**。

生成结果会加入画布，之后可照常编辑。

## 5. 故障排查

| 现象 | 处理 |
|------|------|
| 「Connection refused」或 「Failed to fetch」 | 确认已执行 `ollama serve`，且 Base URL 正确（默认 `http://localhost:11434`）。 |
| 很慢或超时 | 换更小模型（如 `mistral`），或在应用中调高超时（若支持）。 |
| JSON 质量差或无效 | 换偏代码的模型（`codellama`、`qwen2.5-coder`），描述尽量简短清晰。 |
| 提示找不到模型 | 对界面里填写的模型名执行 `ollama pull <model>`。 |

## 小结

- 安装 Ollama → `ollama serve` → `ollama pull codellama`
- 编辑器中选 **Ollama (local)**，不填 API Key，按需改 Base URL / Model，输入描述后生成。
