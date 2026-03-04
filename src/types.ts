import type { Geo } from '@vercel/functions';

export type GeolocationField = keyof Geo;

/**
 * Configuration for which geolocation fields to store.
 * Each field can be set to `true` to include it in the session.
 */
export interface GeolocationFieldConfig {
  /** The city that the request originated from. */
  city?: boolean;
  /** The country that the request originated from. */
  country?: boolean;
  /** The region part of the ISO 3166-2 code of the client IP. */
  countryRegion?: boolean;
  /** The flag emoji for the country the request originated from. */
  flag?: boolean;
  /** The latitude of the client. */
  latitude?: boolean;
  /** The longitude of the client. */
  longitude?: boolean;
  /** The postal code of the client. */
  postalCode?: boolean;
  /** The Vercel Edge Network region that received the request. */
  region?: boolean;
}

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
   * All available fields: city, country, countryRegion, flag, latitude, longitude, postalCode, region.
   * @default { city: true, country: true, countryRegion: true, flag: true }
   */
  fields?: T & GeolocationFieldConfig;
  /**
   * Whether to update session geolocation data when the session is refreshed.
   * @default true
   */
  updateOnRefresh?: boolean;
}
