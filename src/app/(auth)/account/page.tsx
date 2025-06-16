import Link from 'next/link'
import type { Metadata } from 'next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard,
  Bell,
  Shield,
  LogOut,
  Edit
} from 'lucide-react'
import { getUserFromAPI, logout } from '@/actions/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Minha Conta',
  description: 'Gerencie sua conta, pedidos, endereços e preferências.',
}

// Função para buscar dados do usuário
async function getUserData() {
  const user = await getUserFromAPI()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}



export default async function AccountPage() {
  const user = await getUserData()
  
  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Minha Conta
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais, pedidos e preferências
        </p>
      </div>

      <div className="space-y-8">
        {/* User Info Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge variant="outline" className="mt-2">
                  Usuário verificado
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Account Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Pedidos Realizados</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">R$ 0,00</div>
                <div className="text-sm text-muted-foreground">Total Gasto</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Itens Favoritos</div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <Card id="profile">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Informações Pessoais</h2>
                  <p className="text-sm text-muted-foreground">
                    Gerencie suas informações de perfil
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome Completo</label>
                  <Input value={user.name} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail</label>
                  <Input value={user.email} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <Input value="Não informado" readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data de Nascimento</label>
                  <Input value="Não informado" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card id="orders">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Pedidos Recentes</h2>
                  <p className="text-sm text-muted-foreground">
                    Acompanhe seus últimos pedidos
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/orders">
                    Ver Todos
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido</p>
                <Button asChild>
                  <Link href="/products">
                    Começar a Comprar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Ações Rápidas</h2>
              <p className="text-sm text-muted-foreground">
                Acesse rapidamente as funcionalidades mais utilizadas
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex-col" asChild>
                  <Link href="/orders">
                    <ShoppingBag className="h-6 w-6 mb-2" />
                    <span className="text-sm">Ver Pedidos</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col" asChild>
                  <Link href="/wishlist">
                    <Heart className="h-6 w-6 mb-2" />
                    <span className="text-sm">Lista de Desejos</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col" asChild>
                  <Link href="/addresses">
                    <MapPin className="h-6 w-6 mb-2" />
                    <span className="text-sm">Endereços</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col" asChild>
                  <Link href="/support">
                    <Settings className="h-6 w-6 mb-2" />
                    <span className="text-sm">Suporte</span>
                  </Link>
                </Button>
                <form action={logout}>
                  <Button variant="outline" className="h-auto p-4 flex-col w-full" type="submit">
                    <LogOut className="h-6 w-6 mb-2" />
                    <span className="text-sm">Sair</span>
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}