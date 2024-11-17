import React, { useState, useEffect } from "react";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface SessionFormProps {
    sessionFile: File | null;
    setSessionData: React.Dispatch<React.SetStateAction<any>>;
}

const sessionSchema = z.object({
    name: z.string().min(1, "Имя не может быть пустым"), // Проверка на непустое значение
    apiId: z.string().min(10, "API ID должно содержать минимум 10 символов"),
    apiToken: z.string().min(10, "API Token должен содержать минимум 10 символов"),
    proxy: z.string().url("Некорректный URL для прокси"),
    deviceId: z.string().min(1, "ID устройства не может быть пустым"),
});

const SessionForm = ({ sessionFile, setSessionData }: SessionFormProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionData, setSessionDataState] = useState<any>(null);
    const [duplicateName, setDuplicateName] = useState<string | null>(null);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors , isValid},
        setValue,
        trigger,
    } = useForm({
        resolver: zodResolver(sessionSchema),
        mode: "onChange"
    });

    useEffect(() => {
        if (!sessionFile) return;

        const loadSessionData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/sessions/loadSession?fileName=${sessionFile.name}`);

                if (!res.ok) {
                    setError(`Ошибка при загрузке: ${res.statusText}`);
                    return;
                }

                const data = await res.json();
                setSessionDataState(data.sessionData);
                setSessionData(data.sessionData);
                Object.keys(data.sessionData).forEach((key) => {
                    setValue(key, data.sessionData[key]);
                });
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

        try {
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
                const errorData = await res.json();
                setError(errorData.error || 'Ошибка при сохранении сессии');
                console.error('Ошибка при сохранении сессии:', errorData);
            }
        } catch (err) {
            setError('Ошибка при сохранении сессии');
            console.error('Ошибка при сохранении сессии:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = async (key: string, value: any) => {
        setSessionDataState({ ...sessionData, [key]: value });
        setValue(key, value, { shouldValidate: true });
        await trigger(key);
    };

    const handleDuplicateSession = async () => {
        if (!sessionFile || !sessionData || !duplicateName) {
            setError('Необходимо указать новое имя для дубликата');
            return;
        }

        setLoading(true);

        try {
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

            if (res.ok) {
                alert('Сессия успешно дублирована!');
                setShowDuplicateModal(false);
            } else {
                const errorData = await res.json();
                setError(errorData.error || 'Ошибка при дублировании сессии');
                console.error('Ошибка при дублировании сессии:', errorData);
            }
        } catch (err) {
            setError('Ошибка при дублировании сессии');
            console.error('Ошибка при дублировании сессии:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSession = async () => {
        if (!sessionFile) return;

        setLoading(true);

        try {
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
                const errorData = await res.json();
                setError(errorData.error || 'Ошибка при удалении сессии');
                console.error('Ошибка при удалении сессии:', errorData);
            }
        } catch (err) {
            setError('Ошибка при удалении сессии');
            console.error('Ошибка при удалении сессии:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setSessionDataState((prevState: any) => ({
            ...prevState,
            isActive: checked,
        }));
        setValue("isActive", checked, { shouldValidate: true });
        await trigger("isActive");
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="form-container">
            {!sessionFile ? (
                <div className="file-selection">
                    <label htmlFor="sessionFile" className="upload-label">
                        Выберите файл сессии
                    </label>
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

            {sessionData && (
                <form className="session-form" onSubmit={handleSubmit(handleSaveChanges)}>
                    {Object.keys(sessionData).map((key) => {
                        if (key !== 'isActive') {
                            return (
                                <div className="form-group" key={key}>
                                    <label htmlFor={key}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </label>
                                    <input
                                        type="text"
                                        id={key}
                                        {...register(key)}
                                        className="input-field"
                                        onChange={(e) => handleFieldChange(key, e.target.value)}
                                    />
                                    {errors[key] && (
                                        <div className="error">
                                            {(errors[key] as FieldError)?.message}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        return null;
                    })}
                    <div className="form-group">
                        <div className="checkbox-group">
                            <label htmlFor="isActive">Включить Сессию</label>
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={sessionData.isActive ?? false}
                                onChange={handleCheckboxChange}
                                className="checkbox-field"
                            />
                        </div>
                    </div>
                </form>
            )}

            <div className="action-buttons">
                <button
                    onClick={handleSaveChanges}
                    className="button save-button"
                    disabled={!isValid}
                >
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
