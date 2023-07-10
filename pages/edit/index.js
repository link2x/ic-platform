import * as React from 'react'

import { auth, db } from '../../src/firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'

import Container from '@mui/material/Container';

import CreateItem from '../../src/CreateItem';
import ItemList from '../../src/ItemList';
import LoginBox from '../../src/LoginBox';
import UserBar from '../../src/UserBar';

export default function Admin() {

    const [user, loading, error] = useAuthState(auth);

    const [ username, setUsername ] = React.useState();
    const [ password, setPassword ] = React.useState();

    const [ itemData, setItemData ] = React.useState([]);

    const [ forceUpdate, setForceUpdate ] = React.useState(0);

    const triggerRefresh = () => {
        setForceUpdate(forceUpdate + 1)
    }

    const attemptLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, username, password)
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

    if (loading) return (<div>Loading...</div>)
    else if (!user) return(
        <Container>
            <LoginBox />
        </Container>
    )
    else if (user) return (
        <Container maxWidth='xl' sx={{mt: '1em'}}>
            <UserBar showURL user={user} />
            <ItemList userID={user.uid} itemData={itemData} />
            <CreateItem userID={user.uid} itemData={itemData} />
        </Container>
    )
}