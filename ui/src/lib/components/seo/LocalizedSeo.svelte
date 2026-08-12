<script lang="ts">
	import { getLocale } from '$i18n/runtime';
	import {
		SITE_ORIGIN,
		hrefLanguageTags,
		localizedPath,
		siteLocales,
		type SiteLocale
	} from '$lib/i18n/routingConfig.js';

	type StructuredData = Record<string, unknown>;

	let {
		pathname,
		title,
		description,
		ogTitle = title,
		ogDescription = description,
		structuredData
	}: {
		pathname: string;
		title: string;
		description: string;
		ogTitle?: string;
		ogDescription?: string;
		structuredData?: StructuredData;
	} = $props();

	const locale = $derived(getLocale() as SiteLocale);
	const canonicalUrl = $derived(`${SITE_ORIGIN}${localizedPath(pathname, locale)}`);
	const alternates = $derived(
		siteLocales.map((alternateLocale) => ({
			locale: alternateLocale,
			hreflang: hrefLanguageTags[alternateLocale],
			href: `${SITE_ORIGIN}${localizedPath(pathname, alternateLocale)}`
		}))
	);
	const structuredDataTag = $derived(
		structuredData
			? `<script type="application/ld+json" data-localized-seo>${JSON.stringify({
					...structuredData,
					url: canonicalUrl,
					description
				}).replace(/</g, '\\u003c')}<\/script>`
			: ''
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta data-localized-seo name="description" content={description} />
	<meta data-localized-seo name="robots" content="index,follow,max-image-preview:large" />
	<link data-localized-seo rel="canonical" href={canonicalUrl} />
	{#each alternates as alternate (alternate.locale)}
		<link data-localized-seo rel="alternate" hreflang={alternate.hreflang} href={alternate.href} />
	{/each}
	<link
		data-localized-seo
		rel="alternate"
		hreflang="x-default"
		href={`${SITE_ORIGIN}${localizedPath(pathname, 'en')}`}
	/>
	<meta data-localized-seo property="og:title" content={ogTitle} />
	<meta data-localized-seo property="og:description" content={ogDescription} />
	<meta data-localized-seo property="og:type" content="website" />
	<meta data-localized-seo property="og:url" content={canonicalUrl} />
	<meta data-localized-seo name="twitter:card" content="summary_large_image" />
	<meta data-localized-seo name="twitter:title" content={ogTitle} />
	<meta data-localized-seo name="twitter:description" content={ogDescription} />
	{#if structuredDataTag}
		{@html structuredDataTag}
	{/if}
</svelte:head>
