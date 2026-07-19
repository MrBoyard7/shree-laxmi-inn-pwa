# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-17

### Added

- Initial release: guest-facing PWA (Home, Ayodhya Darshan Guide, Temple Detail, Darshan Routes, Guesthouse Information, Emergency Contacts) and an Admin Panel (temples, routes, guesthouse info, emergency contacts, photo upload).
- Firebase-backed data layer (Firestore, Auth, Storage) with an automatic local demo-data fallback that requires no setup.
- PWA support: web manifest, generated icon set, offline caching via Workbox.
- Unit and component tests (Vitest + React Testing Library) with coverage reporting.
- ESLint + Prettier configuration, GitHub Actions CI, and Codecov integration.
