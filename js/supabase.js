const SUPABASE_URL = "https://roujhvvwawwaskvuejus.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvdWpodnZ3YXd3YXNrdnVlanVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTEyMDYsImV4cCI6MjEwMDQ4NzIwNn0.5FlMo63QLxCUQqXgdgdX5u7s-wL8QcBGrvTZJErVCDY";

const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);