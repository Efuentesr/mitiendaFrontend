import { useContext, useState, useEffect } from "react";
import ShowCategory from "./ShowCategory";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api.js"


const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

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
        fetchCategories();
    }, []);      
    return (
        <div  className="container py-3">
            <div className="row">
                {categories.map((category) => (
                    <ShowCategory key={category.id} category={category['name']} categoryImg={category['imgurl']} />
                ))}
            </div>
        </div>
    );
};

export default Categories;
