<content># Portfolio Website

A modern portfolio website with blog and admin panel, built with Astro and React.

## cPanel Installation Guide

1. Build the project locally:
   ```bash
   npm install
   npm run build
   ```

2. Upload to cPanel:
   - Upload the entire `dist` folder contents to your public_html directory
   - Upload `.htaccess` file to the same directory as index.html
   - Upload `.env` file to the root directory (one level above public_html)

3. Database Setup:
   - Go to cPanel > MySQL Databases
   - Create a new database
   - Create a new user
   - Add user to database with all privileges
   - Visit `yourdomain.com/install` to complete setup

4. First-time Setup:
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
- cPanel compatible</content>