import { betterAuth } from 'better-auth';
import { createAuthClient } from 'better-auth/client';
import { admin } from 'better-auth/plugins';

import { geolocation } from '../src';
import { geolocationClient } from '../src/client';

type Expect<T extends true> = T;
type Has<T, K extends PropertyKey> = K extends keyof T ? true : false;

const auth = betterAuth({ plugins: [geolocation()] });
const timezoneAuth = betterAuth({
  plugins: [geolocation({ fields: { timezone: true } })],
});
const adminAuth = betterAuth({ plugins: [admin(), geolocation()] });
const client = createAuthClient({ plugins: [geolocationClient()] });

type InferredSession = (typeof auth)['$Infer']['Session'];
type InferredSessionRecord = InferredSession['session'];
type InferredUser = InferredSession['user'];

export type KeepsUser = Expect<Has<InferredSession, 'user'>>;
export type UserHasId = Expect<Has<InferredUser, 'id'>>;
export type UserHasEmail = Expect<Has<InferredUser, 'email'>>;

export type SessionHasToken = Expect<Has<InferredSessionRecord, 'token'>>;
export type SessionHasUserId = Expect<Has<InferredSessionRecord, 'userId'>>;
export type SessionHasCity = Expect<Has<InferredSessionRecord, 'city'>>;
export type SessionHasCountry = Expect<Has<InferredSessionRecord, 'country'>>;
export type SessionHasCountryRegion = Expect<
  Has<InferredSessionRecord, 'countryRegion'>
>;
export type SessionHasFlag = Expect<Has<InferredSessionRecord, 'flag'>>;
export type SessionHasNoLatitude = Expect<
  Has<InferredSessionRecord, 'latitude'> extends false ? true : false
>;

type TimezoneSession = (typeof timezoneAuth)['$Infer']['Session']['session'];

export type TimezoneSessionHasTimezone = Expect<Has<TimezoneSession, 'timezone'>>;
export type TimezoneSessionHasNoCity = Expect<
  Has<TimezoneSession, 'city'> extends false ? true : false
>;

type ApiSession = NonNullable<
  Awaited<ReturnType<(typeof auth)['api']['getSession']>>
>;

export type ApiSessionHasUser = Expect<Has<ApiSession, 'user'>>;
export type ApiUserHasId = Expect<Has<ApiSession['user'], 'id'>>;
export type ApiSessionHasCity = Expect<Has<ApiSession['session'], 'city'>>;
export type ApiSessionHasCountry = Expect<
  Has<ApiSession['session'], 'country'>
>;
export type ApiSessionHasCountryRegion = Expect<
  Has<ApiSession['session'], 'countryRegion'>
>;
export type ApiSessionHasFlag = Expect<Has<ApiSession['session'], 'flag'>>;
export type ApiSessionHasNoLatitude = Expect<
  Has<ApiSession['session'], 'latitude'> extends false ? true : false
>;

type ClientSession = (typeof client)['$Infer']['Session']['session'];

export type ClientSessionHasCity = Expect<Has<ClientSession, 'city'>>;

type AdminInferred = (typeof adminAuth)['$Infer']['Session'];

export type AdminUserHasRole = Expect<Has<AdminInferred['user'], 'role'>>;
export type AdminUserHasBanned = Expect<Has<AdminInferred['user'], 'banned'>>;
export type AdminSessionHasImpersonatedBy = Expect<
  Has<AdminInferred['session'], 'impersonatedBy'>
>;
export type AdminSessionHasToken = Expect<Has<AdminInferred['session'], 'token'>>;
export type AdminSessionHasCity = Expect<Has<AdminInferred['session'], 'city'>>;

type AdminApiSession = NonNullable<
  Awaited<ReturnType<(typeof adminAuth)['api']['getSession']>>
>;

export type AdminApiUserHasRole = Expect<Has<AdminApiSession['user'], 'role'>>;
export type AdminApiUserHasBanned = Expect<
  Has<AdminApiSession['user'], 'banned'>
>;
export type AdminApiSessionHasImpersonatedBy = Expect<
  Has<AdminApiSession['session'], 'impersonatedBy'>
>;
export type AdminApiSessionHasToken = Expect<
  Has<AdminApiSession['session'], 'token'>
>;
export type AdminApiSessionHasCity = Expect<
  Has<AdminApiSession['session'], 'city'>
>;
