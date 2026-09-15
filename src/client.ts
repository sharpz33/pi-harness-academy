export const clientScript = `(() => {
  const isPolish = document.documentElement.lang === 'pl'
  const copyMessages = isPolish
    ? { missing: 'Nie udało się skopiować: tekst jest niedostępny.', copied: 'Skopiowano.', fallback: 'Kopiowanie jest niedostępne. Tekst został zaznaczony — skopiuj go ręcznie.' }
    : { missing: 'Copy failed: text is unavailable.', copied: 'Copied.', fallback: 'Copy unavailable. Text selected—copy it manually.' }

  const setCopyStatus = (button, message, state) => {
    const statusId = button.getAttribute('aria-describedby')
    const status = statusId ? document.getElementById(statusId) : null

    if (status) {
      status.textContent = message
      status.dataset.state = state
    }
  }

  const selectCopyTarget = (target) => {
    target.focus()

    if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) {
      target.select()
      return
    }

    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(target)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  document.addEventListener('click', async (event) => {
    if (!(event.target instanceof Element)) return

    const button = event.target.closest('[data-copy-target]')
    if (!button) return

    const targetId = button.dataset.copyTarget
    const target = targetId ? document.getElementById(targetId) : null
    if (!target) {
      setCopyStatus(button, copyMessages.missing, 'error')
      return
    }

    const text = 'value' in target ? target.value : target.textContent

    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
        throw new Error('Clipboard API unavailable')
      }

      await navigator.clipboard.writeText(text || '')
      setCopyStatus(button, copyMessages.copied, 'success')
    } catch {
      selectCopyTarget(target)
      setCopyStatus(button, copyMessages.fallback, 'error')
    }
  })

  const evidenceChecks = Array.from(document.querySelectorAll('[data-evidence-check]'))
  const evidenceReady = document.querySelector('[data-evidence-ready]')

  const updateEvidence = () => {
    if (!evidenceReady) return

    const isReady = evidenceChecks.length === 4 && evidenceChecks.every((check) => check.checked)
    evidenceReady.hidden = !isReady
  }

  evidenceChecks.forEach((check) => check.addEventListener('change', updateEvidence))
  updateEvidence()
})()`
