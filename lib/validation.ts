import { z } from "zod";

export const postStatusValues = ["draft", "published", "scheduled"] as const;

export const postSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200),
    excerpt: z.string().trim().max(500).optional().nullable(),
    contentJson: z.string().min(1, "Content is required"),
    contentHtml: z.string().min(1, "Content is required"),
    // Not .url() — local dev storage returns relative paths like "/uploads/x.png",
    // only Cloudinary returns a full absolute URL.
    coverImageUrl: z.string().trim().min(1).optional().nullable().or(z.literal("")),
    videoUrl: z.string().trim().optional().nullable().or(z.literal("")),
    status: z.enum(postStatusValues),
    publishedAt: z.string().trim().optional().nullable().or(z.literal("")),
    categoryIds: z.array(z.string().min(1)).max(6).optional().default([]),
    tags: z.array(z.string().trim().min(1)).max(10).optional(),
    attachments: z
      .array(
        z.object({
          url: z.string().min(1),
          publicId: z.string().optional().nullable(),
          fileName: z.string().min(1),
          type: z.literal("pdf"),
        })
      )
      .optional(),
  })
  .refine((data) => data.status === "draft" || data.categoryIds.length > 0, {
    message: "Pick at least one category before publishing.",
    path: ["categoryIds"],
  });

export type PostInput = z.infer<typeof postSchema>;

export const commentSchema = z.object({
  postId: z.string().min(1),
  authorName: z.string().trim().min(1, "Name is required").max(60),
  authorEmail: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  body: z.string().trim().min(2, "Comment is too short").max(2000),
  // Honeypot: real visitors never see or fill this field. Checked manually
  // (not enforced here) so a bot that fills it gets a fake success instead
  // of an error that would help it detect the trap.
  companyWebsite: z.string().optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  description: z.string().trim().max(300).optional().nullable(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const resourceTypeValues = ["book", "magazine", "course", "podcast", "article", "tool"] as const;

export const resourceSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  type: z.enum(resourceTypeValues),
  creator: z.string().trim().max(150).optional().nullable(),
  url: z.string().trim().url("Needs to be a full URL, e.g. https://…"),
  coverImageUrl: z.string().trim().min(1).optional().nullable().or(z.literal("")),
  description: z.string().trim().max(500).optional().nullable(),
  featured: z.boolean().optional(),
});

export type ResourceInput = z.infer<typeof resourceSchema>;

export const subscribeSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  source: z.string().trim().max(40).optional(),
  // Honeypot — see commentSchema for why this isn't enforced here.
  companyWebsite: z.string().optional(),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
