import { Metadata } from 'next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Entre em contato conosco. Estamos aqui para ajudar com suas dúvidas e necessidades.',
}

export default function ContactPage() {
  return (
    <div className='container py-12'>
      {/* Hero Section */}
      <div className='mx-auto mb-16 max-w-4xl text-center'>
        <Badge variant='outline' className='mb-4'>
          Contato
        </Badge>
        <h1 className='mb-6 text-4xl font-bold tracking-tight sm:text-5xl'>
          Entre em <span className='text-primary'>Contato</span>
        </h1>
        <p className='text-muted-foreground text-lg leading-8'>
          Estamos aqui para ajudar! Entre em contato conosco através dos canais
          abaixo ou envie uma mensagem diretamente pelo formulário.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Contact Info */}
        <div className='space-y-6 lg:col-span-1'>
          <Card>
            <CardHeader>
              <div className='flex items-center space-x-3'>
                <div className='bg-primary flex h-10 w-10 items-center justify-center rounded-lg'>
                  <MapPin className='text-primary-foreground h-5 w-5' />
                </div>
                <div>
                  <h3 className='font-semibold'>Endereço</h3>
                  <p className='text-muted-foreground text-sm'>
                    Nossa localização
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                Rua das Flores, 123
                <br />
                Centro - São Paulo, SP
                <br />
                CEP: 01234-567
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center space-x-3'>
                <div className='bg-primary flex h-10 w-10 items-center justify-center rounded-lg'>
                  <Phone className='text-primary-foreground h-5 w-5' />
                </div>
                <div>
                  <h3 className='font-semibold'>Telefone</h3>
                  <p className='text-muted-foreground text-sm'>
                    Ligue para nós
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                (11) 9999-9999
                <br />
                (11) 8888-8888
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center space-x-3'>
                <div className='bg-primary flex h-10 w-10 items-center justify-center rounded-lg'>
                  <Mail className='text-primary-foreground h-5 w-5' />
                </div>
                <div>
                  <h3 className='font-semibold'>E-mail</h3>
                  <p className='text-muted-foreground text-sm'>
                    Envie uma mensagem
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                contato@store.com
                <br />
                suporte@store.com
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center space-x-3'>
                <div className='bg-primary flex h-10 w-10 items-center justify-center rounded-lg'>
                  <Clock className='text-primary-foreground h-5 w-5' />
                </div>
                <div>
                  <h3 className='font-semibold'>Horário</h3>
                  <p className='text-muted-foreground text-sm'>Atendimento</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-muted-foreground space-y-1 text-sm'>
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 8h às 14h</p>
                <p>Domingo: Fechado</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <h2 className='text-2xl font-bold'>Envie uma Mensagem</h2>
              <p className='text-muted-foreground'>
                Preencha o formulário abaixo e entraremos em contato o mais
                breve possível.
              </p>
            </CardHeader>
            <CardContent>
              <form className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <label htmlFor='firstName' className='text-sm font-medium'>
                      Nome *
                    </label>
                    <Input id='firstName' placeholder='Seu nome' required />
                  </div>
                  <div className='space-y-2'>
                    <label htmlFor='lastName' className='text-sm font-medium'>
                      Sobrenome *
                    </label>
                    <Input id='lastName' placeholder='Seu sobrenome' required />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label htmlFor='email' className='text-sm font-medium'>
                    E-mail *
                  </label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='seu@email.com'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <label htmlFor='phone' className='text-sm font-medium'>
                    Telefone
                  </label>
                  <Input id='phone' type='tel' placeholder='(11) 99999-9999' />
                </div>

                <div className='space-y-2'>
                  <label htmlFor='subject' className='text-sm font-medium'>
                    Assunto *
                  </label>
                  <Input
                    id='subject'
                    placeholder='Assunto da sua mensagem'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <label htmlFor='message' className='text-sm font-medium'>
                    Mensagem *
                  </label>
                  <textarea
                    id='message'
                    rows={6}
                    className='border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                    placeholder='Descreva sua dúvida ou necessidade...'
                    required
                  />
                </div>

                <Button type='submit' className='w-full'>
                  <Send className='mr-2 h-4 w-4' />
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className='mt-16'>
        <div className='mb-8 text-center'>
          <h2 className='mb-4 text-3xl font-bold tracking-tight'>
            Perguntas Frequentes
          </h2>
          <p className='text-muted-foreground'>
            Encontre respostas para as dúvidas mais comuns
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <h3 className='font-semibold'>Como posso rastrear meu pedido?</h3>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                Após a confirmação do pagamento, você receberá um código de
                rastreamento por e-mail para acompanhar sua entrega.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className='font-semibold'>Qual o prazo de entrega?</h3>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                O prazo varia de acordo com sua localização, mas geralmente é de
                3 a 7 dias úteis para todo o território nacional.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className='font-semibold'>
                Posso trocar ou devolver um produto?
              </h3>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                Sim! Você tem até 30 dias para trocar ou devolver qualquer
                produto, desde que esteja em perfeitas condições.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className='font-semibold'>
                Quais formas de pagamento aceitas?
              </h3>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                Aceitamos cartões de crédito, débito, PIX, boleto bancário e
                parcelamento em até 12x sem juros.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
