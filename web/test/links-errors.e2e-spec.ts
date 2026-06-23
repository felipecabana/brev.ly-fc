import { expect, test } from '@playwright/test'

test('deve exibir 404 para slug inválido', async ({ page }) => {
  await page.goto('/ab')

  await expect(
    page.getByRole('heading', { name: 'Link não encontrado' }),
  ).toBeVisible()
})

test('deve exibir 404 para slug inexistente', async ({ page }) => {
  await page.goto('/slug-nao-cadastrado')

  await expect(
    page.getByRole('heading', { name: 'Link não encontrado' }),
  ).toBeVisible()
})

test('deve bloquear submit e exibir erros de validação no formulário', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Novo link' })).toBeVisible()

  await page.getByRole('textbox', { name: 'link original' }).fill('site-invalido')
  await page.getByRole('textbox', { name: 'link encurtado' }).fill('ab')

  await expect(
    page.getByRole('button', { name: 'Salvar link' }),
  ).toBeDisabled()
  await expect(page.getByText('Informe uma URL válida.')).toBeVisible()
  await expect(
    page.getByText('Use entre 3 e 32 caracteres (letras, números, _ ou -).'),
  ).toBeVisible()
})

test('deve exibir erro quando a listagem de links falha', async ({ page }) => {
  await page.route('**/links?pageIndex=**', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue()
      return
    }

    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Falha ao listar links.' }),
    })
  })

  await page.goto('/')

  await expect(page.getByRole('alert')).toContainText('Falha ao listar links.', {
    timeout: 15_000,
  })
})

test('deve exibir erro no campo ao criar slug duplicado', async ({
  page,
}) => {
  await page.route('**/links', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue()
      return
    }

    await route.fulfill({
      status: 409,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'URL encurtada já está em uso.' }),
    })
  })

  await page.goto('/')

  await page.getByRole('textbox', { name: 'link original' }).fill('https://example.com')
  await page.getByRole('textbox', { name: 'link encurtado' }).fill('meu-link')
  await page.getByRole('button', { name: 'Salvar link' }).click()

  await expect(
    page.getByText('URL encurtada já está em uso.'),
  ).toBeVisible()
})

test('deve exibir erro quando a exportação CSV falha', async ({ page }) => {
  await page.route('**/links/export', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Falha ao publicar CSV na CDN.' }),
    })
  })

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Meus links' })).toBeVisible()

  await page.getByRole('button', { name: 'Baixar CSV' }).click()

  await expect(page.getByRole('alert')).toContainText(
    'Falha ao publicar CSV na CDN.',
  )
})
