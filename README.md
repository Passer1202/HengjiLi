# Hengji Li — Academic Homepage

The source for [Hengji Li's academic homepage](https://passer1202.github.io/HengjiLi/).

This version is directly adapted from [jiangyy/jiangyy.github.io at `caebe1d`](https://github.com/jiangyy/jiangyy.github.io/tree/caebe1d07f0029a2e5a16d508727308f747f27eb): it uses the upstream xterm.js terminal, Markdown content compiler, shell commands, typography, and screen-clearing page navigation. Hengji's content and GitHub Pages configuration are maintained here. The reference repository did not include a license file when this adaptation was made; this repository does not assert a license over its upstream code.

The bundled Maple Mono font comes from the [Maple Mono project](https://github.com/42willow/maple-mono) and is under the [SIL Open Font License 1.1](https://openfontlicense.org/).

## Local development

Install with `npm ci`, run `npm run dev`, and open the local URL shown by Vite. `npm run build` compiles the Markdown documents and produces `dist/` for GitHub Pages. `npm test` and `npm run typecheck` verify the shell and content compiler.

Edit the profile pages in `content/`. The shell runtime is in `src/`, and the font and visual styles are in `public/`.

Commits to `main` build and deploy the site through `.github/workflows/pages.yml` to the `/HengjiLi/` project path.

