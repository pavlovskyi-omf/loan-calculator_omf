import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { LanguageSelector } from './LanguageSelector'
import * as useI18nModule from '../i18n/useI18n'

describe('LanguageSelector', () => {
  it('should render language dropdown with current language', () => {
    render(<LanguageSelector />)

    const select = screen.getByLabelText(/language.label/i)
    expect(select).toBeInTheDocument()
    expect(select).toHaveValue('en')
  })

  it('should display all supported languages', () => {
    render(<LanguageSelector />)

    expect(screen.getByRole('option', { name: /english/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /deutsch/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /українська/i })).toBeInTheDocument()
  })

  it('should call changeLanguage when selecting a different language', async () => {
    const user = userEvent.setup()
    const mockChangeLanguage = vi.fn().mockResolvedValue(undefined)

    vi.spyOn(useI18nModule, 'useI18n').mockReturnValue({
      t: (key: string) => key,
      currentLanguage: 'en',
      changeLanguage: mockChangeLanguage,
      isLoading: false,
      error: null,
      languages: {
        en: { code: 'en', name: 'English', localeCode: 'en-US', currencyCode: 'USD', direction: 'ltr' },
        de: { code: 'de', name: 'Deutsch', localeCode: 'de-DE', currencyCode: 'EUR', direction: 'ltr' },
        uk: { code: 'uk', name: 'Українська', localeCode: 'uk-UA', currencyCode: 'UAH', direction: 'ltr' },
      },
      formatNumber: (value: number) => value.toLocaleString('en-US'),
      formatCurrency: (value: number) => `$${value.toLocaleString('en-US')}`,
    })

    render(<LanguageSelector />)

    const select = screen.getByLabelText(/language.label/i)
    await user.selectOptions(select, 'de')

    expect(mockChangeLanguage).toHaveBeenCalledWith('de')
  })

  it('should disable dropdown when loading', () => {
    vi.spyOn(useI18nModule, 'useI18n').mockReturnValue({
      t: (key: string) => key,
      currentLanguage: 'en',
      changeLanguage: vi.fn(),
      isLoading: true,
      error: null,
      languages: {
        en: { code: 'en', name: 'English', localeCode: 'en-US', currencyCode: 'USD', direction: 'ltr' },
        de: { code: 'de', name: 'Deutsch', localeCode: 'de-DE', currencyCode: 'EUR', direction: 'ltr' },
        uk: { code: 'uk', name: 'Українська', localeCode: 'uk-UA', currencyCode: 'UAH', direction: 'ltr' },
      },
      formatNumber: (value: number) => value.toLocaleString('en-US'),
      formatCurrency: (value: number) => `$${value.toLocaleString('en-US')}`,
    })

    render(<LanguageSelector />)

    const select = screen.getByLabelText(/language.label/i)
    expect(select).toBeDisabled()
  })

  it('should have accessible label', () => {
    render(<LanguageSelector />)

    const select = screen.getByRole('combobox', { name: /language.label/i })
    expect(select).toHaveAccessibleName()
  })
})
