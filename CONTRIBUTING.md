# Contributing

Thanks for considering a contribution to Shree Laxmi Inn's Ayodhya Darshan Guide PWA!

## Getting set up

```bash
git clone https://github.com/MrBoyard7/shree-laxmi-inn-pwa.git
cd shree-laxmi-inn-pwa
npm install
npm run dev
```

No Firebase project is required to develop locally — the app runs in local demo mode by default (see the README's "Getting started" section).

## Before opening a pull request

Please make sure the following all pass locally:

```bash
npm run lint
npm run format:check
npm run test:coverage
npm run build
```

The same checks run in CI on every pull request; a red check will block merging.

## Code style

- Formatting is enforced by Prettier (`npm run format` to auto-fix).
- Linting is enforced by ESLint, including the React Hooks rules — please don't disable a rule without a comment explaining why.
- Keep components small and focused; prefer composing existing components in `src/components/common` over duplicating markup.
- All code, comments, commit messages and documentation should be written in English.

## Commit messages

Please use short, descriptive commit messages in the imperative mood, e.g. `Add opening-hours validation to TempleEditor` rather than `Added stuff`.

## Reporting bugs / requesting features

Please open a GitHub issue with:

- What you expected to happen
- What actually happened (including any console errors)
- Steps to reproduce, if applicable

## Questions

Feel free to open a discussion or issue on the repository — see the author's profile at [github.com/MrBoyard7](https://github.com/MrBoyard7).
