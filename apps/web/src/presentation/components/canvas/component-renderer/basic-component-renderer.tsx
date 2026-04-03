import type React from "react";
import type { Component } from "@/domain/component";
import type { ThemeConfig } from "@/domain/theme";
import { css } from "@emotion/react";
import { cn } from "@/application/services/utils";
import styled from "@emotion/styled";
import {
  Button,
  Separator,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Progress,
  Badge,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Card,
  CardContent,
} from "@/presentation/components/ui";
import { CheckCircle, Star, Clock, User } from "lucide-react";
import { ComponentRenderer } from "./index";
import { fallbackBox, mutedSmall } from "./renderer-emotion";

const textPad = css`
  padding: 0.5rem;
`;

const StyledButton = styled(Button)<{ $fullWidth?: boolean }>`
  ${(p) => p.$fullWidth && "width: 100%;"}
`;

const ImageRoot = styled.div<{ $floating?: boolean }>`
  ${(p) => p.$floating && ""}
`;

const ImageFrame = styled.div`
  position: relative;
  overflow: hidden;
`;

const PreviewImg = styled.img<{
  $rounded?: boolean;
  $shadow?: boolean;
  $border?: boolean;
  $gradientOverlay?: boolean;
}>`
  object-fit: cover;
  ${(p) => p.$rounded && "border-radius: 0.5rem;"}
  ${(p) => p.$shadow && "box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.12);"}
  ${(p) => p.$border && "border: 2px solid #e5e7eb;"}
  ${(p) =>
    p.$gradientOverlay &&
    `
    .group:hover & {
      filter: brightness(1.1);
    }
  `}
`;

const ImgGradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgb(0 0 0 / 0.2), transparent);
  opacity: 0;
  transition: opacity 300ms;
  .group:hover & {
    opacity: 1;
  }
`;

const ImgOverlayCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 300ms;
  .group:hover & {
    opacity: 1;
  }
`;

const OverlayLabel = styled.span`
  color: white;
  font-weight: 600;
  background: rgb(0 0 0 / 0.5);
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
`;

const Caption = styled.div`
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
  transition: color 200ms;
  .group:hover & {
    color: hsl(var(--foreground));
  }
`;

const CarouselWrap = styled.div`
  width: 100%;
  max-width: 20rem;
  margin-left: auto;
  margin-right: auto;
`;

const CarouselPad = styled.div`
  padding: 0.25rem;
`;

const SquareCardContent = styled(CardContent)`
  display: flex;
  aspect-ratio: 1 / 1;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

const SlideNum = styled.span`
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 600;
  color: white;
`;

const StepsRoot = styled.div`
  width: 100%;
`;

const StepsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StepCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const stepCircle = (isCompleted: boolean, isCurrent: boolean, isPending: boolean) => css`
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border-width: 2px;
  border-style: solid;
  ${isCompleted &&
  `
    background-color: hsl(var(--primary));
    border-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  `}
  ${isCurrent &&
  !isCompleted &&
  `
    border-color: hsl(var(--primary));
    color: hsl(var(--primary));
  `}
  ${isPending &&
  `
    border-color: hsl(var(--muted-foreground));
    color: hsl(var(--muted-foreground));
  `}
`;

const StepTitle = styled.div<{ $current?: boolean; $pending?: boolean }>`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  ${(p) => p.$current && "color: hsl(var(--primary));"}
  ${(p) => p.$pending && "color: hsl(var(--muted-foreground));"}
`;

const StepDesc = styled.div`
  font-size: 0.75rem;
  line-height: 1rem;
  color: hsl(var(--muted-foreground));
`;

const StepConnector = styled.div<{ $done: boolean }>`
  position: absolute;
  top: 1.25rem;
  left: 50%;
  height: 2px;
  transform: translateY(-50%);
  width: calc(100% - 2.5rem);
  left: calc(50% + 1.25rem);
  background-color: ${(p) =>
    p.$done ? "hsl(var(--primary))" : "hsl(var(--muted))"};
`;

const ProgressWrap = styled.div`
  width: 100%;
`;

const ProgressStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProgressLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const FullProgress = styled(Progress)`
  width: 100%;
`;

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledAvatar = styled(Avatar)<{ $size?: string }>`
  height: 3rem;
  width: 3rem;
  ${(p) => p.$size === "sm" && "height: 2rem; width: 2rem;"}
  ${(p) => p.$size === "lg" && "height: 4rem; width: 4rem;"}
