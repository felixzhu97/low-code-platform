"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Label } from "./label";
import { Slider } from "./slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Play, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

import { useAllStores } from "@/presentation/hooks";

interface AnimationEditorProps {}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const Section = styled.div`
  display: grid;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const SliderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SliderValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const HelperText = styled.p`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

const PreviewCard = styled(Card)`
  margin-top: 0;
`;

const PreviewContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 8rem;
`;

const PreviewElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4rem;
  width: 8rem;
  border-radius: calc(var(--radius));
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
`;

const PreviewFooter = styled(CardFooter)`
  display: flex;
  justify-content: center;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const animationKeyframesStr = `
  @keyframes preview-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes preview-slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes preview-slide-down {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes preview-slide-left {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes preview-slide-right {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes preview-zoom-in {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes preview-zoom-out {
    from { transform: scale(1.2); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes preview-rotate {
    from { transform: rotate(-10deg); opacity: 0; }
    to { transform: rotate(0); opacity: 1; }
  }
  @keyframes preview-bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
  }
  @keyframes preview-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const KeyframeStyles = () => {
  useEffect(() => {
    const styleId = "animation-keyframes-style";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = animationKeyframesStr;
    return () => {
      styleEl?.remove();
    };
  }, []);
  return null;
};

export function AnimationEditor({}: AnimationEditorProps) {
  const { selectedComponentId: componentId, updateComponent } = useAllStores();
  const [animation, setAnimation] = useState({
    type: "fade",
    duration: 500,
    delay: 0,
    easing: "ease",
    repeat: 0,
    direction: "normal",
    trigger: "onView",
  });

  const handleChange = (key: string, value: any) => {
    setAnimation({ ...animation, [key]: value });
  };

  const handleApply = () => {
    if (componentId) {
      updateComponent(componentId, {
        properties: {
          animation,
        },
      });
    }
  };

  const previewAnimation = () => {
    const previewElement = document.getElementById("animation-preview");
    if (previewElement) {
      previewElement.style.animation = "none";
      previewElement.offsetHeight;

      const keyframes = getKeyframes(animation.type);
      previewElement.style.animation = `${keyframes} ${animation.duration}ms ${
        animation.easing
      } ${animation.delay}ms ${
        animation.repeat === 0 ? "1" : animation.repeat
      } ${animation.direction}`;
    }
  };

  const getKeyframes = (type: string) => {
    switch (type) {
      case "fade":
        return "preview-fade";
      case "slide-up":
        return "preview-slide-up";
      case "slide-down":
        return "preview-slide-down";
      case "slide-left":
        return "preview-slide-left";
      case "slide-right":
        return "preview-slide-right";
      case "zoom-in":
        return "preview-zoom-in";
      case "zoom-out":
        return "preview-zoom-out";
      case "rotate":
        return "preview-rotate";
      case "bounce":
        return "preview-bounce";
      case "pulse":
        return "preview-pulse";
      default:
        return "preview-fade";
    }
  };

  return (
    <Dialog>
      <KeyframeStyles />
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!componentId}>
          <Sparkles css={{ marginRight: "0.375rem", width: "1rem", height: "1rem" }} aria-hidden="true" />
          动画效果
        </Button>
      </DialogTrigger>
      <DialogContent css={{ maxWidth: "42rem" }}>
        <DialogHeader>
          <DialogTitle>动画效果</DialogTitle>
          <DialogDescription>为选中的组件添加动画效果</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="animation">
          <TabsList css={{ display: "grid", width: "100%", gridTemplateColumns: "repeat(2, 1fr)" }}>
            <TabsTrigger value="animation">动画类型</TabsTrigger>
            <TabsTrigger value="timing">时间与触发</TabsTrigger>
          </TabsList>

          <TabsContent value="animation" css={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem" }}>
            <Section>
              <FormGroup>
                <Label htmlFor="animation-type">动画类型</Label>
                <Select
                  value={animation.type}
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <SelectTrigger id="animation-type">
                    <SelectValue placeholder="选择动画类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade">淡入</SelectItem>
                    <SelectItem value="slide-up">向上滑入</SelectItem>
                    <SelectItem value="slide-down">向下滑入</SelectItem>
                    <SelectItem value="slide-left">向左滑入</SelectItem>
                    <SelectItem value="slide-right">向右滑入</SelectItem>
                    <SelectItem value="zoom-in">放大</SelectItem>
                    <SelectItem value="zoom-out">缩小</SelectItem>
                    <SelectItem value="rotate">旋转</SelectItem>
                    <SelectItem value="bounce">弹跳</SelectItem>
                    <SelectItem value="pulse">脉冲</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="animation-easing">缓动函数</Label>
                <Select
                  value={animation.easing}
                  onValueChange={(value) => handleChange("easing", value)}
                >
                  <SelectTrigger id="animation-easing">
                    <SelectValue placeholder="选择缓动函数" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">线性 (Linear)</SelectItem>
                    <SelectItem value="ease">平滑 (Ease)</SelectItem>
                    <SelectItem value="ease-in">渐入 (Ease In)</SelectItem>
                    <SelectItem value="ease-out">渐出 (Ease Out)</SelectItem>
                    <SelectItem value="ease-in-out">渐入渐出 (Ease In Out)</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="animation-direction">动画方向</Label>
                <Select
                  value={animation.direction}
                  onValueChange={(value) => handleChange("direction", value)}
                >
                  <SelectTrigger id="animation-direction">
                    <SelectValue placeholder="选择动画方向" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">正常</SelectItem>
                    <SelectItem value="reverse">反向</SelectItem>
                    <SelectItem value="alternate">交替</SelectItem>
                    <SelectItem value="alternate-reverse">反向交替</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>
            </Section>
          </TabsContent>

          <TabsContent value="timing" css={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem" }}>
            <Section>
              <FormGroup>
                <SliderHeader>
                  <Label htmlFor="animation-duration">
                    持续时间 ({animation.duration}ms)
                  </Label>
                </SliderHeader>
                <Slider
                  id="animation-duration"
                  min={100}
                  max={2000}
                  step={100}
                  value={[animation.duration]}
                  onValueChange={(value) => handleChange("duration", value[0])}
                />
              </FormGroup>

              <FormGroup>
                <SliderHeader>
                  <Label htmlFor="animation-delay">
                    延迟时间 ({animation.delay}ms)
                  </Label>
                </SliderHeader>
                <Slider
                  id="animation-delay"
                  min={0}
                  max={1000}
                  step={100}
                  value={[animation.delay]}
                  onValueChange={(value) => handleChange("delay", value[0])}
                />
              </FormGroup>

              <FormGroup>
                <SliderHeader>
                  <Label htmlFor="animation-repeat">
                    重复次数 ({animation.repeat === 0 ? "无限" : animation.repeat})
                  </Label>
                </SliderHeader>
                <Slider
                  id="animation-repeat"
                  min={0}
                  max={10}
                  step={1}
                  value={[animation.repeat]}
                  onValueChange={(value) => handleChange("repeat", value[0])}
                />
                <HelperText>0 表示无限重复</HelperText>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="animation-trigger">触发条件</Label>
                <Select
                  value={animation.trigger}
                  onValueChange={(value) => handleChange("trigger", value)}
                >
                  <SelectTrigger id="animation-trigger">
                    <SelectValue placeholder="选择触发条件" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onView">进入视图</SelectItem>
                    <SelectItem value="onClick">点击时</SelectItem>
                    <SelectItem value="onHover">悬停时</SelectItem>
                    <SelectItem value="onLoad">页面加载</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>
            </Section>
          </TabsContent>
        </Tabs>

        <Wrapper>
          <PreviewCard>
            <CardHeader>
              <CardTitle css={{ fontSize: "0.875rem" }}>预览</CardTitle>
            </CardHeader>
            <CardContent css={{ display: "flex", height: "8rem", alignItems: "center", justifyContent: "center" }}>
              <PreviewElement id="animation-preview">
                预览元素
              </PreviewElement>
            </CardContent>
            <PreviewFooter>
              <Button variant="outline" size="sm" onClick={previewAnimation}>
                <Play css={{ marginRight: "0.5rem", width: "1rem", height: "1rem" }} />
                播放动画
              </Button>
            </PreviewFooter>
          </PreviewCard>

          <Actions>
            <Button onClick={handleApply} disabled={!componentId}>
              应用动画
            </Button>
          </Actions>
        </Wrapper>
      </DialogContent>
    </Dialog>
  );
}
