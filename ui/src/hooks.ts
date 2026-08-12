import { deLocalizeUrl } from '$i18n/runtime';
import type { Reroute } from '@sveltejs/kit';

// Locale prefixes are a public URL concern. SvelteKit continues to resolve the
// existing route tree after Paraglide removes the prefix.
export const reroute: Reroute = ({ url }) => deLocalizeUrl(url).pathname;

// SvelteKit's generated client imports this optional hook when hooks.ts exists.
export const transport = {};
