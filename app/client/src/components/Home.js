import React from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import Footer from './Footer'
import {
    Switch,
    Route
} from "react-router-dom";
import { BsCheck, BsCheckAll, BsCheckBox, BsPeopleFill, BsXSquare } from 'react-icons/bs'
import NotFound from './NotFound'


export default function Home(props) {
    // Main Component
    return (
        <div>
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <div className="row justify-content-center">
                        <Switch>
                            <Route path="/login" exact={true}>
                                <LoginForm />
                            </Route>
                            <Route path="/" exact={true}>
                                <div className="col-sm-8 col-md-auto py-3 mr-none mr-lg-5">
                                    <Panel />
                                </div>
                                <div className="col-xs-8 col-sm-7 col-md-6 col-lg-5 col-xl-4">
                                    <RegisterForm />
                                </div>
                            </Route>
                            <Route path="*">
<<<<<<< HEAD
                                <h1>Page not found</h1>
=======
                                <NotFound />
>>>>>>> myTaskCardRemake
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
            <Footer />
        </div >
    )
}

const Panel = (props) => {
    return (
        <>
            <h2 className="text-center text-md-left mb-4">Donought</h2>
            <div className="text-center text-md-left mb-3">
                <h5><BsCheckBox className="mr-2" />Do more, by doing less</h5>
            </div>
            <div className="text-center text-md-left mb-3">
                <h5><BsXSquare className="mr-2" />An "anti" to-do list</h5>
            </div>
            <div className="text-center text-md-left mb-3">
                <h5><BsPeopleFill className="mr-2" />Community support</h5>
            </div>
        </>
    )
}