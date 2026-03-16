'use client'

import React from 'react'
import { IconType } from 'react-icons'
import styles from './Button/Button.module.css'

type ButtonProps = {
  children: React.ReactNode
  icon?: IconType
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className: string
}

export default function Button({
  children,
  icon: Icon,
  onClick,
  className,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {Icon && <Icon size={18} className={styles.icon} />}
      <span>{children}</span>
    </button>
  )
}