# Local LLM Setup for Page Generation

This guide configures a local large language model so you can generate web pages from natural language without using third-party APIs.

## Overview

The platform uses **Ollama** to run models locally. The editor's "AI Generate" flow sends your description to the local model, which returns a JSON page schema that is rendered on the canvas.

## 1. Install Ollama

- **macOS / Linux**: [https://ollama.com](https://ollama.com) — download and install.
- **Windows**: Same installer from the website.

After installation, the Ollama service usually runs in the background. If not, start it manually (see step 2).

## 2. Start Ollama (if not running)

From a terminal:

```bash
ollama serve
```

By default the API is at `http://localhost:11434`. Keep this running while using AI generation.

## 3. Pull a model

For **page/component generation** (JSON schema output), a code-capable model works best. Pull one of these:

```bash
ollama pull codellama
```

Other options (larger = better quality, more RAM/VRAM):

- `ollama pull codellama` — good balance of size and quality (recommended).
- `ollama pull qwen2.5-coder` — strong for structured/code output.
- `ollama pull llama3.2` — general purpose, can work for pages.
- `ollama pull mistral` — smaller, faster.

List installed models:

```bash
ollama list
```

## 4. Use it in the app

1. Open the low-code editor and click **AI Generate** (sparkle icon).
2. Choose **AI provider**: **Ollama (local)**.
3. Leave **API Key** empty (not used for Ollama).
4. Optional: set **Base URL** if Ollama is not on the same machine (e.g. `http://192.168.1.10:11434`). Default is `http://localhost:11434`.
5. Optional: set **Model** to the name you pulled (e.g. `codellama`). Default is `codellama`.
6. Enter a **description** (e.g. "Login page with email, password and submit button") and click **Generate**.

Generated components are added to the canvas. You can edit them as usual.

## 5. Troubleshooting

| Issue | What to do |
|-------|------------|
| "Connection refused" or "Failed to fetch" | Ensure `ollama serve` is running and Base URL is correct (default `http://localhost:11434`). |
| Slow or timeout | Use a smaller model (e.g. `mistral`) or increase timeout in the app if available. |
| Poor or invalid JSON | Try a code-oriented model (`codellama`, `qwen2.5-coder`) and a clear, short description. |
| Model not found | Run `ollama pull <model>` for the exact name you set in the Model field. |

## Summary

- Install Ollama → `ollama serve` → `ollama pull codellama`
- In the editor: provider **Ollama (local)**, no API Key, optional Base URL/Model, then describe the page and generate.
