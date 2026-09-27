import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Prompt workflow" })).toBeVisible({ timeout: 15_000 });
});

test("moves through the five-stage workflow", async ({ page }) => {
  await expect(page.getByRole("textbox", { name: "Name" })).toHaveValue("Arjun");
  await page.getByRole("navigation", { name: "Prompt workflow" }).getByRole("button", { name: "Mind Map", exact: true }).click();
  await expect(page.getByLabel("Scene tags")).toBeVisible();
  await expect(page.locator(".react-flow__node-storyNode")).toHaveCount(6);
  await page.getByRole("button", { name: "Randomize" }).click();
  await page.locator(".react-flow__node-storyNode").first().click();
  await expect(page.getByLabel("Name")).toBeVisible();
  await page.getByRole("navigation", { name: "Prompt workflow" }).getByRole("button", { name: "Storyboard", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Plan the shots" })).toBeVisible();
  await page.getByRole("navigation", { name: "Prompt workflow" }).getByRole("button", { name: "Video", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Shot settings" })).toBeVisible();
  await page.getByRole("navigation", { name: "Prompt workflow" }).getByRole("button", { name: "Auditor", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Continuity check" })).toBeVisible();
});

test("renders visible story connections on the mind map", async ({ page }) => {
  await page.getByRole("navigation", { name: "Prompt workflow" }).getByRole("button", { name: "Mind Map", exact: true }).click();
  await expect(page.getByRole("button", { name: "Auto-arrange nodes" })).toBeVisible();
  await page.getByRole("button", { name: "Auto-arrange nodes" }).click();
  const paths = page.locator(".react-flow__edge-path");
  await expect(paths).toHaveCount(5);
  const visibility = await paths.evaluateAll((elements) => elements.map((element) => {
    const path = element as SVGPathElement;
    const style = getComputedStyle(path);
    return { length: path.getTotalLength(), stroke: style.stroke, width: Number.parseFloat(style.strokeWidth), opacity: Number.parseFloat(style.strokeOpacity) };
  }));
  expect(visibility.every((edge) => edge.length > 0 && edge.stroke !== "none" && edge.width >= 2 && edge.opacity > 0)).toBe(true);
});

test("opens compiled output only on request", async ({ page }) => {
  await page.getByRole("button", { name: "Character", exact: true }).click();
  await expect(page.getByRole("complementary", { name: "Compiled prompt" })).toHaveCount(0);
  await page.getByRole("button", { name: "Preview character prompt" }).click();
  await expect(page.getByRole("complementary", { name: "Compiled prompt" })).toBeVisible();
});

test("keeps the character editor inside one viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 720 });
  const dimensions = await page.evaluate(() => ({ viewport: window.innerHeight, page: document.documentElement.scrollHeight, card: document.querySelector(".character-stage")?.getBoundingClientRect().bottom ?? 0 }));
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.card).toBeLessThanOrEqual(dimensions.viewport);
});

test("opens the isolated workspace creator", async ({ page }) => {
  await page.getByRole("button", { name: "New workspace" }).click();
  await expect(page.getByRole("heading", { name: "Start with one story" })).toBeVisible();
});

test("collapses both rails and opens compiler settings", async ({ page }) => {
  await page.getByRole("navigation", { name: "Prompt workflow" }).getByRole("button", { name: "Mind Map", exact: true }).click();
  await page.getByRole("button", { name: "Collapse node inspector" }).click();
  await expect(page.getByRole("button", { name: "Expand node inspector" })).toBeVisible();
  await page.getByRole("button", { name: "Collapse sidebar" }).click();
  await expect(page.getByRole("button", { name: "Expand sidebar" })).toBeVisible();
  await page.getByRole("button", { name: "Expand sidebar" }).click();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Compiler preferences" })).toBeVisible();
  await expect(page.getByRole("switch", { name: "NSFW mature-content mode" })).toBeVisible();
});

test("adds a storyboard inside the active workspace", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Storyboard 01" })).toBeVisible();
  await page.getByRole("textbox", { name: "Name" }).fill("Maya");
  await page.getByRole("button", { name: "New storyboard" }).click();
  await expect(page.getByRole("button", { name: "Storyboard 02" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Storyboard 02" })).toHaveClass(/active/);
  await expect(page.getByRole("textbox", { name: "Name" })).toHaveValue("Maya");
});

test("persists character locks across workflow navigation", async ({ page }) => {
  await page.getByRole("button", { name: "Lock Identity" }).click();
  await expect(page.getByRole("button", { name: "Unlock Identity" })).toBeVisible();
  await page.getByRole("navigation", { name: "Prompt workflow" }).getByRole("button", { name: "Mind Map", exact: true }).click();
  await page.getByRole("navigation", { name: "Prompt workflow" }).getByRole("button", { name: "Character", exact: true }).click();
  await expect(page.getByRole("button", { name: "Unlock Identity" })).toBeVisible();
});

test("filters poor clothing by cultural context", async ({ page }) => {
  await page.getByRole("combobox", { name: "Lifestyle" }).selectOption("poor");
  await page.locator(".character-stage-tabs").getByRole("button").filter({ hasText: "Styling" }).click();
  await expect(page.getByRole("combobox", { name: "Outfit" })).toHaveValue("in_m_poor_shirt");
  await expect(page.getByRole("combobox", { name: "Shoes" })).toHaveValue("in_m_rubber_sandals");
  await page.locator(".character-stage-tabs").getByRole("button").filter({ hasText: "Core" }).click();
  await page.getByRole("button", { name: "Western", exact: true }).click();
  await page.locator(".character-stage-tabs").getByRole("button").filter({ hasText: "Styling" }).click();
  await expect(page.getByRole("combobox", { name: "Outfit" })).toHaveValue("west_m_poor_workwear");
  await expect(page.getByRole("combobox", { name: "Shoes" })).toHaveValue("west_m_repaired_trainers");
});

test("audits and safely corrects a pasted prompt", async ({ page }) => {
  await page.getByRole("navigation", { name: "Prompt workflow" }).getByRole("button", { name: "Auditor", exact: true }).click();
  const prompt = page.getByRole("textbox", { name: "Prompt to audit" });
  await prompt.fill("Arjun changes his clothing into a uniform while the camera remains static.");
  await expect(page.getByText("Wardrobe transition inside one generation")).toBeVisible();
  await page.getByRole("button", { name: "Apply safe corrections" }).click();
  await expect(prompt).toHaveValue(/CUT REQUIRED/);
});
