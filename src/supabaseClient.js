import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jubmebmxginicktlgrjz.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1Ym1lYm14Z2luaWNrdGxncmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3NDgxNDAsImV4cCI6MjAyOTMyNDE0MH0.T2FrSHQymaDBFR6XGqSx0lJL-TN63RneJU8R1Gqjf5M'; 

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
