import { useRef, useState, useEffect, useContext } from 'react';
import { BsFillFilterSquareFill } from "react-icons/bs";
import { useSearchParams } from 'react-router-dom';
import Product from './Product.jsx';
import Filtro from './Filtro.jsx';
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../services/api.js"

const Comprar = () => {
  const { cartProducts, setCartProducts } = useContext(AuthContext);
  const [showFiltro, setShowFiltro] = useState(false);
  
  // Usar searchParams para persistir en URL
  const [searchParams, setSearchParams] = useSearchParams();

  const [productsWF, setProductsWF] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Leer página actual de la URL
  const currentPage = parseInt(searchParams.get('page')) || 1;
  
  const [pagination, setPagination] = useState({
      count: 0,
      next: null,
      previous: null,
      totalPages: 1
  });

  // Leer filtros de la URL también
  const [filters, setFilters] = useState({
      name: searchParams.get('name') || '',
      category: searchParams.get('category') || '',
      page_size: 10
  });

  // Actualizar URL cuando cambia página o filtros
  const updateURL = (page, name, category) => {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      if (name) params.set('name', name);
      if (category) params.set('category', category);
      setSearchParams(params);
  };

  const fetchProducts = async (page = 1) => {
      setLoading(true);
      try {
          const params = new URLSearchParams({
              page: page,
              page_size: filters.page_size
          });
          
          if (filters.name) params.append('name', filters.name);
          if (filters.category) params.append('category', filters.category);

          const response = await api.get("api/Product/?" + params);
          const data = response.data;
          console.log('fetch products response.data: ', response.data);

          setProductsWF(data.results);
          setPagination({
              count: data.count,
              next: data.next,
              previous: data.previous,
              totalPages: Math.ceil(data.count / filters.page_size)
          });
      } catch (error) {
          console.error('Error fetching products:', error);
      } finally {
          setLoading(false);
      }
  };

  const fetchCategories = async () => {
      setLoading(true);
      try {
          const response = await api.get("api/Category/");
          const data = response.data;
          console.log('fetch categories response.data: ', response.data);

          setCategories(data);
      } catch (error) {
          console.error('Error fetching categories:', error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchProducts(currentPage);
  }, [currentPage, filters.name, filters.category, filters.page_size]);

  const handlePageChange = (page) => {
      if (page >= 1 && page <= pagination.totalPages) {
          updateURL(page, filters.name, filters.category);
      }
  };

  const handleFilterChange = (e) => {
      const { name, value } = e.target;
      const newFilters = { ...filters, [name]: value };
      setFilters(newFilters);
      updateURL(1, newFilters.name, newFilters.category);
  };

  const myHandleFilterChange = (categorias, textSearch) => {
      setFilters({
          name: textSearch,
          category: categorias,
          page_size: 10
      });
      updateURL(1, textSearch, categorias);
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
  useEffect(() => {
      fetchCategories();
  }, []);

  return (
    <div className="container">
      <BsFillFilterSquareFill className="fill-filter" onClick={() => setShowFiltro(true)} />

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-3">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      <div className='container-fluid row justify-content-around' style={{ overflowY: "auto" }}>
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

      {showFiltro && <Filtro setShowFiltro={setShowFiltro} setFilters={setFilters} categories={categories}/>}

      {/* Paginación */}
      {pagination.totalPages > 1 && (
          <nav aria-label="Navegación de productos">
              <ul className="pagination justify-content-center">
                  <li className={`page-item ${!pagination.previous ? 'disabled' : ''}`}>
                      <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                      >
                          Anterior
                      </button>
                  </li>
                  
                  {renderPaginationItems()}
                  
                  <li className={`page-item ${!pagination.next ? 'disabled' : ''}`}>
                      <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                      >
                          Siguiente
                      </button>
                  </li>
              </ul>
          </nav>
      )}
    </div>
  );
};

export default Comprar;
