/**
 * ISO country code utilities for admin partner forms.
 * Names resolved via Intl.DisplayNames — zero external deps for country names.
 */

const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });

/** All ISO 3166-1 alpha-2 codes (matching flag SVGs in product-core). */
const ISO_CODES = [
  'ad','ae','af','ag','ai','al','am','ao','aq','ar','as','at','au','aw','ax','az',
  'ba','bb','bd','be','bf','bg','bh','bi','bj','bl','bm','bn','bo','bq','br','bs','bt','bv','bw','by','bz',
  'ca','cc','cd','cf','cg','ch','ci','ck','cl','cm','cn','co','cr','cu','cv','cw','cx','cy','cz',
  'de','dj','dk','dm','do','dz','ec','ee','eg','eh','er','es','et','eu',
  'fi','fj','fk','fm','fo','fr','ga','gb','gd','ge','gf','gg','gh','gi','gl','gm','gn','gp','gq','gr',
  'gs','gt','gu','gw','gy','hk','hm','hn','hr','ht','hu',
  'id','ie','il','im','in','io','iq','ir','is','it','je','jm','jo','jp',
  'ke','kg','kh','ki','km','kn','kp','kr','kw','ky','kz',
  'la','lb','lc','li','lk','lr','ls','lt','lu','lv','ly',
  'ma','mc','md','me','mf','mg','mh','mk','ml','mm','mn','mo','mp','mq','mr','ms','mt','mu','mv','mw','mx','my','mz',
  'na','nc','ne','nf','ng','ni','nl','no','np','nr','nu','nz',
  'om','pa','pe','pf','pg','ph','pk','pl','pm','pn','pr','ps','pt','pw','py',
  'qa','re','ro','rs','ru','rw',
  'sa','sb','sc','sd','se','sg','sh','si','sj','sk','sl','sm','sn','so','sr','ss','st','sv','sx','sy','sz',
  'tc','td','tf','tg','th','tj','tk','tl','tm','tn','to','tr','tt','tv','tw','tz',
  'ua','ug','um','us','uy','uz','va','vc','ve','vg','vi','vn','vu',
  'wf','ws','xk','ye','yt','za','zm','zw',
] as const;

function getCountryName(code: string): string {
  try {
    return displayNames.of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

export type CountryOption = Readonly<{ code: string; name: string }>;

/** Sorted country options for Select dropdowns. */
export const COUNTRY_OPTIONS: readonly CountryOption[] = ISO_CODES
  .map((code) => ({ code, name: getCountryName(code) }))
  .sort((a, b) => a.name.localeCompare(b.name));

/** Converts an ISO alpha-2 country code to an emoji flag. */
export function countryCodeToEmoji(code: string): string {
  if (code.length !== 2) return '';
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...Array.from(upper).map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}
