import React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "secondary" | "ghost"
  text?: string
  className?: string
}

export function LoadingSpinner({
  size = "md",
  variant = "default",
  text,
  className,
}: LoadingSpinnerProps) {
  // 尺寸映射
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  // 颜色变体
  const variantMap = {
    default: "text-muted-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    ghost: "text-slate-400",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-t-transparent",
          sizeMap[size],
          variantMap[variant]
        )}
        style={{ borderTopColor: "transparent" }}
      />
      {text && (
        <p className={cn("mt-2 text-sm text-center", variantMap[variant])}>
          {text}
        </p>
      )}
    </div>
  )
}

export function FullPageLoader({ text = "加载中..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="bg-background/90 p-6 rounded-lg shadow-lg border flex flex-col items-center">
        <LoadingSpinner size="lg" variant="primary" />
        <p className="mt-4 text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}

export function ContentLoader({ className }: { className?: string }) {
  return (
    <div className={cn("w-full py-10 flex justify-center", className)}>
      <LoadingSpinner text="内容加载中..." />
    </div>
  )
}

export function ButtonLoader({ className }: { className?: string }) {
  return (
    <LoadingSpinner 
      size="sm" 
      className={cn("mr-1", className)} 
    />
  )
}

// 骨架屏组件
export function SkeletonLoader() {
  return (
    <div className="space-y-4 w-full animate-pulse">
      <div className="h-8 bg-muted rounded-md w-3/4"></div>
      <div className="h-32 bg-muted rounded-md"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded-md"></div>
        <div className="h-4 bg-muted rounded-md w-5/6"></div>
        <div className="h-4 bg-muted rounded-md w-4/6"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 bg-muted rounded-md w-24"></div>
        <div className="h-8 bg-muted rounded-md w-24"></div>
      </div>
    </div>
  )
} 