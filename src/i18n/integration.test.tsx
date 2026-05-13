import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import i18n from '../i18n/i18n'
import { I18nProvider } from '../i18n/I18nProvider'
import { LanguageSelector } from '../components/LanguageSelector'

describe('i18n Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset i18n to English
    i18n.changeLanguage('en')
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should default to English on first load', async () => {
    render(
      <I18nProvider>
        <LanguageSelector />
      </I18nProvider>
    )

    await waitFor(() => {
      const select = screen.getByRole('combobox')
      expect(select).toHaveValue('en')
    })
  })

  it('should persist language selection to localStorage', async () => {
    const user = userEvent.setup()

    render(
      <I18nProvider>
        <LanguageSelector />
      </I18nProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'de')

    await waitFor(() => {
      expect(localStorage.getItem('app_language')).toBe('de')
    })
  })

  it('should restore language from localStorage on mount', async () => {
    localStorage.setItem('app_language', 'uk')

    render(
      <I18nProvider>
        <LanguageSelector />
      </I18nProvider>
    )

    await waitFor(() => {
      const select = screen.getByRole('combobox')
      expect(select).toHaveValue('uk')
    })
  })

  it('should update document.documentElement.lang when language changes', async () => {
    const user = userEvent.setup()

    render(
      <I18nProvider>
        <LanguageSelector />
      </I18nProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'de')

    await waitFor(() => {
      expect(document.documentElement.lang).toBe('de')
    })
  })

  it('should handle localStorage errors gracefully', async () => {
    // Mock localStorage to throw error
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error('Quota exceeded')
    })

    const user = userEvent.setup()

    render(
      <I18nProvider>
        <LanguageSelector />
      </I18nProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    const select = screen.getByRole('combobox')
    
    // Should not throw error
    await expect(user.selectOptions(select, 'de')).resolves.not.toThrow()

    // Restore original
    Storage.prototype.setItem = originalSetItem
  })

  it('should fall back to English if invalid language in localStorage', async () => {
    localStorage.setItem('app_language', 'invalid')

    render(
      <I18nProvider>
        <LanguageSelector />
      </I18nProvider>
    )

    await waitFor(() => {
      const select = screen.getByRole('combobox')
      expect(select).toHaveValue('en')
    })
  })
})
