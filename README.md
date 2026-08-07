# Efeito Web

Site institucional imersivo da Efeito Web, construído com Next.js, Vinext,
React, GSAP e Cloudflare Workers.

## Requisitos

- Node.js 22
- npm, usando o `package-lock.json` versionado

## Desenvolvimento

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

O build gera o Worker em `dist/server/index.js`, os arquivos estáticos em
`dist/client` e um manifesto mínimo de compatibilidade dentro de `dist`. A
compilação não depende de arquivos ocultos presentes no código-fonte.

Os scripts chamam outros arquivos `.sh` por meio de `bash`, então o build
continua funcionando depois de um clone feito no Windows mesmo quando as
permissões executáveis não são preservadas.

## Cloudflare

Configuração recomendada no painel:

- Production branch: `main`
- Root directory: `/`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Node.js: `22`

Para simular a implantação sem publicar:

```bash
npm run build
npx wrangler deploy --dry-run
```

O `wrangler.jsonc` aponta para o Worker compilado e publica `dist/client` como
assets estáticos. O projeto não utiliza D1 ou R2.

## GitHub

O conteúdo do ZIP de entrega deve ser colocado diretamente na raiz do
repositório. A pasta `.openai` não faz parte da exportação e não é necessária
para instalar, compilar ou publicar o projeto.

Arquivos locais e artefatos de build já estão protegidos pelo `.gitignore`,
incluindo `node_modules`, `dist`, `.next`, `.vinext`, `.wrangler`,
`.sites-runtime`, arquivos `.env`, `outputs` e `work`.

## Ícones

A identidade usada no cabeçalho foi adaptada para favicon, Apple Touch Icon e
ícones PWA. O manifesto público está em `public/site.webmanifest`, e os
metadados em `app/layout.tsx` referenciam todas as variações necessárias.
