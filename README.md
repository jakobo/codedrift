# Code Drift

Personal Website of Jakob Heuser, available at https://codedrift.com

# Stack

- Site is a [next.js](https://nextjs.org/) app, deployed on [Vercel](https://vercel.com)
  - It uses [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration) to minimize client load times
  - A GraphQL endpoint under `/api` is available for non-critical path items (hello, webmentions), powered by [Apollo Micro](https://www.apollographql.com/docs/apollo-server/v1/servers/micro/). It's also reused in Incremental Static Regeneration. Kind of.
- Content is developed in [ghost](https://ghost.org), though its origins are often my [Working Notes](https://coda.io/d/Jakobs-Notes_dFBvQLDXnR5/Home_suijF)
  - A [rehype](https://github.com/rehypejs/rehype) plugin chain takes HTML content from Ghost (and webmentions) and turns it into safe React friendly elements
- [Tailwind](https://tailwindcss.com/) is used for the styling
- There's eslint, commitlint, and conventional commit running via Husky, because I'd rather be annoyed on `git-commit` than several months later
- It's not in Typescript. I'm not ready to throw myself at that yet, as I'm currently absorbing everything I can about React Native

# Developing

1. `yarn dev`

# Developing in WSL2

I use windows. It has its upsides. These would be the downsides. There is no _good_ way to get a functional pupeteer instance inside of WSL. I tried for a couple afternoons before I settled for YOLOing.

# Outstanding Issues

You could file bugs. Chances are they'll be triaged. There's a wishlist of things I'm tracking in my [Code Drift Working Notes](https://coda.io/d/Jakobs-Notes_dFBvQLDXnR5/CodeDrift_suuaz#_lutQ7)

# License

- [Posts (UNLICENSED)](./LICENSE-posts)
- [Snippets in Posts (MIT)](./LICENSE-posts)
- [Website (MIT)](./LICENSE-website)
