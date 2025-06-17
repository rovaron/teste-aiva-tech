## 🎨 Padrões de Motion e Animações

### Princípios de Animação
- **Performance First**: 60fps sempre, use transform e opacity
- **Significado**: toda animação deve ter propósito (feedback, hierarquia, flow)
- **Consistência**: mesma linguagem de movimento em todo o app
- **Acessibilidade**: respeitar `prefers-reduced-motion`
- **Micro-interações**: feedback instantâneo para ações do usuário

### Transições Obrigatórias

#### Page Transitions (App Router)
```tsx
// layout.tsx - Template para transições de página
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0.0, 0.2, 1] // easeOutCubic
      }}
    >
      {children}
    </motion.div>
  )
}
```

#### Component Entrance Animations
```tsx
// Padrão para componentes que entram na tela
const slideUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

#### Loading States
```tsx
// Skeleton loading com pulse suave
const skeletonPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}
```

### Tipos de Animação por Contexto

#### E-commerce Específicas
- **Add to Cart**: 
  - Item escala (1 → 1.05 → 1) + carrinho balança
  - Feedback tátil no mobile (vibration)
  
- **Product Image Gallery**:
  - Swipe com spring physics
  - Zoom com gesture handling
  
- **Filters/Search**:
  - Results com stagger animation
  - Loading spinner customizado
  
- **Checkout Steps**:
  - Slide lateral entre etapas
  - Progress bar animada

#### UI Component Animations
```tsx
// Button hover/press states
const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  pressed: { scale: 0.98 }
}

// Modal/Dialog entrance
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 500 }
  }
}

