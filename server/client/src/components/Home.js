import React from 'react'
import LoginForm from './LoginForm'
import HomeNav from './HomeNav'
import Footer from './Footer'

export default function Home(){
    return(
        <div>
            <HomeNav />
            <LoginForm />
            <Footer />
        </div>
    )
}