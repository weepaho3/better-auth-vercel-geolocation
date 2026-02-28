import type { BetterAuthClientPlugin } from 'better-auth/client';

import type { geolocation } from './geolocation';
import type {
  DefaultGeolocationFields,
  GeolocationFieldConfig,
} from './types';

export const geolocationClient = <
  const T extends GeolocationFieldConfig = DefaultGeolocationFields,
>() => {
  return {
    id: 'vercel-geolocation',
    $InferServerPlugin: {} as ReturnType<typeof geolocation<T>>,
  } satisfies BetterAuthClientPlugin;
};
