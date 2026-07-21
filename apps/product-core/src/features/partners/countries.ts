/**
 * ISO 3166-1 alpha-2 country code utilities.
 *
 * The full list matches the 255 flag SVGs bundled in `src/assets/flags.svg/`.
 * Country names are resolved via `Intl.DisplayNames` — zero npm dependencies.
 */

/** All ISO 3166-1 alpha-2 codes present in the flags asset directory. */
const ISO_ALPHA2_CODES = [
  'ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'aq', 'ar',
  'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be',
  'bf', 'bg', 'bh', 'bi', 'bj', 'bl', 'bm', 'bn', 'bo', 'bq',
  'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd',
  'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr',
  'cu', 'cv', 'cw', 'cx', 'cy', 'cz', 'de', 'dj', 'dk', 'dm',
  'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'eu',
  'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge',
  'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr',
  'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht',
  'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir', 'is',
  'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km',
  'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li',
  'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md',
  'me', 'mf', 'mg', 'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp',
  'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz',
  'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr',
  'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl',
  'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro',
  'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh',
  'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st',
  'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj',
  'tk', 'tl', 'tm', 'tn', 'to', 'tr', 'tt', 'tv', 'tw', 'tz',
  'ua', 'ug', 'um', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg',
  'vi', 'vn', 'vu', 'wf', 'ws', 'xk', 'ye', 'yt', 'za', 'zm',
  'zw',
] as const;

export type IsoCountryCode = (typeof ISO_ALPHA2_CODES)[number];

/** Immutable set for O(1) lookup. */
export const VALID_ISO_COUNTRY_CODES: ReadonlySet<string> = new Set<string>(ISO_ALPHA2_CODES);

/** Validate that a string is a known ISO alpha-2 country code. */
export function isValidCountryCode(code: string): code is IsoCountryCode {
  return VALID_ISO_COUNTRY_CODES.has(code);
}

/** Resolve an ISO alpha-2 code to its English display name via `Intl.DisplayNames`. */
const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });

export function getCountryName(code: string): string | undefined {
  try {
    return displayNames.of(code.toUpperCase());
  } catch {
    return undefined;
  }
}

/** Full list of `{ code, name }` entries for populating Select options. */
export const COUNTRY_OPTIONS: ReadonlyArray<Readonly<{ code: IsoCountryCode; name: string }>> =
  ISO_ALPHA2_CODES
    .map((code) => ({ code, name: getCountryName(code) ?? code.toUpperCase() }))
    .sort((a, b) => a.name.localeCompare(b.name));
