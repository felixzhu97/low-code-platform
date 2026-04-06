"use client";

import { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  Button,
} from "@/presentation/components/ui";
import { Code, Copy, Check, Download, Braces } from "lucide-react";
import { useAllStores } from "@/presentation/hooks";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { Label } from "./label";

interface CodeExportProps {}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CodePreview = styled.div`
  background-color: hsl(var(--muted));
  border-radius: calc(var(--radius));
  padding: 1rem;
  max-height: 24rem;
  overflow: auto;
`;

const CodeText = styled.pre`
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-break: break-all;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export function CodeExport({}: CodeExportProps) {
  const [code, setCode] = useState("");
  const [exportFormat, setExportFormat] = useState<"json" | "jsx" | "html">("json");
  const [copied, setCopied] = useState(false);

  const store = useAllStores();

  const handleFormatChange = (format: "json" | "jsx" | "html") => {
    setExportFormat(format);
  };

  const handleExport = () => {
    const generatedCode = generateCode(exportFormat);
    setCode(generatedCode);
  };

  const generateCode = (format: "json" | "jsx" | "html"): string => {
    const { components } = store;

    switch (format) {
      case "json":
        return JSON.stringify({ components }, null, 2);
      case "jsx":
        return generateJSX(components);
      case "html":
        return generateHTML(components);
      default:
        return JSON.stringify({ components }, null, 2);
    }
  };

  const generateJSX = (components: any[]) => {
    return components
      .map((component) => {
        switch (component.type) {
          case "button":
            return `<button>${component.properties?.text || "Button"}</button>`;
          case "input":
            return `<input type="text" placeholder="${component.properties?.placeholder || ""}" />`;
          case "text":
            return `<p>${component.properties?.content || ""}</p>`;
          default:
            return `<div>${component.name || component.type}</div>`;
        }
      })
      .join("\n");
  };

  const generateHTML = (components: any[]) => {
    const bodyContent = components
      .map((component) => {
        switch (component.type) {
          case "button":
            return `  <button>${component.properties?.text || "Button"}</button>`;
          case "input":
            return `  <input type="text" placeholder="${component.properties?.placeholder || ""}" />`;
          case "text":
            return `  <p>${component.properties?.content || ""}</p>`;
          default:
            return `  <div>${component.name || component.type}</div>`;
        }
      })
      .join("\n");

    return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>低代码平台导出</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 2rem;
    }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export.${exportFormat === "jsx" ? "jsx" : exportFormat === "html" ? "html" : "json"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Code css={{ marginRight: "0.375rem", width: "1rem", height: "1rem" }} aria-hidden="true" />
          导出代码
        </Button>
      </DialogTrigger>
      <DialogContent css={{ maxWidth: "36rem" }}>
        <DialogHeader>
          <DialogTitle>导出代码</DialogTitle>
          <DialogDescription>将画布组件导出为可用的代码</DialogDescription>
        </DialogHeader>

        <Wrapper>
          <Section>
            <Label htmlFor="export-format">导出格式</Label>
            <Tabs defaultValue={exportFormat} onValueChange={(v) => handleFormatChange(v as any)}>
              <TabsList css={{ display: "grid", width: "100%", gridTemplateColumns: "repeat(3, 1fr)" }}>
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="jsx">JSX</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>
            </Tabs>
          </Section>

          <Section>
            <Button onClick={handleExport}>
              <Braces css={{ marginRight: "0.5rem", width: "1rem", height: "1rem" }} />
              生成代码
            </Button>
          </Section>

          {code && (
            <>
              <Section>
                <Label>预览</Label>
                <CodePreview>
                  <CodeText>{code}</CodeText>
                </CodePreview>
              </Section>

              <FormRow>
                <Button variant="outline" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check css={{ marginRight: "0.5rem", width: "1rem", height: "1rem" }} />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy css={{ marginRight: "0.5rem", width: "1rem", height: "1rem" }} />
                      复制代码
                    </>
                  )}
                </Button>
                <Button onClick={handleDownload}>
                  <Download css={{ marginRight: "0.5rem", width: "1rem", height: "1rem" }} />
                  下载
                </Button>
              </FormRow>
            </>
          )}
        </Wrapper>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
