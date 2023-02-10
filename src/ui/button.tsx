import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

import cc from 'classcat';

import { BUTTON_COLORS, BUTTON_SIZES } from '@/constants/button';

export type ButtonView = 'accent' | 'blue' | 'white' | 'dark-light' | 'bordered-white' | 'bordered-dark' | 'gradient';

export type ButtonSize = 'xxs' | 'xs' | 's' | 'm' | 'l';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mutationKey?: unknown[];
  size?: ButtonSize;
  view?: ButtonView;
}

export const Button = ({
  children,
  className,
  view = 'accent',
  size = 'm',
  type = 'button',
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const btnSize = BUTTON_SIZES[size];
  const btnBg = BUTTON_COLORS[view];

  return (
    <button
      className={cc([`relative rounded-lg bg-blue-300 text-center transition ${btnSize} ${btnBg}`, className])}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};
