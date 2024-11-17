import React, { useState } from 'react';
import SessionForm from '@/app/components/forms/SessionForm';

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
            <h1>Редактировать сессию</h1>
            <div className="file-upload">
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".json"
                />
            </div>

            {sessionFile && (
                <SessionForm
                    sessionFile={sessionFile}
                    setSessionData={setSessionData}
                />
            )}

            {sessionData && (
                <div className="session-preview">
                    <h2>Данные сессии:</h2>
                    <pre>{JSON.stringify(sessionData, null, 2)}</pre>
                </div>
            )}

        </div>


);
};

export default Home;
