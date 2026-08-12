<script lang="ts">
	import { Popover } from '$components/ui';
	import { persistLocalePreference } from '$states';
	import { languages, type SupportedLanguage } from '$types';
	import Globe from '@lucide/svelte/icons/globe';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { deLocalizeHref, extractLocaleFromUrl, localizeHref } from '$i18n/runtime';

	const entries = Object.entries(languages) as [SupportedLanguage, string][];
	const activeCode = $derived(
		(extractLocaleFromUrl(page.url) as SupportedLanguage | undefined) ?? 'en'
	);
	const currentHref = $derived(
		browser ? `${page.url.pathname}${page.url.search}${page.url.hash}` : page.url.pathname
	);
	const baseHref = $derived(deLocalizeHref(currentHref));
</script>

<Popover position="bottom-end">
	{#snippet children()}
		<button class="public-chip" type="button">
			<Globe class="h-3.5 w-3.5" />
			<span class="uppercase">{activeCode}</span>
		</button>
	{/snippet}
	{#snippet content({ close }: { close: () => void })}
		<div class="flex max-h-72 flex-col gap-0.5 overflow-y-auto">
			{#each entries as [code, label] (code)}
				<a
					href={localizeHref(baseHref, { locale: code })}
					data-sveltekit-reload
					class="public-chip-option"
					class:is-active={activeCode === code}
					onclick={() => {
						persistLocalePreference(code);
						close();
					}}
				>
					{label}
				</a>
			{/each}
		</div>
	{/snippet}
</Popover>
