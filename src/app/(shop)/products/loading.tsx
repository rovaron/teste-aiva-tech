import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export default function ProductsLoading() {
  return (
    <div className='container py-8'>
      {/* Header Skeleton */}
      <div className='mb-8'>
        <Skeleton className='mb-2 h-9 w-64' />
        <Skeleton className='h-5 w-96' />
      </div>

      {/* Filters Skeleton */}
      <div className='mb-8 space-y-4'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <Skeleton className='h-10 w-full max-w-sm' />

          <div className='flex items-center gap-2'>
            <Skeleton className='h-10 w-[180px]' />
            <Skeleton className='h-10 w-[180px]' />
            <Skeleton className='h-10 w-[72px]' />
          </div>
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className='overflow-hidden'>
            <CardHeader className='p-0'>
              <Skeleton className='aspect-square w-full' />
            </CardHeader>

            <CardContent className='p-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-5 w-full' />
                <Skeleton className='h-4 w-24' />
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-6 w-20' />
                  <Skeleton className='h-4 w-16' />
                </div>
              </div>
            </CardContent>

            <CardFooter className='p-4 pt-0'>
              <Skeleton className='h-9 w-full' />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Load More Skeleton */}
      <div className='mt-12 text-center'>
        <Skeleton className='mx-auto h-10 w-48' />
      </div>
    </div>
  )
}
