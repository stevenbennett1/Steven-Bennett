/**
 * Single place to re-brand this template for a new client:
 * name, tagline, and the starting category list all live here.
 */
export const siteConfig = {
  name: "Steven Bennett",
  shortName: "Steven Bennett",
  tagline: "My thoughts and foreseen insights on geopolitics, finance, investment, AI, and deep tech.",
  description:
    "A running record of what I'm reading, testing, and arguing with myself about: the shifting balance of global power, where capital is actually moving, and the deep tech and AI systems quietly rewriting the rules for both.",
  authorName: "Steven Bennett",
  authorTitle: "Deep Tech Investor",
  authorBio:
    "Steven spent a decade building startups before becoming a deep tech investor. He writes about the lessons from both sides of the table.",
  // Longer first-person story for the About page, one paragraph per array entry.
  authorStory: [
    "I started my first company in 2015 with no real idea what I was doing, which in hindsight was probably necessary. What followed was a decade of building: shipping products that didn't work until they did, raising money from people who had every reason to say no, and learning the difference between a good idea and a fundable one. By 2019 I was running a second, harder company, one built around genuinely difficult technology rather than a fast go to market. That shift in what I was willing to spend years on turned out to matter more than anything else I learned in the years before it.",
    "Around 2021 I started writing angel checks into founders solving the same category of hard problems I had spent years wrestling with myself. It became clear fairly quickly that this was the work I wanted to do full time, not as a side interest but as the main one. I made that shift official a couple of years later, and I have been backing early stage deep tech founders since: people building in AI infrastructure, robotics, energy systems, and semiconductors, the kind of technology that is slow to build and hard to fake.",
    "This site is where I write down what I am actually thinking, not a polished investment thesis but the working notes behind one. Most of what interests me sits at the intersection of three things. Geopolitics, because the next decade of technology will be shaped as much by trade policy and national security as by venture capital. Finance, because understanding where capital is actually flowing tells you more about the future than any roadmap. And deep tech and AI, because the physical and computational infrastructure being built right now will quietly decide who has real leverage for the next several decades.",
    "I do not think the biggest opportunities are the loudest ones. They tend to be slow, capital intensive, and easy to dismiss until they are not. That is the bet I have made with my own career, and it is the lens this site is written through.",
  ],
  // Files under public/ are always served from the real site root, regardless
  // of which app/ route folder renders them.
  authorPhotoUrl: "/author.jpg",
  url: "http://localhost:3000/blog",
};

// Left empty on purpose — no pre-set categories. The admin adds their own
// from /blog/admin/categories.
export const defaultCategories: { name: string; description: string }[] = [];
