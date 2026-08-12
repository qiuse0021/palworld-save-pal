import { expect, test } from '@playwright/test';

test('web landing shows the Palworld Save Editor SEO copy', async ({ page }) => {
	await page.goto('/');

	// Theme logo
	await expect(page.getByRole('img', { name: /palworld save pal/i })).toBeVisible({
		timeout: 15_000
	});

	// Tagline
	await expect(
		page.getByRole('heading', {
			level: 1,
			name: /palworld save editor - free, private and online/i
		})
	).toBeVisible();
	await expect(page.locator('h1')).toHaveCount(1);

	// Rendered landing-copy targets: exact keyphrase occurrences / English word count.
	const copyAudit = await page.locator('.landing-page').evaluate((root) => {
		const text = root.textContent?.replace(/\s+/g, ' ').trim() ?? '';
		const words = text.match(/[A-Za-z0-9]+(?:[.'-][A-Za-z0-9]+)*/g) ?? [];
		const exactKeyphraseHits = text.match(/Palworld Save Editor/gi)?.length ?? 0;
		return {
			wordCount: words.length,
			density: (exactKeyphraseHits / words.length) * 100
		};
	});
	expect(copyAudit.wordCount).toBeGreaterThanOrEqual(1000);
	expect(copyAudit.wordCount).toBeLessThanOrEqual(1200);
	expect(copyAudit.density).toBeGreaterThanOrEqual(2.5);
	expect(copyAudit.density).toBeLessThanOrEqual(3);

	// Unified dropzone with both browse buttons
	await expect(page.getByText(/drop your save here/i)).toBeVisible();
	await expect(page.getByRole('button', { name: 'Choose .zip', exact: true })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Choose folder', exact: true })).toBeVisible();

	// 3D map claim
	await expect(page.getByText(/explore your world with a 3d palworld save editor/i)).toBeVisible();

	// Section headings
	await expect(page.getByText(/a private, open-source palworld save editor/i)).toBeVisible();
	await expect(page.getByText(/what you can change with the palworld save editor/i)).toBeVisible();
	await expect(page.getByText(/how to use the palworld save editor/i)).toBeVisible();
	await expect(
		page.getByText(/palworld save editor for desktop and dedicated servers/i)
	).toBeVisible();

	// FAQ accordion: an item expands on click
	const faqSummary = page.getByText(/does the palworld save editor upload my save files\?/i);
	await faqSummary.click();
	await expect(page.getByText(/runs save parsing and editing on your device/i)).toBeVisible();

	// Root-domain SEO metadata
	await expect(page).toHaveTitle('Palworld Save Editor Online - Free, Private & Open Source');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://palworldsaveeditor.org/'
	);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		'content',
		'index,follow,max-image-preview:large'
	);

	// Desktop links
	await expect(page.getByRole('link', { name: /github/i }).first()).toHaveAttribute(
		'href',
		'https://github.com/oMaN-Rod/palworld-save-pal'
	);
	// Renders as an anchor with aria-label "Nexus Mods" (see landing/Link.svelte),
	// so it is a link, not a button, and the accessible name contains a space.
	await expect(page.getByRole('link', { name: /nexus\s*mods/i }).first()).toHaveAttribute(
		'href',
		'https://www.nexusmods.com/palworld/mods/1827'
	);

	// Footer social links
	await expect(page.getByRole('link', { name: 'Discord' })).toHaveAttribute(
		'href',
		'https://discord.gg/YWZFPy9G8J'
	);

	// No sidebar/nav rail on the landing
	await expect(page.locator('.nav-rail')).toHaveCount(0);

	// No compatibility banner on a healthy desktop Chromium run. The unit tests
	// only prove detection matches hand-written fake scopes; this is the only
	// check that a real browser is not told it is broken.
	await expect(page.getByRole('status')).toHaveCount(0);
});
