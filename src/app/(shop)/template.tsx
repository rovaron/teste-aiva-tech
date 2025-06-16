'use client'

import { motion } from 'framer-motion'

interface ShopTemplateProps {
  children: React.ReactNode
}

export default function ShopTemplate({ children }: ShopTemplateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}