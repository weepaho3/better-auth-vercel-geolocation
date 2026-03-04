# better-auth-vercel-geolocation

A [better-auth](https://www.better-auth.com/) plugin that enriches the auth session with Vercel edge geolocation data. On session create and refresh, it reads the `[x-vercel-ip-*` headers](https://vercel.com/docs/headers/request-headers) server-side and writes the configured fields into the session record — no browser permission prompt, no extra API call.

> [!NOTE]
> Requires deployment on Vercel. In local development, geo fields will be `undefined`.

## Features

- **Zero-config defaults** — stores city, country, countryRegion and flag out of the box
- **Configurable fields** — pick exactly which [geo fields](https://vercel.com/docs/edge-network/headers#x-vercel-ip-city) you need
- **Auto-refresh** — Updates geo data when the session refreshes

## Installation

```bash
npm install better-auth-vercel-geolocation
```

Requires **better-auth** >= 1.4.18 as a peer dependency.

## Quick start

### 1. Add the plugin to your auth config

```ts
import { betterAuth } from 'better-auth';
import { geolocation } from 'better-auth-vercel-geolocation';

export const auth = betterAuth({
  plugins: [geolocation()],
});
```

### 2. Migrate the database

```bash
npx @better-auth/cli migrate
```

### 3. Add the client plugin

```ts
import { createAuthClient } from 'better-auth/react';
import { geolocationClient } from 'better-auth-vercel-geolocation/client';

export const authClient = createAuthClient({
  plugins: [geolocationClient()],
});
```

The session now includes geolocation fields:

```ts
const { data: session } = authClient.useSession();

session.city; // "Hamburg"
session.country; // "DE"
session.countryRegion; // "HH"
session.flag; // "🇩🇪"
```

## Options


| Option            | Type                     | Default                                  | Description                                   |
| ----------------- | ------------------------ | ---------------------------------------- | --------------------------------------------- |
| `fields`          | `GeolocationFieldConfig` | `{ city, country, countryRegion, flag }` | Which fields to store on the session          |
| `updateOnRefresh` | `boolean`                | `true`                                   | Update geo data when the session is refreshed |


## Available fields


| Field           | Header                         | Example           | Default |
| --------------- | ------------------------------ | ----------------- | ------- |
| `city`          | `x-vercel-ip-city`             | `"Hamburg"`       | ✅       |
| `country`       | `x-vercel-ip-country`          | `"DE"`            | ✅       |
| `countryRegion` | `x-vercel-ip-country-region`   | `"HH"`            | ✅       |
| `flag`          | *(derived from country)*       | `"🇩🇪"`          | ✅       |
| `latitude`      | `x-vercel-ip-latitude`         | `"53.5573"`       |         |
| `longitude`     | `x-vercel-ip-longitude`        | `"9.9652"`        |         |
| `postalCode`    | `x-vercel-ip-postal-code`      | `"20359"`         |         |
| `region`        | *(Vercel Edge Network region)* | `"fra1"`          |         |
| `timezone`      | `x-vercel-ip-timezone`         | `"Europe/Berlin"` |         |



## License

MIT