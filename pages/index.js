import * as React from 'react'

import { useRouter } from "next/router"

import { auth, db } from '../src/firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'

import LoginBox from '../src/LoginBox';

export default function Home() {

    const router = useRouter()

    const [user, loading, error] = useAuthState(auth);

    const [ username, setUsername ] = React.useState();
    const [ password, setPassword ] = React.useState();

    const [ userData, setUserData ] = React.useState();

    const [ forceUpdate, setForceUpdate ] = React.useState(0);

    const triggerRefresh = () => {
        setForceUpdate(forceUpdate + 1)
    }

    const attemptLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, username, password)
    }

    const getUser = () => {
        const userDocument = doc(db, 'users/', user.uid)
        getDoc(userDocument).then((doc) => {
            setUserData(doc.data())
        })
    }

    React.useEffect(() => {
        if (user) router.push('/edit');
      }, [user, router])

    if (!user) return(
        <Container maxWidth='xl' sx={{mt: '1em'}}>
            <LoginBox />
        </Container>
    )

}