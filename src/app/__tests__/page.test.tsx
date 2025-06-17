import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}))

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('Home Page', () => {
  it('renders the hero section with main heading', () => {
    render(<Home />)

    // Check if the main heading is rendered
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/sua loja online/i)
  })

  it('renders navigation links', () => {
    render(<Home />)

    // Check if the "Ver Produtos" link exists
    const productsLink = screen.getByRole('link', { name: /ver produtos/i })
    expect(productsLink).toBeInTheDocument()
    expect(productsLink).toHaveAttribute('href', '/products')
  })

  it('renders the page description', () => {
    render(<Home />)

    // Check if the description text is rendered
    expect(screen.getByText(/desenvolvida com next.js/i)).toBeInTheDocument()
  })

  it('has proper page structure', () => {
    render(<Home />)

    // Check if the main container div exists
    const container = document.querySelector('.flex.flex-col')
    expect(container).toBeInTheDocument()
  })
})
