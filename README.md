# Store - Next.js 15 E-commerce Platform

Uma plataforma de e-commerce moderna construída com Next.js 15, TypeScript e focada em performance nativa.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização utilitária
- **Zustand** - Gerenciamento de estado
- **Zod** - Validação de schemas
- **Lucide React** - Ícones
- **Framer Motion** - Animações
- **Sonner** - Notificações toast
- **next-themes** - Sistema de temas

## 🤔 Decisões Técnicas

### Por que Next.js ao invés de Vite?

#### Vantagens do Next.js para E-commerce

**1. SEO e Performance Nativa**
- **Server-Side Rendering (SSR)**: Páginas de produtos renderizadas no servidor para melhor SEO
- **Static Site Generation (SSG)**: Catálogo de produtos gerado estaticamente para máxima performance
- **Incremental Static Regeneration (ISR)**: Atualização automática de produtos sem rebuild completo
- **Image Optimization**: Otimização automática de imagens de produtos (WebP, AVIF, lazy loading)

#### Limitações do Vite para E-commerce

**1. SEO Challenges**
- SPA por padrão, requer configuração complexa para SSR
- Meta tags dinâmicas mais difíceis de implementar
- Structured data e Open Graph requerem soluções adicionais

**2. Backend Separation**
- Necessita backend separado (Express, Fastify, etc.)
- Complexidade adicional para deploy e manutenção
- Latência entre frontend e backend

**3. E-commerce Features**
- Sem otimizações nativas para e-commerce
- Cache strategies manuais
- Image optimization requer plugins externos

### Estratégia de Geração Estática

#### Produtos Estáticos (SSG)

```typescript
// Geração estática de páginas de produtos
export async function generateStaticParams() {
  const products = await getProducts()
  return products.map(product => ({ id: product.id }))
}

// Revalidação incremental
export const revalidate = 3600 // 1 hora
```

**Benefícios:**
- **Performance**: Páginas servidas diretamente do CDN
- **SEO**: HTML completo disponível para crawlers
- **Costs**: Redução de custos de servidor
- **Reliability**: Funciona mesmo com API offline

#### Catálogo Dinâmico (ISR)

```typescript
// Revalidação sob demanda
export async function revalidateProduct(productId: string) {
  await revalidatePath(`/products/${productId}`)
  await revalidateTag('products')
}
```

**Vantagens:**
- **Fresh Content**: Produtos sempre atualizados
- **Performance**: Primeira visita serve versão cached
- **Flexibility**: Atualização sem rebuild completo

#### Páginas Administrativas (SSR)

```typescript
// Renderização no servidor para dados sensíveis
export default async function AdminPage() {
  const products = await getProductsAdmin()
  return <AdminDashboard products={products} />
}
```

**Justificativas:**
- **Security**: Dados sensíveis não expostos no cliente
- **Real-time**: Informações sempre atualizadas
- **Authentication**: Verificação de permissões no servidor

### Arquitetura de Cache

#### Multi-layer Caching

1. **CDN Level**: Vercel Edge Network
2. **Server Level**: Next.js Data Cache
4. **Client Level**: React Query para estado servidor


## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Route groups para autenticação
│   ├── (shop)/            # Route groups para e-commerce
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   ├── layout/            # Componentes de layout (Header, Footer)
│   ├── features/          # Componentes por feature
│   └── providers/         # Providers (Theme, etc.)
├── lib/                   # Configurações e utilities
│   ├── utils.ts           # Funções utilitárias
│   ├── constants.ts       # Constantes da aplicação
│   └── validations.ts     # Schemas de validação Zod
├── stores/                # Stores Zustand
│   ├── cart-store.ts      # Estado do carrinho
│   └── ui-store.ts        # Estado da UI
├── types/                 # Tipos TypeScript
│   └── global.ts          # Tipos globais
└── actions/               # Server Actions
    └── product-actions.ts # Ações de produtos
```

## 🎯 Filosofia de Desenvolvimento

### Server Components First

- Prioriza Server Components para melhor performance
- Client Components apenas quando necessário
- Hidratação mínima no cliente

### Performance Nativa

- Cache strategies otimizadas (ISR, SSG)
- Image optimization automática
- Bundle splitting inteligente
- Lazy loading de componentes

### TypeScript Strict

- Tipagem rigorosa em todo o projeto
- Validação com Zod
- Type safety em runtime

## 🛠️ Configurações de Performance

### Next.js Optimizations

- **Image Optimization**: AVIF/WebP automático
- **Bundle Optimization**: Code splitting otimizado
- **Turbopack**: Build system ultra-rápido

### Cache Strategies

- **Static Generation**: Para páginas de produtos
- **Incremental Static Regeneration**: Para catálogo
- **Server-side Rendering**: Para páginas dinâmicas
- **Client-side Caching**: Com React Query

## 🎨 Sistema de Temas

O projeto inclui um sistema completo de temas dark/light:

- **next-themes**: Gerenciamento de temas
- **System Preference**: Detecção automática
- **Persistência**: Estado salvo no localStorage

## 🛒 Gerenciamento de Estado

### Zustand Stores

#### Cart Store (`useCartStore`)

```typescript
// Adicionar item ao carrinho
const { addItem } = useCartStore()
addItem({ id: '1', name: 'Produto', price: 99.99 })

// Obter total de itens
const totalItems = useCartStore(state => state.getTotalItems())
```

#### UI Store (`useUIStore`)

```typescript
// Controlar sidebar
const { toggleSidebar } = useUIStore()

// Gerenciar modais
const { openModal, closeModal } = useUIStore()
```

## 📝 Validação de Dados

Todos os formulários e APIs usam validação Zod:

```typescript
import { productSchema } from '@/lib/validations'

// Validar dados de produto
const result = productSchema.safeParse(data)
if (!result.success) {
  console.error(result.error.errors)
}
```

## 🚀 Server Actions

Exemplo de Server Action para produtos:

```typescript
import { createProduct } from '@/actions/product-actions'

// Em um componente
const handleSubmit = async (formData: FormData) => {
  const result = await createProduct(formData)
  if (result.success) {
    toast.success(result.message)
  }
}
```

## 🎯 Componentes Principais

### Layout Components

- **Header**: Navegação, busca, carrinho, tema
- **Footer**: Links, informações, redes sociais
- **ThemeToggle**: Alternador de tema

### Feature Components

- Organizados por funcionalidade
- Reutilizáveis e modulares
- Props tipadas com TypeScript

## 📱 Responsividade

- **Mobile First**: Design responsivo
- **Breakpoints**: Tailwind CSS padrão
- **Touch Friendly**: Interfaces otimizadas para mobile

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento com Turbopack
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm run start

# Linting
npm run lint
```

## ⚠️ Observações sobre a API

A partir das 20h de hoje, foi observado um comportamento estranho na API externa utilizada no projeto. Durante o desenvolvimento do CRUD e páginas administrativas, os produtos e usuários estavam sendo resetados frequentemente, o que atrapalhou significativamente o progresso.

Devido a essa instabilidade da API (que afetou até mesmo os dados inseridos manualmente), foi necessário reverter para um commit anterior do dia, onde o CRUD administrativo ainda não havia sido implementado.

**Status atual**: O projeto está em um estado estável anterior à implementação completa do painel administrativo.

---

**Desenvolvido com ❤️ usando Next.js 15 e TypeScript**
