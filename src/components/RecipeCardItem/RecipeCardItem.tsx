
import { FC } from 'react';
import nextId from "react-id-generator";
import { Recepie } from "../../types/type";
import './RecipeCardItem.scss';

type FavoriteClickHandler = (recipeId: string|number|null, recipe: Recepie, e: React.MouseEvent<HTMLButtonElement>) => void;

interface RecipeCardProps {
  recipe: Recepie;
  onFavoriteClick: FavoriteClickHandler;
}

const RecipeCard: FC<RecipeCardProps> = ({ recipe, onFavoriteClick }) => {
    const { ingredients, id, title, time, img, favorites, category } = recipe;        
    const renderedTags = ingredients?.map(item => {
        return (
            <li key={nextId("tag-id-")} className="product-tags__item">{item}</li>
        )
    });
    const timerClass = time ? "recipe-item__timer active" : "recipe-item__timer";

    return (
        <a className="recipe-item" href={`/about-recepie/${id}`} title="Подрбнее">
            <div className="recipe-item__top">
                <div className="recipe-item__img-wrapper">
                    <img 
                        className="recipe-item__image"
                        src={img} 
                        alt={title} />
                </div>
                <span className="recipe-item__category">{category}</span>
                <button className = {favorites ? "recipe-item__favorite-btn active" : "recipe-item__favorite-btn"}
                onClick={(e) => onFavoriteClick(id, recipe, e)}>
                <svg width="25" height="25" viewBox="0 0 25 25" fill="red" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.4917 4.06702C18.8609 4.14272 20.1447 4.75651 21.0633 5.77463C21.9819 6.79276 22.4609 8.13269 22.3958 9.50244C22.3958 12.7024 19.6333 14.6681 16.9823 17.0254C14.3656 19.3618 12.9563 20.6389 12.5 20.9337C12.0031 20.6118 10.2677 19.0347 8.01772 17.0254C5.35522 14.6587 2.60418 12.6743 2.60418 9.50244C2.53914 8.13269 3.01812 6.79276 3.93674 5.77463C4.85535 4.75651 6.13914 4.14272 7.50834 4.06702C8.26683 4.04404 9.0183 4.21826 9.68929 4.57265C10.3603 4.92704 10.9278 5.44949 11.3365 6.0889C12.2115 7.31286 12.3573 7.92536 12.5031 7.92536C12.649 7.92536 12.7927 7.31286 13.6594 6.08577C14.0657 5.4434 14.6335 4.91889 15.306 4.56464C15.9784 4.21039 16.7321 4.03881 17.4917 4.06702V4.06702ZM17.4917 1.98369C16.5458 1.95341 15.6052 2.1369 14.7401 2.52052C13.8749 2.90413 13.1074 3.47797 12.4948 4.19932C11.8827 3.48007 11.1168 2.90755 10.2537 2.52406C9.39062 2.14056 8.45239 1.95589 7.50834 1.98369C5.58633 2.05885 3.77228 2.89201 2.46286 4.30098C1.15345 5.70995 0.455212 7.58008 0.520843 9.50244C0.520843 13.2629 3.17709 15.5722 5.7448 17.8045C6.03959 18.0608 6.33751 18.3191 6.63334 18.5827L7.70314 19.5389C8.86984 20.6491 10.093 21.6984 11.3677 22.6827C11.705 22.901 12.0982 23.0172 12.5 23.0172C12.9018 23.0172 13.295 22.901 13.6323 22.6827C14.9476 21.6683 16.2084 20.5852 17.4094 19.4379L18.3698 18.5795C18.675 18.3087 18.9844 18.0389 19.2917 17.7733C21.7229 15.6639 24.4792 13.2733 24.4792 9.50244C24.5448 7.58008 23.8466 5.70995 22.5372 4.30098C21.2277 2.89201 19.4137 2.05885 17.4917 1.98369V1.98369Z" fill="black"/>
                </svg>
                </button>
            </div>
            <div className="recipe-item__content-wrapper">
                <div className="recipe-item__content-text">
                    <h2 className="recipe-item__title" title={title}>{title.length > 42 ? (title.substring(0, 42) + '...') : title}</h2>
                    <span className={timerClass}>{time ? time + 'min' : null}</span>
                    <ul className="recipe-item__product-tags product-tags">
                        {renderedTags ? renderedTags : null}
                    </ul>
                </div>
            </div>
        </a>
    );
};

export default RecipeCard;
