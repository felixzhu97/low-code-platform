import type { ReactNode } from "react";
import { Button } from "./button";
import { Save, Play, Download, Settings } from "lucide-react";

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header
      className="flex h-14 items-center justify-between border-b bg-background px-4 shadow-sm transition-shadow duration-200"
      role="banner"
    >
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold" id="app-title">
          低代码平台
        </h1>
      </div>
      <nav
        className="flex items-center gap-2"
        aria-label="主工具栏"
        role="navigation"
      >
        {children || (
          <>
            <Button variant="outline" size="sm" aria-label="保存">
              <Save className="mr-2 h-4 w-4" aria-hidden="true" />
              保存
            </Button>
            <Button variant="outline" size="sm" aria-label="预览">
              <Play className="mr-2 h-4 w-4" aria-hidden="true" />
              预览
            </Button>
            <Button variant="outline" size="sm" aria-label="导出">
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              导出
            </Button>
            <Button variant="outline" size="sm" aria-label="设置">
              <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
              设置
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
