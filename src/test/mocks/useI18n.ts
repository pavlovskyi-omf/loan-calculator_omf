import { vi } from 'vitest'
import { UseI18nReturn } from '../../i18n/useI18n'
import { localeConfigs } from '../../i18n/config'

/**
 * Mock implementation of useI18n hook for testing.
 */
export const createMockUseI18n = (
  overrides?: Partial<UseI18nReturn>
): UseI18nReturn => ({
  t: vi.fn((key: string) => key),
  currentLanguage: 'en',
  changeLanguage: vi.fn().mockResolvedValue(undefined),
  isLoading: false,
  error: null,
  languages: localeConfigs,
  formatNumber: vi.fn((value: number) => value.toLocaleString('en-US')),
  formatCurrency: vi.fn((value: number) => 
    `$${value.toLocaleString('en-US')}`
  ),
  ...overrides,
})

/**
 * Default mock for useI18n hook.
 */
export const mockUseI18n = createMockUseI18n()
