# Codedrift [Posts](https://codedrift.com/thunked) | [AMA](https://github.com/jakobo/codedrift/discussions/categories/ask-me-anything-ama)

Personal Website of Jakob Heuser, available at https://codedrift.com

# Stack

- Site is a [next.js](https://nextjs.org/) app, deployed on [Vercel](https://vercel.com)
  - It leverages `getStaticProps` where possible, falling back to `getInitialProps` where there's large amounts of data access
  - A [GraphQL Proxy](https://github.com/jakobo/codedrift/blob/main/pages/api/proxy/api.github.com/graphql.ts) connects to GitHub which doubles as a CMS
- [Tailwind](https://tailwindcss.com/) is used for the styling
- There's eslint, commitlint, and conventional commit running via Husky, because I'd rather be annoyed on `git-commit` than several months later
- It's in Typescript, because I want to get better at typing things

# Developing

1. `pnpm dev`

# Outstanding Issues

This is a rough list of things I'd like to do

- [ ] Go digging for old posts from LinkedIn/Medium/Felocity.org

You could file bugs. They'll be triaged. I file bugs against myself, if only so I remember something's broken.
