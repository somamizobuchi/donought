import React, {useContext, useEffect, useState} from "react";
import { UserContext } from '../../UserContext'
import Task from './Task'
import { Row } from 'reactstrap'

export default function Tasks(){
    // Get user context
    const {user, setUser} = useContext(UserContext)

    // loading state
    const [loading, setLoading] = useState(true); 

    // Initial
    useEffect(() => {
        fetch(`/api/task/${user._id}`)
            .then(res => res.json())
            .then(doc => {
                setUser({
                    ...user,
                    tasks: doc.tasks
                })
            })
            .then(setLoading(false));
    },[])

    // Render
    if(!user.tasks){
        return (
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        )
    }else{
        return (
            <div className="">
                <Row className="w-75 m-auto">
                    {user.tasks.map((task) => (
                        <Task title={task.title} key={task._id} desc={task.description}/>
                    ))}
                </Row>
            </div>
        )
    }
        
}