import * as React from 'react'

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip'

import { versionNumber } from './constants';

export default function Footer(props) {

  const router = props.router

  return (
    <Stack spacing={1} direction='column' sx={{pt: '1em'}}>
      <Divider />
      <Grid container sx={{p: '1em'}} alignItems={'center'} justifyContent={{xs: 'center'}}>
        <Grid item xs={12} sm={4} md={4} sx={{pb: '1em'}}>
          <Stack spacing={2} direction='row' justifyContent={{xs: 'center', sm: 'left'}}>
            <Chip variant='outlined' 
              label={'Version ' + versionNumber.major + '.' + versionNumber.minor + '.' + versionNumber.patch} />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4} md={4} sx={{pb: '1em'}}>
          <Stack spacing={1} direction='column' alignItems={'center'}>
            <Typography variant='subtitle2' color='secondary'>Open source. Built with love.</Typography>
            <Stack direction='row'>
              <Button size='small' onClick={() => router.push('https://github.com/link2x/ic-platform')}>GitHub</Button>
              {/* <Button>About</Button> */}
            </Stack>
          </Stack>
        </Grid>
        <Box sx={{flexGrow: 1}} />
        <Chip label='l2x.us' />
      </Grid>
    </Stack>
  )

}