import { expect, test } from '@playwright/test';

const englishPages = [
	{
		path: '/map',
		title: 'Palworld Interactive Map - Locations, Bosses & Dungeons',
		description:
			'Explore the Palworld interactive map to find fast travel points, Lifmunk Effigies, dungeons, bosses, Alpha Pals, Predator Pals and other key locations.'
	},
	{
		path: '/wiki',
		title: 'Palworld Wiki - Pals, Items, Skills & Technology',
		description:
			'Search the Palworld Wiki for Pals, items, buildings, active and passive skills, technologies, elements, work suitability data and more.'
	},
	{
		path: '/breeding',
		title: 'Palworld Breeding Calculator - Find Combos & Chains',
		description:
			'Use the Palworld Breeding Calculator to find parent combinations, target children and multi-generation breeding chains, with optional save-file Pal data.'
	}
] as const;

for (const pageMeta of englishPages) {
	test(`${pageMeta.path} exposes localized SEO metadata`, async ({ page }) => {
		await page.goto(pageMeta.path);

		await expect(page).toHaveTitle(pageMeta.title);
		const description = page.locator('meta[name="description"]');
		await expect(description).toHaveCount(1);
		await expect(description).toHaveAttribute('content', pageMeta.description);
		const canonical = page.locator('link[rel="canonical"]');
		await expect(canonical).toHaveCount(1);
		await expect(canonical).toHaveAttribute(
			'href',
			`https://palworldsaveeditor.org${pageMeta.path}`
		);
	});
}

test('homepage and public-page metadata switch to Simplified Chinese', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'en', exact: true }).click();
	await page.getByRole('button', { name: '简体中文', exact: true }).click();

	await expect(page).toHaveTitle('Palworld 存档编辑器在线版 - 免费、私密、开源');
	await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hans');
	const description = page.locator('meta[name="description"]');
	await expect(description).toHaveCount(1);
	await expect(description).toHaveAttribute(
		'content',
		'免费在线使用 Palworld 存档编辑器，修改帕鲁、玩家、物品栏、科技、公会和基地。存档始终留在您的设备上，无需注册账号。'
	);

	await page.goto('/map');
	await expect(page).toHaveTitle('Palworld 互动地图 - 地点、头目与地下城');
	await expect(description).toHaveCount(1);
	await expect(description).toHaveAttribute(
		'content',
		'探索 Palworld 互动地图，查找快速传送点、翠叶鼠雕像、地下城、头目、阿尔法帕鲁、掠食者帕鲁及其他重要地点。'
	);
});
