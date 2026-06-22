
CREATE TABLE public.comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Untitled comparison',
  paper_ids uuid[] NOT NULL,
  focus text,
  initial_result text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comparisons TO authenticated;
GRANT ALL ON public.comparisons TO service_role;
ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own comparisons" ON public.comparisons
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX comparisons_user_updated_idx ON public.comparisons(user_id, updated_at DESC);

CREATE TABLE public.comparison_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_id uuid NOT NULL REFERENCES public.comparisons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comparison_messages TO authenticated;
GRANT ALL ON public.comparison_messages TO service_role;
ALTER TABLE public.comparison_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own comparison messages" ON public.comparison_messages
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX comparison_messages_comp_idx ON public.comparison_messages(comparison_id, created_at);

CREATE OR REPLACE FUNCTION public.touch_comparison_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  UPDATE public.comparisons SET updated_at = now() WHERE id = NEW.comparison_id;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_touch_comparison
AFTER INSERT ON public.comparison_messages
FOR EACH ROW EXECUTE FUNCTION public.touch_comparison_updated_at();
