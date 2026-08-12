import { paraglideMiddleware } from '$i18n/server';
import { htmlLanguageTags } from '$lib/i18n/routingConfig.js';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;
		const htmlLanguage = htmlLanguageTags[locale as keyof typeof htmlLanguageTags] ?? locale;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', htmlLanguage).replace('%dir%', 'ltr')
		});
	});
