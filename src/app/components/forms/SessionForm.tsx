import { useState, useEffect } from "react";

interface SessionFormProps {
    sessionFile: File | null;
    setSessionData: React.Dispatch<React.SetStateAction<any>>;
}

const SessionForm = ({ sessionFile, setSessionData }: SessionFormProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionData, setSessionDataState] = useState<any>(null);
    const [duplicateName, setDuplicateName] = useState<string | null>(null);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);

    useEffect(() => {
        if (!sessionFile) return;

        const loadSessionData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/sessions/loadSession?fileName=${sessionFile.name}`);

                if (!res.ok) {
                    setError(`Ошибка при загрузке: ${res.statusText}`);
                    return
                }

                const data = await res.json();
                setSessionDataState(data.sessionData);
                setSessionData(data.sessionData);
            } catch (err: unknown) {
                setError('Ошибка загрузки данных сессии');
                console.error('Ошибка загрузки данных сессии:', err);
            } finally {
                setLoading(false);
            }
        };

        loadSessionData();
    }, [sessionFile]);

    const handleSaveChanges = async () => {
        if (!sessionFile || !sessionData) return;

        setLoading(true);

        const res = await fetch(`/api/sessions/saveSession`, {
            method: "POST",
            body: JSON.stringify({ fileName: sessionFile.name, sessionData }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            alert('Сессия успешно сохранена!');
        } else {
            setError('Ошибка при сохранении сессии');
            console.error('Ошибка при сохранении сессии:', await res.json());
        }

        setLoading(false);
    };

    const handleFieldChange = (key: string, value: any) => {
        setSessionDataState({ ...sessionData, [key]: value });
    };

    const handleDuplicateSession = async () => {
        if (!sessionFile || !sessionData || !duplicateName) {
            setError('Необходимо указать все данные: файл и новое имя для дубликата');
            return;
        }

        setLoading(true);

        const res = await fetch(`/api/sessions/duplicateSession`, {
            method: "POST",
            body: JSON.stringify({
                originalFileName: sessionFile.name,
                duplicateFileName: duplicateName,
                sessionData,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Логируем тело запроса перед отправкой
        console.log('Отправляем запрос на дублирование сессии:', {
            originalFileName: sessionFile.name,
            duplicateFileName: duplicateName,
            sessionData,
        });

        if (res.ok) {
            alert('Сессия успешно дублирована!');
            setShowDuplicateModal(false);
        } else {
            const errorData = await res.json();
            setError(errorData.error || 'Ошибка при дублировании сессии');
            console.error('Ошибка при дублировании сессии:', errorData);
        }

        setLoading(false);
    };

    const handleDeleteSession = async () => {
        if (!sessionFile) return;

        setLoading(true);

        const res = await fetch(`/api/sessions/deleteSession`, {
            method: "DELETE",
            body: JSON.stringify({
                fileName: sessionFile.name,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            alert('Сессия успешно удалена!');
            setSessionData(null);
            setDuplicateName(null);
        } else {
            setError('Ошибка при удалении сессии');
            console.error('Ошибка при удалении сессии:', await res.json());
        }

        setLoading(false);
    };

    const handleCheckboxChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setSessionDataState((prevState:any) => ({
            ...prevState,
            isActive: checked
        }));
    }

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="form-container">
            {/* Выбор файла сессии */}
            {!sessionFile ? (
                <div className="file-selection">
                    <label htmlFor="sessionFile" className="upload-label">Выберите файл сессии</label>
                    <input
                        type="file"
                        id="sessionFile"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setSessionData(file);
                        }}
                        className="file-input"
                    />
                </div>
            ) : (
                <div className="file-selection">
                    <p><strong>Выбран файл: {sessionFile.name}</strong></p>
                </div>
            )}

            {/* Редактирование данных сессии */}
            {sessionData && (
                <form className="session-form">
                    {Object.keys(sessionData).map((key) => (
                        <div className="form-group" key={key}>
                            <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            <input
                                type="text"
                                id={key}
                                name={key}
                                value={sessionData[key] || ""}
                                onChange={(e) => handleFieldChange(key, e.target.value)}
                                className="input-field"
                            />
                        </div>
                    ))}
                </form>
            )}

            <div className="action-buttons">
                <button onClick={handleSaveChanges} className="button save-button">
                    Сохранить изменения
                </button>

                <button
                    onClick={() => setShowDuplicateModal(true)}
                    className="button duplicate-button"
                >
                    Дублировать сессию
                </button>

                <button onClick={handleDeleteSession} className="button delete-button">
                    Удалить сессию
                </button>
            </div>

            {showDuplicateModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Введите новое имя для дубликата сессии</h2>
                        <input
                            type="text"
                            id="duplicateName"
                            value={duplicateName || ""}
                            onChange={(e) => setDuplicateName(e.target.value)}
                            className="input-field"
                            placeholder="Новое имя сессии"
                        />
                        <div className="modal-actions">
                            <button onClick={handleDuplicateSession} className="button save-button">
                                Сохранить дубликат
                            </button>
                            <button
                                onClick={() => setShowDuplicateModal(false)}
                                className="button cancel-button"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionForm;
