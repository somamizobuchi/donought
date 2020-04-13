import React, {useState} from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
const LoginForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email:email, password:password })
        };
        fetch('/api/user/login', requestOptions)
            .then(res => res.json())
            .then(dat => console.log(dat))
    }
    return (
        <Form>
            <FormGroup>
                <Label for="email">Email:</Label>
                <Input value={email} type="email" name="email" onChange={(e) => setEmail(e.target.value)}></Input>
            </FormGroup>
            <FormGroup>
                <Label for="password">Password:</Label>
                <Input value={password} type="password" name="password" onChange={e => setPassword(e.target.value)}></Input>
            </FormGroup>
            <Button onClick={handleSubmit}>Submit</Button>
        </Form>
    )
}
export default LoginForm;