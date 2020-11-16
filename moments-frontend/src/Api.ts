import { ISearchData } from "./Models"

class Api {
    private static headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    private static apiCall = (path: string, method: string, data: object, callback: Function) => {
        fetch(`http://localhost:5000${path}`, { headers: Api.headers, method, body: JSON.stringify(data) })
            .then(resp => resp.json())
            .then(json => callback(json))
    }

    public static getEntries = (searchData: ISearchData, callback: Function) => {
        console.info('Fetching entries with following criteria:', searchData)
        Api.apiCall('/api/entries/search', 'POST', searchData, callback)
    }

    public static getTags = (frequencies: boolean, callback: Function) => {
        Api.apiCall('/api/tags', 'POST', { frequencies }, callback)
    }
}

export default Api