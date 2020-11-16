import React from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import Footer from './Footer'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

export default function Home(props) {
    return (
        <div>
            <div className="container">
                <Switch>
                    <Route path="/login" exact={true}>
                        <LoginForm />
                    </Route>
                    <Route path="/">
                        <RegisterForm />
                    </Route>
                </Switch>
            </div>
            <Footer />
        </div>
    )
}