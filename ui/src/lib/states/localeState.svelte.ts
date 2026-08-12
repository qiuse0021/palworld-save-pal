import { getLocale, setLocale } from '$i18n/runtime';
import { send } from '$lib/utils/websocketUtils';
import { switchLocale } from '$lib/utils/localeSwitch';
import { MessageType } from '$types';
import type { SupportedLanguage } from '$types';
import { getAppState } from './appState.svelte';

let version = $state(0);

const htmlLanguageTags: Partial<Record<SupportedLanguage, string>> = {
	'es-mx': 'es-MX',
	'id-id': 'id-ID',
	'pt-br': 'pt-BR',
	'zh-hans': 'zh-Hans',
	'zh-hant': 'zh-Hant'
};

// Paraglide message accessors read module-scoped state, so a locale change does
// not re-render on its own. The layout keys on this counter to force it.
export const localeState = {
	get version(): number {
		return version;
	}
};

export function bumpLocaleVersion(): void {
	// Each localized page owns its SEO tags. Remove the current set before the
	// keyed route remounts so a locale switch cannot leave stale metadata behind.
	if (typeof document !== 'undefined') {
		document.head.querySelectorAll('[data-localized-seo]').forEach((node) => node.remove());
	}
	version += 1;
}

export function syncDocumentLocale(code: SupportedLanguage): void {
	if (typeof document !== 'undefined') {
		document.documentElement.lang = htmlLanguageTags[code] ?? code;
	}
}

export function applyLocale(code: SupportedLanguage): boolean {
	const appState = getAppState();
	const changed = switchLocale(code, {
		getLocale: () => getLocale(),
		setLocale: (next, opts) => setLocale(next as SupportedLanguage, opts),
		bump: bumpLocaleVersion,
		persist: (next) => {
			appState.settings.language = next as SupportedLanguage;
			send(MessageType.UPDATE_SETTINGS, { ...appState.settings });
		}
	});
	if (changed) syncDocumentLocale(code);
	return changed;
}
