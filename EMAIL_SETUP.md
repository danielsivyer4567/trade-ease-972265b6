# Email Service Setup

This project supports two email service providers: **Mailgun** (default) and **Brevo** (alternative).

## Current Configuration

The project is currently configured to use **Mailgun** as the primary email service.

## Mailgun Setup (Default)

### 1. Environment Variables
Add these to your Supabase project's environment variables:

```bash
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_verified_mailgun_domain
```

### 2. Get Mailgun Credentials
1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Verify your domain
3. Get your API key from Settings → API Keys
4. Use your verified domain as `MAILGUN_DOMAIN`

### 3. Features
- HTML and text email support
- Custom sender addresses
- Template variables
- Default sender: `Trade Ease <noreply@{MAILGUN_DOMAIN}>`

## Brevo Setup (Alternative)

### 1. Environment Variables
```bash
BREVO_API_KEY=your_brevo_api_key
```

### 2. Get Brevo Credentials
1. Sign up at [Brevo](https://www.brevo.com/)
2. Go to SMTP & API → API Keys
3. Create a new API key

### 3. Switch to Brevo
To use Brevo instead of Mailgun:

1. Update `src/utils/emailService.ts`:
   ```typescript
   const { data, error } = await supabase.functions.invoke('brevo-email-sender', {
     body: {
       to: options.to,
       subject: options.subject,
       htmlContent: options.html,
       textContent: options.text,
       sender: options.from ? { email: options.from } : undefined
     }
   });
   ```

## Supabase Edge Functions

The project includes two email sender functions:

- `mailgun-email-sender` - Located in `supabase/functions/mailgun-email-sender/`
- `brevo-email-sender` - Located in `supabase/functions/brevo-email-sender/`

## Environment Variable Setup

### Local Development
1. Copy `.env.example` to `.env.local`
2. Add your email service credentials

### Production (Supabase)
1. Go to your Supabase dashboard
2. Navigate to Project Settings → Edge Functions → Environment Variables
3. Add the required variables:
   - `MAILGUN_API_KEY`
   - `MAILGUN_DOMAIN`
   - `BREVO_API_KEY` (if using Brevo)

## Usage Examples

### Basic Email
```typescript
import { sendEmail } from '@/utils/emailService';

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome to Trade Ease!</h1>',
  text: 'Welcome to Trade Ease!'
});
```

### With Custom Sender
```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Custom Sender',
  html: '<p>Hello from custom sender</p>',
  from: 'support@yourcompany.com'
});
```

### With Template Variables (Mailgun only)
```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome {{name}}!',
  html: '<h1>Welcome {{name}}!</h1>',
  templateVariables: {
    name: 'John Doe'
  }
});
```

## Troubleshooting

### Common Issues

1. **"Server configuration error"**
   - Check that environment variables are set in Supabase
   - Verify variable names match exactly

2. **Domain verification errors (Mailgun)**
   - Ensure your domain is verified in Mailgun dashboard
   - Check DNS records are properly configured

3. **API key issues**
   - Verify API keys are active and have correct permissions
   - For Mailgun: Use the private API key, not public

### Testing

You can test email functionality through:
1. The AutomationTriggerService
2. Direct calls to the email service functions
3. User registration/password reset flows

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Restrict API key permissions to minimum required
- For Mailgun: Consider using subdomain for better deliverability 