# 🏪 Sistema de Gestión de Inventario

> Sistema de gestión de inventario desarrollado con Next.js, TypeScript y Tailwind CSS.

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Backend API corriendo en `http://localhost:7299`

## 🚀 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd inventory-app
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

## ⚙️ Configuración

1. Asegúrate de que el backend esté corriendo en `http://localhost:7299`
2. Si el backend está en una URL diferente, actualiza las URLs en:
   - `src/features/products/services/ProductService.ts`
   - `src/features/transactions/services/TransactionService.ts`

## 🏃‍♂️ Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run start` | Inicia la aplicación en modo producción |
| `npm run lint` | Ejecuta el linter para verificar el código |

## ✨ Características

- ✅ Gestión de productos (CRUD)
- ✅ Gestión de transacciones (Compra/Venta)
- ✅ Almacenamiento local para mejor rendimiento
- ✅ Interfaz responsive
- ✅ Filtros y búsqueda
- ✅ Paginación

## 📁 Estructura del Proyecto

```
src/
├── app/                 # Páginas y rutas de Next.js
├── features/           # Características principales
│   ├── products/      # Gestión de productos
│   └── transactions/  # Gestión de transacciones
├── shared/            # Componentes y utilidades compartidas
└── core/             # Configuraciones y utilidades core
```

## 🛠️ Tecnologías Utilizadas

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Axios](https://axios-http.com/)

## 📝 Notas Adicionales

- La aplicación utiliza **localStorage** para mejorar el rendimiento y la experiencia del usuario
- Las imágenes de productos se cargan desde URLs externas
- El sistema maneja errores y muestra alertas para mejor feedback al usuario

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
