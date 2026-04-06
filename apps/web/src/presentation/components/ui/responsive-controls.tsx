"use client";

import styled from "@emotion/styled";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { Laptop, Smartphone, Tablet } from "lucide-react";
import { useCanvasStore } from "@/infrastructure/state-management/stores";

interface ResponsiveControlsProps {}

const Wrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.25rem;
`;

const TabsStyled = styled(Tabs)`
  margin-right: 0.25rem;
`;

const TabsListStyled = styled(TabsList)`
  display: grid;
  height: 2rem;
  width: auto;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  padding: 0.125rem;
`;

const TabsTriggerStyled = styled(TabsTrigger)`
  height: 1.75rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0;
  padding-bottom: 0;
  font-size: 0.75rem;
`;

const DeviceIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 0.875rem;
  width: 0.875rem;
`;

export function ResponsiveControls({}: ResponsiveControlsProps) {
  const { activeDevice, setActiveDevice, setViewportWidth } = useCanvasStore();

  const handleDeviceChange = (device: string) => {
    setActiveDevice(device);

    switch (device) {
      case "mobile":
        setViewportWidth(375);
        break;
      case "tablet":
        setViewportWidth(768);
        break;
      case "desktop":
      default:
        setViewportWidth(1280);
        break;
    }
  };

  return (
    <Wrapper>
      <TabsStyled
        value={activeDevice}
        onValueChange={handleDeviceChange}
      >
        <TabsListStyled>
          <TabsTriggerStyled value="mobile">
            <DeviceIcon>
              <Smartphone aria-hidden="true" />
            </DeviceIcon>
          </TabsTriggerStyled>
          <TabsTriggerStyled value="tablet">
            <DeviceIcon>
              <Tablet aria-hidden="true" />
            </DeviceIcon>
          </TabsTriggerStyled>
          <TabsTriggerStyled value="desktop">
            <DeviceIcon>
              <Laptop aria-hidden="true" />
            </DeviceIcon>
          </TabsTriggerStyled>
        </TabsListStyled>
      </TabsStyled>
    </Wrapper>
  );
}
