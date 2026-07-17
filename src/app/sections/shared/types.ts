// Shared types for all homepage section components

export interface IProject {
  _id: string;
  title: string;
  description: string;
  richText?: string;
  image: string;
  techStack: string[];
  liveLink?: string;
  githubLink?: string;
  order: number;
  category?: string;
  screenshots?: string[];
  role?: string;
  duration?: string;
  projectType?: string;
  keyFeatures?: string;
  isFeatured?: boolean;
}

export interface ISkill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  iconName?: string;
  order: number;
}

export interface ITestimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  reviewText: string;
  avatar?: string;
  rating: number;
  order: number;
}

export interface IMessage {
  _id?: string;
  sessionId: string;
  sender: 'user' | 'admin';
  text: string;
  image?: string;
  createdAt: string;
}

export interface IBlog {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  tags: string[];
  readTime: string;
  published: boolean;
  order: number;
  createdAt: string;
}

export interface IExperience {
  _id: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  employmentType?: string;
  description: string;
  responsibilities?: string;
  techStack: string[];
  logo?: string;
  order: number;
  isCurrent: boolean;
}

export interface IService {
  _id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

export interface INavbarLink {
  label: string;
  url: string;
}

export interface ISetting {
  logoText: string;
  logoImage?: string;
  heroBannerImage?: string;
  favicon?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBtn1Text?: string;
  heroBtn1Url?: string;
  heroBtn2Text?: string;
  heroBtn2Url?: string;
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
}

export interface HomeClientProps {
  initialProjects: IProject[];
  initialSkills: ISkill[];
  initialTestimonials: ITestimonial[];
  initialBlogs: IBlog[];
  initialServices: IService[];
  initialExperiences: IExperience[];
  siteSettings: ISetting | null;
}
