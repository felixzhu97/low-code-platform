import * as React from "react"
import styled from "@emotion/styled"

const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
`

const StyledTable = styled.table`
  width: 100%;
  caption-bottom: 0.875rem;
  font-size: 0.875rem;
`

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <TableWrapper>
    <StyledTable ref={ref} className={className} {...props} />
  </TableWrapper>
))
Table.displayName = "Table"

const StyledThead = styled.thead`
  tr {
    border-bottom: 1px solid hsl(var(--border));
  }
`

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <StyledThead ref={ref} className={className} {...props} />
))
TableHeader.displayName = "TableHeader"

const StyledTbody = styled.tbody`
  tr:last-child {
    border: 0;
  }
`

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <StyledTbody ref={ref} className={className} {...props} />
))
TableBody.displayName = "TableBody"

const StyledTfoot = styled.tfoot`
  border-top: 1px solid hsl(var(--border));
  background-color: hsl(var(--muted) / 0.5);
  font-weight: 500;

  tr:last-child {
    border-bottom: 0;
  }
`

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <StyledTfoot ref={ref} className={className} {...props} />
))
TableFooter.displayName = "TableFooter"

const StyledTr = styled.tr`
  border-bottom: 1px solid hsl(var(--border));
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: hsl(var(--muted) / 0.5);
  }

  &[data-state="selected"] {
    background-color: hsl(var(--muted));
  }
`

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <StyledTr ref={ref} className={className} {...props} />
))
TableRow.displayName = "TableRow"

const StyledTh = styled.th`
  height: 3rem;
  padding: 0 1rem;
  text-align: left;
  vertical-align: middle;
  font-weight: 500;
  color: hsl(var(--muted-foreground));

  &:has([role="checkbox"]) {
    padding-right: 0;
  }
`

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <StyledTh ref={ref} className={className} {...props} />
))
TableHead.displayName = "TableHead"

const StyledTd = styled.td`
  padding: 1rem;
  vertical-align: middle;

  &:has([role="checkbox"]) {
    padding-right: 0;
  }
`

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <StyledTd ref={ref} className={className} {...props} />
))
TableCell.displayName = "TableCell"

const StyledCaption = styled.caption`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <StyledCaption ref={ref} className={className} {...props} />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}