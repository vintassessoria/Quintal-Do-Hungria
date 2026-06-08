'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Respeita prefers-reduced-motion globalmente para todas as animações
 * Framer Motion da página.
 */
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
