/**
 * Single place to re-brand this template for a new client:
 * name, tagline, and the starting category list all live here.
 */
export const siteConfig = {
  name: "Steven Bennett",
  shortName: "Steven Bennett",
  tagline: "Notes on building, investing, and deep tech.",
  description:
    "Essays from a decade of building startups, now spent backing early-stage deep tech founders — AI infrastructure, robotics, energy, and the hard problems worth solving.",
  authorName: "Steven Bennett",
  authorTitle: "Deep Tech Investor",
  authorBio:
    "Steven spent a decade building startups before becoming a deep tech investor. He writes about the lessons from both sides of the table.",
  // Note: next/image doesn't auto-prefix a plain string src with the app's
  // basePath (set in next.config.ts) — this needs the /blog prefix included
  // manually to match.
  authorPhotoUrl: "/blog/author.jpg",
  url: "http://localhost:3000/blog",
  // The main portfolio site this blog lives under — the navbar brand links
  // back here. Update this to the real domain/path once both are deployed.
  portfolioUrl: "http://localhost:5173",
};

export const defaultCategories: { name: string; description: string }[] = [
  {
    name: "Books I Recommend",
    description: "Reading notes and recommendations worth your time.",
  },
  {
    name: "Artificial Intelligence",
    description: "Thoughts on AI, machine learning, and where it's headed.",
  },
  {
    name: "Resources for Upskilling",
    description: "Courses, tools, and paths for leveling up.",
  },
  {
    name: "Economics & Markets",
    description: "Notes on markets, policy, and how the world works.",
  },
  {
    name: "Social Opinions",
    description: "Perspectives on culture and society.",
  },
  {
    name: "Leadership & Business",
    description: "Lessons on building teams, companies, and decisions.",
  },
  {
    name: "Technology",
    description: "Where software, hardware, and the internet are going.",
  },
  {
    name: "Health & Longevity",
    description: "What's worth knowing about living well and living long.",
  },
  {
    name: "Science & Climate",
    description: "Research, energy, and the state of the planet.",
  },
  {
    name: "Personal Reflections",
    description: "Notes on habits, mindset, and lessons learned.",
  },
  {
    name: "Travel & Culture",
    description: "Places, people, and perspective gained on the road.",
  },
];
