# Orion Decor - Gerador de Páginas de Produto

Arquitetura criada para gerar páginas de produto a partir de `data/products.json` usando templates simples.

Como usar:

1. Coloque as imagens em `assets/images/products/<categoria>/` com os nomes declarados em `data/products.json`.
2. Instale Node.js (se ainda não tiver).
3. Execute:

```bash
node generate.js
```

Isso irá gerar páginas em `produtos/<categoria>/<slug>.html` e `produtos/<categoria>/index.html`.

Quer que eu rode o gerador aqui e verifique a saída?