export interface IEntry {
    id: number
    text: string
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
    desc: boolean
}

export const defaultSearchData: ISearchData = {
    begin: 0,
    end: 20,
    tags: [],
    desc: true,
}

export const emptyEntry: IEntry = {
    id: -1,
    text: '',
    title: '',
    tags: [],
    links_to: [],
    start_readable_timestamp: '',
    end_readable_timestamp: undefined,
    start_time: undefined,
    end_time: undefined,
}
