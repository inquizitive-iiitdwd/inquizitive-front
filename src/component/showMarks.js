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
                if(quizName==' '){
                     toast.error("Failed to get marks");
                }
                const response = await axios.get(`https://inquizitive-web.onrender.com/quiz/getMarks?quizName=${quizName}`);
                console.log(response.data);
                     if(response.data.ok === false){
                    toast.error("Failed to get marks");
                    return;
                }
                setMarks(response.data.marks);
               
                
            }
            catch(err){
                console.log(err);
            }
        };

        fetchData();

    }, [quizName]);

    return( 
        <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Marks for {quizName}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marks.map((mark, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <p className="font-semibold">Team Name: <span className="font-normal">{mark.teamName}</span></p>
              <p className="font-semibold">Timestamp: <span className="font-normal">{mark.timestamp}</span></p>
              <p className="font-semibold">Lead Mail ID: <span className="font-normal">{mark.leadmailid}</span></p>
              <p className="font-semibold">Marks: <span className="font-normal">{mark.marks}</span></p>
            </div>
          ))}
        </div>
        <Toaster />
      </div>
    );
  };

export default ShowMarks;
