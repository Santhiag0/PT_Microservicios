'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bienvenido al Sistema de Gestión de Inventario
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Seleccione una opción del menú para comenzar
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link
              href="/products"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gestión de Productos
              </h3>
              <p className="text-gray-600">
                Administre su inventario de productos, agregue nuevos items y actualice el stock
              </p>
            </Link>
            <Link
              href="/transactions"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gestión de Transacciones
              </h3>
              <p className="text-gray-600">
                Registre y consulte las transacciones de compra y venta
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
