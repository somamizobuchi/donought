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
            <Router>
                <Switch>
                    <div className="container">
                        <Route path="/login">
                            <LoginForm />
                        </Route>
                        <Route path="/">
                            <RegisterForm />
                        </Route>
                    </div>
                </Switch>
                <Footer />
            </Router>
        </div>
    )
}