import { test, expect, type Page } from "@playwright/test";

async function createProduct(page: Page, sku: string) {
  await page.goto("/products");

  await page.getByRole("button", { name: "Add product" }).click();

  const dialog = page.getByRole("dialog", { name: "Add new product" });

  await dialog
    .getByRole("textbox", { name: /Product name/i })
    .fill("MacBook Air");
  await dialog.getByRole("textbox", { name: /SKU/i }).fill(sku);

  await dialog.getByRole("button", { name: "Create Product" }).click();

  await expect(dialog).not.toBeVisible();
  await expect(page.getByText(sku)).toBeVisible();
}

test("should create a product", async ({ page }) => {
  const sku = `MAC-${Date.now()}`;
  await createProduct(page, sku);
});

test("should create IN movement for the product", async ({ page }) => {
  const sku = `MAC-${Date.now()}`;
  await createProduct(page, sku);

  const productRow = page.getByRole("row").filter({ hasText: sku });

  await productRow.getByRole("link", { name: "View details" }).click();

  await page.getByRole("button", { name: "Receive Stock" }).click();

  const modal = page.getByRole("dialog", { name: "Receive Stock" });

  await modal.getByRole("spinbutton", { name: /Quantity/i }).fill("10");

  await modal.getByRole("button", { name: "Receive Stock" }).click();

  await expect(modal).not.toBeVisible();
  await expect(page.getByText("Stock Received")).toBeVisible();
  await expect(page.getByText("+10")).toBeVisible();

  const currentStock = page
    .getByText("Current Stock", { exact: true })
    .locator("..")
    .locator("..");
  await expect(currentStock.getByText("10", { exact: true })).toBeVisible();
});

test("should create OUT movement for the product", async ({ page }) => {
  const sku = `MAC-${Date.now()}`;
  await createProduct(page, sku);

  const productRow = page.getByRole("row").filter({ hasText: sku });

  await productRow.getByRole("link", { name: "View details" }).click();

  await page.getByRole("button", { name: "Receive Stock" }).click();

  const modalIn = page.getByRole("dialog", { name: "Receive Stock" });

  await modalIn.getByRole("spinbutton", { name: /Quantity/i }).fill("10");

  await modalIn.getByRole("button", { name: "Receive Stock" }).click();

  await expect(modalIn).not.toBeVisible();
  await expect(page.getByText("Stock Received")).toBeVisible();
  await expect(page.getByText("+10")).toBeVisible();

  await page.getByRole("button", { name: "Write Off" }).click();

  const modalOut = page.getByRole("dialog", { name: "Write Off Stock" });

  await modalOut.getByRole("spinbutton", { name: /Quantity/i }).fill("6");

  await modalOut.getByRole("button", { name: "Write Off Stock" }).click();

  await expect(modalOut).not.toBeVisible();
  await expect(page.getByText("Stock Dispatched")).toBeVisible();
  await expect(page.getByText("-6")).toBeVisible();

  const currentStock = page
    .getByText("Current Stock", { exact: true })
    .locator("..")
    .locator("..");
  await expect(currentStock.getByText("4", { exact: true })).toBeVisible();
});