`;

const AvatarMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const AvatarName = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseMini = styled.button`
  margin-left: 0.25rem;
  height: 1rem;
  width: 1rem;
  border-radius: 9999px;
  border: none;
  background: transparent;
  cursor: pointer;
  &:hover {
    background-color: hsl(var(--muted));
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TimelineStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TimelineRow = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const TimelineDot = styled.div`
  display: flex;
  height: 1.5rem;
  width: 1.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
`;

const TimelineBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 1.5rem;
  height: 100%;
  width: 2px;
  background-color: hsl(var(--border));
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StarBtn = styled.button<{ $size: string }>`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  transition: color 150ms;
  ${(p) => p.$size === "sm" && "height: 1rem; width: 1rem;"}
  ${(p) => p.$size === "default" && "height: 1.25rem; width: 1.25rem;"}
  ${(p) => p.$size === "lg" && "height: 1.5rem; width: 1.5rem;"}
`;

const RatingValue = styled.span`
  margin-left: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
`;

interface BasicComponentRendererProps {
  component: Component;
  props: Record<string, any>;
  theme?: ThemeConfig;
  animationStyle: React.CSSProperties;
  themeStyle: React.CSSProperties;
  childComponents?: Component[];
  components?: Component[];
  isPreviewMode?: boolean;
  selectedId?: string | null;
  dropTargetId?: string | null;
  onSelectComponent?: (component: Component) => void;
  onMouseDown?: (e: React.MouseEvent, component: Component) => void;
}

export function BasicComponentRenderer({
  component,
  props,
  theme,
  animationStyle,
  themeStyle,
  childComponents = [],
  components = [],
  isPreviewMode = false,
  selectedId = null,
  dropTargetId = null,
  onSelectComponent = () => {},
  onMouseDown = () => {},
}: BasicComponentRendererProps) {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "plus":
        return <span>+</span>;
      case "minus":
        return <span>-</span>;
      case "check":
        return <span>✓</span>;
      case "x":
        return <span>×</span>;
      default:
        return <span>⚪</span>;
    }
  };

  switch (component.type) {
    case "text":
      return (
        <div
          css={textPad}
          style={{
            fontSize: `${props.fontSize}px`,
            fontWeight: props.fontWeight,
            color: props.color,
            textAlign: props.alignment as React.CSSProperties["textAlign"],
            lineHeight: props.lineHeight,
            letterSpacing: props.letterSpacing,
            textTransform: props.textTransform as React.CSSProperties["textTransform"],
            textDecoration: props.textDecoration as React.CSSProperties["textDecoration"],
            ...themeStyle,
            ...animationStyle,
          }}
        >
          {props.content || "示例文本"}
        </div>
      );

    case "button":
      return (
        <StyledButton
          variant={(props.variant as React.ComponentProps<typeof Button>["variant"]) || "default"}
          size={(props.size as React.ComponentProps<typeof Button>["size"]) || "default"}
          disabled={props.disabled}
          $fullWidth={!!props.fullWidth}
          className={cn(
            props.gradient && "gradient-primary text-white border-0",
            props.shadow && "shadow-medium",
            props.floating && "floating"
          )}
          style={{
            ...themeStyle,
            ...animationStyle,
            background: props.gradient ? undefined : props.backgroundColor,
            color: props.textColor,
            borderRadius: props.borderRadius || "0.375rem",
            border: props.border
              ? `2px solid ${props.borderColor || "transparent"}`
              : "none",
            boxShadow: props.shadow
              ? "0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.12)"
              : undefined,
          }}
        >
          {props.icon && props.iconPosition === "left" && (
            <span css={css({ marginRight: "0.5rem" })}>{renderIcon(props.icon)}</span>
          )}
          {props.text || "按钮"}
          {props.icon && props.iconPosition === "right" && (
            <span css={css({ marginLeft: "0.5rem" })}>{renderIcon(props.icon)}</span>
          )}
        </StyledButton>
      );

    case "image":
      return (
        <ImageRoot
          $floating={!!props.floating}
          className={cn(props.floating && "floating")}
          style={{ ...animationStyle }}
        >
          <ImageFrame className="group">
            <PreviewImg
              src={props.src || "/placeholder.svg?height=200&width=300"}
              alt={props.alt || "示例图片"}
              width={props.width || 300}
              height={props.height || 200}
              $rounded={!!props.rounded}
              $shadow={!!props.shadow}
              $border={!!props.border}
              $gradientOverlay={!!props.gradientOverlay}
              style={{
                objectFit: (props.objectFit as React.CSSProperties["objectFit"]) || "cover",
                filter: props.gradientOverlay
                  ? "contrast(1.1) saturate(1.1)"
                  : undefined,
              }}
            />
            {props.gradientOverlay && <ImgGradientOverlay />}
            {props.overlayText && (
              <ImgOverlayCenter>
                <OverlayLabel>{props.overlayText}</OverlayLabel>
              </ImgOverlayCenter>
            )}
          </ImageFrame>
          {props.caption && <Caption>{props.caption}</Caption>}
        </ImageRoot>
      );

    case "divider":
      return (
        <Separator
          className={cn(props.orientation === "vertical" ? "h-full" : "w-full")}
          style={{
            margin: props.margin || "1rem 0",
            borderStyle: props.style || "solid",
            borderColor: props.color || "#e2e8f0",
            borderWidth:
              props.orientation === "horizontal"
                ? `${props.thickness || 1}px 0 0 0`
                : `0 0 0 ${props.thickness || 1}px`,
            ...animationStyle,
          }}
        />
      );

    case "carousel":
      return (
        <CarouselWrap style={{ ...animationStyle }}>
          <Carousel
            opts={{
              align: "start",
              loop: props.loop || false,
            }}
            className="w-full"
          >
            <CarouselContent>
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <CarouselItem key={child.id}>
                    <CarouselPad>
                      <Card>
                        <SquareCardContent>
                          <ComponentRenderer
                            component={child}
                            parentComponent={component}
                            components={components}
                            theme={theme}
                            isPreviewMode={isPreviewMode}
                            selectedId={selectedId}
                            dropTargetId={dropTargetId}
                            onSelectComponent={onSelectComponent}
                            onMouseDown={onMouseDown}
                            componentData={null}
                          />
                        </SquareCardContent>
                      </Card>
                    </CarouselPad>
                  </CarouselItem>
                ))
              ) : (
                <>
                  <CarouselItem>
                    <CarouselPad>
                      <Card className="gradient-primary">
                        <SquareCardContent>
                          <SlideNum>1</SlideNum>
                        </SquareCardContent>
                      </Card>
                    </CarouselPad>
                  </CarouselItem>
                  <CarouselItem>
                    <CarouselPad>
                      <Card className="gradient-secondary">
                        <SquareCardContent>
                          <SlideNum>2</SlideNum>
                        </SquareCardContent>
                      </Card>
                    </CarouselPad>
                  </CarouselItem>
                  <CarouselItem>
                    <CarouselPad>
                      <Card className="gradient-success">
                        <SquareCardContent>
                          <SlideNum>3</SlideNum>
                        </SquareCardContent>
                      </Card>
                    </CarouselPad>
                  </CarouselItem>
                </>
              )}
            </CarouselContent>
            {props.showArrows !== false && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </CarouselWrap>
      );

    case "steps": {
      const steps = props.steps || [
        { title: "步骤1", description: "第一步描述" },
        { title: "步骤2", description: "第二步描述" },
        { title: "步骤3", description: "第三步描述" },
      ];
      const currentStep = props.currentStep || 1;

      return (
        <StepsRoot style={{ ...animationStyle }}>
          <StepsRow>
            {steps.map((step: { title: string; description?: string }, index: number) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;
              const isPending = stepNumber > currentStep;

              return (
                <StepCol key={index}>
                  <div css={stepCircle(isCompleted, isCurrent, isPending)}>
                    {isCompleted ? (
                      <CheckCircle size={20} />
                    ) : (
                      <span css={css({ fontSize: "0.875rem", fontWeight: 500 })}>
                        {stepNumber}
                      </span>
                    )}
                  </div>
                  <div css={css({ marginTop: "0.5rem", textAlign: "center" })}>
                    <StepTitle $current={isCurrent} $pending={isPending && !isCurrent}>
                      {step.title}
                    </StepTitle>
                    {step.description && <StepDesc>{step.description}</StepDesc>}
                  </div>
                  {index < steps.length - 1 && (
                    <StepConnector $done={stepNumber < currentStep} />
                  )}
                </StepCol>
              );
            })}
          </StepsRow>
        </StepsRoot>
      );
    }

    case "progress":
      return (
        <ProgressStack css={css({ width: "100%" })} style={{ ...animationStyle }}>
          {props.label && (
            <ProgressLabels>
              <span>{props.label}</span>
              <span>{props.value || 0}%</span>
            </ProgressLabels>
          )}
          <FullProgress value={props.value || 0} />
          {props.description && (
            <p css={mutedSmall}>{props.description}</p>
          )}
        </ProgressStack>
      );

    case "avatar":
      return (
        <AvatarRow style={{ ...animationStyle }}>
          <StyledAvatar $size={props.size}>
            <AvatarImage src={props.src || ""} alt={props.alt || "头像"} />
            <AvatarFallback>
              {props.fallback || <User size={16} />}
            </AvatarFallback>
          </StyledAvatar>
          {props.showInfo && (
            <AvatarMeta>
              <AvatarName>{props.name || "用户名"}</AvatarName>
              <p css={mutedSmall}>{props.description || "用户描述"}</p>
            </AvatarMeta>
          )}
        </AvatarRow>
      );

    case "badge":
      return (
        <BadgeRow style={{ ...animationStyle }}>
          <Badge
            variant={props.variant || "default"}
            className={cn(
              props.className,
              props.pulse && "animate-pulse",
              props.gradient && "gradient-primary text-white border-0"
            )}
            style={{
              background: props.gradient ? undefined : props.backgroundColor,
              color: props.textColor,
              borderRadius: props.borderRadius || "0.375rem",
              boxShadow: props.shadow
                ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                : undefined,
            }}
          >
            {props.text || "徽章"}
          </Badge>
          {props.showClose && (
            <CloseMini type="button" onClick={() => {}}>
              ×
            </CloseMini>
          )}
        </BadgeRow>
      );

    case "tag":
      return (
        <TagList style={{ ...animationStyle }}>
          {(props.tags || ["标签1", "标签2", "标签3"]).map(
            (tag: string, index: number) => (
              <div
                key={index}
                className={cn(
                  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
                  props.variant === "secondary" &&
                    "border-transparent bg-secondary text-secondary-foreground",
                  props.variant === "destructive" &&
                    "border-transparent bg-destructive text-destructive-foreground",
                  props.variant === "outline" && "text-foreground",
                  !props.variant &&
                    "border-transparent bg-primary text-primary-foreground",
                  props.gradient && "gradient-primary text-white border-0"
                )}
                style={{
                  background: props.gradient
                    ? undefined
                    : props.backgroundColor,
                  color: props.textColor,
                  borderRadius: props.borderRadius || "0.375rem",
                  boxShadow: props.shadow
                    ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                    : undefined,
                }}
              >
                {tag}
                {props.closable && (
                  <CloseMini type="button" onClick={() => {}}>
                    ×
                  </CloseMini>
                )}
              </div>
            )
          )}
        </TagList>
      );

    case "timeline": {
      const timelineItems = props.items || [
        { title: "事件1", description: "事件描述1", time: "2023-01-01" },
        { title: "事件2", description: "事件描述2", time: "2023-01-02" },
        { title: "事件3", description: "事件描述3", time: "2023-01-03" },
      ];

      return (
        <div css={css({ width: "100%" })} style={{ ...animationStyle }}>
          <TimelineStack>
            {timelineItems.map(
              (item: { title: string; description?: string; time?: string }, index: number) => (
                <TimelineRow key={index}>
                  <TimelineDot>
                    <Clock size={12} />
                  </TimelineDot>
                  <TimelineBody>
                    <div
                      css={css`
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                      `}
                    >
                      <h4 css={css({ fontSize: "0.875rem", fontWeight: 500 })}>
                        {item.title}
                      </h4>
                      <span css={mutedSmall}>{item.time}</span>
                    </div>
                    <p css={css`
                      font-size: 0.875rem;
                      line-height: 1.25rem;
                      color: hsl(var(--muted-foreground));
                    `}>
                      {item.description}
                    </p>
                  </TimelineBody>
                  {index < timelineItems.length - 1 && <TimelineLine />}
                </TimelineRow>
              )
            )}
          </TimelineStack>
        </div>
      );
    }

    case "rating": {
      const maxRating = props.maxRating || 5;
      const rating = props.rating || 0;
      const size = props.size || "default";

      return (
        <RatingRow style={{ ...animationStyle }}>
          {Array.from({ length: maxRating }, (_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= rating;
            const isHalfFilled =
              starValue === Math.ceil(rating) && rating % 1 !== 0;

            return (
              <StarBtn
                key={index}
                type="button"
                $size={size}
                onClick={() => {}}
                disabled={props.readonly}
              >
                <Star
                  css={css`
                    width: 100%;
                    height: 100%;
                    ${isFilled && "fill: #facc15; color: #facc15;"}
                    ${isHalfFilled && "fill: rgb(250 204 21 / 0.5); color: #facc15;"}
                    ${!isFilled && !isHalfFilled && "color: hsl(var(--muted-foreground));"}
                  `}
                />
              </StarBtn>
            );
          })}
          {props.showValue && (
            <RatingValue>
              {rating}/{maxRating}
            </RatingValue>
          )}
        </RatingRow>
      );
    }

    default:
      return (
        <div css={fallbackBox}>
          {component.name || component.type}
        </div>
      );
  }
}
