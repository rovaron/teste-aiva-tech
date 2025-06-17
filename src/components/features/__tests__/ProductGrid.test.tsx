import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProductGrid } from '../ProductGrid'
import { Product } from '@/lib/types'

// Mock do QuickAddButton
jest.mock('../AddToCartButton', () => ({
  QuickAddButton: ({ product }: { product: { id: string } }) => (
    <button data-testid={`quick-add-${product.id}`}>
      Adicionar ao Carrinho
    </button>
  ),
}))

// Mock do framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: {
      children: React.ReactNode;
      variants?: unknown;
      initial?: unknown;
      whileHover?: unknown;
      animate?: unknown;
      style?: React.CSSProperties;
      [key: string]: unknown;
    }) => {
       const { variants: _variants, initial: _initial, whileHover: _whileHover, animate: _animate, style: _style, ...restProps } = props
       return <div {...restProps}>{children}</div>
     },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock do next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: {
    src: string;
    alt: string;
    fill?: boolean;
    style?: React.CSSProperties;
    [key: string]: unknown;
  }) => {
    const imgProps = { ...props }
    if (fill) {
      imgProps.style = { ...imgProps.style, width: '100%', height: '100%' }
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...imgProps} data-testid="product-image" />
  },
}))

// Mock do next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Produto 1',
    description: 'Descrição do produto 1',
    price: 99.99,
    images: ['/images/product1.jpg'],
    category: {
      id: '1',
      name: 'Categoria 1',
      slug: 'categoria-1'
    },
    slug: 'produto-1'
  },
  {
    id: '2',
    title: 'Produto 2',
    description: 'Descrição do produto 2',
    price: 149.99,
    images: ['/images/product2.jpg'],
    category: {
      id: '2',
      name: 'Categoria 2',
      slug: 'categoria-2'
    },
    slug: 'produto-2'
  },
  {
    id: '3',
    title: 'Produto 3',
    description: 'Descrição do produto 3',
    price: 199.99,
    images: ['/images/product3.jpg'],
    category: {
      id: '1',
      name: 'Categoria 1',
      slug: 'categoria-1'
    },
    slug: 'produto-3'
  }
]

describe('ProductGrid', () => {
  it('renders all products', () => {
    render(<ProductGrid products={mockProducts} />)
    
    expect(screen.getByText('Produto 1')).toBeInTheDocument()
    expect(screen.getByText('Produto 2')).toBeInTheDocument()
    expect(screen.getByText('Produto 3')).toBeInTheDocument()
  })

  it('displays product prices correctly', () => {
    render(<ProductGrid products={mockProducts} />)
    
    expect(screen.getByText('R$ 99.99')).toBeInTheDocument()
    expect(screen.getByText('R$ 149.99')).toBeInTheDocument()
    expect(screen.getByText('R$ 199.99')).toBeInTheDocument()
  })

  it('renders product images with correct alt text', () => {
    render(<ProductGrid products={mockProducts} />)
    
    const images = screen.getAllByTestId('product-image')
    expect(images).toHaveLength(3)
    expect(images[0]).toHaveAttribute('alt', 'Produto 1')
    expect(images[1]).toHaveAttribute('alt', 'Produto 2')
    expect(images[2]).toHaveAttribute('alt', 'Produto 3')
  })

  it('renders quick add buttons for all products', () => {
    render(<ProductGrid products={mockProducts} />)
    
    expect(screen.getByTestId('quick-add-1')).toBeInTheDocument()
    expect(screen.getByTestId('quick-add-2')).toBeInTheDocument()
    expect(screen.getByTestId('quick-add-3')).toBeInTheDocument()
  })

  it('renders product links with correct href', () => {
    render(<ProductGrid products={mockProducts} />)
    
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/products/produto-1')
    expect(links[1]).toHaveAttribute('href', '/products/produto-2')
    expect(links[2]).toHaveAttribute('href', '/products/produto-3')
  })

  it('displays category names', () => {
    render(<ProductGrid products={mockProducts} />)
    
    expect(screen.getAllByText('Categoria 1')).toHaveLength(2)
    expect(screen.getByText('Categoria 2')).toBeInTheDocument()
  })

  it('renders empty grid when no products provided', () => {
    render(<ProductGrid products={[]} />)
    
    const grid = screen.getByTestId('product-grid')
    expect(grid).toHaveClass('grid')
    expect(grid).toBeEmptyDOMElement()
  })
})