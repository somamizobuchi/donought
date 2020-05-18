import React, {useContext, useEffect, useState} from "react";
import { UserContext } from '../../UserContext'
import Task from './Task'
import { Row, Container } from 'reactstrap'

export default function Tasks(){
    // Get user context
    const {user, setUser} = useContext(UserContext)

    // loading state
    const [loading, setLoading] = useState(true); 

    // UI state
    const [refresh, setRefresh] = useState(false);
    // Before component render: 
    useEffect(() => {
        fetch(`/api/task/${user._id}`)
            .then(res => res.json())
            .then(doc => {
                setUser({
                    ...user,
                    tasks: doc.tasks
                });
                setLoading(false);
                setRefresh(false);
            })
    },[refresh])

    // Render
    if(loading){
        return (
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        )
    }else{
        return (
	        <Container> 
                <Row className="w-75 m-auto">
                    {user.tasks.map((task) => (
                        <Task refresh={refresh} setRefresh={setRefresh} tid={task._id} title={task.title} key={task._id} cat={task.category} desc={task.description}/>
                    ))}
                </Row>
	        </Container> 
        )
    }
        
}
