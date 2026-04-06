import type { ReactNode } from "react";
import { Button } from "./button";
import { Save, Play, Download, Settings } from "lucide-react";

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header
      className="flex h-12 min-h-12 items-center gap-3 border-b bg-background px-3 shadow-sm transition-shadow duration-200"
      role="banner"
    >
      <div className="flex shrink-0 items-center pr-1">
        <h1
          className="text-sm font-semibold tracking-tight text-foreground sm:text-base"
          id="app-title"
        >
          低代码平台
        </h1>
      </div>
      <nav
        className="flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="主工具栏"
        role="navigation"
      >
        {children || (
          <>
            <Button variant="outline" size="sm" aria-label="保存">
              <Save className="mr-1.5" aria-hidden="true" />
              保存
            </Button>
            <Button variant="outline" size="sm" aria-label="预览">
              <Play className="mr-1.5" aria-hidden="true" />
              预览
            </Button>
            <Button variant="outline" size="sm" aria-label="导出">
              <Download className="mr-1.5" aria-hidden="true" />
              导出
            </Button>
            <Button variant="outline" size="sm" aria-label="设置">
              <Settings className="mr-1.5" aria-hidden="true" />
              设置
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
