# Fuel Management — Frontend (Angular)

<!-- Badges -->

[![Angular](https://img.shields.io/badge/Angular-22.2-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-4.6-purple?logo=bootstrap&logoColor=white)](https://getbootstrap.com/docs/4.6/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-red?logo=rxjs&logoColor=white)](https://rxjs.dev/)
[![jQuery](https://img.shields.io/badge/jQuery-3.7-lightgrey?logo=jquery&logoColor=blue)](https://jquery.com/)
[![Popper.js](https://img.shields.io/badge/Popper.js-1.16-orange?logo=popper.js&logoColor=white)](https://popper.js.org/)

[![Vitest](https://img.shields.io/badge/Vitest-unit%20tests-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-angular--eslint-4B32C3?logo=eslint&logoColor=white)](https://github.com/angular-eslint/angular-eslint)


A polished frontend application for Fuel Management built with Angular 22.

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

This project uses the Angular CLI (v22) and provides the frontend for a Fuel Management system. It includes standalone components, routing, and styling using Bootstrap.


## Technologies

This repository uses the following primary technologies (badges above):

- Angular 22 (Angular CLI, standalone components)
- TypeScript (strict mode)
- RxJS
- Bootstrap 4
- jQuery and Popper.js (required by Bootstrap 4's JavaScript, e.g. the collapsible navbar)

Developer / testing tools included as devDependencies:

- Vitest with jsdom (unit tests)
- ESLint with angular-eslint (linting)


## Prerequisites

- Node.js `^22.22.3`, `^24.15.0` or `>=26.0.0` (required by Angular CLI 22)
- npm (comes with Node.js)
- Angular CLI (optional, but helpful): install globally with `npm i -g @angular/cli@22`


## Getting started

1. Clone the repository (after renaming, use the new repo name):

   git clone https://github.com/sagarworlds/fuel-management-frontend.git
   cd fuel-management-frontend

2. Install dependencies:

   npm install

3. Run the development server:

   npm start

   The app will be served at http://localhost:4200 and will reload on changes.

4. Create an account on the Register page, or sign in with an existing one. Every page except Log in and Register requires a signed-in user.


## Authentication

The app signs in through the Web API's `POST User/Login`, which returns a JWT. The token is kept in `localStorage` until it expires or you log out.

- `src/app/auth/auth.service.ts` — signs in and out and holds the session.
- `src/app/auth/auth.interceptor.ts` — adds `Authorization: Bearer <token>` to requests for `environment.APIBaseURL` only. If the API answers 401, it signs out and returns to the login page.
- `src/app/auth/auth.guard.ts` — sends signed-out users to `/login?returnUrl=…`, and back to that page after sign-in.

The API takes the user from the token, so the app never sends a user id.

- `src/app/account/` — the Register page (creates the account, then signs in) and the Change password page. After a password change, the API rejects every earlier token and returns a new one, which the app switches to; other devices are signed out.


## Deploying to IIS

`public/web.config` is copied into the build output. It rewrites app routes such as `/list` to `/index.html`, so refreshing a page or opening a link to it works. It needs the IIS URL Rewrite module.

- The build expects to be served from the site root.
- To use a sub-folder, build with `--base-href /folder/` and change the rewrite target to `/folder/index.html`.
- The rules aren't inherited by IIS applications nested under the site, such as the Web API at `/API`.


## Scripts

The repository exposes the usual Angular CLI scripts via npm:

- `npm start` — runs `ng serve` (development server)
- `npm run build` — builds the app (production configuration) into `dist/FuelManagementAngular/browser/`
- `npm run watch` — rebuilds the development configuration on changes
- `npm test` — runs unit tests with Vitest (`npm test -- --watch=false` for a single run)
- `npm run lint` — runs ESLint


## Project structure (high level)

- src/app/ — main Angular application code (components, services, pipes, routes and `app.config.ts`)
- src/environments/ — environment configs (`environment.prod.ts` replaces `environment.ts` in production builds)
- public/ — static files copied as-is into the build output (favicon, IIS `web.config`)


## Tests

- Unit tests: `npm test` (Vitest)


## Contributing

Contributions are welcome. To contribute:

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request describing your change

Include clear commit messages and a description of the problem your change solves.
