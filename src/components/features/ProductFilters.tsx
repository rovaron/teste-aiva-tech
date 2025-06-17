'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/lib/types'

interface ProductFiltersProps {
  categories: Category[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='mb-3 font-semibold'>Categories</h3>
        <div className='space-y-2'>
          <button
            onClick={() => updateFilter('category', '')}
            className='block w-full rounded p-2 text-left hover:bg-gray-100'
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => updateFilter('category', category.id.toString())}
              className='block w-full rounded p-2 text-left hover:bg-gray-100'
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className='mb-3 font-semibold'>Search</h3>
        <input
          type='text'
          placeholder='Search products...'
          className='w-full rounded border p-2'
          onChange={e => updateFilter('search', e.target.value)}
          defaultValue={searchParams.get('search') || ''}
        />
      </div>
    </div>
  )
}
