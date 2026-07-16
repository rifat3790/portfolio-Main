import mongoose, { Schema, Document } from 'mongoose';

export interface INavbarLink {
  label: string;
  url: string;
}

export interface ISetting extends Document {
  logoText: string;
  logoImage?: string; // Base64
  heroBannerImage?: string; // Base64
  favicon?: string; // Base64
  heroTitle: string;
  heroSubtitle: string;
  heroBtn1Text: string;
  heroBtn1Url: string;
  heroBtn2Text: string;
  heroBtn2Url: string;
  aboutHeading: string;
  aboutText: string;
  aboutTitle?: string;
  aboutImage?: string;
  aboutName?: string;
  aboutEmail?: string;
  aboutLocation?: string;
  aboutAvailability?: string;
  aboutCvText?: string;
  aboutCvUrl?: string;
  aboutCvFile?: string;
  aboutCvFileName?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat3Value?: string;
  stat3Label?: string;
  stat4Value?: string;
  stat4Label?: string;
  footerText: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  whatsapp?: string;
  navbarLinks: INavbarLink[];
  typewriterRoles?: string;
  projectsLayout?: string;
  skillsLayout?: string;
  testimonialsLayout?: string;
  blogsLayout?: string;
  servicesPerRow?: number;
  servicesAutoScroll?: boolean;
  projectsPerRow?: number;
  projectCategories?: string;
  heroTagline?: string;
  heroTitleCursive?: string;
  heroSpecializationText?: string;
  heroShowFreelanceBadge?: boolean;
  heroFreelanceText?: string;
}

const NavbarLinkSchema = new Schema<INavbarLink>({
  label: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const SettingSchema = new Schema<ISetting>({
  logoText: { type: String, default: 'RIFAT' },
  logoImage: { type: String },
  heroBannerImage: { type: String },
  favicon: { type: String },
  heroTitle: { type: String, default: "I'm Refayet Hossen" },
  heroSubtitle: { type: String, default: 'Ultra-premium development with meticulous design.' },
  heroBtn1Text: { type: String, default: 'Explore Showcase' },
  heroBtn1Url: { type: String, default: '#projects' },
  heroBtn2Text: { type: String, default: 'Contact Me' },
  heroBtn2Url: { type: String, default: '#contact' },
  aboutHeading: { type: String, default: 'Our Story' },
  aboutText: { type: String, default: 'We build fast, bespoke web applications with luxury branding.' },
  aboutTitle: { type: String, default: 'Who am I?' },
  aboutImage: { type: String },
  aboutName: { type: String, default: 'Md. Refayet Hossen' },
  aboutEmail: { type: String, default: 'refayet@example.com' },
  aboutLocation: { type: String, default: 'Dhaka, Bangladesh' },
  aboutAvailability: { type: String, default: 'Open for opportunities' },
  aboutCvText: { type: String, default: 'Download CV' },
  aboutCvUrl: { type: String, default: '#' },
  aboutCvFile: { type: String },
  aboutCvFileName: { type: String, default: 'CV.pdf' },
  stat1Value: { type: String, default: '2+' },
  stat1Label: { type: String, default: 'Years Experience' },
  stat2Value: { type: String, default: '20+' },
  stat2Label: { type: String, default: 'Projects Completed' },
  stat3Value: { type: String, default: '10+' },
  stat3Label: { type: String, default: 'Happy Clients' },
  stat4Value: { type: String, default: '100%' },
  stat4Label: { type: String, default: 'Client Satisfaction' },
  footerText: { type: String, default: '© 2026 Rifat. All rights reserved.' },
  email: { type: String },
  phone: { type: String },
  github: { type: String },
  linkedin: { type: String },
  whatsapp: { type: String },
  navbarLinks: {
    type: [NavbarLinkSchema],
    default: [
      { label: 'Projects', url: '#projects' },
      { label: 'Curation', url: '#skills' },
      { label: 'Testimonials', url: '#testimonials' },
      { label: 'Journal', url: '#blogs' }
    ]
  },
  typewriterRoles: { type: String, default: 'Refayet Hossen, Full Stack Developer, Shopify Developer' },
  projectsLayout: { type: String, default: 'asymmetric' },
  skillsLayout: { type: String, default: 'category-progress' },
  testimonialsLayout: { type: String, default: 'grid' },
  blogsLayout: { type: String, default: 'editorial-rows' },
  servicesPerRow: { type: Number, default: 3 },
  servicesAutoScroll: { type: Boolean, default: false },
  projectsPerRow: { type: Number, default: 3 },
  projectCategories: { type: String, default: 'Web Applications, E-Commerce, Dashboard, Landing Page, Other' },
  heroTagline: { type: String, default: "HI, I'M REFAYET HOSSEN 👋" },
  heroTitleCursive: { type: String, default: 'That Make Impact' },
  heroSpecializationText: { type: String, default: "Shopify • Next.js • React\nNode.js • MongoDB" },
  heroShowFreelanceBadge: { type: Boolean, default: true },
  heroFreelanceText: { type: String, default: 'Available for freelance' }
}, { timestamps: true });

if (mongoose.models.Setting) {
  delete mongoose.models.Setting;
}

export default mongoose.model<ISetting>('Setting', SettingSchema);
