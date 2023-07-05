import * as React from 'react'

import { auth, db } from '../src/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'

export default function LoginBox() {

  const [user, loading, error] = useAuthState(auth);

  const [ registerMode, setRegisterMode ] = React.useState(false)

  const [ username, setUsername ] = React.useState();
  const [ password, setPassword ] = React.useState();
  const [ repeatPassword, setRepeatPassword ] = React.useState();

  const [ userData, setUserData ] = React.useState();

  const [ forceUpdate, setForceUpdate ] = React.useState(0);

  const triggerRefresh = () => {
      setForceUpdate(forceUpdate + 1)
  }

  const attemptLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, username, password)
}

  const attemptRegister = (e) => {
    e.preventDefault();
    if (repeatPassword == password) {
      createUserWithEmailAndPassword(auth, username, password)
    }
  }

  const getUser = () => {
      const userDocument = doc(db, 'users/', user.uid)
      getDoc(userDocument).then((doc) => {
          setUserData(doc.data())
      })
  }

  if (!registerMode) {return(
    <Stack direction='column' sx={{alignItems: 'center'}}>
        <Typography variant='h5' sx={{py: '1em'}}>Sign In</Typography>
        <Grid container direction='row' spacing={2} sx={{alignItems: 'center'}}>
            <Grid item xs={12} sm={12} md={5}>
                <TextField fullWidth label='Login' id='user' type='text' value={username} onChange={(e) => {setUsername(e.target.value)}} />
            </Grid>
            <Grid item xs={12} sm={12} md={5}>
                <TextField fullWidth label='Password' id='pass' type='password' value={password} onChange={(e) => {setPassword(e.target.value)}} />
            </Grid>
            <Grid item xs={12} sm={12} md={2}>
                <Button fullWidth variant='contained' size='large' onClick={attemptLogin}>Login</Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
                <Button fullWidth variant='outlined' size='large' onClick={() => {setRegisterMode(!registerMode)}}>Register?</Button>
            </Grid>
        </Grid>
    </Stack>
  )} else return(
    <Stack direction='column' sx={{alignItems: 'center'}}>
        <Typography variant='h5' sx={{py: '1em'}}>Sign In</Typography>
        <Grid container direction='row' spacing={2} sx={{alignItems: 'center'}}>
            <Grid item xs={12} sm={12} md={5}>
                <TextField fullWidth label='Login' id='user' type='text' value={username} onChange={(e) => {setUsername(e.target.value)}} />
            </Grid>
            <Grid item xs={12} sm={12} md={5}>
                <TextField fullWidth label='Password' id='pass' type='password' value={password} onChange={(e) => {setPassword(e.target.value)}} />
            </Grid>
            <Grid item xs={12} sm={12} md={5} />
            <Grid item xs={12} sm={12} md={5}>
                <TextField fullWidth label='Repeat Password' id='pass' type='password' value={repeatPassword} onChange={(e) => {setRepeatPassword(e.target.value)}} />
            </Grid>
            <Grid item xs={12} sm={12} md={2}>
                <Button fullWidth variant='contained' size='large' onClick={attemptRegister}>Register</Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
                <Button fullWidth variant='outlined' size='large' onClick={() => {setRegisterMode(!registerMode)}}>Log In?</Button>
            </Grid>
        </Grid>
    </Stack>
  )

}