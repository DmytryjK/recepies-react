import { useState, useEffect, createContext, Dispatch, SetStateAction } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import { postRecipe } from '../../../../store/reducers/RecipesListSlice';
import ReactQuill from 'react-quill';
import { clearAllTags } from '../../../../store/reducers/CreateRecipeFormSlice';
import Ingredients from '../Ingredients/Ingredients';
import UploadPhotos from '../UploadPhotos/UploadPhotos';
import CustomSelect from '../../../../shared-components/CustomSelect/CustomSelect';
import PopUp from '../PopUp/PopUp';
import { IngredientsType, uploadFileType } from '../../../../types/type';
import './AddingRecipesForm.scss';
import 'react-quill/dist/quill.snow.css';

type LoadedPhotoType = {
    id: string;
    imageRefFromStorage: string;
    uploadFile?: uploadFileType;
}

type LoadedPhotoContextType = {
    loadedPhotosInfo: LoadedPhotoType[];
    setLoadedPhotosInfo: Dispatch<SetStateAction<LoadedPhotoType[]>>;
}

export const LoadedPhotoContext = createContext<LoadedPhotoContextType>({
    loadedPhotosInfo: [],
    setLoadedPhotosInfo: () => {},
});

const AddingRecipesForm = (
    {   
        name, 
        category, 
        timer, 
        loadedPhotos, 
        descr, 
        ingredients
    } : 
    {
        name?: string; 
        category?: string; 
        timer?: {hours: string, minutes: string}; 
        descr?: string; 
        loadedPhotos?: LoadedPhotoType[]; 
        ingredients?: IngredientsType[];
    }
    ) => {
    const {error, loadingForm} = useAppSelector(state => state.recipes);
    
    const categories = ['Випічка', 'Гарніри', 'Перші страви', 'Основні страви', 'Десерти', 'Салати', 'Закуски', 'Напої', 'Соуси'];

    const [nameValue, setNameValue] = useState(name || '');
    const [categoryValue, setCategoryValue] = useState(category || '');
    const [timerValue, setTimerValue] = useState({hours: timer?.hours || '', minutes: timer?.minutes || ''});
    const [loadedPhotosInfo, setLoadedPhotosInfo] = useState<LoadedPhotoType[]>(loadedPhotos || []);
    const [description, setDescription] = useState(descr || '');
    const tags =  useAppSelector(state => state.createRecipeForm.tags);

    const [isSuccessPopUpShow, setIsSuccessPopUpShow] = useState(false);
    const dispatch = useAppDispatch();

    // ////////

    useEffect(() => {
        if (loadingForm === 'succeeded') {
            setIsSuccessPopUpShow(true);
        }
    }, [loadingForm]);

    const handleSubmitForm = () => {
        if (nameValue && tags.length > 0 && description) {
            dispatch(postRecipe({
                    id: '',
                    author: '',
                    title: nameValue,
                    time: {
                        hours: timerValue.hours ? timerValue.hours + ' год.' : '',
                        minutes: timerValue.minutes ? timerValue.minutes + ' хв.' : '',
                    },
                    ingredients: tags,
                    description: description,
                    previewImg: loadedPhotosInfo[0].imageRefFromStorage,
                    img: loadedPhotosInfo[1].imageRefFromStorage,
                    favorites: false,
                    category: categoryValue,
                }));
            if (!error) {
                setNameValue('');
                setCategoryValue('');
                dispatch(clearAllTags());
                setLoadedPhotosInfo([]);
                setDescription('');
                setTimerValue({hours: '', minutes: ''});
            };
            
        } else {
            alert('all fields must be fills');
        }
    }

    return(
        <>
            <form className="form add-recepie__form" 
                onKeyDown={(e) => e.code === 'Enter' && e.preventDefault()}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitForm();
                }}>
                <div className="form__fields-wrapper">
                    <label className="form__name-label form__label">
                        <span>Назва страви</span>
                        <input  className="form__name-recepie form__input" 
                                type="text" 
                                name="Назва страви"
                                required
                                value={nameValue}
                                onChange={(e) => setNameValue(e.target.value)}/>
                    </label>
                    <div className="form__field-category">
                        <label className="form__name-label form__label">
                            <span>Категорія</span>
                        </label>
                        <CustomSelect 
                            setValue={setCategoryValue} 
                            fieldValues={categories}
                            initialCheckedValue={categoryValue}
                            selectTitle="Виберіть категорію"
                        />
                    </div>
                    
                </div>
                <div className="form__fields-wrapper">
                    <Ingredients localingredients={ingredients}/>
                    <fieldset className="form__timer-fiedls timer">
                        <legend className="form__label">Час приготування</legend>
                        <div className="timer__wrapper">
                            <label className="timer__label-hours">
                                <input className="timer__input-hours form__input" 
                                    type="number"
                                    name="години"
                                    value={timerValue.hours}
                                    placeholder="00"
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (+value < 0) {
                                            value = '0';
                                        }
                                        setTimerValue((prev) => {
                                            return {
                                                minutes: prev?.minutes || '',
                                                hours: value,
                                            }
                                        })
                                    }}/>
                                <span>годин</span>
                            </label>
                            <label className="timer__label-minutes">
                                <input className="timer__input-minutes form__input" 
                                    type="number"
                                    name="хвилини"
                                    value={timerValue.minutes}
                                    placeholder="00"
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (+value > 59) {
                                            value = '59';
                                        } else if (+value < 0) {
                                            value = '0';
                                        }
                                        setTimerValue((prev) => {
                                            return {
                                                hours: prev?.hours || '',
                                                minutes: value,
                                            }
                                        })
                                    }}/>
                                <span>хвилин</span>
                            </label>
                        </div>
                    </fieldset>
                </div>
                {/* <div className="form__fields-wrapper">
                    <LoadedPhotoContext.Provider value={{
                            loadedPhotosInfo, 
                            setLoadedPhotosInfo,
                        }}>
                        <UploadPhotos />
                    </LoadedPhotoContext.Provider>
                </div> */}
                <div className="form__fields-wrapper form-descr">
                    <span className="form-descr__title form__label">Процес приготування</span>
                    <ReactQuill 
                        className="form-descr__editor"
                        placeholder= "Опишіть процес приготування..."
                        theme="snow"
                        value={description} 
                        onChange={setDescription} />
                </div>
                <button className="form__submit addRecipe-btn" type="submit">Додати рецепт</button>
            </form>
            <PopUp 
                isPopUpShow={isSuccessPopUpShow} 
                setIsPopUpShow={setIsSuccessPopUpShow} />
        </>
        
    )
}

export default AddingRecipesForm;
