import * as React from 'react'

import { v4 as uuidv4 } from 'uuid';

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper';

import { db } from './firebase'
import { doc, setDoc, Timestamp } from 'firebase/firestore'

import { safetyRatings, itemCategories } from './constants'

export default function CreateItem(props) {

    const itemData = props.itemData
    const userID = props.userID

    const [ name, setName ] = React.useState('')
    const [ rating, setRating ] = React.useState(0)
    const [ category, setCategory ] = React.useState(-1)

    const [ updating, setUpdating ] = React.useState(false)
    const [ error, setError ] = React.useState('')

    const makeItem = () => {

        let newItemID = uuidv4()

        setUpdating(true)
        if (name && (itemData.findIndex(e => e.itemID==newItemID) === -1)) {
            const linkDocument = doc(db, 'items/' + userID + '/items/' + newItemID)
            let newItemData = {
                name: name,
                rating: rating,
                category: category,
                createTimestamp: Timestamp.now(),
                updateTimestamp: Timestamp.now()
            }
            setDoc(linkDocument, newItemData).then(() => {
                setName('')
                setRating(0)
                setCategory(-1)
                setUpdating(false)
            })
        } else if (!name) {
            setError('Please enter an item name.')
            setUpdating(false)
        }
    }

    return(
        <Paper elevation={1} sx={{my: '1em', p: '1.5em'}}>
            <Grid container spacing={2} sx={{alignItems: 'center'}}>
                {error && 
                    <Grid item xs={12} sm={12} md={12}>
                        <Alert severity='error'>{error}</Alert>
                    </Grid>
                }
                <Grid item xs={12} sm={6} md={12} lg={12}>
                    <TextField fullWidth value={name}
                        disabled={updating}
                        onChange={(e) => {
                            setName(e.target.value)
                            setError('')
                            }} label='Item Name' />
                </Grid>
                <Grid item xs={12} sm={6} md={12} lg={12}>
                    <Select fullWidth disabled={updating} value={rating} onChange={(e) => {setRating(e.target.value)}}>
                        {safetyRatings.map((ratingText, ratingValue) => 
                            <MenuItem key={ratingValue} value={ratingValue}>{ratingText}</MenuItem>
                        )}
                    </Select>
                </Grid>
                <Grid item xs={12} sm={6} md={8} lg={10}>
                    <Select fullWidth disabled={updating} value={category} onChange={(e) => {setCategory(e.target.value)}}>
                        <MenuItem value={-1}>No Category</MenuItem>
                        {itemCategories.map((categoryText, categoryValue) => 
                            <MenuItem key={categoryValue} value={categoryValue}>{categoryText}</MenuItem>
                        )}
                    </Select>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2}>
                    <Button fullWidth size='large' variant='outlined' disabled={updating} onClick={makeItem}>New Item</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}