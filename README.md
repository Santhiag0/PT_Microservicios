# 🧩 Sistema de Gestión de Inventario - Microservicios (.NET & REACT (Next JS))

Este proyecto es una aplicación full stack de gestión de inventario que utiliza:

- 🖥️ **Backend:** Microservicios en .NET 9 con arquitectura basada en API Gateway y SQL Server.
- 🌐 **Frontend:** Aplicación moderna hecha con Next.js, React, Tailwind CSS y TypeScript.

---

## ⚙️ Requisitos Previos

### 🔧 Backend
- Docker + Docker Compose
- .NET SDK (para ejecutar migraciones de base de datos)

### 🌐 Frontend
- Node.js
- npm o yarn

---

## 🐳 Instalación y Ejecución del Backend (Microservicios)

### 1. Levantar los contenedores
```bash
docker-compose up --build -d
```

### 2. Ejecutar migraciones manualmente

> Esto se hace una vez, luego de levantar los contenedores:

```bash
cd ./backend/ProductService/
dotnet ef database update

cd ../TransactionService/
dotnet ef database update
```

### 🧠 Microservicios involucrados

| Servicio             | Puerto Contenedor | Funcionalidad principal              |
|----------------------|-------------------|-------------------------------------|
| `sqlserver`          | 1433              | Base de datos MS SQL Server         |
| `productservice`     | 7146 → 80         | CRUD de productos                   |
| `transactionservice` | 7129 → 80         | Registro de compras y ventas        |
| `apigateway`         | 7299 → 80         | Orquestación vía Ocelot API Gateway |

---

## 🧑‍💻 Frontend - Aplicación en React (Next.js)

> Carpeta: `inventory-app`

### 📋 Requisitos

- Backend corriendo en `http://localhost:7299`

### 🚀 Instalación

```bash
git clone <url-del-repositorio>
cd inventory-app
npm install   # o yarn install
```

### 🏃‍♂️ Ejecución del servidor de desarrollo

```bash
npm run dev   # o yarn dev
```

Accede a la app en: [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuración

- Verifica que el backend esté en `http://localhost:7299`
- Si necesitas apuntar a otra URL, actualiza:
  - `src/features/products/services/ProductService.ts`
  - `src/features/transactions/services/TransactionService.ts`

---

## ✨ Características de la App

- ✅ Gestión de productos (CRUD)
- ✅ Gestión de transacciones (Compra/Venta)
- ✅ Ajuste automático de stock
- ✅ LocalStorage para persistencia ligera
- ✅ Interfaz responsive y optimizada
- ✅ Filtros, búsqueda y paginación

---

## 🗂️ Estructura del Proyecto (Frontend)

```
src/
├── app/                 # Rutas de Next.js
├── features/           # Funcionalidades por módulo
│   ├── products/      # Módulo de productos
│   └── transactions/  # Módulo de transacciones
├── shared/            # Componentes reutilizables
└── core/              # Configuración base y utilidades
```

---

## 🛠️ Tecnologías Utilizadas

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

## 📜 Scripts Disponibles (Frontend)

| Script            | Descripción                         |
|------------------|-------------------------------------|
| `npm run dev`     | Inicia servidor de desarrollo      |
| `npm run build`   | Compila la app para producción     |
| `npm run start`   | Inicia app en modo producción      |
| `npm run lint`    | Corre linter para verificación     |

---

## 🤝 Contribuciones

1. Haz un fork del repositorio
2. Crea una rama: `git checkout -b feature/NuevaFuncionalidad`
3. Realiza commits: `git commit -m "Agrega X funcionalidad"`
4. Push: `git push origin feature/NuevaFuncionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Revisa [LICENSE.md](LICENSE.md) para más detalles.
