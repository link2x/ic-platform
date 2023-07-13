import * as React from 'react'

import { auth, db } from '../src/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'

import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'

import { authErrors } from './constants';

export default function LoginBox() {

  const [user, loading, error] = useAuthState(auth);

  const [ registerMode, setRegisterMode ] = React.useState(false)

  const [ username, setUsername ] = React.useState();
  const [ password, setPassword ] = React.useState();
  const [ repeatPassword, setRepeatPassword ] = React.useState();

  const [ userData, setUserData ] = React.useState();

  const [ forceUpdate, setForceUpdate ] = React.useState(0);

  const [ errorText, setErrorText ] = React.useState('')

  const triggerRefresh = () => {
    setForceUpdate(forceUpdate + 1)
  }

  const attemptLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, username, password).catch((err) => {setErrorText(authErrors[err.code])})
  }

  const attemptRegister = (e) => {
    e.preventDefault();
    if (repeatPassword == password) {
      createUserWithEmailAndPassword(auth, username, password).catch((err) => {setErrorText(authErrors[err.code])})
    } else {
      setErrorText('Passwords must match.')
    }
  }

  const getUser = () => {
      const userDocument = doc(db, 'users/', user.uid)
      getDoc(userDocument).then((doc) => {
          setUserData(doc.data())
      })
  }

  const loginPanel =
  <Stack direction='column' sx={{alignItems: 'center'}}>
    <Typography variant='h5' sx={{py: '1em'}}>Sign In</Typography>
    <Grid container direction='row' spacing={2} sx={{alignItems: 'center'}}>
        {errorText && 
            <Grid item xs={12} sm={12} md={12}>
                <Alert severity='error'>{errorText}</Alert>
            </Grid>
        }
        <Grid item xs={12} sm={12} md={5}>
            <TextField fullWidth label='Login' id='user' type='text' disabled={loading} value={username} onChange={(e) => {setUsername(e.target.value); setErrorText('')}} />
        </Grid>
        <Grid item xs={12} sm={12} md={5}>
            <TextField fullWidth label='Password' id='pass' disabled={loading} type='password' value={password} onChange={(e) => {setPassword(e.target.value); setErrorText('')}} />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
            <Button fullWidth variant='contained' size='large' disabled={loading} onClick={attemptLogin}>Login</Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
            <Button fullWidth variant='text' color='secondary' size='large' disabled={loading} onClick={() => {setRegisterMode(!registerMode)}}>Register?</Button>
        </Grid>
    </Grid>
 </Stack>

 const registerPanel =
  <Stack direction='column' sx={{alignItems: 'center'}}>
          <Typography variant='h5' sx={{py: '1em'}}>Sign In</Typography>
          <Grid container direction='row' spacing={2} sx={{alignItems: 'center'}}>
              {errorText && 
                  <Grid item xs={12} sm={12} md={12}>
                      <Alert severity='error'>{errorText}</Alert>
                  </Grid>
              }
              <Grid item xs={12} sm={12} md={5}>
                  <TextField fullWidth label='Login' id='user' type='text' disabled={loading} value={username} onChange={(e) => {setUsername(e.target.value); setErrorText('')}} />
              </Grid>
              <Grid item xs={12} sm={12} md={5}>
                  <TextField fullWidth label='Password' id='pass' type='password' disabled={loading} value={password} onChange={(e) => {setPassword(e.target.value); setErrorText('')}} />
              </Grid>
              <Grid item xs={12} sm={12} md={5} />
              <Grid item xs={12} sm={12} md={5}>
                  <TextField fullWidth label='Repeat Password' id='pass' type='password' disabled={loading} value={repeatPassword} onChange={(e) => {setRepeatPassword(e.target.value); setErrorText('')}} />
              </Grid>
              <Grid item xs={12} sm={12} md={2}>
                  <Button fullWidth variant='contained' size='large' disabled={loading} onClick={attemptRegister}>Register</Button>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                  <Button fullWidth variant='text' color='secondary' size='large' disabled={loading} onClick={() => {setRegisterMode(!registerMode)}}>Log In?</Button>
              </Grid>
          </Grid>
      </Stack>


  return (
    <Grid container justifyContent={'center'}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Paper elevation={2} sx={{mt: '2em', p: '1em'}}>
          <Stack direction='column' alignItems={'center'}>
            <Typography variant='h4' sx={{pt: '0.5em'}}>IC Safe Foods</Typography>
            {registerMode ? registerPanel : loginPanel}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  )

}