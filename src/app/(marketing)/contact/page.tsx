import { Metadata } from 'next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato conosco. Estamos aqui para ajudar com suas dúvidas e necessidades.',
}

export default function ContactPage() {
  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="mx-auto max-w-4xl text-center mb-16">
        <Badge variant="outline" className="mb-4">
          Contato
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          Entre em <span className="text-primary">Contato</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-8">
          Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo 
          ou envie uma mensagem diretamente pelo formulário.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <MapPin className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Endereço</h3>
                  <p className="text-sm text-muted-foreground">Nossa localização</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Rua das Flores, 123<br />
                Centro - São Paulo, SP<br />
                CEP: 01234-567
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Phone className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Telefone</h3>
                  <p className="text-sm text-muted-foreground">Ligue para nós</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                (11) 9999-9999<br />
                (11) 8888-8888
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Mail className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">E-mail</h3>
                  <p className="text-sm text-muted-foreground">Envie uma mensagem</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                contato@store.com<br />
                suporte@store.com
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Clock className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Horário</h3>
                  <p className="text-sm text-muted-foreground">Atendimento</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 8h às 14h</p>
                <p>Domingo: Fechado</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Envie uma Mensagem</h2>
              <p className="text-muted-foreground">
                Preencha o formulário abaixo e entraremos em contato o mais breve possível.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      Nome *
                    </label>
                    <Input
                      id="firstName"
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Sobrenome *
                    </label>
                    <Input
                      id="lastName"
                      placeholder="Seu sobrenome"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    E-mail *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Telefone
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Assunto *
                  </label>
                  <Input
                    id="subject"
                    placeholder="Assunto da sua mensagem"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Descreva sua dúvida ou necessidade..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground">
            Encontre respostas para as dúvidas mais comuns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Como posso rastrear meu pedido?</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Após a confirmação do pagamento, você receberá um código de rastreamento 
                por e-mail para acompanhar sua entrega.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold">Qual o prazo de entrega?</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                O prazo varia de acordo com sua localização, mas geralmente é de 
                3 a 7 dias úteis para todo o território nacional.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold">Posso trocar ou devolver um produto?</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sim! Você tem até 30 dias para trocar ou devolver qualquer produto, 
                desde que esteja em perfeitas condições.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold">Quais formas de pagamento aceitas?</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
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