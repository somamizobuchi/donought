import React, {useState, useEffect} from 'react'
import {Col, Card, CardTitle, CardText, Button} from 'reactstrap'

export default function Task(props){
    // handling delete
    const handleDelete = (e) => {
        e.preventDefault();
        // Set header options
        const requestOptions = {
            method: 'DELETE'
        };
        fetch('/api/task/delete/' + props.tid, requestOptions)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                // Refresh
                props.setRefresh(true);
            })
    }

    // Render
    return(
        <Col xs="12" sm="6">
            <Card body>
                <CardTitle>{props.title}</CardTitle>
                <CardText>{props.desc}</CardText>
                <CardText>{props.cat}</CardText>
                <CardText>{props.tid}</CardText>
                <Button onClick={handleDelete}>Delete</Button>
            </Card>
        </Col>
    )
}
