import React, {useContext, useEffect, useState} from "react";
import {UserContext} from '../../UserContext'
import Task from './Task'
import {Row} from 'reactstrap'

export default function Tasks(){
    const {user, setUser} = useContext(UserContext)
    useEffect(() => {
        fetch(`/api/task/${user._id}`)
            .then(res => res.json())
            .then(doc => {
                setUser({
                    ...user,
                    tasks: doc.tasks
                })
                
            })
    },[])
    
    if(user.tasks){
        return(
            <div className="">
                <Row>
                    {user.tasks.map((task) => (
                        <Task title={task.title} key={task._id} desc={task.description}/>
                    ))}
                </Row>
            </div>
        )
    }else{
        return(
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        )
    }
}