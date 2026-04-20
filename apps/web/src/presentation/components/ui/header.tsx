import { memo, type ReactNode } from "react";
import styled from "@emotion/styled";
import { Button } from "./button";
import { Save, Play, Download, Settings } from "lucide-react";

interface HeaderProps {
  children?: ReactNode;
}

const HeaderRoot = styled.header`
  display: flex;
  height: 3rem;
  min-height: 3rem;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  padding: 0 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: box-shadow 200ms;
`;

const LogoSection = styled.div`
  display: flex;
  shrink: 0;
  align-items: center;
  padding-right: 0.25rem;
`;

const Title = styled.h1`
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: hsl(var(--foreground));
  line-height: 1.25;

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const NavSection = styled.nav`
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const IconMargin = styled.span`
  margin-right: 0.375rem;
`;

export const Header = memo(({ children }: HeaderProps) => {
  return (
    <HeaderRoot role="banner">
      <LogoSection>
        <Title id="app-title">低代码平台</Title>
      </LogoSection>
      <NavSection aria-label="主工具栏" role="navigation">
        {children || (
          <>
            <Button variant="outline" size="sm" aria-label="保存">
              <IconMargin aria-hidden="true"><Save size={16} /></IconMargin>
              保存
            </Button>
            <Button variant="outline" size="sm" aria-label="预览">
              <IconMargin aria-hidden="true"><Play size={16} /></IconMargin>
              预览
            </Button>
            <Button variant="outline" size="sm" aria-label="导出">
              <IconMargin aria-hidden="true"><Download size={16} /></IconMargin>
              导出
            </Button>
            <Button variant="outline" size="sm" aria-label="设置">
              <IconMargin aria-hidden="true"><Settings size={16} /></IconMargin>
              设置
            </Button>
          </>
        )}
      </NavSection>
    </HeaderRoot>
  );
});

Header.displayName = "Header";
