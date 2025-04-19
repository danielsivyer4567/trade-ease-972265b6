# Security Policy

## Supported Versions

The following versions of Trade Ease are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Trade Ease seriously. If you discover a security vulnerability, please follow these steps:

1. **Do Not** disclose the vulnerability publicly until it has been addressed.
2. Send a detailed report to our team by:
   - Opening a [security advisory](https://github.com/danielsivyer4567/trade-ease-972265b6/security/advisories/new)
   - Or emailing us (please contact repository owner for the security email)

### What to Include in Your Report
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fixes (if any)

### What to Expect
- We will acknowledge receipt of your report within 48 hours
- We will provide a detailed response within 7 days
- We will work on fixing verified vulnerabilities as quickly as possible
- We will keep you informed about our progress

### Security Update Process
- Security fixes are given the highest priority
- Updates will be released as soon as possible
- Release notes will include any security-related fixes
- Users will be notified through GitHub's security advisory system

## Best Practices
- Keep your dependencies up to date
- Run `npm audit` regularly to check for vulnerabilities
- Follow security advisories in the GitHub repository
- Use environment variables for sensitive information
- Never commit sensitive credentials to the repository

## Recent Security Updates
- 2024-03-19: Updated dependencies to fix vulnerabilities in `dompurify` and `esbuild` 