import { IEntry, ISearchData } from './Models'

class Api {
    private static headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }

    private static apiCall = (path: string, method: string, data: object, callback: Function) => {
        fetch(`http://localhost:5000${path}`, { headers: Api.headers, method, body: JSON.stringify(data) })
            .then(resp => resp.json())
            .then(json => callback(json))
    }

    public static getEntries = (searchData: ISearchData, callback: Function) => {
        Api.apiCall('/api/entries/search', 'POST', searchData, callback)
    }

    public static getTags = (frequencies: boolean, callback: Function) => {
        Api.apiCall('/api/tags', 'POST', { frequencies }, callback)
    }

    public static saveEntry = (entry: IEntry, callback: Function) => {
        Api.apiCall('/api/entries', 'POST', entry, callback)
    }

    public static removeEntry = (entry: IEntry, callback: Function) => {
        Api.apiCall('/api/entries', 'DELETE', entry, callback)
    }
}

export default Api
