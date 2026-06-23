import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://untelemetry.unledu.com.br"),

  title: {
    default: "UnTelemetry — Observabilidade moderna com poder OpenTelemetry",
    template: "%s | UnTelemetry",
  },

  description:
    "UnTelemetry é uma plataforma proprietária de observabilidade com suporte completo ao padrão OpenTelemetry, permitindo coleta unificada de logs, métricas e traces de qualquer aplicação compatível, com visualização clara e insights avançados.",

  keywords: [
    "telemetria",
    "observabilidade",
    "opentelemetry",
    "monitoramento de aplicações",
    "traces",
    "logs",
    "métricas",
    "APM",
    "plataforma de monitoramento",
    "distributed tracing",
    "application performance monitoring",
    "UnTelemetry",
    "monitoramento em tempo real",
    "infraestrutura",
    "devops"
  ],

  authors: [{ name: "UnTelemetry" }],
  creator: "UnTelemetry",
  publisher: "UnTelemetry",

  alternates: {
    canonical: "https://untelemetry.unledu.com.br",
  },

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://untelemetry.unledu.com.br",
    siteName: "UnTelemetry",

    title: "UnTelemetry — Observabilidade moderna com poder OpenTelemetry",
    description:
      "Coleta unificada de logs, métricas e traces usando o padrão OpenTelemetry. Visualização rápida, correlação inteligente e insights profundos para aplicações modernas.",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UnTelemetry — Plataforma de Observabilidade",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "UnTelemetry — Observabilidade moderna com poder OpenTelemetry",
    description:
      "Observabilidade proprietária com compatibilidade total com OpenTelemetry. Receba dados de qualquer aplicação e visualize tudo em um ambiente moderno e inteligente.",
    images: ["/og-image.png"],
    creator: "@untelemetry",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },

  category: "technology",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  applicationName: "UnTelemetry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="description" content="UnTelemetry é uma plataforma proprietária de observabilidade com suporte total ao OpenTelemetry." />
        <meta name="keywords" content="observabilidade, telemetria, opentelemetry, monitoramento, logs, métricas, traces, devops, untelemetry" />
        <meta name="author" content="UnTelemetry" />

        <link rel="canonical" href="https://untelemetry.unledu.com.br" />

        <meta name="theme-color" content="#ffffff" />
        <meta name="application-name" content="UnTelemetry" />
        <meta name="apple-mobile-web-app-title" content="UnTelemetry" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />


        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UnTelemetry — Observabilidade com OpenTelemetry" />
        <meta name="twitter:description" content="Receba logs, métricas e traces de qualquer aplicação compatível com OpenTelemetry." />
        <meta name="twitter:image" content="https://untelemetry.unledu.com.br/logo.png" />
        <meta name="twitter:site" content="@untelemetry" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="UnTelemetry — Observabilidade moderna" />
        <meta property="og:description" content="Plataforma proprietária com suporte total ao OpenTelemetry para monitoramento avançado." />
        <meta property="og:url" content="https://untelemetry.unledu.com.br" />
        <meta property="og:site_name" content="UnTelemetry" />
        <meta property="og:image" content="https://untelemetry.unledu.com.br/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />


        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <ToastContainer />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
