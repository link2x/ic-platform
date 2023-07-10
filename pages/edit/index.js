import * as React from 'react'

import { auth, db } from '../../src/firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

import RefreshIcon from '@mui/icons-material/Refresh'

import Item from '../../src/Item';
import CreateItem from '../../src/CreateItem';
import ItemList from '../../src/ItemList';
import LoginBox from '../../src/LoginBox';

export default function Admin() {

    const [user, loading, error] = useAuthState(auth);

    const [ username, setUsername ] = React.useState();
    const [ password, setPassword ] = React.useState();

    const [ userData, setUserData ] = React.useState();
    const [ itemData, setItemData ] = React.useState([]);

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
        if (user) {
        const itemCollection = collection(db, 'items/' + user.uid + '/items')
        const itemQuery = query(itemCollection, orderBy('createTimestamp', 'desc'))
        const unsubGetItems = onSnapshot(itemQuery, (docs) => {
                let newItemData = []
                docs.forEach((doc) => {
                    let newItem = doc.data()
                    newItem.itemID = doc.id
                    itemData.findIndex(e => e.itemID==newItem.itemID) === -1 ? newItemData.push(newItem) : null
                })
                setItemData(newItemData)
        })

        return () => unsubGetItems()
        }
    }, [ user, forceUpdate ] )

    React.useMemo(() => {
        if (user) {
            getUser()
        }
    }, [ user ])

    if (loading) return (<div>Loading...</div>)
    else if (!user) return(
        <Container>
            <LoginBox />
        </Container>
    )
    else if (user) return (
        <Container maxWidth='xl' sx={{mt: '1em'}}>
            <Grid container spacing={2} sx={{pb: '1em', alignItems: 'center'}}>
                <Grid item md={4}>
                    <Typography>Signed In As {user.email}</Typography>
                </Grid>
                <Grid item md={4}>
                    <TextField fullWidth value={'https://ic.l2x.us/u/'+user.uid} />
                </Grid>
                <Grid item sx={{flexGrow: 1}} />
                <Grid item md={2}>
                    <Button variant='contained' fullWidth onClick={() => signOut(auth)}>Sign Out</Button>
                </Grid>
            </Grid>
            <CreateItem userID={user.uid} itemData={itemData} />
            <ItemList userID={user.uid} itemData={itemData} />
        </Container>
    )
}