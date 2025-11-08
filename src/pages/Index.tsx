import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { StatCard } from "@/components/StatCard";
import { TableView } from "@/components/TableView";
import { Card, CardContent } from "@/components/ui/card";
import { Database, Table2, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface TableInfo {
  name: string;
  data: any[];
  rowCount: number;
}

const Index = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all tables from the public schema
      const { data: tablesData, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .not('table_name', 'in', '(schema_migrations)');

      if (tablesError) throw tablesError;

      // For each table, fetch its data
      const tableInfoPromises = (tablesData || []).map(async (table: any) => {
        const tableName = table.table_name;
        
        try {
          const { data, error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact' })
            .limit(100);

          if (error) {
            console.error(`Error fetching ${tableName}:`, error);
            return null;
          }

          return {
            name: tableName,
            data: data || [],
            rowCount: count || 0,
          };
        } catch (err) {
          console.error(`Error fetching ${tableName}:`, err);
          return null;
        }
      });

      const tableInfos = await Promise.all(tableInfoPromises);
      const validTables = tableInfos.filter((t): t is TableInfo => t !== null);
      
      setTables(validTables);
      
      if (validTables.length === 0) {
        toast({
          title: "No tables found",
          description: "Your Supabase database doesn't have any public tables yet.",
        });
      }
    } catch (err: any) {
      console.error('Error fetching tables:', err);
      setError(err.message || 'Failed to fetch database information');
      toast({
        title: "Error",
        description: err.message || 'Failed to fetch database information',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalTables = tables.length;
  const totalRows = tables.reduce((sum, table) => sum + table.rowCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Database className="h-8 w-8 text-primary-foreground" />
            </div>
            Supabase Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your database tables and data
          </p>
        </div>

        {/* Security Warning */}
        <Alert className="mb-6 border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertTitle className="text-destructive">Security Notice</AlertTitle>
          <AlertDescription className="text-destructive/90">
            You're using a service_role key which should only be used server-side. 
            For production apps, use the anon (public) key with Row Level Security policies.
          </AlertDescription>
        </Alert>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <StatCard
                title="Total Tables"
                value={totalTables}
                icon={Table2}
                description="Public schema tables"
              />
              <StatCard
                title="Total Rows"
                value={totalRows.toLocaleString()}
                icon={Database}
                description="Across all tables"
              />
              <StatCard
                title="Connection Status"
                value="Connected"
                icon={Database}
                description="Supabase instance active"
              />
            </div>

            {/* Tables */}
            <div className="space-y-6">
              {tables.length === 0 ? (
                <Card className="bg-gradient-card border-border/50 shadow-md">
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <Database className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      No tables found in your database.
                      <br />
                      Create tables in your Supabase dashboard to see them here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                tables.map((table) => (
                  <TableView
                    key={table.name}
                    tableName={table.name}
                    data={table.data}
                    rowCount={table.rowCount}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
