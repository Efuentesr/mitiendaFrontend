import { useState, useEffect, useContext } from 'react';
import { BsFillFilterSquareFill } from "react-icons/bs";
import { useSearchParams } from 'react-router-dom';
import Product from './Product.jsx';
import Filtro from './Filtro.jsx';
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../services/api.js"

const Comprar = () => {
  const { cartProducts, setCartProducts } = useContext(AuthContext);
  const [showFiltro, setShowFiltro] = useState(false);
  
  const [searchParams, setSearchParams] = useSearchParams();

  const [productsWF, setProductsWF] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Leer TODO directamente de la URL (single source of truth)
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const filterName = searchParams.get('name') || '';
  const filterCategory = searchParams.get('category') || '';
  const pageSize = 10;
  
  const [pagination, setPagination] = useState({
      count: 0,
      next: null,
      previous: null,
      totalPages: 1
  });

  const fetchProducts = async () => {
      setLoading(true);
      try {
          const params = new URLSearchParams({
              page: currentPage,
              page_size: pageSize
          });
          
          if (filterName) params.append('name', filterName);
          if (filterCategory) params.append('category', filterCategory);

          const response = await api.get("api/Product/?" + params);
          const data = response.data;

          setProductsWF(data.results);
          setPagination({
              count: data.count,
              next: data.next,
              previous: data.previous,
              totalPages: Math.ceil(data.count / pageSize)
          });
      } catch (error) {
          console.error('Error fetching products:', error);
      } finally {
          setLoading(false);
      }
  };

  const fetchCategories = async () => {
      try {
          const response = await api.get("api/Category/");
          setCategories(response.data);
      } catch (error) {
          console.error('Error fetching categories:', error);
      }
  };

  // Un solo useEffect que depende de los valores de la URL
  useEffect(() => {
      fetchProducts();
  }, [currentPage, filterName, filterCategory]);

  useEffect(() => {
      fetchCategories();
  }, []);

  const handlePageChange = (page) => {
      if (page >= 1 && page <= pagination.totalPages) {
          const params = new URLSearchParams();
          params.set('page', page.toString());
          if (filterName) params.set('name', filterName);
          if (filterCategory) params.set('category', filterCategory);
          setSearchParams(params);
      }
  };

  // Función para aplicar filtros - solo actualiza la URL
  const handleApplyFilters = (name, category) => {
      const params = new URLSearchParams();
      params.set('page', '1'); // Siempre resetear a página 1
      if (name) params.set('name', name);
      if (category && category.length > 0) params.set('category', category.toString());
      setSearchParams(params);
  };

  const renderPaginationItems = () => {
      const items = [];
      const { totalPages } = pagination;
      
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
          items.push(
              <li key={1} className="page-item">
                  <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
              </li>
          );
          if (startPage > 2) {
              items.push(
                  <li key="ellipsis-start" className="page-item disabled">
                      <span className="page-link">...</span>
                  </li>
              );
          }
      }

      for (let i = startPage; i <= endPage; i++) {
          items.push(
              <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
              </li>
          );
      }

      if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
              items.push(
                  <li key="ellipsis-end" className="page-item disabled">
                      <span className="page-link">...</span>
                  </li>
              );
          }
          items.push(
              <li key={totalPages} className="page-item">
                  <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                      {totalPages}
                  </button>
              </li>
          );
      }

      return items;
  };

  return (
    <div className="container-fluid px-2 px-md-4">
      {/* Botón de filtro */}
      <button 
        className="btn btn-warning position-fixed d-flex align-items-center gap-2 shadow"
        style={{ top: "70px", right: "15px", zIndex: 100 }}
        onClick={() => setShowFiltro(true)}
      >
        <BsFillFilterSquareFill size={20} />
        <span className="d-none d-sm-inline">Filtrar</span>
      </button>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {/* Grid de productos */}
      <div className="row g-3 mt-2">
        {productsWF.map((product, i) => (
          <Product
            key={product.code}
            product={product}
            indice={i}
            cartProducts={cartProducts}
            setCartProducts={setCartProducts}
          />
        ))}
      </div>

      {/* Mensaje cuando no hay productos */}
      {!loading && productsWF.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No se encontraron productos</p>
        </div>
      )}

      {showFiltro && (
          <Filtro 
            setShowFiltro={setShowFiltro} 
            categories={categories}
            onApplyFilters={handleApplyFilters}
            initialName={filterName}
            initialCategory={filterCategory}
          />
        )}

      {/* Paginación */}
      {pagination.totalPages > 1 && (
          <nav aria-label="Navegación de productos" className="mt-4 mb-3">
              <ul className="pagination pagination-sm justify-content-center flex-wrap">
                  <li className={`page-item ${!pagination.previous ? 'disabled' : ''}`}>
                      <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                      >
                          <span className="d-none d-sm-inline">Anterior</span>
                          <span className="d-sm-none">«</span>
                      </button>
                  </li>
                  
                  {renderPaginationItems()}
                  
                  <li className={`page-item ${!pagination.next ? 'disabled' : ''}`}>
                      <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                      >
                          <span className="d-none d-sm-inline">Siguiente</span>
                          <span className="d-sm-none">»</span>
                      </button>
                  </li>
              </ul>
          </nav>
      )}
    </div>
  );
};

export default Comprar;
