export type ClingApiCredentials = {
	email:string;
	password: string;
}

export type ClingApiTokenCredentials = {
	apiToken:string;
}

export type LoadedResource = {
	id: number;
	name: string;
}

export type LoadedTemplate = {
	_id: string;
	name: string;
}

export type LoadedField = {
	id: string;
	name: string;
}

export type LoadedArticles = {
	ArticleId: string;
	name: string;
}
