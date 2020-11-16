import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import { IEntry } from './Models'
import Tag from './Tag'
import { textToBoldComponents } from './Utils'

interface IEntryProps {
    entry: IEntry
    searchPattern?: string
}

const Entry = (props: IEntryProps) => {
    const { entry, searchPattern } = props

    return (
        <Card
            style={{
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
                border: 'solid gray 2px',
                boxShadow: '3px 3px 4px rgba(0, 0, 0, 0.4)',
            }}
        >
            <CardContent>
                {entry.title !== null ? (
                    <Typography variant="h5" style={{ marginBottom: -3 }}>
                        {entry.title}
                    </Typography>
                ) : null}
                <Typography variant="h6" style={{ color: '#666' }}>
                    {entry.start_readable_timestamp}
                </Typography>
                <Typography style={{ marginTop: 15, whiteSpace: 'pre-line' }}>{textToBoldComponents(entry.text, searchPattern)}</Typography>
                <Typography variant="h6" style={{ marginTop: 20 }}>
                    Tägit
                </Typography>
                {entry.tags.map(tag => (
                    <Tag key={tag} label={tag} />
                ))}
            </CardContent>
        </Card>
    )
}

export default Entry
