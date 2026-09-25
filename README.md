# Fuel Management — Web Client

[![Angular](https://img.shields.io/badge/Angular-22.2-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-4.6-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/docs/4.6/)
[![Tests](https://img.shields.io/badge/tests-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

The browser application for **Fuel Management**. Users record vehicle fill-ups and see their monthly spend, fuel volume, mileage and distance. It is a single-page Angular application that talks to the [Fuel Management Web API](https://github.com/sagarworlds/FuelManagementWebAPI).

## Contents

- [Features](#features)
- [Technology](#technology)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Available scripts](#available-scripts)
- [Application structure](#application-structure)
- [Authentication and security](#authentication-and-security)
- [Testing and code quality](#testing-and-code-quality)
- [Building and deploying](#building-and-deploying)
- [Development notes](#development-notes)

## Features

- **Accounts:** register, sign in, sign out and change password. After a password change, other devices are signed out while the current session continues.
- **Dashboard:** choose a month and year to see:
  - total spend
  - fuel added
  - mileage (km/l)
  - distance travelled since the previous fill-up
- **Record a fill-up:** a form with validation that matches the API's rules, and clear success and error messages.
- **History:** every recorded fill-up, newest first.
- **Session handling:** protected pages redirect to sign-in and return afterwards. An expired or revoked session sends the user back to the sign-in page.

## Technology

| Area | Choice |
| --- | --- |
| Framework | Angular 22.2 (standalone components, built-in control flow) |
| Language | TypeScript 6.0 in strict mode, with strict template checking |
| Reactive programming | RxJS 7.8; Angular signals for session and form state |
| UI | Bootstrap 4.6 (with jQuery 3.7 and Popper.js 1.16 for its interactive components) |
| Unit tests | Vitest with jsdom (Angular CLI unit-test builder) |
| Linting | ESLint with angular-eslint |
| Build | Angular CLI application builder (esbuild) |

## Getting started

### Prerequisites

- **Node.js** `^22.22.3`, `^24.15.0` or `>=26.0.0`, as required by Angular CLI 22. npm is included.
- **A running instance of the Web API.** See its [README](https://github.com/sagarworlds/FuelManagementWebAPI#getting-started).

### Install and run

```bash
git clone https://github.com/sagarworlds/FuelManagementAngular.git
cd FuelManagementAngular
npm ci
npm start
```

The development server runs at `http://localhost:4200` and reloads on changes. Create an account on the **Register** page, or sign in with an existing one. Every page except **Log in** and **Register** requires a signed-in user.

## Configuration

The API address is set per build configuration:

| File | Used by | Setting |
| --- | --- | --- |
| `src/environments/environment.ts` | `npm start`, development builds | `APIBaseURL` |
| `src/environments/environment.prod.ts` | `npm run build` (production) | `APIBaseURL` |

Both default to `http://localhost/API/api`, which assumes the Web API is hosted in IIS as the `/API` application on the same machine. Change the production value to wherever the API is deployed.

When the app and the API are served from different origins, the API must list the app's origin in its `AllowedOrigins` setting. The development server (`http://localhost:4200`) is allowed by default.

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the development server (`ng serve`). |
| `npm run build` | Production build into `dist/FuelManagementAngular/browser/`. |
| `npm run watch` | Rebuild the development configuration on every change. |
| `npm test` | Run the unit tests in watch mode; use `npm test -- --watch=false` for a single run. |
| `npm run lint` | Lint TypeScript and templates with ESLint. |

## Application structure

```text
src/
├── app/
│   ├── account/            AccountService, Register and Change password pages
│   ├── auth/               AuthService (session), authGuard, authInterceptor
│   ├── fuel/               Dashboard (fuel-home), Add (fuel-add), History (fuel-list), model and FuelService
│   ├── login/              Sign-in page
│   ├── pipe/               OrderByPipe (sorting for the history table)
│   ├── shared/             API error messages, date conversion, password validators
│   ├── app.config.ts       Application providers (router, HTTP client with the auth interceptor)
│   └── app.routes.ts       Route table
├── environments/           API address per build configuration
└── styles.css              Global styles
public/                     Copied as-is into the build: favicon and the IIS web.config
```

### Routes

| Path | Page | Access |
| --- | --- | --- |
| `/login` | Sign in | Public |
| `/register` | Create an account | Public |
| `/`, `/home` | Dashboard | Signed in |
| `/add` | Record a fill-up | Signed in |
| `/list` | Fill-up history | Signed in |
| `/account/password` | Change password | Signed in |

## Authentication and security

- **Sign-in:** `AuthService` exchanges the email and password for a JWT from the API. It keeps the session (token, expiry, user) in a signal and persists it in `localStorage` until it expires or the user signs out.
- **Requests:** `authInterceptor` adds `Authorization: Bearer <token>` only to requests for `environment.APIBaseURL`, so the token is never sent to other hosts. If the API answers `401` to a request that carried a token, the interceptor ends the session and opens the sign-in page.
- **Routing:** `authGuard` protects every page except sign-in and registration. After sign-in, the user returns to the page they requested. Only paths within the app are accepted as return addresses, which prevents redirects to other sites.
- **Password changes:** the API revokes every earlier token and returns a new one, which the app switches to immediately.
- **No user id from the client:** the API derives the user from the token, so the app never sends a user id.
- **Stored token:** because the token is kept in `localStorage`, any script injected into the page could read it. Keep third-party scripts to a minimum and serve the app over HTTPS in production.

## Testing and code quality

Unit tests cover:
- the authentication service, guard and interceptor
- the sign-in, registration and change-password pages
- the dashboard calculations, including months without an earlier fill-up
- form validation, API error handling and date conversion
- the HTTP services

```bash
npm test -- --watch=false   # unit tests
npm run lint                # ESLint
npm run build               # production build, which also type-checks templates
```

## Building and deploying

`npm run build` writes a production build to `dist/FuelManagementAngular/browser/`. To host it on IIS:

1. **Install the IIS URL Rewrite module.**
2. **Copy the contents of the build folder to the site's root.** The build expects to be served from `/`. To host it in a sub-folder, build with `ng build --base-href /folder/` and change the rewrite target in `web.config` to `/folder/index.html`.
3. **Include `web.config`.** It comes with the build and rewrites application routes such as `/list` to `/index.html`, so refreshing a page or opening a link to it works. Existing files are served as usual. The rules aren't inherited by IIS applications nested under the site, such as the Web API at `/API`.
4. **Point the app at the API.** Make sure `environment.prod.ts` contains the deployed API address. If the app is on a different origin than the API, add the app's origin to the API's `AllowedOrigins` setting.

## Development notes

- **Change detection:** Angular 22 components use the `OnPush` strategy by default. Components that assign plain fields inside HTTP callbacks call `ChangeDetectorRef.markForCheck()`; newer components hold their state in signals instead. Follow one of these patterns in new code, or the view won't update.
- **Dates:** the API stores and returns UTC. `localDateToUtcIso` (in `src/app/shared/local-date.ts`) converts a date picked in the form to the UTC instant of that day's local midnight, so entries appear on the chosen day when read back.
- **Error messages:** `describeHttpError` (in `src/app/shared/http-error-message.ts`) turns API failures into messages, including field-level validation errors. It returns `null` for `401`, which the interceptor handles.
