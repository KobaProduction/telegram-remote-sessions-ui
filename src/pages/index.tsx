import React, { useState } from 'react';
import SessionFormTemplateSerent from "@/app/components/sessions/sessionFormTemplateSerent";
// import SessionForm from '@/app/components/forms/SessionForm';




const Home = () => {
    const [sessionFile, setSessionFile] = useState<File | null>(null); // Храним выбранный файл
    const [sessionData, setSessionData] = useState<any>(null); // Храним данные сессии

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSessionFile(event.target.files[0]);
        }
    };



    return (
        <div className="container">
            <SessionFormTemplateSerent/>
        </div>
    );
};

export default Home;
