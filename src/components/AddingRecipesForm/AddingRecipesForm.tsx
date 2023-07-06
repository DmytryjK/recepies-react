import { useState, useEffect } from 'react';
import nextId from 'react-id-generator';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { postRecepie } from '../RecipeList/RecepieListSlice';
import { storage } from '../../firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import type { tagsType, uploadFileType } from '../../types/type';

import PopUp from '../PopUp/PopUp';
import './AddingRecipesForm.scss';

const AddingRecipesForm = () => {

    const {error, loadingForm} = useAppSelector(state => state.recepies);
    const [nameValue, setNameValue] = useState<string>('');
    const [tagName, setTagName] = useState<string>('');
    const [timerValue, setTimerValue] = useState<string>('');
    const [tags, setTags] = useState<tagsType[]>([]);
    const [uploadFile, setUploadFile] = useState<uploadFileType | any>({});
    const [statusUploadedPhoto, setStatusUploadedPhoto] = useState<'' | 'error' | 'success' | 'pending'>('');
    const [imageRefFromStorage, setImageRefFromStorage] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const dispatch = useAppDispatch();

    useEffect(() => {

        if (loadingForm === 'succeeded') {
            const popUp = document.querySelector('.success-window');
            popUp?.classList.add('active');
        }

    }, [loadingForm])

    useEffect(() => {
        if (uploadFile.name) {
            const imageRef = ref(storage, `${uploadFile.name}${nextId('photo-id')}`);

            uploadBytes(imageRef, uploadFile)
                .then((snapshot) => {
                    setStatusUploadedPhoto('success');
                    getDownloadURL(snapshot.ref)
                        .then(ref => setImageRefFromStorage(ref));
            });
        }
    }, [uploadFile]);

    const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files;
        setStatusUploadedPhoto('pending');

        if (files && files.length > 0) {
            if (files[0].type.indexOf("image") >= 0) {
                setUploadFile(files[0]);
            } else {
                setStatusUploadedPhoto('error');
                alert('виберіть інший тип файлу для зображення')
            }
        }
        
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameValue(e.target.value);
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimerValue(e.target.value);
    }

    const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagName(event.target.value);
    }

    const handlePlusBtn = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        changeTagsStatesOnEvent();
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === 'Enter') {
            changeTagsStatesOnEvent();
        }
    }

    const delBtnClicked = (id: string | number) => {
        setTags(tags.filter(tag => tag.id !== id));
    }

    // const handleDescrChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     setDescription(e.target.value);
    // }   

    const changeTagsStatesOnEvent = () => {
        if (tagName.length > 0) {
            setTagName("");
            setTags(
                [...tags, 
                    {
                        id: nextId("ingredient-"), 
                        tagText: tagName
                    }
                ]
            )
        }
    }

    const handleSubmitForm = (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (nameValue && tags.length > 0 && description) {
            dispatch(postRecepie({
                    id: '',
                    title: nameValue,
                    time: timerValue ? timerValue : null,
                    ingredients: tags.map(tag => tag.tagText),
                    description: description,
                    img: imageRefFromStorage,
                    favorites: false,
                    category: 'default',
                }));
            if (!error) {
                setNameValue('');
                setTagName('');
                setTags([]);
                setUploadFile({});
                setImageRefFromStorage('');
                setStatusUploadedPhoto('');
                setDescription('');
            }
            
        } else {
            alert('all fields must be fills');
        }
    }

    const tagsRender = (tags: tagsType[]) => {
        if (tags.length > 0) {
            const result = tags.map(tag => {
                const {id, tagText} = tag;
                return (
                    <li className="tagsForm__createdTag" key={id}>
                    {tagText}
                        <button 
                            className="tagsForm__closeTag"
                            onClick={() => delBtnClicked(id)}>
                        </button>
                    </li>
                )
            })
            return result;
        }
    }

    const renderedTags = tagsRender(tags);
    
    let uploadInfo;

    if (statusUploadedPhoto === 'pending') {
        uploadInfo = 'loading...'
    }
    else if (statusUploadedPhoto === 'success' && uploadFile) {
        uploadInfo = uploadFile.name;
    } else if (statusUploadedPhoto === 'error') {
        uploadInfo = 'Sorry, try to load another type of image file' 
    }

    return(
        <>
            <form className="form add-recepie__form">
                <label className="form__name-label">
                    <span>Название блюда</span>
                    <input  className="form__name-recepie" 
                            type="text" 
                            required
                            value={nameValue}
                            onChange={handleNameChange}/>
                </label>
                <fieldset className="tagsForm">          
                    <legend className="tagsForm__header">Ингредиенты</legend>
                    <div className="tagsForm__top-wrapper">
                        <input 
                        className="tagsForm__tagName"
                        type="text"
                        value={tagName}
                        onChange={handleTagChange}
                        onKeyDown={handleKeyDown}/>
                        <button 
                            className="tagsForm__search-btn"
                            onClick={handlePlusBtn}
                            >+</button>
                    </div>
                    <ul className="tagsForm__tagList">
                        {renderedTags}
                    </ul>
                </fieldset>
                <label className="form__timer-label">
                    <span>Время приготовления</span>
                    <div className="form__timer-wrapper">
                        <input  className="form__timer-input" 
                            type="text"
                            value={timerValue}
                            onChange={handleTimeChange}/>
                    </div>
                </label>
                <label className="form__upload-label">
                    <input 
                        className="form__upload-photo" 
                        type="file"
                        onChange={handleUploadPhoto}
                        disabled = {statusUploadedPhoto === 'success' ? true : false}/>
                    <span className="form__upload-label-name">{uploadInfo ? uploadInfo : 'Загрузить фото блюда'}</span>
                </label>
                <div className="form__descr">
                    <span className="form__descr-title">Описание</span>
                    <ReactQuill 
                        className="form__descr-editor"
                        theme="snow" 
                        value={description} 
                        onChange={setDescription} />
                </div>
                <input 
                    className="form__submit addRecipe-btn" 
                    type="submit"
                    onClick={handleSubmitForm}/>
            </form>
            {PopUp()}
        </>
        
    )
}

export default AddingRecipesForm;
