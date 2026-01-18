import { useState, useContext, useEffect, myHandleFilterChange } from "react";
import { AuthContext } from "../context/AuthContext";

const Filtro = ({setShowFiltro, setFilters, categories}) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchText ,setSearchText] = useState('');

    const handleTextChange = (event) =>{
        setSearchText(event.target.value);
    }
    const handleCheckboxChange = (id) => {
        console.log((`id of category: ${id}`))
        setSelectedCategories((prevSelected) => {
          const isSelected = prevSelected.includes(id);
          const updatedSelection = isSelected
            ? prevSelected.filter((c) => c !== id)
            : [...prevSelected, id];
    
          handleFilterChange(updatedSelection); // Enviar las categorías seleccionadas al padre
          return updatedSelection;
        });
    }

    const handleFilterChange = (selectedCategories) => {
        console.log("id selected:", selectedCategories);
    };

    const selectProducts = () => {
        console.log("selectedCat: ", selectedCategories)
        setShowFiltro(false);
        setFilters({
            name: searchText,
            category: selectedCategories,
            page_size: 10
        });
    }
    
    return (
        <div className="d-flex justify-content-center align-items-center flex-column bg-white p-3 border-success" 
            id="mostrar-filtro-fijo" 
        >
            <h3 className="text-center">Categorias de Productos</h3>
            <div className="my-2">
                {categories.map((category, index) => (
                    <div  key={index}>
                        <label>
                            <input className="p-0 me-2"
                                type="checkbox"
                                value={category.id}
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => handleCheckboxChange(category.id)}
                            />
                            {category.name}
                        </label>
                    </div>
                ))}
            </div>
            <input type="text" value={searchText} onChange={handleTextChange} className="mb-2 p-0"/>
            <div className="d-flex">
                <button className="btn btn-success me-2"  onClick={selectProducts}>Enviar</button>
                <button className="btn btn-secondary"  onClick={()=> setShowFiltro(false)}>Cancelar</button>
            </div>
            
        </div>
    );
};
export default Filtro;