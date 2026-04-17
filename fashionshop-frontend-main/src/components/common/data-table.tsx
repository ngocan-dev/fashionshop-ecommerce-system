import { cn } from '@/lib/utils/cn';

type Column<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  emptyLabel?: string;
  isLoading?: boolean;
};

export function DataTable<T>({ columns, data, emptyLabel = 'No records found', isLoading }: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-border bg-card px-6 py-10 text-sm text-muted-foreground animate-pulse">
        <div className="space-y-4">
          <div className="h-4 bg-neutral-100 rounded w-full" />
          <div className="h-4 bg-neutral-100 rounded w-full" />
          <div className="h-4 bg-neutral-100 rounded w-full" />
        </div>
      </div>
    );
  }

  if (!data.length) {
    return <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-sm text-muted-foreground">{emptyLabel}</div>;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            {columns.map((column) => (
              <th key={column.header} className={cn('px-4 py-3 font-medium text-muted-foreground', column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-border last:border-b-0">
              {columns.map((column) => (
                <td key={column.header} className={cn('px-4 py-3 align-top', column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
