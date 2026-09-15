import { describe, expect, it, vi } from 'vitest'
import { CloudflareAuthMailer } from './mailer'

const makeMailer = () => {
  const send = vi.fn(async () => undefined)
  return { mailer: new CloudflareAuthMailer({ send } as unknown as SendEmail, 'login@academy.example'), send }
}

describe('passwordless mail localization', () => {
  it('sends Polish copy for a Polish journey', async () => {
    const { mailer, send } = makeMailer()

    await mailer.sendLoginLink({
      to: 'learner@example.com',
      url: 'https://academy.example/auth/verify?token=example&locale=pl',
      expiresInMinutes: 10,
      locale: 'pl',
    })

    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      subject: 'Zaloguj się do Pi Harness Academy',
      text: expect.stringContaining('Link wygaśnie za 10 minut.'),
      html: expect.stringContaining('Przejdź do Akademii'),
    }))
  })

  it('keeps the existing English copy', async () => {
    const { mailer, send } = makeMailer()

    await mailer.sendLoginLink({
      to: 'learner@example.com',
      url: 'https://academy.example/auth/verify?token=example',
      expiresInMinutes: 10,
      locale: 'en',
    })

    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      subject: 'Sign in to Pi Harness Academy',
      text: expect.stringContaining('This link expires in 10 minutes.'),
      html: expect.stringContaining('Continue to Academy'),
    }))
  })
})
