import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Operation Reclaim — Supere seus vícios",
  description: "Sistema gamificado de superação de vícios digitais. Transforme sua luta em uma jornada épica.",
  keywords: ["vícios", "superação", "gamificação", "redes sociais", "pornografia", "jogos", "hábitos"],
  openGraph: {
    title: "Operation Reclaim",
    description: "Toda pessoa que encontrei tem um vício. A diferença está em quem decide lutar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
