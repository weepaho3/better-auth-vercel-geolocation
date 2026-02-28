import type { Geo } from '@vercel/functions';

export type GeolocationField = keyof Geo;

export type GeolocationFieldConfig = Partial<Record<GeolocationField, boolean>>;

export const DEFAULT_FIELDS = {
  city: true,
  country: true,
  countryRegion: true,
  flag: true,
} as const satisfies GeolocationFieldConfig;

export type DefaultGeolocationFields = typeof DEFAULT_FIELDS;

export type GeoSchemaFields<T extends GeolocationFieldConfig> = {
  [K in keyof T & GeolocationField as T[K] extends true ? K : never]: {
    type: 'string';
    required: false;
    input: false;
  };
};

export type InferGeoSession<T extends GeolocationFieldConfig> = {
  [K in keyof T & GeolocationField as T[K] extends true
    ? K
    : never]?: string | null;
};

export interface GeolocationPluginOptions<
  T extends GeolocationFieldConfig = GeolocationFieldConfig,
> {
  /**
   * Which geolocation fields to store on the session.
   * @default { city: true, country: true, countryRegion: true, flag: true }
   */
  fields?: T;
  /**
   * Whether to update session geolocation data when the session is refreshed.
   * @default true
   */
  updateOnRefresh?: boolean;
}
