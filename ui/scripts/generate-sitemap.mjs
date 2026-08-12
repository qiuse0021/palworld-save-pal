import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	PUBLIC_INDEXABLE_PATHS,
	SITE_ORIGIN,
	hrefLanguageTags,
	localizedPath,
	siteLocales
} from '../src/lib/i18n/routingConfig.js';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(scriptDir, '../static/sitemap.xml');

const pageSettings = new Map([
	['/', { changefreq: 'weekly', priority: '1.0' }],
	['/map', { changefreq: 'weekly', priority: '0.9' }],
	['/wiki', { changefreq: 'weekly', priority: '0.8' }],
	['/breeding', { changefreq: 'weekly', priority: '0.9' }]
]);

function absoluteUrl(pathname, locale) {
	return `${SITE_ORIGIN}${localizedPath(pathname, locale)}`;
}

function xmlEscape(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

const urls = [];
for (const pathname of PUBLIC_INDEXABLE_PATHS) {
	const settings = pageSettings.get(pathname);
	for (const locale of siteLocales) {
		const alternates = siteLocales
			.map(
				(alternateLocale) =>
					`\t\t<xhtml:link rel="alternate" hreflang="${hrefLanguageTags[alternateLocale]}" href="${xmlEscape(absoluteUrl(pathname, alternateLocale))}" />`
			)
			.concat(
				`\t\t<xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(absoluteUrl(pathname, 'en'))}" />`
			)
			.join('\n');

		urls.push(
			[
				'\t<url>',
				`\t\t<loc>${xmlEscape(absoluteUrl(pathname, locale))}</loc>`,
				alternates,
				`\t\t<changefreq>${settings.changefreq}</changefreq>`,
				`\t\t<priority>${settings.priority}</priority>`,
				'\t</url>'
			].join('\n')
		);
	}
}

const sitemap = [
	'<?xml version="1.0" encoding="UTF-8"?>',
	'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
	...urls,
	'</urlset>',
	''
].join('\n');

await writeFile(outputPath, sitemap, 'utf8');
console.log(
	`Generated ${PUBLIC_INDEXABLE_PATHS.length * siteLocales.length} localized sitemap URLs.`
);
