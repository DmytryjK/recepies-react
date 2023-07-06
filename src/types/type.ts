export interface Recepie {
	id: string|number|null;
	title: string;
	time?: string | null;
	ingredients?: string[];
	img?: string;
	description?: string;
	favorites: boolean;
	category: string;
}

export interface Recepies {
	recepies: Recepie[];
	fetchedRecepieInfo?: Recepie | null;
}

export interface PostState {
	loading: 'idle' | 'pending' | 'succeeded' | 'failed';
	loadingForm?: 'idle' | 'pending' | 'succeeded' | 'failed';
	error: null | unknown;
}

export interface tagsType {
    id: number | string;
    tagText: string;
}

export interface filterRecepies {
    filteredRecepies: Recepie[];
	searchInput: string;
	searchTags: tagsType[];
}

export interface objectForFiltered {
	recepies: Recepie[];
	tags: string[];
}

export interface objectForSearch {
	recepies: Recepie[];
	value: string;
}

export interface uploadFileType {
    lastModified?: number;
    lastModifiedDate?: Date;
    name?: string;
    size?: number;
    type?: string;
    webkitRelativePath?: string;
}

export interface userType {
	user: {
		uid: string;
		email: string;
	}
}

export interface user {
	uid: string;
	email: string;
}

export interface FavoriteRecipes {
	favoriteRecipes: Recepie[];
	loadingRecipesById: 'idle' | 'pending' | 'succeeded' | 'failed'
	loadingRecipeIdToFirebase: 'idle' | 'pending' | 'succeeded' | 'failed'
	error: null | unknown;
}
