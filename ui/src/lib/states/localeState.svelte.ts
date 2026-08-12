import { getLocale, setLocale } from '$i18n/runtime';
import { htmlLanguageTags } from '$lib/i18n/routingConfig.js';
import { switchLocale } from '$lib/utils/localeSwitch';
import { send } from '$lib/utils/websocketUtils';
import type { SupportedLanguage } from '$types';
import { MessageType } from '$types';
import { getAppState } from './appState.svelte';

let version = $state(0);

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
		document.documentElement.lang = htmlLanguageTags[code];
	}
}

export function persistLocalePreference(code: SupportedLanguage): void {
	const appState = getAppState();
	appState.settings.language = code;
	send(MessageType.UPDATE_SETTINGS, { ...appState.settings });
}

export function applyLocale(code: SupportedLanguage): boolean {
	const changed = switchLocale(code, {
		getLocale: () => getLocale(),
		setLocale: (next, opts) => setLocale(next as SupportedLanguage, opts),
		bump: bumpLocaleVersion,
		persist: (next) => persistLocalePreference(next as SupportedLanguage)
	});
	if (changed) syncDocumentLocale(code);
	return changed;
}
