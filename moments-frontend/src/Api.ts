import { IEntry, ISearchData } from './Models'

const API_URL = process.env.BACKEND;

class Api {
    private static headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }

    private static apiCall = (
        path: string,
        method: string,
        data: object | null,
        callback: Function
    ) => {
        fetch(`${API_URL}${path}`, {
            headers: Api.headers,
            method,
            body: data ? JSON.stringify(data) : null,
        })
            .then((resp) => resp.json())
            .then((json) => callback(json))
    }

    public static getEntries = (
        searchData: ISearchData,
        callback: Function
    ) => {
        Api.apiCall('/entries/search', 'POST', searchData, callback)
    }

    public static getTags = (callback: Function) => {
        Api.apiCall('/tags', 'GET', null, callback)
    }

    public static saveEntry = (entry: IEntry, callback: Function) => {
        Api.apiCall('/entries', 'POST', entry, callback)
    }

    public static removeEntry = (entry: IEntry, callback: Function) => {
        Api.apiCall('/entries', 'DELETE', entry, callback)
    }
}

export default Api
