"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Button,
  ScrollArea,
} from "@/presentation/components/ui";
import { Loader2, Send, Trash2, User } from "lucide-react";
import { useAIChat } from "@/presentation/hooks/use-ai-chat";
import type { AIProvider } from "@/presentation/adapters/ai-generator.adapter";

const AI_PROVIDER_LABELS: Record<AIProvider, string> = {
  openai: "OpenAI (GPT-4)",
  claude: "Claude (Anthropic)",
  deepseek: "DeepSeek",
  gemini: "Google Gemini",
  "azure-openai": "Azure OpenAI",
  groq: "Groq",
  mistral: "Mistral AI",
  ollama: "Ollama (Local)",
  siliconflow: "SiliconFlow",
};

const AI_PROVIDERS: AIProvider[] = [
  "openai",
  "claude",
  "deepseek",
  "gemini",
  "azure-openai",
  "groq",
  "mistral",
  "ollama",
  "siliconflow",
];

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid hsl(var(--border));
  gap: 0.5rem;
  flex-shrink: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ModelSelect = styled(Select)`
  flex: 1;
  max-width: 14rem;
`;

const ClearButton = styled(Button)`
  padding: 0.375rem;
`;

const OllamaModelSelect = styled(Select)`
  flex: 1;
  max-width: 12rem;
`;

const MessagesList = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 1rem;
`;

const StyledScrollArea = styled(ScrollArea)`
  height: 100%;
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageBubble = styled.div<{ role: "user" | "assistant" }>`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  max-width: 90%;
  ${(props) =>
    props.role === "user"
      ? css`
          align-self: flex-end;
          align-items: flex-end;
        `
      : css`
          align-self: flex-start;
          align-items: flex-start;
        `}
`;

const MessageContent = styled.div<{ role: "user" | "assistant" }>`
  padding: 0.625rem 0.875rem;
  border-radius: 0.875rem;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;

  ${(props) =>
    props.role === "user"
      ? css`
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border-bottom-right-radius: 0.25rem;
        `
      : css`
          background-color: hsl(var(--muted));
          color: hsl(var(--foreground));
          border-bottom-left-radius: 0.25rem;
        `}
`;

const MessageTime = styled.span`
  font-size: 0.625rem;
  color: hsl(var(--muted-foreground));
  padding: 0 0.375rem;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.375rem;
`;

const TypingDot = styled.span`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background-color: hsl(var(--muted-foreground));
  animation: bounce 1.4s ease-in-out infinite;

  &:nth-of-type(1) {
    animation-delay: 0s;
  }
  &:nth-of-type(2) {
    animation-delay: 0.2s;
  }
  &:nth-of-type(3) {
    animation-delay: 0.4s;
  }

  @keyframes bounce {
    0%,
    60%,
    100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-4px);
    }
  }
`;

const InputArea = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid hsl(var(--border));
  flex-shrink: 0;
`;

const InputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const StyledInput = styled(Input)`
  width: 100%;
  resize: none;
  min-height: 2.5rem;
  max-height: 8rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  line-height: 1.5;
  border-radius: 0.875rem;
`;

const SendButton = styled(Button)`
  flex-shrink: 0;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
`;

const SpinningIcon = styled(Loader2)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const WelcomeMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
  color: hsl(var(--muted-foreground));
`;

const WelcomeIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: hsl(var(--muted));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const WelcomeTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0 0 0.5rem 0;
`;

const WelcomeText = styled.p`
  font-size: 0.875rem;
  margin: 0;
  max-width: 20rem;
`;

interface AIChatProps {
  className?: string;
}

export function AIChat({ className }: AIChatProps) {
  const {
    messages,
    loading,
    provider,
    model,
    sendMessage,
    clearMessages,
    switchModel,
    ollamaModels,
    ollamaModelsLoading,
    ollamaModelsError,
    setModel,
  } = useAIChat();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || loading) return;

    const content = inputValue.trim();
    setInputValue("");

    try {
      await sendMessage(content);
    } catch (error) {
      console.error("Send message error:", error);
    }
  }, [inputValue, loading, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleProviderChange = useCallback(
    (value: string) => {
      switchModel(value as AIProvider);
    },
    [switchModel]
  );

  const handleModelChange = useCallback(
    (value: string) => {
      setModel(value);
    },
    [setModel]
  );

  const handleClear = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  return (
    <ChatContainer className={className}>
      <ChatHeader>
        <HeaderLeft>
          <ModelSelect value={provider} onValueChange={handleProviderChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AI_PROVIDERS.map((p) => (
                <SelectItem key={p} value={p}>
                  {AI_PROVIDER_LABELS[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </ModelSelect>
          {provider === "ollama" && (
            <OllamaModelSelect
              value={model || ""}
              onValueChange={handleModelChange}
              disabled={ollamaModelsLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    ollamaModelsLoading
                      ? "加载中..."
                      : ollamaModelsError
                        ? "加载失败"
                        : ollamaModels.length === 0
                          ? "无模型"
                          : "选择模型"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {ollamaModelsLoading && (
                  <SelectItem value="__loading__" disabled>
                    <Loader2 size={14} className="animate-spin" /> 加载中...
                  </SelectItem>
                )}
                {!ollamaModelsLoading &&
                  ollamaModelsError &&
                  ollamaModels.length === 0 && (
                    <SelectItem value="__error__" disabled>
                      {ollamaModelsError.message || "加载失败"}
                    </SelectItem>
                  )}
                {ollamaModels.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </OllamaModelSelect>
          )}
        </HeaderLeft>
        <HeaderRight>
          <ClearButton
            variant="ghost"
            size="sm"
            onClick={handleClear}
            title="清空对话"
            disabled={loading}
          >
            <Trash2 size={16} />
          </ClearButton>
        </HeaderRight>
      </ChatHeader>

      <MessagesList>
        <StyledScrollArea>
          <MessagesContainer>
            {messages.map((message) => (
              <MessageBubble key={message.id} role={message.role}>
                <MessageContent role={message.role}>
                  {message.content}
                  {message.isStreaming && (
                    <TypingIndicator>
                      <TypingDot />
                      <TypingDot />
                      <TypingDot />
                    </TypingIndicator>
                  )}
                </MessageContent>
                <MessageTime>{formatTime(message.timestamp)}</MessageTime>
              </MessageBubble>
            ))}
            {loading &&
              messages[messages.length - 1]?.role === "user" &&
              !messages[messages.length - 1]?.content && (
                <MessageBubble role="assistant">
                  <MessageContent role="assistant">
                    <TypingIndicator>
                      <TypingDot />
                      <TypingDot />
                      <TypingDot />
                    </TypingIndicator>
                  </MessageContent>
                </MessageBubble>
              )}
            <div ref={messagesEndRef} />
          </MessagesContainer>
        </StyledScrollArea>
      </MessagesList>

      <InputArea>
        <InputWrapper>
          <StyledInput
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息，Enter 发送..."
            disabled={loading}
          />
        </InputWrapper>
        <SendButton
          onClick={handleSend}
          disabled={loading || !inputValue.trim()}
          variant="default"
        >
          {loading ? (
            <SpinningIcon size={16} />
          ) : (
            <Send size={16} />
          )}
        </SendButton>
      </InputArea>
    </ChatContainer>
  );
}

export { AI_PROVIDER_LABELS, AI_PROVIDERS };
export type { AIChatProps };
