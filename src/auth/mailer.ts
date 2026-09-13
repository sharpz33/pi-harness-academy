import type { AuthMailer, LoginLinkMessage } from './types'

const escapeHtml = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')

export class CloudflareAuthMailer implements AuthMailer {
  constructor(
    private readonly email: SendEmail,
    private readonly from: string,
  ) {}

  async sendLoginLink(message: LoginLinkMessage): Promise<void> {
    const subject = 'Sign in to Pi Harness Academy'
    const text = `Confirm your Pi Harness Academy sign-in:\n\n${message.url}\n\nThis link expires in ${message.expiresInMinutes} minutes. If you did not request it, ignore this email.`
    const html = `<p>Confirm your Pi Harness Academy sign-in:</p><p><a href="${escapeHtml(message.url)}">Continue to Academy</a></p><p>This link expires in ${message.expiresInMinutes} minutes. If you did not request it, ignore this email.</p>`

    await this.email.send({
      from: this.from,
      to: message.to,
      subject,
      text,
      html,
    })
  }
}
