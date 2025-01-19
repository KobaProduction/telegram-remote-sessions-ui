import axios from 'axios';

const API_URL = 'http://localhost:9000/v1';

// Получение списка всех сессий
export const getSessions = async (page = 1, limit = 5) => {
  const response = await fetch(`${API_URL}/sessions/read?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Ошибка при получении сессий');
  }
  return await response.json();
};


// Получение деталей конкретной сессии
export const getSessionDetails = async (sessionName: string) => {
  const response = await axios.get(`${API_URL}/session/read?name=${sessionName}`);
  return response.data;
};

// Удаление сессии
export const deleteSession = async (sessionName: string) => {
  await axios.delete(`${API_URL}/session/delete?name=${sessionName}`);
};

export const createSession = async (sessionName: string) => {
  const response = await fetch(`${API_URL}/session/create?name=${sessionName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'
      , 'Accept': 'application/json'
      , 'content-length': "101"},

    body: JSON.stringify({
      "app_version": "test",
      "lang_code": "test",
      "device_model": "test",
      "system_version": "test",
      "system_lang_code": "test",
      "api_id": 1,
      "api_hash": "test"
    }),
  });

  if (!response.ok) {
    throw new Error('Ошибка при создании сессии');
  }

  return await response.json();
};
