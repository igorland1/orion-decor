const fs = require('fs').promises;
const path = require('path');

async function loadJSON(p) {
  const txt = await fs.readFile(p, 'utf8');
  return JSON.parse(txt);
}

function buildImageTags(category, images, alt) {
  return images.map(img => {
    const src = path.posix.join('/assets/images/products', category, img);
    return `<img src="${src}" alt="${alt}" loading="lazy">`;
  }).join('\n');
}

async function generate() {
  const workspaceRoot = __dirname;
  const dataPath = path.join(workspaceRoot, 'data', 'products.json');
  const tplPath = path.join(workspaceRoot, 'templates', 'product.html');
  const headerPath = path.join(workspaceRoot, 'templates', 'partials', 'header.html');
  const footerPath = path.join(workspaceRoot, 'templates', 'partials', 'footer.html');

  const [products, tplRaw, headerRaw, footerRaw] = await Promise.all([
    loadJSON(dataPath),
    fs.readFile(tplPath, 'utf8'),
    fs.readFile(headerPath, 'utf8'),
    fs.readFile(footerPath, 'utf8')
  ]);

  for (const p of products) {
    const categoryDir = path.join(workspaceRoot, 'produtos', p.category);
    await fs.mkdir(categoryDir, { recursive: true });
    const outPath = path.join(categoryDir, `${p.slug}.html`);

    const imagesHtml = buildImageTags(p.category, p.images, p.title);

    let html = tplRaw
      .replace('%%HEADER%%', headerRaw)
      .replace('%%FOOTER%%', footerRaw)
      .replace('%%TITLE%%', p.title)
      .replace(/%%CATEGORY%%/g, p.category)
      .replace('%%PRICE%%', p.price.toFixed(2))
      .replace('%%DESCRIPTION%%', p.description)
      .replace('%%IMAGES_HTML%%', imagesHtml);

    await fs.writeFile(outPath, html, 'utf8');
    console.log('Generated', outPath);
  }

  // Optionally generate category indexes
  const categories = [...new Set(products.map(p => p.category))];
  for (const cat of categories) {
    const catDir = path.join(workspaceRoot, 'produtos', cat);
    const catIndexPath = path.join(catDir, 'index.html');
    const items = products.filter(p => p.category === cat).map(p => `- <a href="./${p.slug}.html">${p.title}</a>`).join('\n');
    const catHtml = `${headerRaw}\n  <h1>Categoria: ${cat}</h1>\n  <ul>\n${items}\n  </ul>\n${footerRaw}`;
    await fs.writeFile(catIndexPath, catHtml, 'utf8');
    console.log('Written category index', catIndexPath);
  }
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
