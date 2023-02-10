import { ButtonSize, ButtonView } from '@/ui/button';

export const BUTTON_SIZES: Record<ButtonSize, string> = {
  l: 'text-base py-1 px-5',
  m: 'text-base py-1 px-5',
  s: 'text-base py-1 px-5',
  xs: 'text-sm py-1 px-5',
  xxs: 'text-sm py-1 px-5',
};

export const BUTTON_COLORS: Record<ButtonView, string> = {
  accent: 'bg-orange',
  blue: 'bg-blue',
  'bordered-dark': 'border border-dark text-dark',
  'bordered-white': 'border border-[#2F3139] hover:border-white',
  'dark-light': 'bg-dark-light',
  gradient: 'bg-gradient-to-tr from-blue via-[#F86443CE] to-orange',
  white: 'bg-white text-dark',
};
