# Codedrift [Posts](https://codedrift.com/thunked) | [AMA](https://github.com/jakobo/codedrift/discussions/categories/ask-me-anything-ama)

Personal Website of Jakob Heuser, available at https://codedrift.com

# Stack

- Site is a [next.js](https://nextjs.org/) app, deployed on [Vercel](https://vercel.com)
  - It leverages `getStaticProps` where possible, falling back to `getInitialProps` where there's large amounts of data access
  - A [GraphQL Proxy](https://github.com/jakobo/codedrift/blob/main/src/pages/api/proxy/api.github.com/graphql.ts) connects to GitHub which doubles as a CMS
- [Tailwind](https://tailwindcss.com/) is used for the styling
- There's eslint, commitlint, and conventional commit running via Husky, because I'd rather be annoyed on `git-commit` than several months later
- It's in Typescript, because I want to get better at typing things

# Developing

1. `yarn dev`

# Developing in WSL2

I use windows. It has its upsides. These would be the downsides. There is no _good_ way to get a functional pupeteer instance inside of WSL. I tried for a couple afternoons before I settled for YOLOing. I'll probably create a `vnext` URL if I ever need to attempt these shenanigans again.

# Outstanding Issues
This is a roughly current list of big ticket feature items I'd like to do
* [ ] Expose post revision data (`changelog` in frontmatter)
* [ ] Add a section for mentoring, coaching, advising, & investing
* [ ] Go digging for old posts from LinkedIn/Medium/Felocity.org
* [ ] Explore bringing github comments into the webmentions area on individual posts
