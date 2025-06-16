import Link from "next/link";
import { ArrowRight, ShoppingBag, Zap, Shield, Truck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Sua loja online{" "}
              <span className="text-primary">moderna</span> e{" "}
              <span className="text-primary">performática</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Desenvolvida com Next.js 15, TypeScript e as melhores práticas de performance.
              Server Components, ISR, e otimizações nativas para uma experiência excepcional.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/products"
                className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
              >
                Ver Produtos
                <ArrowRight className="ml-2 h-4 w-4 inline" />
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
              >
                Saiba mais <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Por que escolher nossa plataforma?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tecnologia de ponta para uma experiência de compra superior
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Performance</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Carregamento ultra-rápido com SSR e ISR otimizados
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Segurança</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Transações seguras e proteção de dados avançada
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Truck className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Entrega Rápida</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Entrega expressa em todo o território nacional
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <ShoppingBag className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Experiência</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Interface moderna e intuitiva para todos os dispositivos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Tecnologias Utilizadas
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stack moderna focada em performance e developer experience
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
              {[
                "Next.js 15",
                "TypeScript",
                "Tailwind CSS",
                "Zustand",
                "Framer Motion",
                "Zod",
              ].map((tech) => (
                <div
                  key={tech}
                  className="flex items-center justify-center rounded-lg border bg-card p-4 text-center text-sm font-medium"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
