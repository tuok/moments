import { Chip } from '@material-ui/core'
import React from 'react'

export interface ITagProps {
    label: string
    handleDelete?: any
}

const Tag = (props: ITagProps) => (
    <Chip
        label={props.label}
        style={{ marginTop: 5, marginRight: 6, boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.4)' }}
        onDelete={props.handleDelete ? () => props.handleDelete(props.label) : undefined}
    />
)

export default Tag
