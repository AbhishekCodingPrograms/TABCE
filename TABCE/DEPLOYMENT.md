# 🚀 TABCE Deployment Guide

## Quick Start (Local Development)

The application is already running locally! Just open your browser to:
```
http://localhost:5173/
```

## 📦 Build for Production

### 1. Create Production Build

```bash
npm run build
```

This creates an optimized production bundle in the `dist/` folder.

### 2. Preview Production Build Locally

```bash
npm run preview
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⚡

**Why Vercel?**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Perfect for React apps

**Steps:**
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts (use default settings)

4. Your app will be live at: `https://your-project.vercel.app`

### Option 2: Netlify 🎯

1. **Via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

2. **Via Netlify Dashboard:**
   - Go to https://app.netlify.com
   - Drag & drop the `dist` folder
   - Done!

### Option 3: GitHub Pages 📄

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/TABCE",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Update `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/TABCE/',
     // ... rest of config
   })
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### Option 4: Firebase Hosting 🔥

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize:
   ```bash
   firebase init hosting
   ```

4. Configure:
   - Public directory: `dist`
   - Single-page app: `Yes`
   - Set up automatic builds: `No`

5. Deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Option 5: Docker 🐳

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t tabce .
docker run -p 80:80 tabce
```

## ⚙️ Environment Variables

If you add backend integration, create `.env`:

```env
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_ID=your-analytics-id
VITE_FIREBASE_KEY=your-firebase-key
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🔧 Build Configuration

### Optimize Build Size

1. **Code Splitting**: Already configured via React Router
2. **Image Optimization**: Use image CDN or compress before upload
3. **Bundle Analysis**:
   ```bash
   npm run build -- --mode analyze
   ```

### Performance Optimizations

Already included:
- ✅ Tree-shaking (Vite)
- ✅ Minification
- ✅ CSS extraction
- ✅ Code splitting
- ✅ Lazy loading routes (can be added)

## 📊 Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify navigation works
- [ ] Check mobile responsiveness
- [ ] Test image loading
- [ ] Verify animations work
- [ ] Check console for errors
- [ ] Test on different browsers
- [ ] Verify HTTPS is enabled
- [ ] Set up custom domain (if needed)
- [ ] Configure analytics (if needed)

## 🐛 Troubleshooting

### Issue: 404 on page refresh

**Solution**: Configure server for SPA routing

**Netlify** (`_redirects` file):
```
/*    /index.html   200
```

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Apache** (`.htaccess`):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Issue: Images not loading

- Check image URLs are correct
- Ensure CORS is configured for external images
- Use relative paths for local images

### Issue: Styles not applying

- Clear browser cache
- Check CSS files are imported
- Verify build completed successfully

## 🎯 Recommended: Vercel Deployment

For the hackathon demo, I recommend **Vercel**:

1. **Quick Deploy**:
   ```bash
   npm run build
   vercel --prod
   ```

2. **Get your URL**: `https://tabce-xyz.vercel.app`

3. **Share** with judges!

## 📱 Custom Domain (Optional)

Most platforms support custom domains:

1. **Buy domain** (Namecheap, Google Domains, etc.)
2. **Add domain** in hosting dashboard
3. **Update DNS** records
4. **Wait for propagation** (up to 24 hours)

## 🔒 Security Best Practices

- ✅ HTTPS enabled (automatic on most platforms)
- ✅ No sensitive data in frontend code
- ✅ Environment variables for secrets
- ✅ CSP headers (configure in hosting platform)
- ✅ CORS properly configured

## 📈 Analytics (Optional)

Add Google Analytics:

1. Get tracking ID from analytics.google.com
2. Add to `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

## 🎉 You're Ready!

Your TABCE application is now production-ready and can be deployed to any modern hosting platform!

**Recommended for Demo**: Vercel (fastest, easiest)

Need help? Check the platform-specific docs or contact support!

---

**Built with ❤️ for Tesco Retail Media Hackathon**
