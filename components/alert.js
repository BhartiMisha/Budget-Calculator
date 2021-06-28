import React from 'react'
import {MdSend} from 'react-icons/md';

const alert = ({type,text}) => {
    return (
        <div className={`alert alert-${type}`}>
            {text}
        </div>
    )
}
export default alert;