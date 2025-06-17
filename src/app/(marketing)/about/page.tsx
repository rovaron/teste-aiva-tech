import { Metadata } from 'next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Target, Award, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description:
    'Conheça nossa história, missão e valores. Saiba mais sobre nossa equipe e compromisso com a excelência.',
}

export default function AboutPage() {
  return (
    <div className='container py-12'>
      {/* Hero Section */}
      <div className='mx-auto mb-16 max-w-4xl text-center'>
        <Badge variant='outline' className='mb-4'>
          Sobre Nós
        </Badge>
        <h1 className='mb-6 text-4xl font-bold tracking-tight sm:text-5xl'>
          Nossa História e <span className='text-primary'>Missão</span>
        </h1>
        <p className='text-muted-foreground text-lg leading-8'>
          Somos uma empresa dedicada a oferecer produtos de alta qualidade e uma
          experiência de compra excepcional. Nossa jornada começou com a visão
          de revolucionar o e-commerce através da tecnologia e do atendimento
          personalizado.
        </p>
      </div>

      {/* Values Section */}
      <div className='mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='text-center'>
            <div className='bg-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
              <Users className='text-primary-foreground h-6 w-6' />
            </div>
            <h3 className='text-lg font-semibold'>Foco no Cliente</h3>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-center text-sm'>
              Colocamos nossos clientes no centro de tudo que fazemos,
              garantindo satisfação e excelência no atendimento.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='text-center'>
            <div className='bg-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
              <Target className='text-primary-foreground h-6 w-6' />
            </div>
            <h3 className='text-lg font-semibold'>Inovação</h3>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-center text-sm'>
              Utilizamos as mais modernas tecnologias para criar soluções
              inovadoras e eficientes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='text-center'>
            <div className='bg-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
              <Award className='text-primary-foreground h-6 w-6' />
            </div>
            <h3 className='text-lg font-semibold'>Qualidade</h3>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-center text-sm'>
              Comprometemo-nos com a mais alta qualidade em todos os nossos
              produtos e serviços.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='text-center'>
            <div className='bg-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
              <Heart className='text-primary-foreground h-6 w-6' />
            </div>
            <h3 className='text-lg font-semibold'>Paixão</h3>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-center text-sm'>
              Fazemos o que amamos com dedicação e entusiasmo, buscando sempre
              superar expectativas.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Story Section */}
      <div className='mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
        <div>
          <h2 className='mb-6 text-3xl font-bold tracking-tight'>
            Nossa Jornada
          </h2>
          <div className='text-muted-foreground space-y-4'>
            <p>
              Fundada em 2020, nossa empresa nasceu da necessidade de criar uma
              plataforma de e-commerce que combinasse tecnologia de ponta com
              uma experiência de usuário excepcional.
            </p>
            <p>
              Começamos como uma pequena startup com grandes sonhos e, através
              de muito trabalho e dedicação, crescemos para nos tornar uma
              referência no mercado digital.
            </p>
            <p>
              Hoje, atendemos milhares de clientes em todo o país, mantendo
              sempre nosso compromisso com a qualidade, inovação e atendimento
              personalizado.
            </p>
          </div>
        </div>

        <div className='bg-muted rounded-lg p-8'>
          <h3 className='mb-4 text-xl font-semibold'>Nossos Números</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div className='text-center'>
              <div className='text-primary text-2xl font-bold'>10k+</div>
              <div className='text-muted-foreground text-sm'>
                Clientes Satisfeitos
              </div>
            </div>
            <div className='text-center'>
              <div className='text-primary text-2xl font-bold'>500+</div>
              <div className='text-muted-foreground text-sm'>Produtos</div>
            </div>
            <div className='text-center'>
              <div className='text-primary text-2xl font-bold'>99%</div>
              <div className='text-muted-foreground text-sm'>Satisfação</div>
            </div>
            <div className='text-center'>
              <div className='text-primary text-2xl font-bold'>24/7</div>
              <div className='text-muted-foreground text-sm'>Suporte</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className='bg-muted/50 rounded-lg p-12 text-center'>
        <h2 className='mb-6 text-3xl font-bold tracking-tight'>Nossa Missão</h2>
        <p className='text-muted-foreground mx-auto max-w-3xl text-lg'>
          Democratizar o acesso a produtos de qualidade através de uma
          plataforma tecnológica avançada, oferecendo uma experiência de compra
          segura, conveniente e personalizada para cada cliente.
        </p>
      </div>
    </div>
  )
}
