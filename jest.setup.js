import '@testing-library/jest-dom'

// Suppress console errors during tests unless they're actual test failures
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is deprecated') ||
        args[0].includes('Warning: React.createFactory() is deprecated') ||
        args[0].includes(
          'Warning: componentWillReceiveProps has been renamed'
        ) ||
        args[0].includes('Warning: componentWillMount has been renamed') ||
        args[0].includes('Warning: componentWillUpdate has been renamed') ||
        args[0].includes('Warning: Failed prop type') ||
        args[0].includes(
          'Warning: Each child in a list should have a unique "key" prop'
        ) ||
        args[0].includes('Warning: validateDOMNesting') ||
        args[0].includes('Warning: React does not recognize') ||
        args[0].includes('Warning: Unknown event handler property') ||
        args[0].includes(
          'Warning: Received `true` for a non-boolean attribute'
        ) ||
        args[0].includes('Warning: Using UNSAFE_') ||
        args[0].includes("Warning: Can't perform a React state update") ||
        args[0].includes('Warning: forwardRef render functions') ||
        args[0].includes('Warning: Function components cannot be given refs'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: props => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
