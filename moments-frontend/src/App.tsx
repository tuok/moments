import React, { useEffect, useState } from 'react'

import { AppBar, Fab, Toolbar, Tooltip, Typography } from '@material-ui/core'
import { Add } from '@material-ui/icons'

import Api from './Api'
import { defaultSearchData, IEntry, ISearchData } from './Models'
import Entry from './Entry'
import EntrySearch from './EntrySearch'
// import { surroundPatternWithTags } from './Utils'

const App = () => {
    const [entries, setEntries] = useState<IEntry[]>([])
    const [tags, setTags] = useState<Record<string, number>>({})
    const [searchPattern, setSearchPattern] = useState<string | undefined>(undefined)

    useEffect(() => {
        Api.getTags(true, (tags: Record<string, number>) => {
            setTags(tags)
        })
    }, [])

    useEffect(() => {
        Api.getEntries(defaultSearchData, (entries: IEntry[]) => setEntries(entries))
    }, [])

    const handleSearchDataChanged = (searchData: ISearchData) => {
        Api.getEntries(searchData, (entries: IEntry[]) => {
            setSearchPattern(searchData.searchTerm)
            setEntries(entries)
        })
    }

    return (
        <>
            <AppBar position="static" style={{ marginBottom: 20 }}>
                <Toolbar>
                    <Typography variant="h4" style={{ flexGrow: 1, textShadow: '2px 2px 1px rgba(0, 0, 0, 0.6)' }}>
                        Moments &lt;3
                    </Typography>
                </Toolbar>
            </AppBar>
            <EntrySearch tagsFrequencies={tags} searchDataUpdatedCallback={handleSearchDataChanged} />
            <Tooltip title="Uusi kirjaus">
                <Fab color="primary" style={{ position: 'fixed', bottom: 30, right: 30 }}>
                    <Add />
                </Fab>
            </Tooltip>
            {entries.length > 0 ? entries.map(entry => <Entry key={entry.id} entry={entry} searchPattern={searchPattern} />) : null}
        </>
    )
}

export default App
