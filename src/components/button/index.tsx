import React, { ButtonHTMLAttributes } from 'react';

import {
  Heading4,
  Subheading1,
  Subheading2,
  Subheading3,
} from '@components/typography';
import styles from './styles.module.scss';

interface IProps {
  type?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'purple' | 'black';
}

const Button = (
  props: Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof IProps> & IProps
) => {
  const HTMLButtonProps: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof IProps
  > = { ...props };
  props = {
    ...props,
    size: props.size ?? 'md',
    type: props.type ?? 'primary',
    color: props.color ?? 'purple',
  };
  const typography = {
    sm: Subheading3,
    md: Subheading2,
    lg: Subheading1,
    xl: Heading4,
  };
  const Typography = typography[props.size!];
  return (
    <button
      className={[
        styles[props.size!],
        styles[props.disabled ? 'disabled' : `${props.type!}-${props.color!}`],
      ].join(' ')}
      {...HTMLButtonProps}>
      <Typography color="inherit" style={{textAlign: 'center'}}>{props.children}</Typography>
    </button>
  );
};

export default Button;
