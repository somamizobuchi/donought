import React from 'react'
import {Col, Card, CardTitle, CardText, Button} from 'reactstrap'

export default function Task(props){
    return(
        <Col sm="6">
            <Card body>
                <CardTitle>{props.title}</CardTitle>
                <CardText>{props.desc}</CardText>
                <Button>Go somewhere</Button>
            </Card>
        </Col>
    )
}