import * as React from 'react'

import Item from "./Item"

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import IconButton from "@mui/material/IconButton";
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'

import RefreshIcon from '@mui/icons-material/Refresh'

import { safetyRatings, itemCategories } from './constants';

export default function ItemList(props) {

  const userID = props.userID
  const itemData = props.itemData
  const readOnly = props.readOnly

  const [ name, setName ] = React.useState('')
  const [ rating, setRating ] = React.useState(-1)
  const [ category, setCategory ] = React.useState(-1)

  const [ filterData, setFilterData ] = React.useState(itemData)
  const [ showFilterPanel, setShowFilterPanel ] = React.useState(false)

  const [ forceUpdate, setForceUpdate ] = React.useState(0);

  const triggerRefresh = () => {
      setForceUpdate(forceUpdate + 1)
  }

  React.useEffect(() => {
    let newFilterData = itemData
    if (name) newFilterData = newFilterData.filter(
      input => input.name.toLowerCase().includes(name.toLowerCase())
    )
    if (rating >= 0) newFilterData = newFilterData.filter(
      input => (rating == -1) ? input : input.rating == rating
    )
    if (category >= 0) newFilterData = newFilterData.filter(
      input => (category == -1) ? input : input.category == category
    )
    setFilterData(newFilterData)
  }, [name, rating, category, itemData])

  const clearFilters = () => {
    if (name) setName('')
    if (rating >= 0) setRating(-1)
    if (category >= 0) setCategory(-1)
  }

  const handleFilterPanel = () => {
    clearFilters()
    setShowFilterPanel(!showFilterPanel)
  }

  return(
    <Paper elevation={1} sx={{my: '1em', p: '1em'}}>
      <Grid container spacing={2} sx={{mb: '1em', px: '1em', alignContent: 'center', alignItems: 'center'}}>
        <Grid item>
          <Typography variant='body1'>Filters</Typography>
        </Grid>
        <Grid item sx={{flexGrow: 1}} />
        <Grid item>
          <Switch checked={showFilterPanel} onChange={handleFilterPanel} />
        </Grid>
        {showFilterPanel && <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Stack direction='column' spacing={2}>
            <TextField fullWidth value={name}
              onChange={(e) => {
                  setName(e.target.value)
                  }} label='Search' />
            <Select fullWidth value={rating} onChange={(e) => {setRating(e.target.value)}}>
              <MenuItem value={-1}>None</MenuItem>
                {safetyRatings.map((ratingText, ratingValue) => 
                    <MenuItem key={ratingValue} value={ratingValue}>{ratingText}</MenuItem>
                )}
            </Select>
            <Select fullWidth value={category} onChange={(e) => {setCategory(e.target.value)}}>
                <MenuItem value={-1}>No Category</MenuItem>
                {itemCategories.map((categoryText, categoryValue) => 
                    <MenuItem key={categoryValue} value={categoryValue}>{categoryText}</MenuItem>
                )}
            </Select>
            <Button fullWidth variant='outlined' onClick={clearFilters} >Clear Filters</Button>
          </Stack>
        </Grid>}
      </Grid>
      <Grid container spacing={2} sx={{mb: '1em', px: '1em', alignContent: 'center', alignItems: 'center'}}>
        <Grid item xs={10} sm={10} md={10} lg={10}>
          <Typography variant='body1' sx={{px: '1em'}}>{filterData.length} Items</Typography>
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2}>
            <Stack direction='row' sx={{justifyContent: 'right', px: '1em'}}>
              <IconButton onClick={triggerRefresh}>
                <RefreshIcon />
              </IconButton>
            </Stack>
        </Grid>
      </Grid>
      <Stack direction='column' spacing={2}>
          {filterData.map((item, index) => 
              <Item readOnly={readOnly} userID={userID} itemData={item} index={index} key={index} />
          )}
      </Stack>
    </Paper>
  )

}