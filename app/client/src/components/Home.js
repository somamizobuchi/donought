import React from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import HomeNav from './HomeNav'
import Footer from './Footer'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

export default function Home(){
    return(
        <div>
            <Router>
                <HomeNav />
                <Switch>
                    <Route path="/login">
                        <LoginForm />
                    </Route>
                    <Route path="/">
                        <RegisterForm />
                    </Route>
                </Switch>
                <Footer />
            </Router>
        </div>
    )
}