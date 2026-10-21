export type StoryBlock = { kind: 'paragraph' | 'list'; items: string[] };
export type StorySection = { title: string; blocks: StoryBlock[] };

export function parseCaseStory(body: string): StorySection[] {
  const chapters = body.trim().split(/(?=^## )/m).filter(Boolean);
  return chapters.map((chapter) => {
    const lines = chapter.trim().split('\n');
    const titled = lines[0].startsWith('## ');
    const title = titled ? lines.shift()!.slice(3).trim() : 'The work';
    const blocks = lines.join('\n').trim().split(/\n\s*\n/).filter(Boolean).map((block): StoryBlock => {
      const items = block.split('\n').map((line) => line.trim());
      return items.every((line) => line.startsWith('- '))
        ? { kind: 'list', items: items.map((line) => line.slice(2)) }
        : { kind: 'paragraph', items: [block.trim()] };
    });
    return { title, blocks };
  });
}
