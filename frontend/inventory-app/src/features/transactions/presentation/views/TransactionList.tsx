import { useState, useEffect, useRef } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { useProducts } from '../../../products/hooks/useProducts';
import { Transaction, TransactionFormData, TransactionType } from '../../data/interfaces/Transaction';
import { TransactionService } from '../../services/TransactionService';
import { Pagination } from '@/shared/components/Pagination';
import { Alert } from '@/shared/components/Alert';
import { FiSearch, FiFilter, FiPlus, FiRefreshCw, FiCalendar, FiDollarSign, FiPackage, FiLoader, FiChevronDown, FiEdit2 } from 'react-icons/fi';

export const TransactionList = () => {
  const { transactions, loading, error, fetchTransactions, createTransaction, updateTransaction } = useTransactions();
  const { products, fetchProducts } = useProducts();
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'Compra',
    productId: 0,
    quantity: 0,
    unitPrice: 0,
    details: '',
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [filters, setFilters] = useState<{ type?: TransactionType; startDate?: string; endDate?: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const pageSize = 8;
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState<{ date: string; details: string }>({
    date: '',
    details: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsInitialLoading(true);
        await Promise.all([fetchProducts(), fetchTransactions()]);
      } catch (error) {
        setAlert({ 
          type: 'error', 
          message: 'Error al cargar los datos. Por favor, intente nuevamente.' 
        });
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
        setIsProductDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedProduct = products?.items?.find(p => p.id === formData.productId);
      if (!selectedProduct) {
        setAlert({ type: 'error', message: 'Producto Eliminado' });
        return;
      }

      if (formData.type === 'Venta' && formData.quantity > selectedProduct.stock) {
        setAlert({ type: 'error', message: 'No hay suficiente stock disponible' });
        return;
      }

      await createTransaction(formData);
      setAlert({ type: 'success', message: 'Transacción creada exitosamente' });
      setFormData({
        type: 'Compra',
        productId: 0,
        quantity: 0,
        unitPrice: 0,
        details: '',
      });
      await Promise.all([fetchProducts(), fetchTransactions()]);
    } catch (err) {
      setAlert({ type: 'error', message: err instanceof Error ? err.message : 'Error al crear la transacción' });
    }
  };

  const handleProductChange = (productId: number) => {
    const product = products?.items?.find(p => p.id === productId);
    if (product) {
      setFormData(prev => ({
        ...prev,
        productId,
        unitPrice: product.price
      }));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<{ type?: TransactionType; startDate?: string; endDate?: string }>) => {
    setFilters((prev: { type?: TransactionType; startDate?: string; endDate?: string }) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const filteredProducts = products?.items?.filter(product => 
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(productSearchTerm.toLowerCase())
  ) || [];

  // Filtrar transacciones basado en búsqueda y filtros
  const filteredTransactions = transactions?.items?.filter(transaction => {
    const product = products?.items?.find(p => p.id === transaction.productId);
    const matchesSearch = !searchTerm || 
      (product && (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    const matchesType = !filters.type || transaction.type === filters.type;
    const matchesDate = (!filters.startDate || new Date(transaction.date) >= new Date(filters.startDate)) &&
                       (!filters.endDate || new Date(transaction.date) <= new Date(filters.endDate));
    return matchesSearch && matchesType && matchesDate;
  }) || [];

  // Calcular paginación
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditForm({
      date: new Date(transaction.date).toISOString().split('T')[0],
      details: transaction.details
    });
  };

  const handleUpdate = async () => {
    if (!editingTransaction) return;

    try {
      await updateTransaction(editingTransaction.id, {
        date: editForm.date,
        details: editForm.details
      });
      setEditingTransaction(null);
      setAlert({ type: 'success', message: 'Transacción actualizada correctamente' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al actualizar la transacción' });
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <FiLoader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Nueva Transacción</h2>
          <button
            onClick={() => fetchProducts()}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            title="Actualizar lista de productos"
          >
            <FiRefreshCw className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Transacción</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as TransactionType }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="Compra">Compra</option>
                <option value="Venta">Venta</option>
              </select>
            </div>
          </div>
          <div className="relative" ref={productDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <div className="relative">
              <input
                type="text"
                value={productSearchTerm}
                onChange={(e) => {
                  setProductSearchTerm(e.target.value);
                  setIsProductDropdownOpen(true);
                }}
                onFocus={() => setIsProductDropdownOpen(true)}
                placeholder="Buscar producto..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {isProductDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">No se encontraron productos</div>
                ) : (
                  filteredProducts.map(product => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, productId: product.id }));
                        setProductSearchTerm(product.name);
                        setIsProductDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
                    >
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-gray-500 text-xs">{product.description}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FiPackage className="w-5 h-5" />
                </span>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  min="1"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unitario</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FiDollarSign className="w-5 h-5" />
                </span>
                <input
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: Number(e.target.value) }))}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Detalles</label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              rows={3}
              placeholder="Ingrese detalles adicionales de la transacción..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            Registrar Transacción
          </button>
        </form>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Historial de Transacciones</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchTransactions()}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Actualizar lista"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
            >
              <FiFilter className="w-5 h-5" />
              Filtros
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => handleFilterChange({ startDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => handleFilterChange({ endDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange({ type: e.target.value as TransactionType || undefined })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="">Todos</option>
                  <option value="Compra">Compra</option>
                  <option value="Venta">Venta</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FiLoader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Actualizando transacciones...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center p-4">{error}</div>
        ) : (
          <>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron transacciones</p>
                {(searchTerm || filters.type || filters.startDate || filters.endDate) && (
                  <p className="text-gray-400 mt-2">
                    Intente con otros términos de búsqueda o filtros
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unit.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedTransactions.map((transaction) => {
                        const product = products?.items?.find(p => p.id === transaction.productId);
                        const isEditing = editingTransaction?.id === transaction.id;

                        return (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {isEditing ? (
                                <input
                                  type="date"
                                  value={editForm.date}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                                  className="w-full px-2 py-1 border rounded"
                                />
                              ) : (
                                new Date(transaction.date).toLocaleDateString()
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.type === 'Compra' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product ? product.name : 'Producto Eliminado'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${transaction.unitPrice.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                              ${transaction.totalPrice.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editForm.details}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, details: e.target.value }))}
                                  className="w-full px-2 py-1 border rounded"
                                />
                              ) : (
                                transaction.details
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {isEditing ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={handleUpdate}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Guardar
                                  </button>
                                  <button
                                    onClick={() => setEditingTransaction(null)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleEdit(transaction)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <FiEdit2 className="w-5 h-5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}; 