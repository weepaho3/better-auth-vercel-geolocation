import { describe, expect, it } from 'bun:test';

import { geolocation } from '../src';

type Hooks = ReturnType<
  ReturnType<typeof geolocation>['init']
>['options']['databaseHooks']['session'];
type HookContext = Parameters<Hooks['create']['before']>[1];

const hooksOf = (plugin: ReturnType<typeof geolocation>) =>
  plugin.init().options.databaseHooks.session;

const contextWith = (headers: Record<string, string>) =>
  // SAFETY: the hooks only read `request`; a full endpoint context is not needed.
  ({ request: new Request('https://example.com/', { headers }) }) as HookContext;

const germanHeaders = {
  'x-vercel-ip-country': 'DE',
  'x-vercel-ip-city': 'Hamburg',
  'x-vercel-ip-country-region': 'HH',
};

const newSession = () => ({
  id: 's1',
  userId: 'u1',
  token: 't1',
  createdAt: new Date(0),
  updatedAt: new Date(0),
  expiresAt: new Date(1),
});

describe('create.before', () => {
  it('writes the default fields and nothing else', async () => {
    const result = await hooksOf(geolocation()).create.before(
      newSession(),
      contextWith(germanHeaders),
    );
    expect(result?.data.country).toBe('DE');
    expect(result?.data.city).toBe('Hamburg');
    expect(result?.data.countryRegion).toBe('HH');
    expect(typeof result?.data.flag).toBe('string');
    expect(Object.keys(result?.data ?? {}).sort()).toEqual(
      [
        ...Object.keys(newSession()),
        'city',
        'country',
        'countryRegion',
        'flag',
      ].sort(),
    );
  });

  it('writes the timezone and no city when only timezone is configured', async () => {
    const result = await hooksOf(
      geolocation({ fields: { timezone: true } }),
    ).create.before(
      newSession(),
      contextWith({ ...germanHeaders, 'x-vercel-ip-timezone': 'Europe/Berlin' }),
    );
    expect(result?.data.timezone).toBe('Europe/Berlin');
    expect('city' in (result?.data ?? {})).toBe(false);
  });

  it('returns nothing without a request', async () => {
    const hooks = hooksOf(geolocation());
    expect(await hooks.create.before(newSession(), null)).toBeUndefined();
  });

  it('leaves the fields undefined without geolocation headers', async () => {
    const result = await hooksOf(geolocation()).create.before(
      newSession(),
      contextWith({}),
    );
    expect(result?.data.city).toBeUndefined();
    expect(result?.data.country).toBeUndefined();
    expect(result?.data.countryRegion).toBeUndefined();
    expect(result?.data.flag).toBeUndefined();
  });
});

describe('update.before', () => {
  it('fills the fields by default', async () => {
    const result = await hooksOf(geolocation()).update.before(
      {},
      contextWith(germanHeaders),
    );
    expect(result?.data.city).toBe('Hamburg');
  });

  it('does nothing when updateOnRefresh is false', async () => {
    const result = await hooksOf(
      geolocation({ updateOnRefresh: false }),
    ).update.before({}, contextWith(germanHeaders));
    expect(result).toBeUndefined();
  });
});

describe('schema', () => {
  it('lists exactly the configured fields', () => {
    const field = { type: 'string', required: false, input: false } as const;
    expect(geolocation().schema.session.fields).toEqual({
      city: field,
      country: field,
      countryRegion: field,
      flag: field,
    });
    expect(
      geolocation({ fields: { timezone: true, latitude: true } }).schema.session
        .fields,
    ).toEqual({ timezone: field, latitude: field });
  });
});
