import type { BetterAuthPlugin } from 'better-auth';

import { geolocation as extractGeo } from '@vercel/functions';

import {
  DEFAULT_FIELDS,
  type DefaultGeolocationFields,
  type GeolocationField,
  type GeolocationFieldConfig,
  type GeolocationPluginOptions,
  type GeoSchemaFields,
  type InferGeoSession,
} from './types';

export const geolocation = <
  const T extends GeolocationFieldConfig = DefaultGeolocationFields,
>(
  options?: GeolocationPluginOptions<T>,
) => {
  const updateOnRefresh = options?.updateOnRefresh ?? true;
  const fieldConfig = (options?.fields ?? DEFAULT_FIELDS) as T;

  const activeFields = (Object.keys(fieldConfig) as GeolocationField[]).filter(
    (field) => fieldConfig[field] === true,
  );

  const schemaFields = Object.fromEntries(
    activeFields.map((field) => [
      field,
      {
        type: 'string',
        required: false,
        input: false,
      },
    ]),
  ) as GeoSchemaFields<T>;

  function applyGeo(
    session: Record<string, unknown>,
    request: Request | undefined,
  ) {
    if (!request) return;

    const geo = extractGeo(request);
    for (const field of activeFields) {
      session[field] = geo[field];
    }
    return { data: session };
  }

  return {
    id: 'vercel-geolocation',
    schema: {
      session: { fields: schemaFields },
    },
    $Infer: {
      Session: {
        session: {} as InferGeoSession<T>,
      },
    },
    init() {
      return {
        options: {
          databaseHooks: {
            session: {
              create: {
                before: async (session, ctx) => {
                  return applyGeo(session, ctx?.request);
                },
              },
              update: {
                before: async (session, ctx) => {
                  if (!updateOnRefresh) return;
                  return applyGeo(session, ctx?.request);
                },
              },
            },
          },
        },
      };
    },
  } satisfies BetterAuthPlugin;
};
