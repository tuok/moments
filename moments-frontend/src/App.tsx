import React, { useEffect, useState } from 'react'
import debounce from 'lodash/debounce'

import { AppBar, Divider, Fab, Toolbar, Tooltip, Typography } from '@material-ui/core'
import { Add } from '@material-ui/icons'

import Api from './Api'
import { defaultSearchData, emptyEntry, IEntry, ISearchData } from './Models'
import Entry from './Entry'
import EntrySearch from './EntrySearch'
import EntryEdit from './EntryEdit'
import DeleteModal from './DeleteModal'

const App = () => {
    const [entries, setEntries] = useState<IEntry[]>([])
    const [tags, setTags] = useState<string[]>([])
    const [frequencies, setFrequencies] = useState<Record<string, number>>({})
    const [searchData, setSearchData] = useState<ISearchData>(defaultSearchData)
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    const [selectedEntry, setSelectedEntry] = useState<IEntry>(emptyEntry)

    const debouncedSearchDataUpdate = debounce((searchData: ISearchData) => setSearchData(searchData), 400)

    useEffect(() => {
        Api.getTags(true, (tagsFrequencies: Record<string, number>) => {
            setFrequencies(tagsFrequencies)
            setTags(Object.keys(tagsFrequencies))
        })
    }, [])

    useEffect(() => {
        Api.getEntries(searchData, (entries: IEntry[]) => setEntries(entries))
    }, [searchData])

    const openEntryEditDialog = (entry: IEntry) => {
        setSelectedEntry(entry)
        setEditDialogOpen(true)
    }

    const triggerSearch = () => setSearchData({ ...searchData })

    const handleEntryModified = (addedTags: string[], removedTags: string[]) => {
        console.debug('New/updated tags:', addedTags)
        console.debug('Removed tags:', removedTags)

        setFrequencies((prevFreqs: Record<string, number>) => {
            const updatedFreqs = { ...prevFreqs }

            addedTags.forEach(tag => {
                if (tag in updatedFreqs) {
                    updatedFreqs[tag]++
                } else {
                    updatedFreqs[tag] = 1
                }
            })

            removedTags.forEach(tag => {
                if (tag in updatedFreqs) {
                    if (updatedFreqs[tag] > 1) {
                        updatedFreqs[tag]--
                    } else {
                        delete updatedFreqs[tag]
                    }
                }
            })

            setTags(Object.keys(updatedFreqs))
            triggerSearch()

            return updatedFreqs
        })
    }

    const handleEntryDelete = (entry: IEntry) => {
        setSelectedEntry(entry)
        setDeleteDialogOpen(true)
    }

    return (
        <div style={{ backgroundColor: 'whitesmoke' }}>
            <AppBar position="static" style={{ marginBottom: 20 }}>
                <Toolbar>
                    <Typography variant="h4" style={{ flexGrow: 1, textShadow: '2px 2px 1px rgba(0, 0, 0, 0.6)' }}>
                        Moments &lt;3
                    </Typography>
                </Toolbar>
            </AppBar>
            <EntrySearch tagsFrequencies={frequencies} searchDataUpdatedCallback={debouncedSearchDataUpdate} />
            <Tooltip title="Uusi kirjaus">
                <Fab
                    color="primary"
                    style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}
                    onClick={() => openEntryEditDialog(emptyEntry)}
                >
                    <Add />
                </Fab>
            </Tooltip>
            <Divider style={{ height: 2, marginTop: 15, marginBottom: 15 }} />
            {deleteDialogOpen ? (
                <DeleteModal
                    entry={selectedEntry}
                    handleCancel={() => {
                        setSelectedEntry(emptyEntry)
                        setDeleteDialogOpen(false)
                    }}
                    handleEntryModified={handleEntryModified}
                />
            ) : null}
            {editDialogOpen ? (
                <EntryEdit
                    entry={selectedEntry}
                    tags={tags}
                    frequencies={frequencies}
                    handleClose={() => setEditDialogOpen(false)}
                    handleEntryModified={handleEntryModified}
                />
            ) : null}
            {entries.length > 0
                ? entries.map(entry => (
                      <Entry
                          key={entry.id}
                          entry={entry}
                          searchPattern={searchData.searchTerm}
                          entryEditCallback={openEntryEditDialog}
                          deleteCallback={handleEntryDelete}
                          handleEntryModified={handleEntryModified}
                      />
                  ))
                : null}
        </div>
    )
}

export default App
