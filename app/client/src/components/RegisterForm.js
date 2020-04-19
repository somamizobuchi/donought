import React, { useState, useContext } from 'react'
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap'
import { UserContext } from '../UserContext'


export default function RegisterForm(){
    
    const {user, setUser} = useContext(UserContext);

    const [form, setForm] = useState({
        firstname: "", 
        lastname: "",
        email: "", 
        password: "",
        error: ""
    })

    const [alert, setAlert] = useState("d-none")
    const handleHttpResponse = (res) => {
        const status = res.status
        res.json()
        .then(res => {
            if(status === 200){
                setUser({
                    ...user,
                    _id: res._id,
                    email: res.email,
                    authorized: true
                })
            }else{
                setForm({
                    ...form,
                    error: res.Error
                })
                setAlert('d-block')
            }
        })

    }
    
    const updateField = (e) => {
        setForm({
            ...form, 
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }
        fetch('/api/user/new', requestOptions)
        .then(res => {
            handleHttpResponse(res)
        })
    }
    return (
        <div className="w-50 m-auto">
            <Form className="p-50">
                <h2>Sign Up</h2>
                <Alert color="danger" className={alert}>{form.error}</Alert>
                <FormGroup>
                    <Label for="firstname">First:</Label>
                    <Input value={form.firstname} type="text" name="firstname" onChange={updateField}></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="lastname">Last:</Label>
                    <Input value={form.lastname} type="text" name="lastname" onChange={updateField}></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="email">Email:</Label>
                    <Input value={form.email} type="email" name="email" onChange={updateField}></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password:</Label>
                    <Input value={form.password} type="password" name="password" onChange={updateField}></Input>
                </FormGroup>
                <Button color="success" onClick={handleSubmit}>Sign up</Button>
            </Form>
        </div>
    )
}