import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Testimonial from '@/models/Testimonial';
import Blog from '@/models/Blog';
import Setting from '@/models/Setting';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { clearDbCache, writeHomepageDataJson } from '@/lib/data-cache';

const GOLD_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const DARK_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// A tiny elegant SVG encoded in Base64 for the favicon (a gold "A" inside a diamond)
const DEFAULT_FAVICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiMwNTA1MDUiLz48cGF0aCBkPSJNMTYgMkwzMCAxNkwxNiAzMEwyIDE2WiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDRhZjM3IiBzdHJva2Utd2lkdGg9IjEuNSIvPjx0ZXh0IHg9IjE2IiB5PSIyMSIgZmlsbD0iI2Q0YWYzNyIgZm9udC1mYW1pbHk9Imdlb3JnaWEsIHNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QTwvdGV4dD48L3N2Zz4=';

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Clear existing data
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Testimonial.deleteMany({});
    await Blog.deleteMany({});
    await Setting.deleteMany({});

    // 1. Seed Site Settings
    const setting = await Setting.create({
      logoText: 'RIFAT',
      favicon: DEFAULT_FAVICON,
      heroTitle: "I'm Refayet Hossen",
      heroSubtitle: 'High-end development engineered with uncompromising aesthetics and extreme performance.',
      aboutHeading: 'The Luxury Curation',
      aboutText: 'Rifat is a digital creative studio led by Refayet. We reject average layouts. We blend fine-arts editorial design with bleeding-edge technology to build digital portals that feel exclusive, load instantly, and leave a permanent imprint on the high-end digital landscape.',
      footerText: '© 2026 Rifat. Meticulously crafted for high-end digital presence.',
      email: 'mdrifayethossen@gmail.com',
      phone: '+880 17XXXXXXX',
      github: 'https://github.com/rifat',
      linkedin: 'https://linkedin.com/in/rifat',
      whatsapp: '+88017XXXXXXX',
      navbarLinks: [
        { label: 'Projects', url: '#projects' },
        { label: 'Skills', url: '#skills' },
        { label: 'Curation', url: '#about' },
        { label: 'Journal', url: '#blogs' },
        { label: 'Testimonials', url: '#testimonials' }
      ],
      typewriterRoles: 'Full Stack Developer, Shopify Developer, Next.js Architect',
      projectsLayout: 'minimal-cards',
      skillsLayout: 'circular-progress',
      testimonialsLayout: 'single-featured',
      blogsLayout: 'asymmetric-cards'
    });

    // 2. Seed Projects
    const projects = await Project.create([
      {
        title: 'Aetheria Estates',
        description: 'Ultra-premium digital showcase for elite real estate portfolios in Monaco and Zurich.',
        richText: 'Aetheria Estates is a bespoke digital platform catering to high-net-worth individuals. Engineered using Next.js with Server-Side Rendering (SSR), it provides an immersive 3D walkthrough experience (integrated with WebGL) and elegant fluid-scroll typography. The backend utilizes advanced caching algorithms for instant load times under 0.4 seconds.',
        image: GOLD_PIXEL,
        techStack: ['Next.js', 'WebGL', 'Framer Motion', 'MongoDB'],
        liveLink: 'https://aetheria.example.com',
        githubLink: 'https://github.com/rifat/aetheria',
        order: 1
      },
      {
        title: 'Chronos Horology',
        description: 'An interactive luxury catalog and customizer for haute horology brands.',
        richText: 'Chronos is an editorial e-commerce exploration built for luxury Swiss watchmakers. Featuring customizable spring animations, interactive 360-degree product tilts, and high-fidelity image loaders, it replicates the physical luxury experience in a browser window. The system integrates seamless API pipelines for private client booking.',
        image: DARK_PIXEL,
        techStack: ['React', 'Vanilla CSS', 'Three.js', 'Node.js'],
        liveLink: 'https://chronos.example.com',
        githubLink: 'https://github.com/rifat/chronos',
        order: 2
      },
      {
        title: 'Vesper Curation',
        description: 'Curated architectural furniture house representing elite European design labels.',
        richText: 'Vesper & Co. required a minimal digital archive that behaves like an art museum gallery. Designed with grid lines, large content spacing, micro-text details, and smooth layout changes. Utilizing database-backed real-time inventory and headless stripe processing, Vesper offers a frictionless high-end shopping workflow.',
        image: GOLD_PIXEL,
        techStack: ['Next.js', 'CSS Modules', 'Stripe', 'GraphQL'],
        liveLink: 'https://vesper.example.com',
        githubLink: 'https://github.com/rifat/vesper',
        order: 3
      }
    ]);

    // 3. Seed Skills
    const skills = await Skill.create([
      { name: 'React / Next.js', category: 'Frontend', proficiency: 98, iconName: 'Layers', order: 1 },
      { name: 'TypeScript', category: 'Frontend', proficiency: 95, iconName: 'Code', order: 2 },
      { name: 'Framer Motion & Animations', category: 'Frontend', proficiency: 97, iconName: 'Sparkles', order: 3 },
      { name: 'Vanilla CSS & Modular Design', category: 'Frontend', proficiency: 96, iconName: 'Palette', order: 4 },
      { name: 'Node.js & Express', category: 'Backend', proficiency: 90, iconName: 'Server', order: 5 },
      { name: 'MongoDB / Mongoose', category: 'Backend', proficiency: 92, iconName: 'Database', order: 6 },
      { name: 'Rest API Design & Integration', category: 'Backend', proficiency: 94, iconName: 'Cpu', order: 7 },
      { name: 'Figma to Code Engineering', category: 'Tools/Other', proficiency: 95, iconName: 'Monitor', order: 8 },
      { name: 'SEO & Performance Audits', category: 'Tools/Other', proficiency: 93, iconName: 'TrendingUp', order: 9 }
    ]);

    // 4. Seed Testimonials
    const testimonials = await Testimonial.create([
      {
        name: 'Arthur Pendelton',
        role: 'Creative Director',
        company: 'Elite Digital London',
        reviewText: 'Working with Rifat was an absolute revelation. He understands that luxury is not about adding more, but about removing the unnecessary until only pure beauty remains. The Next.js portfolio he built for our campaign loads instantly and is a masterpiece.',
        rating: 5,
        avatar: GOLD_PIXEL
      },
      {
        name: 'Victoria Sterling',
        role: 'Founder',
        company: 'Sterling & Co.',
        reviewText: 'We needed a digital experience that could convey the weight of our legacy brand. Rifat built a portal that felt like a virtual luxury salon. His attention to micro-animations and typography is unparalleled.',
        rating: 5,
        avatar: DARK_PIXEL
      },
      {
        name: 'Maximilian Kross',
        role: 'Lead Architect',
        company: 'Vesper Labs',
        reviewText: 'Rifat possesses that rare hybrid skill set: an absolute eye for haute design coupled with rigorous, clean code engineering. The speed of our new platform is jaw-dropping.',
        rating: 5,
        avatar: GOLD_PIXEL
      }
    ]);

    // 5. Seed Blogs
    const blogs = await Blog.create([
      {
        title: 'The Obsidian Space: Designing Web Portals for Elite Brands',
        slug: 'obsidian-space-designing-elite-brands',
        excerpt: 'How minimalism, negative space, and dark obsidian themes establish immediate credibility and premium status.',
        content: `Designing a digital presence for luxury brands is radically different from mainstream web design. While standard websites focus on conversion optimization through loud buttons and flashing elements, luxury platforms establish authority through silence, space, and motion.

## 1. The Power of Empty Space
In premium design, negative space is not wasted space—it is the luxury of breathing room. It tells the viewer that your work has value and doesn't need to shout to be noticed. Larger margins, generous typography line-heights, and minimal borders create an editorial layout similar to high-end fashion print magazines.

## 2. The Obsidian Canvas
Dark mode is no longer just a feature; it is an aesthetic of mystery and refinement. Deep charcoal backgrounds combined with sharp golden or champagne borders draw the eye to the key focus points: high-quality images and bold, elegant headings.

## 3. Micro-Animations and Lag Cursors
Motion should feel fluid, never robotic. By using spring physics in Framer Motion, animations react dynamically to user speed. A subtle custom cursor that lags slightly behind the mouse pointer creates a physical, organic feel that ties the whole immersive experience together.`,
        image: DARK_PIXEL,
        tags: ['Design', 'UX/UI', 'Branding'],
        readTime: '4 min read',
        published: true,
        order: 1
      },
      {
        title: 'Optimizing Next.js 16 for Sub-Second Database Queries',
        slug: 'optimizing-nextjs-database-queries',
        excerpt: 'A technical walkthrough on caching, Mongoose index optimization, and connection pooling for rapid portfolios.',
        content: `A luxury website must not only look premium—it must feel premium. In the digital world, speed is the ultimate indicator of prestige. If your site takes more than 2 seconds to load, you have already lost the user's attention.

## 1. Mongoose Connection Pooling
Next.js serverless functions can quickly exhaust database connections if not cached properly. By caching the connection object across hot reloads, we avoid the overhead of re-establishing a TCP handshake on every serverless execution:

\`\`\`typescript
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
// check cached.conn before calling mongoose.connect()
\`\`\`

## 2. Server-Sent Events vs Polling for Chat
While WebSockets are excellent, Server-Sent Events (SSE) offer a lightweight HTTP-based alternative for real-time dashboard notifications. We can optimize this by indexing our MongoDB \`createdAt\` fields, avoiding heavy lookup queries during active user sessions.

## 3. Pre-Fetching and Dynamic Server Caching
By utilizing Next.js selective revalidation, static content like projects and skills can be statically compiled at build time, while chat logs and settings are fetched dynamically. This achieves a perfect balance between speed and real-time updates.`,
        image: GOLD_PIXEL,
        tags: ['Next.js', 'Database', 'Performance'],
        readTime: '6 min read',
        published: true,
        order: 2
      }
    ]);

    revalidatePath('/');
    clearDbCache();
    await writeHomepageDataJson();

    return NextResponse.json({
      success: true,
      message: 'Database seeded with premium luxury content successfully!',
      seeded: {
        settings: 1,
        projects: projects.length,
        skills: skills.length,
        testimonials: testimonials.length,
        blogs: blogs.length
      }
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Seeding failed: ' + (error as Error).message }, { status: 500 });
  }
}