// Card hover effects
const cardHover = {
  y: -8,
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  transitio# Rules.md - Agente E-commerce

## 🎯 Objetivo Principal
Desenvolver soluções de e-commerce seguindo os mais altos padrões de performance, SEO e qualidade de código.

## 🛠️ Stack Tecnológico

### Core Technologies
- **Next.js 15**: App Router (RSC + Server Actions)
- **Shadcn/ui**: Componentes base
- **Framer Motion**: Animações e transições
- **TanStack Query**: Gerenciamento de estado servidor
- **Zustand**: Gerenciamento de estado cliente
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização

## 📋 Fluxo de Trabalho

### 1. Execução de Tasks
- Sempre implemente seguindo as melhores práticas de e-commerce
- Foque em performance e otimização de SEO
- Mantenha código limpo e bem documentado
- Implemente acessibilidade (WCAG 2.1 AA)
- **SEMPRE** adicione transições elegantes com Motion
- Use componentes Shadcn como base
- Gerencie estados com Zustand (cliente) e TanStack Query (servidor)

### 2. Aprovação de Task
Após completar uma task, SEMPRE pergunte:
```
✅ Task concluída! A implementação está aprovada para commit?
- [Descreva brevemente o que foi implementado]
- [Mencione melhorias de performance aplicadas]
- [Mencione otimizações de SEO implementadas]
```

### 3. Commit Semântico (Após Aprovação)
Execute commit seguindo Conventional Commits:
```bash
git add .
git commit -m "tipo(escopo): descrição concisa da implementação

- Detalhe das funcionalidades adicionadas
- Melhorias de performance implementadas  
- Otimizações de SEO aplicadas
- Outras melhorias relevantes"
```

### 4. Desenvolvimento de Testes
Após o commit da funcionalidade:
- Desenvolva testes automatizados completos
- Cubra casos de uso principais e edge cases
- Inclua testes de performance quando relevante
- Teste acessibilidade e SEO quando aplicável

### 5. Commit de Testes
```bash
git add .
git commit -m "test(escopo): adiciona testes para [funcionalidade]

- Testes unitários para [componentes/funções]
- Testes de integração para [fluxos]
- Testes de performance para [métricas]
- Cobertura de testes: [percentual]%"
```

## 🚀 Padrões de Performance

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.5s

### Otimizações Obrigatórias
- Lazy loading para imagens e componentes
- Code splitting por rotas e funcionalidades
- Compressão de assets (Gzip/Brotli)
- Cache strategies (Service Workers)
- Prefetch/preload de recursos críticos
- Otimização de imagens (WebP, AVIF, responsive)
- Minificação de CSS/JS
- Tree shaking para remover código não utilizado

### Performance de E-commerce
- Carregamento assíncrono do carrinho
- Debounce em buscas e filtros
- Paginação virtual para listas grandes
- Otimização de checkout (single-page)
- Cache de produtos e categorias
- CDN para assets estáticos

## 🔍 Padrões de SEO

### SEO Técnico
- **Meta tags**: title, description, keywords
- **Open Graph**: og:title, og:description, og:image, og:type
- **Twitter Cards**: twitter:card, twitter:title, twitter:description
- **Schema.org**: Product, Organization, BreadcrumbList, Review
- **Canonical URLs**: evitar conteúdo duplicado
- **Hreflang**: para sites multilíngues
- **Sitemap XML**: atualizado automaticamente
- **Robots.txt**: configurado corretamente

### SEO para E-commerce
- **Structured Data**: Product, Offer, Review, Rating, Organization
- **Breadcrumbs**: navegação hierárquica
- **URLs amigáveis**: /categoria/subcategoria/produto
- **Alt text**: todas as imagens de produtos
- **Lazy loading**: que não afete SEO
- **Page speed**: otimização agressiva
- **Mobile-first**: design responsivo

### Content SEO
- Títulos H1 únicos por página
- Hierarquia de headings (H1-H6)
- Descrições de produtos únicas
- Meta descriptions atrativas (150-160 chars)
- Internal linking strategy
- Rich snippets para produtos

## 🛒 Padrões de E-commerce

### UX/UI Essenciais
- **Carrinho persistente**: mantém itens entre sessões
- **Checkout rápido**: máximo 3 etapas
- **Busca inteligente**: autocomplete, filtros, sugestões
- **Wishlist**: funcionalidade de favoritos
- **Reviews**: sistema de avaliações
- **Comparação**: compare produtos
- **Zoom de imagens**: visualização detalhada

### Funcionalidades Técnicas
- **Inventory management**: controle de estoque
- **Payment integration**: múltiplas formas de pagamento
- **Shipping calculator**: cálculo de frete
- **Tax calculation**: cálculo de impostos
- **Multi-currency**: suporte a múltiplas moedas
- **Responsive design**: mobile-first
- **PWA**: Progressive Web App

### Analytics e Tracking
- **Google Analytics 4**: e-commerce tracking
- **Google Tag Manager**: gerenciamento de tags
- **Facebook Pixel**: tracking de conversões
- **Hotjar/Clarity**: análise de comportamento
- **Performance monitoring**: Core Web Vitals
- **Error tracking**: Sentry ou similar

## 🧪 Padrões de Teste

### Tipos de Teste Obrigatórios
- **Unit Tests**: componentes isolados
- **Integration Tests**: fluxos completos
- **E2E Tests**: jornadas de usuário
- **Performance Tests**: Core Web Vitals
- **Accessibility Tests**: WCAG compliance
- **SEO Tests**: meta tags, structured data

### Cobertura Mínima
- **Código**: 80% de cobertura
- **Funcionalidades críticas**: 100% (checkout, pagamento)
- **Componentes reutilizáveis**: 90%
- **Utils e helpers**: 95%

### Ferramentas de Teste
- **Jest**: testes unitários
- **React Testing Library**: testes de componentes
- **Cypress/Playwright**: testes E2E
- **Lighthouse CI**: testes de performance
- **axe-core**: testes de acessibilidade

## 📝 Padrões de Commit

### Tipos de Commit
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `perf`: melhoria de performance
- `seo`: otimização de SEO
- `style`: mudanças de estilo/formatação
- `refactor`: refatoração de código
- `test`: adição/modificação de testes
- `docs`: documentação
- `chore`: tarefas de manutenção

### Escopos Sugeridos
- `product`: páginas/funcionalidades de produto
- `cart`: carrinho de compras
- `checkout`: processo de checkout
- `search`: busca e filtros
- `auth`: autenticação
- `payment`: pagamentos
- `admin`: painel administrativo
- `api`: integrações de API
- `ui`: componentes de interface
- `core`: funcionalidades base

### Exemplo de Commit Perfeito
```bash
feat(product): implementa zoom de imagem com lazy loading

- Adiciona componente ImageZoom com suporte a touch
- Implementa lazy loading para imagens de produto
- Otimiza LCP reduzindo em 40% o tempo de carregamento
- Adiciona structured data para Product images
- Melhora acessibilidade com navegação por teclado
- Implementa prefetch de imagens ao hover

Performance: LCP melhorou de 3.2s para 1.9s
SEO: Structured data para imagens implementado
```

## ⚡ Checklist de Qualidade

### Antes do Commit
- [ ] Performance: Core Web Vitals otimizados
- [ ] SEO: Meta tags e structured data implementados
- [ ] Acessibilidade: WCAG 2.1 AA compliance
- [ ] Responsividade: testado em mobile/tablet/desktop
- [ ] Cross-browser: testado nos principais navegadores
- [ ] Code quality: ESLint/Prettier aplicados
- [ ] Security: vulnerabilidades verificadas

### Antes dos Testes
- [ ] Casos de uso principais cobertos
- [ ] Edge cases identificados e testados
- [ ] Performance tests para funcionalidades críticas
- [ ] Accessibility tests implementados
- [ ] SEO tests para meta tags e structured data
- [ ] Cobertura de código adequada

## 🔧 Ferramentas Recomendadas

### Performance
- Lighthouse CI
- WebPageTest
- GTmetrix
- Core Web Vitals Chrome Extension

### SEO
- Google Search Console
- Screaming Frog
- SEMrush/Ahrefs
- Structured Data Testing Tool

### Desenvolvimento
- ESLint + Prettier
- Husky (git hooks)
- Commitizen (commits padronizados)
- Bundle Analyzer

## 🎯 Métricas de Sucesso

### Performance KPIs
- Lighthouse Score: > 90 (todas as categorias)
- Core Web Vitals: todos dentro do verde
- Bundle Size: < 250KB inicial
- Time to Interactive: < 3s

### SEO KPIs
- Structured Data: 100% coverage
- Meta Tags: 100% coverage
- Page Speed Score: > 90
- Mobile Usability: 100% sem erros

### Qualidade KPIs
- Test Coverage: > 80%
- ESLint Errors: 0
- TypeScript Errors: 0
- Security Vulnerabilities: 0

---

## 🚨 Lembrete Final

**SEMPRE siga este fluxo:**
1. ✅ Implementar com foco em performance e SEO
2. ❓ Perguntar se a task foi aprovada
3. 📝 Fazer commit semântico da funcionalidade
4. 🧪 Desenvolver testes abrangentes
5. 📝 Fazer commit semântico dos testes

**Nunca pule etapas ou faça commits sem aprovação!**