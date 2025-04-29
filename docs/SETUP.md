# Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/trade-ease.git
cd trade-ease
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment files:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local` with your values.

## Development

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Testing

1. Run tests:
```bash
npm run test
# or
yarn test
```

2. Run tests with coverage:
```bash
npm run test:coverage
# or
yarn test:coverage
```

## Building for Production

1. Create a production build:
```bash
npm run build
# or
yarn build
```

2. Preview the production build:
```bash
npm run preview
# or
yarn preview
```

## Deployment

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy
```

## Troubleshooting

### Common Issues

1. **Node modules issues**
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **Environment variables not loading**
   - Ensure `.env.local` exists
   - Restart the development server

3. **Build errors**
   - Clear the build cache: `npm run clean`
   - Rebuild: `npm run build`

## Contributing

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git commit -m "feat: your feature description"
```

3. Push to your branch:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request

## Support

For support, please:
1. Check the [documentation](docs/)
2. Open an issue
3. Contact the development team 