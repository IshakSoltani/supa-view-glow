import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xdtwkbjcdmlkztvgoazi.supabase.co';
// ⚠️ WARNING: This is a service_role key which should NOT be exposed in client-side code
// For production, use the anon (public) key and implement Row Level Security
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkdHdrYmpjZG1sa3p0dmdvYXppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU1MTQ2OCwiZXhwIjoyMDc4MTI3NDY4fQ.Ut7uKShVy4UbtNJx1_lJmX2-4HNkEWg8S9TyPT_wNIo';

export const supabase = createClient(supabaseUrl, supabaseKey);
