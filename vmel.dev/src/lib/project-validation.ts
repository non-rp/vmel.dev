import { z } from 'zod';

const optionalUrl = z.union([z.literal(''), z.url().max(500).refine((value) => value.startsWith('https://'), 'Use an HTTPS URL')]).transform((value) => value || null);

export const projectInput = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens'),
  title: z.string().trim().min(3).max(100),
  summary: z.string().trim().min(10).max(400),
  body: z.string().trim().min(10).max(20000),
  technologies: z.array(z.string().trim().min(1).max(40)).max(20),
  kind: z.enum(['commercial', 'personal']),
  status: z.enum(['draft', 'published']),
  sortOrder: z.number().int().min(0).max(10000),
  demoUrl: optionalUrl,
  repositoryUrl: optionalUrl,
}).strict().superRefine((value, context) => {
  if (value.kind === 'commercial' && (value.demoUrl || value.repositoryUrl)) {
    context.addIssue({ code: 'custom', message: 'Commercial cases currently stay anonymized; leave public links empty', path: ['demoUrl'] });
  }
});

export const reorderInput = z.object({ ids: z.array(z.uuid()).min(1).max(200) }).strict()
  .refine(({ ids }) => new Set(ids).size === ids.length, 'Project IDs must be unique');

export const publicProjectSchema = z.object({
  id: z.uuid(), slug: z.string(), title: z.string(), summary: z.string(), body: z.string(),
  technologies: z.array(z.string()), kind: z.enum(['commercial', 'personal']),
  demoUrl: z.string().nullable(), repositoryUrl: z.string().nullable(),
});

export type PublicProject = z.infer<typeof publicProjectSchema>;
