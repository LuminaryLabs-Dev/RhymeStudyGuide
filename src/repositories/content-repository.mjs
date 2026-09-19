import { validateContent } from '../models/validate.mjs';
export function createRepository(content) {
  validateContent(content);
  const find = (type, slug) => content[type].find(item => item.slug === slug) ?? null;
  return {
    site: content.site, author: content.author,
    all: type => [...content[type]], find,
    chapters: book => content.chapters.filter(c=>c.book===book).sort((a,b)=>a.order-b.order),
    lessonsForTheme: slug => content.lessons.filter(l=>l.theme===slug),
    booksForTheme: slug => content.books.filter(b=>b.themes?.includes(slug)),
    promptsForLesson: slug => content.prompts.filter(p=>p.lesson===slug)
  };
}
