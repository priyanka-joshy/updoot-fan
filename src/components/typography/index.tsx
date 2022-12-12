import React, { HTMLAttributes } from 'react';
import styles from './styles.module.scss';

export const Heading1 = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    style={{ ...props.style, color: props.color }}
    className={`${styles.heading1} ${props.className}`}>
    {props.children}
  </div>
);

export const Heading2 = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    style={{ ...props.style, color: props.color }}
    className={`${styles.heading2} ${props.className}`}>
    {props.children}
  </div>
);

export const Heading3 = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    style={{ ...props.style, color: props.color }}
    className={`${styles.heading3} ${props.className}`}>
    {props.children}
  </div>
);

export const Heading4 = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    style={{ ...props.style, color: props.color }}
    className={`${styles.heading4} ${props.className}`}>
    {props.children}
  </div>
);

export const Subheading1 = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    style={{ ...props.style, color: props.color }}
    className={`${styles.subheading1} ${props.className}`}>
    {props.children}
  </div>
);

export const Subheading2 = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    style={{ ...props.style, color: props.color }}
    className={`${styles.subheading2} ${props.className}`}>
    {props.children}
  </div>
);

export const Subheading3 = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    style={{ ...props.style, color: props.color }}
    className={`${styles.subheading3} ${props.className}`}>
    {props.children}
  </div>
);

export const BodyText = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    style={{ ...props.style, color: props.color }}
    className={`${styles.body} ${props.className}`}>
    {props.children}
  </div>
);
