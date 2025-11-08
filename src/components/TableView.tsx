import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database } from "lucide-react";

interface TableViewProps {
  tableName: string;
  data: any[];
  rowCount: number;
}

export const TableView = ({ tableName, data, rowCount }: TableViewProps) => {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <Card className="bg-gradient-card border-border/50 shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Database className="h-5 w-5 text-primary" />
          {tableName}
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({rowCount} rows)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {columns.map((column) => (
                  <TableHead key={column} className="font-semibold text-foreground">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/30 transition-colors">
                    {columns.map((column) => (
                      <TableCell key={column} className="text-foreground">
                        {typeof row[column] === 'object' 
                          ? JSON.stringify(row[column]) 
                          : String(row[column] ?? 'NULL')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
