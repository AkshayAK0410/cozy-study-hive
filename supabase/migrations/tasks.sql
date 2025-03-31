    -- Create tasks table
    CREATE TABLE IF NOT EXISTS public.tasks (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        due_date TIMESTAMPTZ,
        status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
        priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        tags TEXT[],
        category TEXT
    );

    -- Enable Row Level Security
    ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

    -- Create policy to allow users to manage their own tasks
    CREATE POLICY "Users can manage their own tasks"
        ON public.tasks
        FOR ALL
        USING (auth.uid() = user_id);

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
    CREATE INDEX IF NOT EXISTS tasks_status_idx ON public.tasks(status);
    CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks(created_at);

    -- Grant necessary permissions
    GRANT ALL ON public.tasks TO authenticated;
