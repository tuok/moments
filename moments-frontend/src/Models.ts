export interface IEntry {
    id: number
    text: string
    author?: string
    title?: string
    tags: string[]
    links_to: number[]
    start_readable_timestamp: string
    end_readable_timestamp?: string
    start_time?: Date
    end_time?: Date
}

export interface ISearchData {
    id?: number
    searchTerm?: string
    tags: string[]
    startDate?: Date
    endDate?: Date
    begin?: number
    end?: number
    reverse: boolean
}

export const defaultSearchData: ISearchData = {
    begin: 1,
    end: 20,
    tags: [],
    reverse: false,
}

export const emptyEntry: IEntry = {
    id: -1,
    text: '',
    author: 'tuomas',
    title: '',
    tags: [],
    links_to: [],
    start_readable_timestamp: '',
    end_readable_timestamp: undefined,
    start_time: undefined,
    end_time: undefined,
}
