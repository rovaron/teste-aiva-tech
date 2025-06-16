'use client'

import { motion } from 'framer-motion'

interface ProductDetailTemplateProps {
  children: React.ReactNode
}

export default function ProductDetailTemplate({ children }: ProductDetailTemplateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}