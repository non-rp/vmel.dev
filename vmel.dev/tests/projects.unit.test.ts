import { describe, expect, it } from 'vitest';
import { projectInput, reorderInput } from '../src/lib/project-validation';

const valid = {
  slug: 'content-platform', title: 'Content platform migration', summary: 'A clear summary of the engineering work.',
  body: 'Problem and responsibilities.\n\nThe decisions and verified outcome.',
  technologies: ['Next.js', 'PostgreSQL'], kind: 'commercial', status: 'draft', sortOrder: 0,
  demoUrl: '', repositoryUrl: '',
};

describe('project publication boundaries', () => {
  it('normalizes empty links and accepts an anonymized commercial draft', () => {
    expect(projectInput.parse(valid).demoUrl).toBeNull();
  });
  it('rejects identifying links on commercial cases', () => {
    expect(projectInput.safeParse({ ...valid, demoUrl: 'https://client.example' }).success).toBe(false);
  });
  it('accepts HTTPS links for personal projects but rejects executable URLs', () => {
    expect(projectInput.safeParse({ ...valid, kind: 'personal', demoUrl: 'https://demo.example' }).success).toBe(true);
    expect(projectInput.safeParse({ ...valid, kind: 'personal', demoUrl: 'javascript:alert(1)' }).success).toBe(false);
  });
  it('rejects path-like slugs, unexpected properties and empty copy', () => {
    expect(projectInput.safeParse({ ...valid, slug: '../admin' }).success).toBe(false);
    expect(projectInput.safeParse({ ...valid, ownerRole: 'admin' }).success).toBe(false);
    expect(projectInput.safeParse({ ...valid, body: '' }).success).toBe(false);
  });
  it('does not silently coerce fractional or negative ordering values', () => {
    expect(projectInput.safeParse({ ...valid, sortOrder: -1 }).success).toBe(false);
    expect(projectInput.safeParse({ ...valid, sortOrder: 1.5 }).success).toBe(false);
  });
  it('rejects duplicate IDs in a reorder operation', () => {
    const id = 'e090540a-278b-40af-9d3f-ea975314ba3c';
    expect(reorderInput.safeParse({ ids: [id, id] }).success).toBe(false);
    expect(reorderInput.safeParse({ ids: [id] }).success).toBe(true);
  });
});
