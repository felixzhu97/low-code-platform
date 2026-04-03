import { css } from "@emotion/react";

export const fallbackBox = css`
  border-radius: 0.25rem;
  border: 1px solid hsl(var(--border));
  padding: 0.5rem;
`;

export const mutedCenter = css`
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
`;

export const mutedSmall = css`
  font-size: 0.75rem;
  line-height: 1rem;
  color: hsl(var(--muted-foreground));
`;

export const fieldStack = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const flexRowGap2 = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const flexRowGap1 = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const flex1 = css`
  flex: 1;
`;

export const tableShell = css`
  width: 100%;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
`;

export const treePanelShell = css`
  width: 100%;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
`;

export const tableHeaderBar = css`
  background-color: hsl(var(--muted));
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
`;

export const overflowXAuto = css`
  overflow-x: auto;
`;

export const whitespaceNowrap = css`
  white-space: nowrap;
`;

export const tableCellMuted = css`
  height: 6rem;
  text-align: center;
`;

export const paginationBar = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid hsl(var(--border));
  background-color: hsl(var(--muted) / 0.5);
  padding: 0.5rem 1rem;
`;

export const iconBtnSm = css`
  height: 2rem;
  width: 2rem;
  padding: 0;
`;

export const divideY = css`
  & > * + * {
    border-top: 1px solid hsl(var(--border));
  }
`;

export const listRow = css`
  padding: 0.75rem 1rem;
`;

export const treeLine = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
`;

export const schemaEmpty = css`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: hsl(var(--muted-foreground));
`;

export const padX2 = css`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`;

export const sliderScaleRow = css`
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: hsl(var(--muted-foreground));
`;

export const radioOptionRow = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

