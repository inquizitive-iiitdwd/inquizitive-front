import React, {useEffect, useState} from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ShowMarks = () => {

    const location = useLocation();
    const { quizName } = location.state || ''; // Get quizName from navigation state
    const [marks,setMarks]= useState([]);

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const response = await axios.get(`https://inquizitive-web.onrender.com/quiz/getMarks?quizName=${quizName}`);
                console.log(response.data);
                setMarks(response.data.marks);
               
                
            }
            catch(err){
                console.log(err);
            }
        };

        fetchData();

    }, [quizName]);

    return (
        <div>
            <h1>Marks for {quizName}</h1>
            {marks.map((mark, index) => (
                <div key={index}>
                    <p>Team Name: {mark.teamName}</p>
                    <p>lead_mail_id: {mark.leadmailid}</p>
                    <p>Marks: {mark.marks}</p>
                </div>
            ))}
            <Toaster />
        </div>
    );

}

export default ShowMarks;
