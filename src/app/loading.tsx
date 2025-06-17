import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className='container py-8'>
      <div className='space-y-8'>
        {/* Header skeleton */}
        <div className='space-y-4'>
          <Skeleton className='h-12 w-3/4' />
          <Skeleton className='h-6 w-1/2' />
        </div>

        {/* Content skeleton */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='space-y-4'>
              <Skeleton className='h-48 w-full' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
