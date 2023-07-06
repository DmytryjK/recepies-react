import { useEffect, FC, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import RecipeCard from '../RecipeCardItem/RecipeCardItem';
import { setFavoriteRecipes, setCurrentRecipes } from './RecepieListSlice';
import { cloneRecepies } from '../Filters/FiltersSlice';
import { manageFavoritesRecipes } from '../FavoritesRecipes/FavoritesRecipesSlice';
import nextId from "react-id-generator";
import { useLocation } from 'react-router-dom';
import type { Recepie } from '../../types/type';
import './RecipeLIst.scss';

const RecipeLIst: FC<{fetchedRecipes:Recepie[], loadStatus:'idle' | 'pending' | 'succeeded' | 'failed'}> = ({fetchedRecipes, loadStatus}) => {

    const { error, recepies } = useAppSelector(state => state.recepies);
    const { loadingRecipeIdToFirebase } = useAppSelector(state => state.favoriteRecipes);
    const { filteredRecepies } = useAppSelector(state => state.filters);
    const { uid } = useAppSelector(state => state.authentication.user);

    const [currentFavoriteId, setCurrentFavoriteId] = useState<string|number|null>(null);

    const dispatch = useAppDispatch();

    const currentLink = useLocation().pathname;

    useEffect(() => {
        if (loadStatus === 'succeeded') {
            dispatch(setCurrentRecipes(fetchedRecipes));
        }
    }, [loadStatus]);

    useEffect(() => {
        dispatch(cloneRecepies(recepies));
    }, [recepies]); 

    useEffect(() => {
        if (currentLink === '/favorites' && loadingRecipeIdToFirebase === 'succeeded') {
            const removedItem = filteredRecepies.filter(item => item.id !== currentFavoriteId);
            dispatch(setCurrentRecipes(removedItem));
        }
    }, [loadingRecipeIdToFirebase]);

    const handleAddFavorite = ( recepieId: string|number|null, recipe: Recepie, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(setFavoriteRecipes({recipeId: recepieId, isFavorite: !recipe.favorites}));
        // dispatch(updateRecipeInfo({
        //     ...item,
        //     favorites: !item.favorites
        // }));
        dispatch(manageFavoritesRecipes({recepieId, uid}));
        setCurrentFavoriteId(recepieId);
    };

    const renderItems = (items: Recepie[]) => {
        if (items) {
            console.log(items);
            const renderedList = items.map((item, index) => {
                return(
                    <li key={nextId('recipe-id')} className="recipe-list__item">
                        <RecipeCard recipe={item} onFavoriteClick={handleAddFavorite}></RecipeCard>
                    </li>
                )
            })
            return renderedList;
        }
    }

    let renderedComponents = null;
    
    if (loadStatus !== 'succeeded') {
        renderedComponents = 'loading...';
    } else if (error) {
        renderedComponents = "Something wen't wrong, try again";
    } else if (loadStatus === 'succeeded' && filteredRecepies.length > 0) {
        renderedComponents = renderItems(filteredRecepies);
    } else if (filteredRecepies.length === 0 && loadStatus === 'succeeded') {
        renderedComponents = 'Поиск не дал результатов, попробуйте ещё раз';
    }

    return (
        <ul className='recipe-list'>
            {renderedComponents}
        </ul>
    )
}

export default RecipeLIst;
