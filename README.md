# Portfolio Website

A modern portfolio website with blog and admin panel, built with Astro and React.

## Installation

### Quick Install (Recommended)

1. Upload the files to your hosting
2. Visit `yourdomain.com/install`
3. Follow the installation wizard to:
   - Configure your database
   - Create admin account
   - Set up environment variables

### Manual Installation

1. Create MySQL Database:
   - Go to cPanel > MySQL Databases
   - Create a new database
   - Create a new user
   - Add user to database with all privileges

2. Configure Environment:
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env`
   - Set a secure JWT_SECRET

3. Build the project locally:
   ```bash
   npm install
   npm run build
   ```

4. Upload to cPanel:
   - Upload the entire `dist` folder contents to your public_html directory
   - Upload `.env` file to the root directory (one level above public_html)

5. First-time setup:
   - Visit `yourdomain.com/admin/setup` to create your admin account
   - After setup, this page will be disabled

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features

- Responsive design
- Blog system
- Project portfolio
- Admin panel
- MySQL database
- Static site generation
- Easy installation wizard