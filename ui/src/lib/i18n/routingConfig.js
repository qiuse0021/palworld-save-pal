export const SITE_ORIGIN = 'https://palworldsaveeditor.org';

/**
 * @typedef {'en' | 'es' | 'de' | 'es-mx' | 'fr' | 'id-id' | 'it' | 'ko' | 'pl' | 'pt-br' | 'ru' | 'th' | 'tr' | 'vi' | 'zh-hans' | 'zh-hant'} SiteLocale
 */

/** @type {readonly SiteLocale[]} */
export const siteLocales = Object.freeze([
	'en',
	'es',
	'de',
	'es-mx',
	'fr',
	'id-id',
	'it',
	'ko',
	'pl',
	'pt-br',
	'ru',
	'th',
	'tr',
	'vi',
	'zh-hans',
	'zh-hant'
]);

/** @type {Readonly<Record<SiteLocale, string>>} */
export const localeSlugs = Object.freeze({
	en: '',
	es: 'es',
	de: 'de',
	'es-mx': 'es-mx',
	fr: 'fr',
	'id-id': 'id-id',
	it: 'it',
	ko: 'ko',
	pl: 'pl',
	'pt-br': 'pt-br',
	ru: 'ru',
	th: 'th',
	tr: 'tr',
	vi: 'vi',
	'zh-hans': 'zh',
	'zh-hant': 'zh-hant'
});

/** @type {Readonly<Record<SiteLocale, string>>} */
export const htmlLanguageTags = Object.freeze({
	en: 'en',
	es: 'es',
	de: 'de',
	'es-mx': 'es-MX',
	fr: 'fr',
	'id-id': 'id-ID',
	it: 'it',
	ko: 'ko',
	pl: 'pl',
	'pt-br': 'pt-BR',
	ru: 'ru',
	th: 'th',
	tr: 'tr',
	vi: 'vi',
	'zh-hans': 'zh-Hans',
	'zh-hant': 'zh-Hant'
});

export const hrefLanguageTags = htmlLanguageTags;

export const PUBLIC_INDEXABLE_PATHS = Object.freeze(['/', '/map', '/wiki', '/breeding']);

/**
 * Prefixes an application route with the public slug for a locale.
 * English remains unprefixed so existing canonical URLs stay stable.
 *
 * @param {string} pathname
 * @param {SiteLocale} locale
 */
export function localizedPath(pathname, locale) {
	const normalized = pathname === '/' ? '/' : `/${pathname.replace(/^\/+|\/+$/g, '')}`;
	const slug = localeSlugs[locale];
	if (!slug) return normalized;
	return normalized === '/' ? `/${slug}` : `/${slug}${normalized}`;
}

/**
 * @param {string} pathname A de-localized SvelteKit route pathname.
 */
export function isLocalizedPublicRoute(pathname) {
	return PUBLIC_INDEXABLE_PATHS.includes(pathname);
}

const originPattern = ':protocol://:domain(.*)::port?';

/**
 * @param {string} pathPattern
 * @param {SiteLocale} locale
 */
function localizedPattern(pathPattern, locale) {
	return `${originPattern}${localizedPath(pathPattern, locale)}`;
}

/**
 * @param {string} pathPattern
 * @returns {{ pattern: string, localized: Array<[SiteLocale, string]> }}
 */
function routePattern(pathPattern) {
	return {
		pattern: `${originPattern}${pathPattern}`,
		localized: siteLocales.map((locale) => [locale, localizedPattern(pathPattern, locale)])
	};
}

// Only public, indexable routes use URL locale detection. Editor routes fall
// through to the existing persisted setting and remain unprefixed SPA pages.
export const paraglideUrlPatterns = [
	routePattern('/'),
	routePattern('/map'),
	routePattern('/wiki'),
	routePattern('/breeding')
];
