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
}

const NavbarLinkSchema = new Schema<INavbarLink>({
  label: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const SettingSchema = new Schema<ISetting>({
  logoText: { type: String, default: 'AURA' },
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
  footerText: { type: String, default: '© 2026 AURA. All rights reserved.' },
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
  blogsLayout: { type: String, default: 'editorial-rows' }
}, { timestamps: true });

if (mongoose.models.Setting) {
  delete mongoose.models.Setting;
}

export default mongoose.model<ISetting>('Setting', SettingSchema);
