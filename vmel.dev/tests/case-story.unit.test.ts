import { describe, expect, it } from 'vitest';
import { parseCaseStory } from '../src/lib/case-story';

describe('case study chapters', () => {
  it('keeps headings, paragraphs and bullet lists as escaped text blocks', () => {
    expect(parseCaseStory('## Decision\nFirst paragraph.\n\n- One\n- Two\n\n## Result\nThe outcome.')).toEqual([
      { title: 'Decision', blocks: [{ kind: 'paragraph', items: ['First paragraph.'] }, { kind: 'list', items: ['One', 'Two'] }] },
      { title: 'Result', blocks: [{ kind: 'paragraph', items: ['The outcome.'] }] },
    ]);
  });

  it('still renders older unheaded project descriptions', () => {
    expect(parseCaseStory('A paragraph.\n\nAnother paragraph.')).toEqual([
      { title: 'The work', blocks: [{ kind: 'paragraph', items: ['A paragraph.'] }, { kind: 'paragraph', items: ['Another paragraph.'] }] },
    ]);
  });
});
