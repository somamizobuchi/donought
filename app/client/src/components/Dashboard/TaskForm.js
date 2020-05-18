import React, {useContext, useState} from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import chalk from 'chalk'


export default function TaskForm(){
//    const {user, setUser} = useContext(UserContext);
    const [form, setForm] = useState({
        title: '', 
        category:'', 
        description: ''
    })

    // Update `form` state based on input
    const updateField = (e) => {
        setForm({
            ...form, 
            [e.target.name]: e.target.value
        })
    }

    // fetch API 
    const handleSubmit = (e) => {
        // Prevent default "submit" action
        e.preventDefault();
        // HTTP header options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        };
        console.log(chalk.red("Making http call"));
        // Make http request
        fetch('/api/task/new', requestOptions)
            .then(res => res.json())
            .then(res => {
                console.log(chalk.blueBright(res))
            })
            .catch(err => {
                console.log(chalk.red(err));
            })
    }

    // render
    return (
        <div> 
            <Form>
                <h2>Create a new Donought</h2>
                <FormGroup> 
                    <Label for="title">Title</Label>
                    <Input value={form.title} type="text" name="title" onChange={updateField}></Input>
                </FormGroup>
                <FormGroup> 
                    <Label for="category">Category</Label>
                    <Input value={form.category} type="text" name="category" onChange={updateField}></Input>
                </FormGroup>
                <FormGroup> 
                    <Label for="description">Description</Label>
                    <Input value={form.description} type="text" name="description" onChange={updateField}></Input>
                </FormGroup>
            </Form>
            <Button onClick={handleSubmit}>Create</Button>
        </div>
    )
}


