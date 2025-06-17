import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidImageUrl(url: string | undefined | null): string {
  const placeholder = '/placeholder-image.svg'
  if (!url) {
    return placeholder
  }
  try {
    const parsedUrl = new URL(url)
    // Verifica se o protocolo é http ou https e se tem uma extensão de imagem comum
    if (
      (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') &&
      /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(parsedUrl.pathname)
    ) {
      return url
    }
    return placeholder
  } catch (_error) {
    // Se a URL for relativa (ex: /image.png) e tiver extensão de imagem, considera válida
    if (url.startsWith('/') && /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(url)) {
      return url
    }
    return placeholder
  }
}
