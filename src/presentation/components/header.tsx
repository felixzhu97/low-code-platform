import type { ReactNode } from "react";
import { Button } from "@/presentation/components/ui/button";
import { Save, Play, Download, Settings } from "lucide-react";

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">低代码平台</h1>
      </div>
      <div className="flex items-center gap-2">
        {children || (
          <>
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
            <Button variant="outline" size="sm">
              <Play className="mr-2 h-4 w-4" />
              预览
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              导出
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              设置
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
