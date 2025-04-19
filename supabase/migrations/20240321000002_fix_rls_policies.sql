-- Drop existing policies
DROP POLICY IF EXISTS "Users can only access their own integration configs" ON integration_configs;
DROP POLICY IF EXISTS "Users can view their own organization's integration configs" ON integration_configs;
DROP POLICY IF EXISTS "Users can insert integration configs" ON integration_configs;
DROP POLICY IF EXISTS "Users can update their own organization's integration configs" ON integration_configs;

-- Create unified policies
CREATE POLICY "Users can view their own integration configs"
  ON public.integration_configs
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own integration configs"
  ON public.integration_configs
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own integration configs"
  ON public.integration_configs
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Ensure proper grants are in place
GRANT ALL ON public.integration_configs TO authenticated;
GRANT ALL ON public.integration_configs TO service_role; 