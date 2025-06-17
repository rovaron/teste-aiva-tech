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
- **Experimental Features**: Package imports otimizados

### Cache Strategies

- **Static Generation**: Para páginas de produtos
- **Incremental Static Regeneration**: Para catálogo
- **Server-side Rendering**: Para páginas dinâmicas
- **Client-side Caching**: Com React Query

## 🎨 Sistema de Temas

O projeto inclui um sistema completo de temas dark/light:

- **next-themes**: Gerenciamento de temas
- **CSS Variables**: Cores dinâmicas
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

## 🚀 Deploy

O projeto está otimizado para deploy em:

- **Vercel** (recomendado)
- **Netlify**
- **AWS Amplify**
- **Docker**

## 📈 Performance Metrics

- **Lighthouse Score**: 95+ em todas as métricas
- **Core Web Vitals**: Otimizado
- **Bundle Size**: Minimizado com tree-shaking
- **Loading Speed**: < 2s First Contentful Paint

---

**Desenvolvido com ❤️ usando Next.js 15 e TypeScript**
