import React, { Component } from 'react'
import RoomJoinPage from './RoomJoinPage'
import CreateRoomPage from './CreateRoomPage'

// For the router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export default class HomePage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Router>
                <Routes>
                    <Route path='/' element={<p>HomePage</p>}/>
                    <Route path='/join' element={<RoomJoinPage />}/>
                    <Route path='/create' element={<CreateRoomPage />}/>
                </Routes>
            </Router>
        )
    }
}

{/* <Router>
<Switch>

<Router path='/join' component={RoomJoinPage}/>
<Router path='/join' component={CreateRoomPage}/>
</Switch>
</Router> */}