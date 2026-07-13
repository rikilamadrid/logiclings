import { expect, test } from '@playwright/test'

/**
 * Sign up → play → reload → progress persisted.
 *
 * Needs the API and a real database, which `npm run dev` (Vite alone) does not
 * provide. Run against `npm run dev:api` (`vercel dev`) with a migrated
 * DATABASE_URL:
 *
 *   E2E_WITH_API=1 npm run test:e2e
 *
 * Skipped by default so `npm run test:e2e` stays green for contributors who do
 * not have a database provisioned.
 */

const LESSON = 'event-bubbling-bubbles'

function uniqueEmail(): string {
  return `learner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.test`
}

test.describe('auth and persistent progress', () => {
  test.skip(
    !process.env.E2E_WITH_API,
    'Requires the API and a database — set E2E_WITH_API=1 and run against `vercel dev`.',
  )

  test('signs up, completes a lesson, and keeps it after a reload', async ({
    page,
  }) => {
    await page.goto('/auth/sign-up')
    await page.getByLabel('Display name').fill('Ada Lovelace')
    await page.getByLabel('Email').fill(uniqueEmail())
    await page.getByLabel('Password').fill('correct-horse-battery')
    await page.getByRole('button', { name: 'Create account' }).click()

    // Landed back in the app, signed in.
    await expect(page).toHaveURL('/')

    await page.goto(`/play/${LESSON}?mode=apply`)
    await page.getByRole('button', { name: /start/i }).click()

    // Play through however many rounds the level asks for.
    const submit = page.getByRole('button', { name: /submit|check/i })
    const next = page.getByRole('button', { name: /continue|next/i })

    while (await submit.isVisible().catch(() => false)) {
      await submit.click()
      if (await next.isVisible().catch(() => false)) {
        await next.click()
      }
    }

    await expect(page).toHaveURL(new RegExp(`/play/${LESSON}/result`))
    await expect(page.getByText('Progress saved')).toBeVisible()

    // The real assertion: it survives a reload, because it lives on the server.
    await page.reload()
    await page.goto('/tracks/frontend')
    await expect(
      page.getByRole('listitem').filter({ hasText: 'Event Bubbling Bubbles' }),
    ).toContainText(/completed/i)
  })

  test('does not gate play behind auth for a signed-out learner', async ({
    page,
  }) => {
    await page.goto(`/play/${LESSON}?mode=apply`)

    // Play is reachable with no account — auth is only asked for at save time.
    await expect(page.getByRole('button', { name: /start/i })).toBeVisible()
  })
})
