import { Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { ISearchData, defaultSearchData } from './Models'

import TagAutoComplete from './TagAutoComplete'
import { DateType, handleDateChangeGeneral } from './Utils'

export interface IEntrySearchProps {
    tagsFrequencies: Record<string, number>
    searchDataUpdatedCallback: Function
}

const EntrySeach = (props: IEntrySearchProps) => {
    const { tagsFrequencies, searchDataUpdatedCallback } = props

    const [searchData, setSearchData] = useState<ISearchData>(defaultSearchData)
    const [startDateError, setStartDateError] = useState<boolean>(false)
    const [endDateError, setEndDateError] = useState<boolean>(false)

    const tags = Object.keys(tagsFrequencies)

    const handleFullTextSearchTermChange = (searchTerm: string) => {
        const term = searchTerm.length < 3 ? undefined : searchTerm
        const newSearchData = { ...searchData, searchTerm: term }

        searchDataUpdatedCallback(newSearchData)
        setSearchData(newSearchData)
    }

    const handleTagsChanged = (newTags: string[]) => {
        const newSearchData = { ...searchData, tags: newTags }

        searchDataUpdatedCallback(newSearchData)
        setSearchData(newSearchData)
    }

    const handleDateChange = (type: DateType, dateStr: string) => {
        const result = handleDateChangeGeneral(
            type,
            dateStr,
            'startDate',
            'endDate',
            setStartDateError,
            setEndDateError
        )

        if (result) {
            const [key_, value] = result
            const key = key_ as string
            const newSearchData = { ...searchData, [key]: value }

            setSearchData(newSearchData)
            searchDataUpdatedCallback(newSearchData)
        }
    }

    const handleReverseChange = () => {
        const newSearchData = { ...searchData, desc: !searchData.desc }

        setSearchData(newSearchData)
        searchDataUpdatedCallback(newSearchData)
    }

    return (
        <Paper
            style={{
                paddingTop: 5,
                paddingLeft: 15,
                paddingRight: 15,
                paddingBottom: 10,
                marginLeft: 10,
                marginRight: 10,
            }}
        >
            <Typography
                variant="h5"
                style={{ marginLeft: 5, marginTop: 5, fontWeight: 600 }}
            >
                Haku
            </Typography>
            <TagAutoComplete
                tags={tags}
                frequencies={tagsFrequencies}
                maxResults={6}
                onTagsChanged={handleTagsChanged}
                threshold={1}
            />
            <TextField
                label="Tekstihaku"
                onChange={(e) => handleFullTextSearchTermChange(e.target.value)}
                fullWidth
                style={{ marginTop: 5 }}
            />
            <TextField
                error={startDateError}
                label="Jälkeen ajanhetken"
                onChange={(e) =>
                    handleDateChange(DateType.BeginDate, e.target.value)
                }
                fullWidth
                style={{ marginTop: 5 }}
            />
            <TextField
                error={endDateError}
                label="Ennen ajanhetkeä"
                onChange={(e) =>
                    handleDateChange(DateType.EndDate, e.target.value)
                }
                fullWidth
                style={{ marginTop: 5 }}
            />
            <label>
                <input
                    type="checkbox"
                    checked={searchData.desc}
                    onChange={handleReverseChange}
                    style={{ marginLeft: 2, marginRight: 10, marginTop: 20 }}
                />
                Järjestä vanhimmasta uusimpaan
            </label>
        </Paper>
    )
}

export default EntrySeach
