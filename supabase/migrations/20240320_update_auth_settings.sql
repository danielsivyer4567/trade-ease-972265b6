-- Update auth settings for enhanced security
DO $$
BEGIN
    -- Set OTP expiry to 30 minutes (1800 seconds)
    PERFORM set_config('auth.otp.lifetime_seconds', '1800', false);
    
    -- Enable HaveIBeenPwned password protection
    PERFORM set_config('auth.password.hibp_enabled', 'true', false);
END;
$$; 