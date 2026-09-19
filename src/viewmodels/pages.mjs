import {volumes} from '../content/volumes.mjs';
export function createPageModels(repo) {
  const link = route => repo.site.base + route.replace(/^\//,'');
  const lessonCard = l => ({...l, href:link(`study-guide/reading-practice/${l.slug}/`)});
  const themeCard = t => ({...t,href:link(`themes/${t.slug}/`)});
  const termCard = t => ({...t,href:link(`vocabulary/${t.slug}/`)});
  const bookCard = b => ({...b,href:link(`books/${b.slug}/`),guideHref:link(`study-guide/${b.slug}/`)});
  const lessons = repo.all('lessons').map(lessonCard);
  const themes = repo.all('themes').map(themeCard);
  const terms = repo.all('vocabulary').map(termCard).sort((a,b)=>a.title.localeCompare(b.title));
  const books = repo.all('books').map(bookCard);
  const shared = { site:repo.site, link, lessons, themes, terms, books };
  const page = (route,kind,title,description,data={}) => ({...shared,route,kind,title,description,...data});
  const pages = [
    page('','home','A little curiosity. A deeper reading.','Explore Dylan’s Books through close reading, meaningful questions, themes, and conversation.'),
    page('books/','books','Every book is a beginning.','Discover Dylan’s Books and find a path into reading.'),
    page('study-guide/','study','Read. Notice. Discover.','A guided way to look closer, connect ideas, and reflect on your reading.'),
    page('study-guide/reading-practice/','practice','The art of looking closer.','Three short reading activities to use with any book you have with you.'),
    page('themes/','themes','Follow an idea.','Explore belonging, change, and perspective as lenses for your own reading.'),
    page('vocabulary/','vocabulary','Words open worlds.','A small companion to the language of reading: definitions, examples, and questions.'),
    page('discussion/','discussion','Good questions bring us together.','Thoughtful prompts for reading groups, classrooms, and conversations.',{prompts:repo.all('prompts')}),
    page('resources/','resources','Take your curiosity with you.','Printable reading and discussion sheets for a book, a group, or a quiet afternoon.'),
    page('resources/reading-sheet/','worksheet','A closer-reading notebook.','A printable worksheet for details, questions, connections, and reflection.'),
    page('resources/discussion-sheet/','discussion-sheet','A conversation worth having.','A printable discussion guide for your next reading conversation.',{prompts:repo.all('prompts')}),
    page('about/','about','A place for curious readers.','Learn about Dylan’s Books and the Rhyme Study Guide.'),
    page('about/author/','author','Meet Dylan.','The author behind Dylan’s Books.',{author:repo.author}),
    page('about/project/','project','More than finishing a chapter.','Discover the purpose of Rhyme Study Guide and how to use the reading materials.'),
    page('404.html','not-found','A small detour.','This page could not be found. Find your way back to a good beginning.')
  ];
  for (const [i,l] of lessons.entries()) pages.push(page(`study-guide/reading-practice/${l.slug}/`,'lesson',l.title,l.introduction,{lesson:l,previous:lessons[i-1]??null,next:lessons[i+1]??null,relatedThemes:themes.filter(t=>t.slug===l.theme),relatedTerms:terms.filter(t=>l.terms.includes(t.slug))}));
  for (const t of themes) pages.push(page(`themes/${t.slug}/`,'theme',t.title,t.description,{theme:t,relatedLessons:repo.lessonsForTheme(t.slug).map(lessonCard),relatedBooks:repo.booksForTheme(t.slug).map(bookCard),relatedTerms:terms.filter(v=>t.terms.includes(v.slug))}));
  for (const t of terms) pages.push(page(`vocabulary/${t.slug}/`,'term',t.title,t.definition,{term:t,relatedThemes:themes.filter(x=>t.themes.includes(x.slug))}));
  for (const b of books) {
    const chapters=repo.chapters(b.slug).map(c=>({...c,href:link(`study-guide/${b.slug}/${c.slug}/`),discussionHref:link(`discussion/${b.slug}/${c.slug}/`)}));
    pages.push(page(`books/${b.slug}/`,'book',b.title,b.summary,{book:b,chapters}));
    pages.push(page(`study-guide/${b.slug}/`,'book-guide',b.title,`Explore ${b.title} with guided questions.`,{book:b,chapters}));
    for (const [i,ch] of chapters.entries()) {
      pages.push(page(`study-guide/${b.slug}/${ch.slug}/`,'chapter',ch.title,ch.introduction,{book:b,chapter:ch,previous:chapters[i-1]??null,next:chapters[i+1]??null}));
      pages.push(page(`discussion/${b.slug}/${ch.slug}/`,'chapter-discussion',ch.title,ch.introduction,{book:b,chapter:ch}));
    }
  }
  for(const volume of volumes)pages.push(page(volume.route,'volume',`${volume.title} — ${volume.focus}`,volume.summary,{volumeId:volume.id}));
  if(new Set(pages.map(p=>p.route)).size!==pages.length)throw Error('Duplicate generated route');
  return pages;
}
