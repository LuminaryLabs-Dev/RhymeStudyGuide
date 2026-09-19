export function validateContent(c) {
  const inspect = object => {
    if (!object || typeof object !== 'object') return;
    for (const [key,value] of Object.entries(object)) {
      if (['private','answerNotes','secret','draft','internalNotes','credentials'].includes(key)) throw Error('Non-public content is prohibited');
      inspect(value);
    }
  };
  inspect(c);
  const slugs = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const collections = ['books','chapters','themes','vocabulary','lessons'];
  for (const name of collections) {
    if (!Array.isArray(c[name])) throw Error(`Missing collection: ${name}`);
    const seen = new Set();
    for (const item of c[name]) {
      if (!slugs.test(item.slug) || seen.has(item.slug)) throw Error(`Invalid or duplicate slug in ${name}: ${item.slug}`);
      seen.add(item.slug);
      if (!item.title) throw Error(`Missing title: ${item.slug}`);
      // This is a public-only repository, not a filter for privately stored records.
      if (item.visibility || item.status || item.private || item.answerNotes) throw Error('Non-public metadata is prohibited in public content');
    }
  }
  const has = (list, slug) => c[list].some(x => x.slug === slug);
  for (const l of c.lessons) {
    if (!has('themes',l.theme) || l.terms.some(t => !has('vocabulary',t))) throw Error(`Broken lesson relation: ${l.slug}`);
  }
  for (const t of c.themes) if (t.terms.some(s=>!has('vocabulary',s))) throw Error(`Broken term: ${t.slug}`);
  for (const v of c.vocabulary) if (v.themes.some(s=>!has('themes',s))) throw Error(`Broken theme: ${v.slug}`);
  for (const p of c.prompts) if (!has('lessons',p.lesson)) throw Error('Broken prompt relation');
  for (const b of c.books) {
    if (b.slug === 'reading-practice') throw Error('Reserved book slug: reading-practice');
    if (b.cover && !b.cover.startsWith(`${c.site.base}assets/`)) throw Error('Cover must be a local public asset');
    if (!b.summary || !b.author || !b.publicationApproved) throw Error(`Book needs approved publication content: ${b.slug}`);
    if (b.themes?.some(t=>!has('themes',t))) throw Error(`Broken book theme: ${b.slug}`);
  }
  for (const ch of c.chapters) if (!has('books',ch.book) || !Number.isFinite(ch.order) || !ch.introduction || !ch.questions?.length) throw Error(`Incomplete chapter: ${ch.slug}`);
  return true;
}
