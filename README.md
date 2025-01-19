# Stories App

Una aplicación de historias estilo Instagram construida con Next.js 14.

## Características

- Visualización de historias al estilo Instagram
- Modo oscuro/claro
- Subida de imágenes
- Navegación por teclado
- Gestos táctiles para móvil
- Historias que desaparecen después de 24 horas

## Tecnologías

- Next.js 14
- TypeScript
- Tailwind CSS
- React Context
- Vercel Storage

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Despliegue en Vercel

1. Crear una cuenta en [Vercel](https://vercel.com)
2. Instalar Vercel CLI:
   ```bash
   npm i -g vercel
   ```
3. Iniciar sesión en Vercel:
   ```bash
   vercel login
   ```
4. Desplegar:
   ```bash
   vercel
   ```

O simplemente:

1. Conecta tu repositorio de GitHub con Vercel
2. Vercel detectará automáticamente que es un proyecto Next.js
3. El despliegue se realizará automáticamente

## Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Para producción, configura estas variables en el dashboard de Vercel.

## Licencia

MIT
