-- Create function to handle new user configuration
CREATE OR REPLACE FUNCTION public.handle_new_user_configuration()
RETURNS TRIGGER AS $$
BEGIN
  -- Create configuration entry for the new user
  INSERT INTO public.users_configuration (
    id,
    automation_enabled,
    messaging_enabled,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    false,  -- Default automation_enabled to false
    false,  -- Default messaging_enabled to false
    NOW(),  -- Set created_at to current timestamp
    NOW()   -- Set updated_at to current timestamp
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user configuration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_configuration();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users_configuration TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user_configuration() TO authenticated; 