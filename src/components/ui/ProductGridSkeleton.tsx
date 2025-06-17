export function ProductGridSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className='overflow-hidden rounded-lg bg-white shadow-md'>
          <div className='h-48 animate-pulse bg-gray-200' />
          <div className='space-y-2 p-4'>
            <div className='h-4 animate-pulse rounded bg-gray-200' />
            <div className='h-3 w-3/4 animate-pulse rounded bg-gray-200' />
            <div className='h-4 w-1/2 animate-pulse rounded bg-gray-200' />
          </div>
        </div>
      ))}
    </div>
  )
}
