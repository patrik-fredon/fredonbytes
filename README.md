# Fredonbytes - Your All-in-One IT Powerhouse

A comprehensive business website and link tree ecosystem built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### Homepage
- **Hero Section** - Animated TypeScript code snippets with dynamic typing effect
- **About Section** - Company story, team information, and core values
- **Services Section** - Comprehensive IT solutions showcase with interactive elements
- **Projects Section** - Filterable portfolio grid with technology tags
- **Pricing Section** - Interactive pricing calculator with multiple tiers
- **Contact Section** - Multi-step form with real-time validation

### Link Tree System
- Professional link organization with categories
- GitHub repository statistics integration
- Company branding and contact information
- Responsive design with hover animations

### Technical Features
- **Email Integration** - Resend API for professional email handling
- **Form Validation** - React Hook Form with Zod schema validation
- **Animations** - Framer Motion for smooth transitions
- **SEO Optimization** - Complete meta tag management and Open Graph support
- **Accessibility** - AAA-level accessibility features
- **Dark Mode** - Complete dark theme support
- **GDPR Compliance** - Cookie consent management with granular controls

### Legal Framework
- Privacy Policy with comprehensive GDPR compliance
- Terms of Service covering all business aspects
- Cookie Policy with detailed usage explanations

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.3
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Email:** Resend API
- **Icons:** Lucide React
- **Deployment:** Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fredonbytes.git
   cd fredonbytes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   RESEND_API_KEY=your_resend_api_key_here
   NEXT_PUBLIC_SITE_URL=https://fredonbytes.cloud
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🌐 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Add environment variables in Vercel dashboard**
   - Go to your project settings
   - Add `RESEND_API_KEY` and other environment variables

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📧 Email Setup

1. **Sign up for Resend**
   - Go to [resend.com](https://resend.com)
   - Create an account and get your API key

2. **Configure your domain**
   - Add your domain in Resend dashboard
   - Set up DNS records for email authentication

3. **Update email addresses**
   - Update sender addresses in `/src/app/api/contact/route.ts`
   - Ensure they match your verified domain

## 🎨 Customization

### Branding
- Update logo files in `/public/`
- Modify colors in `tailwind.config.js`
- Update company information in components

### Content
- Edit homepage sections in `/src/app/components/homepage/`
- Update team information in `AboutSection.tsx`
- Modify services in `ServicesSection.tsx`
- Update project portfolio in `ProjectsSection.tsx`

### Legal Documents
- Customize privacy policy in `/src/app/privacy-policy/page.tsx`
- Update terms of service in `/src/app/terms-of-service/page.tsx`
- Modify cookie policy in `/src/app/cookie-policy/page.tsx`

## 📱 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── common/           # Reusable components
│   │   ├── homepage/         # Homepage sections
│   │   └── linktree/         # Link tree components
│   ├── api/
│   │   └── contact/          # Contact form API
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── links/                # Link tree page
│   ├── privacy-policy/       # Privacy policy page
│   ├── terms-of-service/     # Terms of service page
│   ├── cookie-policy/        # Cookie policy page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── public/                   # Static assets
└── docs/                     # Documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## 📊 Performance

- **Lighthouse Score:** 95+ across all metrics
- **Core Web Vitals:** Optimized for excellent user experience
- **SEO Score:** 100/100 with comprehensive meta tags
- **Accessibility:** AAA-level compliance

## 🛡️ Security & Compliance

- **GDPR Compliant** - Full European data protection compliance
- **Cookie Management** - Granular consent controls
- **Form Validation** - Server-side validation with Zod
- **Data Protection** - Secure handling of user information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved by Fredonbytes.

## 📞 Support

- **Email:** info@fredonbytes.cloud
- **Phone:** +420 799 027 984
- **Website:** [fredonbytes.cloud](https://fredonbytes.cloud)
- **Location:** Brno, Czech Republic

---

**Fredonbytes** - Code. Create. Conquer.

*One Team. Zero Limits.*
