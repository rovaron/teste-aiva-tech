'use client'

import { motion } from 'framer-motion'

interface AuthTemplateProps {
  children: React.ReactNode
}

export default function AuthTemplate({ children }: AuthTemplateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}