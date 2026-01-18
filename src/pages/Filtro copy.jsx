import { useState, useEffect } from "react";


const Filtro = ({setShowFiltro, categories, onApplyFilters }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchText ,setSearchText] = useState('');

    const handleTextChange = (event) =>{
        setSearchText(event.target.value);
    }
    const handleCheckboxChange = (id) => {
        setSelectedCategories((prevSelected) => {
          const isSelected = prevSelected.includes(id);
          const updatedSelection = isSelected
            ? prevSelected.filter((c) => c !== id)
            : [...prevSelected, id];
    
          handleFilterChange(updatedSelection);
          return updatedSelection;
        });
    }

    const handleFilterChange = (selectedCategories) => {
        console.log("id selected:", selectedCategories);
    };

    const selectProducts = () => {
        
        setShowFiltro(false);
        // Llamar al callback del padre con los filtros seleccionados
        onApplyFilters(searchText, selectedCategories);

    }
    
    return (
        // CORREGIDO: Modal responsivo con overlay y dimensiones adaptables
        <>
            {/* Overlay oscuro */}
            <div 
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1040 }}
                onClick={() => setShowFiltro(false)}
            />
            
            {/* Modal de filtro */}
            <div 
                className="position-fixed bg-white rounded shadow-lg p-3 p-md-4"
                style={{ 
                    top: "50%", 
                    left: "50%", 
                    transform: "translate(-50%, -50%)",
                    zIndex: 1050,
                    width: "90%",
                    maxWidth: "400px",
                    maxHeight: "80vh",
                    overflowY: "auto"
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Filtrar Productos</h5>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setShowFiltro(false)}
                        aria-label="Cerrar"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Categorías</label>
                    <div className="border rounded p-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {categories.map((category, index) => (
                            <div key={index} className="form-check">
                                <input 
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`cat-${category.id}`}
                                    value={category.id}
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => handleCheckboxChange(category.id)}
                                />
                                <label className="form-check-label" htmlFor={`cat-${category.id}`}>
                                    {category.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="searchInput">
                        Buscar por nombre
                    </label>
                    <input 
                        type="text" 
                        id="searchInput"
                        className="form-control"
                        placeholder="Escriba para buscar..."
                        value={searchText} 
                        onChange={handleTextChange}
                    />
                </div>

                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-success flex-grow-1" 
                        onClick={selectProducts}
                    >
                        Aplicar Filtros
                    </button>
                    <button 
                        className="btn btn-outline-secondary" 
                        onClick={() => setShowFiltro(false)}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </>
    );
};
export default Filtro;