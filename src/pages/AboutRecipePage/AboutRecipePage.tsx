/* eslint-disable react/no-unstable-nested-components */
import { domMax, LazyMotion, m } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import nextId from 'react-id-generator';
import parse from 'html-react-parser';
import LazyLoad from 'react-lazy-load';
import {
    fetchRecipe,
    setFavoriteRecipes,
} from '../../store/reducers/RecipesListSlice';
import {
    manageFavoritesRecipes,
    fetchFavoritesRecipes,
} from '../../store/reducers/FavoritesRecipesSlice';
import PopUp from '../../shared-components/PopUp/PopUp';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import EditRecipeForm from './components/EditRecipeForm/EditRecipeForm';
import { Recipe } from '../../types/type';
import iconsSprite from '../../assets/icons/about-recipe/sprite.svg';
import timerIcon from '../../assets/icons/timer-line2.svg';
import renderServerData from '../../helpers/renderServerData';
import './AboutRecipePage.scss';

const AboutRecipePage = () => {
    const recipeId = useParams();
    const { recipe, loadingRecipe, error } = useAppSelector(
        (state) => state.recipes
    );
    const favoriteRecipe = useAppSelector(
        (state) => state.favoriteRecipes.favoriteRecipes
    );
    const loadingRecipesToFirebase = useAppSelector(
        (state) => state.favoriteRecipes.loadingRecipeIdToFirebase
    );
    const { uid, isAdmin } = useAppSelector(
        (state) => state.authentication.user
    );
    const dispatch = useAppDispatch();
    const [isEditActive, setIsEditActive] = useState<boolean>(false);
    const [currentRecipeToEdit, setCurrentRecipeToEdit] =
        useState<Recipe | null>(null);
    const [attentionWindowOpen, setAttentionWindowOpen] =
        useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!recipeId.id || recipe?.id === recipeId.id) return;
        dispatch(fetchRecipe(recipeId.id));
        if (!uid) return;
        dispatch(fetchFavoritesRecipes(uid));
    }, [uid, recipeId, recipe]);

    useEffect(() => {
        if (loadingRecipesToFirebase !== 'succeeded') return;
        dispatch(fetchFavoritesRecipes(uid));
    }, [loadingRecipesToFirebase]);

    const handleEditRecipe = (fetchedRecepieInfo: Recipe) => {
        setIsEditActive(true);
        setCurrentRecipeToEdit(fetchedRecepieInfo);
    };

    const handleAddFavorite = (
        recipeId: string | number | null,
        item: Recipe,
        isFavorite: boolean
    ) => {
        dispatch(manageFavoritesRecipes({ item, uid })).then(() => {
            dispatch(
                setFavoriteRecipes({
                    recipeId,
                    isFavorite: !isFavorite,
                })
            );
        });
    };

    const handleBtnPopUpAction = useCallback(() => {
        setAttentionWindowOpen(false);
        setIsEditActive(false);
    }, []);

    const renderedInfo = () => {
        if (!recipe) return '';
        const {
            title,
            ingredients,
            imgDto,
            description,
            category,
            id,
            time,
            authorId,
        } = recipe;
        const isFavorite = favoriteRecipe.some((recipe) => recipe.id === id);
        const mainImg = imgDto.find((img) => img.id === 'main');
        const parsedDescr = parse(description || '');
        return (
            <>
                <div className="recipe-page__top">
                    <div className="recipe-page__top-btns">
                        {!authorId || uid === authorId || isAdmin ? (
                            <button
                                className="recipe-page__edit-btn"
                                title="редагувати"
                                type="button"
                                onClick={() => handleEditRecipe(recipe)}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20">
                                    <use href={`${iconsSprite}/#edit`} />
                                </svg>
                            </button>
                        ) : (
                            ''
                        )}
                        <button
                            className={`recipe-page__favorite-btn ${
                                isFavorite ? 'btn-active' : ''
                            }`}
                            title="в обране"
                            type="button"
                            onClick={() => {
                                if (uid) {
                                    handleAddFavorite(id, recipe, isFavorite);
                                } else {
                                    navigate('/favorites');
                                }
                            }}
                        >
                            <svg width="22" height="22" viewBox="0 0 22 22">
                                <use href={`${iconsSprite}#heart`} />
                            </svg>
                        </button>
                    </div>
                    <div className="recipe-page__top-wrapper">
                        <h2 className="recipe-page__title">{title}</h2>
                        <span className="recipe-page__categories">
                            {category}
                        </span>
                    </div>
                    <div className="recipe-page__photo-wrapper">
                        <LazyLoad>
                            <img
                                className="recipe-page__photo"
                                src={mainImg?.src || ''}
                                alt="фото"
                            />
                        </LazyLoad>
                    </div>
                </div>
                <div className="recipe-page__content">
                    <div className="recipe-page__left-col">
                        <div className="recipe-page__left-fixed">
                            <div className="recipe-page__cooking-time">
                                <h3 className="recipe-page__ingredients-title recipe-titles">
                                    Час приготування
                                </h3>
                                <div className="recipe-page__time-inner">
                                    <img
                                        className="recipe-page__time-icon"
                                        src={timerIcon}
                                        alt="час"
                                    />
                                    <span className="recipe-page__time-text">
                                        {time.hours ? `${time.hours} год` : ''}{' '}
                                        {time.minutes
                                            ? `${time.minutes} хв`
                                            : ''}
                                    </span>
                                </div>
                            </div>
                            <div className="recipe-page__ingredients">
                                <h3 className="recipe-page__ingredients-title recipe-titles">
                                    Інгредієнти
                                </h3>
                                <ul className="recipe-page__ingredients-list">
                                    {ingredients?.map((ingredient) => {
                                        const {
                                            tagText,
                                            tagQuantityWithUnit,
                                            tagUnit,
                                        } = ingredient;
                                        return (
                                            <li
                                                key={nextId('ingredient-')}
                                                className="recipe-page__ingredients-item"
                                            >
                                                <span className="ingredients-item__character">
                                                    {tagText}
                                                </span>
                                                {tagQuantityWithUnit && (
                                                    <span className="ingredients-item__quantity">
                                                        {tagQuantityWithUnit}{' '}
                                                        {tagUnit}
                                                    </span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="recipe-page__cooking-descr">
                        <h3 className="recipe-page__descr-title recipe-titles">
                            Процес приготування
                        </h3>
                        <div className="recipe-page__descr">{parsedDescr}</div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <LazyMotion features={domMax} strict>
            <m.section
                className="about-recipe"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    transition: {
                        duration: 0.7,
                        delay: 0,
                    },
                }}
                exit={{
                    opacity: 0,
                    display: 'none',
                }}
            >
                <div className="container">
                    <PopUp
                        isPopUpShow={attentionWindowOpen}
                        setIsPopUpShow={setAttentionWindowOpen}
                        text="Ви впевнені, що хочете повернутись назад?"
                        subtext="Якщо Ви закриєте редактор, то зміни не буде збережено."
                        additionalBtnText="Скасувати редагування"
                        additionalBtnAction={handleBtnPopUpAction}
                        setIsEditActive={setIsEditActive}
                    />
                    <main className="recipe-page">
                        {isEditActive && currentRecipeToEdit ? (
                            <EditRecipeForm
                                recipe={currentRecipeToEdit}
                                setIsAttentionOpen={setAttentionWindowOpen}
                                setIsEditActive={setIsEditActive}
                            />
                        ) : (
                            renderServerData({
                                error,
                                errorText:
                                    'Упс, щось пішло не так :( Спробуйте оновити сторінку!',
                                loading: loadingRecipe,
                                content: renderedInfo,
                            })
                        )}
                    </main>
                </div>
            </m.section>
        </LazyMotion>
    );
};

export default AboutRecipePage;
