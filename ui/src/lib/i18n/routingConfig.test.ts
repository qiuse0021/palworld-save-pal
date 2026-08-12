import { deLocalizeHref, localizeHref } from '$i18n/runtime';
import { describe, expect, it } from 'vitest';
import {
	PUBLIC_INDEXABLE_PATHS,
	isLocalizedPublicRoute,
	localizedPath,
	paraglideUrlPatterns,
	siteLocales
} from './routingConfig.js';

describe('localized public routing', () => {
	it('keeps English URLs unprefixed', () => {
		expect(localizedPath('/', 'en')).toBe('/');
		expect(localizedPath('/wiki', 'en')).toBe('/wiki');
	});

	it('uses the short /zh slug for Simplified Chinese', () => {
		expect(localizedPath('/', 'zh-hans')).toBe('/zh');
		expect(localizedPath('/wiki/pals', 'zh-hans')).toBe('/zh/wiki/pals');
	});

	it('keeps Traditional Chinese on a distinct script URL', () => {
		expect(localizedPath('/', 'zh-hant')).toBe('/zh-hant');
	});

	it('limits URL locale routing to public routes', () => {
		expect(isLocalizedPublicRoute('/')).toBe(true);
		expect(isLocalizedPublicRoute('/wiki')).toBe(true);
		expect(isLocalizedPublicRoute('/wiki/pals/lamball')).toBe(false);
		expect(isLocalizedPublicRoute('/edit')).toBe(false);
	});

	it('defines every indexable route for every locale', () => {
		expect(paraglideUrlPatterns).toHaveLength(PUBLIC_INDEXABLE_PATHS.length);
		for (const pattern of paraglideUrlPatterns) {
			expect(pattern.localized).toHaveLength(siteLocales.length);
		}
	});

	it('round-trips public links through the generated Paraglide runtime', () => {
		expect(localizeHref('/', { locale: 'zh-hans' })).toBe('/zh');
		expect(localizeHref('/map?area=sakurajima', { locale: 'zh-hans' })).toBe(
			'/zh/map?area=sakurajima'
		);
		expect(deLocalizeHref('/zh/breeding')).toBe('/breeding');
		expect(localizeHref('/edit', { locale: 'zh-hans' })).toBe('/edit');
	});
});
