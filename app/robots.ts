export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://untelemetry.unledu.com.br/sitemap.xml",
    host: "https://untelemetry.unledu.com.br",
  };
}
