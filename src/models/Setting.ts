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
  headerFooterRole?: string;
  serviceStat1Value?: string;
  serviceStat1Label?: string;
  serviceStat2Value?: string;
  serviceStat2Label?: string;
  serviceStat3Value?: string;
  serviceStat3Label?: string;
  projectStat1Value?: string;
  projectStat1Label?: string;
  projectStat2Value?: string;
  projectStat2Label?: string;
  projectStat3Value?: string;
  projectStat3Label?: string;
  projectStat4Value?: string;
  projectStat4Label?: string;
  expStat1Value?: string;
  expStat1Label?: string;
  expStat2Value?: string;
  expStat2Label?: string;
  expStat3Value?: string;
  expStat3Label?: string;
  expStat4Value?: string;
  expStat4Label?: string;
  testiStat1Value?: string;
  testiStat1Label?: string;
  testiStat2Value?: string;
  testiStat2Label?: string;
  testiStat3Value?: string;
  testiStat3Label?: string;
  testiStat4Value?: string;
  testiStat4Label?: string;
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
  // About Feature Cards
  aboutFeature1Title?: string;
  aboutFeature1Desc?: string;
  aboutFeature2Title?: string;
  aboutFeature2Desc?: string;
  aboutFeature3Title?: string;
  aboutFeature3Desc?: string;
  // About Signature & Quote
  aboutSignatureRole?: string;
  aboutQuoteText?: string;
  // About Core Values
  aboutValue1Title?: string;
  aboutValue1Desc?: string;
  aboutValue2Title?: string;
  aboutValue2Desc?: string;
  aboutValue3Title?: string;
  aboutValue3Desc?: string;
  aboutValue4Title?: string;
  aboutValue4Desc?: string;
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
  headerFooterRole: { type: String, default: 'Full Stack Developer' },
  serviceStat1Value: { type: String, default: '99.9%' },
  serviceStat1Label: { type: String, default: 'Uptime & Performance' },
  serviceStat2Value: { type: String, default: 'Clean' },
  serviceStat2Label: { type: String, default: 'Architecture' },
  serviceStat3Value: { type: String, default: '24/7' },
  serviceStat3Label: { type: String, default: 'Support & Comm' },
  projectStat1Value: { type: String, default: 'Pixel' },
  projectStat1Label: { type: String, default: 'Precision UI' },
  projectStat2Value: { type: String, default: 'Fluid' },
  projectStat2Label: { type: String, default: 'Animations' },
  projectStat3Value: { type: String, default: 'Mobile' },
  projectStat3Label: { type: String, default: 'First Design' },
  projectStat4Value: { type: String, default: 'SEO' },
  projectStat4Label: { type: String, default: 'Optimized (A+)' },
  expStat1Value: { type: String, default: '10k+' },
  expStat1Label: { type: String, default: 'Hours Coding' },
  expStat2Value: { type: String, default: 'Agile' },
  expStat2Label: { type: String, default: 'Workflow' },
  expStat3Value: { type: String, default: 'Modern' },
  expStat3Label: { type: String, default: 'Tool Stacks' },
  expStat4Value: { type: String, default: 'Swift' },
  expStat4Label: { type: String, default: 'Resolution Rate' },
  testiStat1Value: { type: String, default: '5.0' },
  testiStat1Label: { type: String, default: 'Average Rating' },
  testiStat2Value: { type: String, default: '98%' },
  testiStat2Label: { type: String, default: 'Client Retention' },
  testiStat3Value: { type: String, default: '100%' },
  testiStat3Label: { type: String, default: 'Client Trust' },
  testiStat4Value: { type: String, default: 'Direct' },
  testiStat4Label: { type: String, default: 'Collaboration' },
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
  heroFreelanceText: { type: String, default: 'Available for freelance' },
  // About Feature Cards
  aboutFeature1Title: { type: String, default: 'Purpose-Driven' },
  aboutFeature1Desc: { type: String, default: 'I build with purpose, focused on solving real problems.' },
  aboutFeature2Title: { type: String, default: 'Modern & Scalable' },
  aboutFeature2Desc: { type: String, default: 'I use the latest technologies to build fast, secure applications.' },
  aboutFeature3Title: { type: String, default: 'Collaborative' },
  aboutFeature3Desc: { type: String, default: 'I believe in clear communication and strong collaboration.' },
  // About Signature & Quote
  aboutSignatureRole: { type: String, default: 'Full Stack Developer' },
  aboutQuoteText: { type: String, default: 'My goal is to help businesses and individuals turn their ideas into powerful digital solutions that make a difference.' },
  // About Core Values
  aboutValue1Title: { type: String, default: 'Quality First' },
  aboutValue1Desc: { type: String, default: 'Delivering pixel-perfect, premium code matching top international standards.' },
  aboutValue2Title: { type: String, default: 'Agile & Responsive' },
  aboutValue2Desc: { type: String, default: 'Fast iterations, transparent updates, and super lightweight pages.' },
  aboutValue3Title: { type: String, default: 'Clean & Scalable' },
  aboutValue3Desc: { type: String, default: 'Future-proof modular structures tailored for high-scale enterprise operations.' },
  aboutValue4Title: { type: String, default: 'Client-Centric' },
  aboutValue4Desc: { type: String, default: 'Partnering closely to solve real-world problems and drive conversion rates.' },
}, { timestamps: true });

if (mongoose.models.Setting) {
  delete mongoose.models.Setting;
}

export default mongoose.model<ISetting>('Setting', SettingSchema);
