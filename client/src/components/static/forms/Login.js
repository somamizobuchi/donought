import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'


export default class Login extends Component {
    // Constructor
    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            redirect: false
        }
    }
    // Handle form inputs onChange
    handleChange = event => this.setState({ [event.target.name]: event.target.value })

    // Handle form data onSubmit
    handleSubmit = event => {
        event.preventDefault()
        // rest API call 
        const url = '/api/user/authenticate'
        axios.post(url, {
            email: this.state.email,        // <--- This maybe the issue
            password: this.state.password   // <--- Or this
        })
            .then(response => {
                console.log(response);
                this.setState({ redirect: true })
            })
            .catch(err => {
                console.log(err);
            })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='<App />' />
        }
    }

    render() {
        return (
            // JSX form

            < form >
                {this.renderRedirect()}
                <div className="form-group" onSubmit={this.handleSubmit}>
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" name="email" placeholder="Email" onChange={this.handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" name="password" placeholder="Password" onChange={this.handleChange} />
                </div>
                <button onClick={this.handleSubmit} className="btn btn-primary">Login</button>
            </form >
        )
    }

}