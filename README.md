# Fuel Management — Frontend (Angular)

<!-- Badges -->

[![Angular](https://img.shields.io/badge/Angular-7.2.0-DD0031?logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3.2-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-4.3.1-purple?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![RxJS](https://img.shields.io/badge/RxJS-6.3.3-red?logo=rxjs&logoColor=white)](https://rxjs.dev/)
[![jQuery](https://img.shields.io/badge/jQuery-3.4.1-lightgrey?logo=jquery&logoColor=blue)](https://jquery.com/)
[![Popper.js](https://img.shields.io/badge/Popper.js-1.15.0-orange?logo=popper.js&logoColor=white)](https://popper.js.org/)

[![Karma](https://img.shields.io/badge/Karma-test-orange?logo=karma&logoColor=white)](https://karma-runner.github.io)
[![Jasmine](https://img.shields.io/badge/Jasmine-specs-green?logo=jasmine&logoColor=white)](https://jasmine.github.io/)
[![Protractor](https://img.shields.io/badge/Protractor-e2e-blue?logo=protractor&logoColor=white)](http://www.protractortest.org/)


A polished frontend application for Fuel Management built with Angular 7.

Recommended repository name: `fuel-management-frontend`

## Table of contents

- About
- Demo / Screenshots (optional)
- Technologies
- Prerequisites
- Getting started
- Scripts
- Project structure
- Tests
- Contributing
- Renaming this repository


## About

This project was generated with the Angular CLI (v7.3.8) and provides the frontend for a Fuel Management system. It includes components, routing, and styling using Bootstrap.


## Technologies

This repository uses the following primary technologies (badges above):

- Angular 7 (Angular CLI)
- TypeScript
- RxJS
- Bootstrap 4
- jQuery
- Popper.js

Developer / testing tools included as devDependencies:

- Karma (unit tests)
- Jasmine (test framework)
- Protractor (end-to-end tests)
- TSLint / Codelyzer


## Prerequisites

- Node.js (v8+ recommended for Angular 7)
- npm (comes with Node.js)
- Angular CLI (optional, but helpful): install globally with `npm i -g @angular/cli@7`


## Getting started

1. Clone the repository (after renaming, use the new repo name):

   git clone https://github.com/sagarworlds/fuel-management-frontend.git
   cd fuel-management-frontend

2. Install dependencies:

   npm install

3. Run the development server:

   npm start

   The app will be served at http://localhost:4200 and will reload on changes.


## Scripts

The repository exposes the usual Angular CLI scripts via npm:

- `npm start` — runs `ng serve` (development server)
- `npm run build` — builds the app into the `dist/` folder
- `npm test` — runs unit tests with Karma + Jasmine
- `npm run e2e` — runs end-to-end tests with Protractor
- `npm run lint` — runs TSLint


## Project structure (high level)

- src/app/ — main Angular application code (components, services, modules)
- src/assets/ — static assets (images, styles)
- src/environments/ — environment configs


## Tests

- Unit tests: `npm test` (Karma + Jasmine)
- E2E tests: `npm run e2e` (Protractor)


## Contributing

Contributions are welcome. To contribute:

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request describing your change

Include clear commit messages and a description of the problem your change solves.


## Renaming this repository

I cannot rename the GitHub repository directly from this assistant, but I've updated this README to use the recommended professional name `fuel-management-frontend`.

To rename the repository yourself on GitHub (web UI):

1. Go to the repository on GitHub: https://github.com/sagarworlds/FuelManagementAngular
2. Click Settings → Repository name
3. Enter the new name `fuel-management-frontend` and click Rename

After renaming, update your local clone's remote URL:

   git remote set-url origin https://github.com/sagarworlds/fuel-management-frontend.git

Or rename via the GitHub CLI:

   gh repo rename sagarworlds/FuelManagementAngular --name fuel-management-frontend

Or use the REST API (authenticated PATCH):

   curl -X PATCH -H "Authorization: token <YOUR_TOKEN>" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/repos/sagarworlds/FuelManagementAngular \
     -d '{"name":"fuel-management-frontend"}'


---

If you'd like a different repository name, tell me which one (or pick from these suggestions) and I will update the README accordingly:

- `fuel-management-frontend` (recommended)
- `fuel-management-ui`
- `fuelops-frontend`
- `fuel-management-dashboard`

If you want, I can also create a GitHub Issue suggesting the rename or update other files (package.json, app metadata) to match the new name — tell me which you'd like next.
