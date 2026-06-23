import { expect, test } from '@playwright/test'

test('deve completar o fluxo feliz de gerenciamento de links', async ({ page }) => {
  const shortUrl = `e2e-${String(Date.now())}`
  const originalUrl = `https://example.com/${shortUrl}`

  page.on('dialog', (dialog) => {
    void dialog.accept()
  })

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Novo link' })).toBeVisible()

  await page.getByRole('textbox', { name: 'link original' }).fill(originalUrl)
  await page.getByRole('textbox', { name: 'link encurtado' }).fill(shortUrl)
  await expect(page.getByRole('button', { name: 'Salvar link' })).toBeEnabled()
  await page.getByRole('button', { name: 'Salvar link' }).click()

  const linkRow = page
    .locator('div.flex.items-center.gap-3')
    .filter({ hasText: originalUrl })
    .filter({ hasText: shortUrl })

  await expect(linkRow).toBeVisible()
  await expect(linkRow.getByText('0 acessos')).toBeVisible()

  await page.goto(`/${shortUrl}`, { waitUntil: 'load' })
  await expect(page).toHaveURL(/example\.com/)

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Meus links' })).toBeVisible()

  const updatedRow = page
    .locator('div.flex.items-center.gap-3')
    .filter({ hasText: originalUrl })
    .filter({ hasText: shortUrl })

  await expect(updatedRow.getByText('1 acesso')).toBeVisible()

  await page.route('**/links/export', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        fileName: 'e2e-export.csv',
        publicUrl: 'https://cdn.example.com/exports/e2e-export.csv',
      }),
    })
  })

  const exportRequest = page.waitForRequest('**/links/export')
  const popupPromise = page.waitForEvent('popup')
  await page.getByRole('button', { name: 'Baixar CSV' }).click()
  await exportRequest
  const popup = await popupPromise
  await popup.close()

  await updatedRow.getByRole('button', { name: 'Excluir link' }).click()
  await expect(updatedRow).not.toBeVisible()
})
