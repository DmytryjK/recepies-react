import { useAppSelector } from "../hooks/hooks";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from "../components/Header/Header";
import RecipeLIst from "../components/RecipeList/RecipeLIst";
import FavoritesRecipes from "../components/FavoritesRecipes/FavoritesRecipes";

const Favorites = () => {
    const recepies = useAppSelector(state=> state.favoriteRecipes.favoriteRecipes);

    return (
        <div>
            <div className="container">
                <Header isSearch={true} recepies={recepies}/>
                <FavoritesRecipes />
            </div>
        </div>
    )
}

export default Favorites;