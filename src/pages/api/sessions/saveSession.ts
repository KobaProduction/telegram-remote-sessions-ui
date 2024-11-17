
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            console.log('Получен запрос на сохранение сессии');

            console.log('Тело запроса:', req.body);

            const { fileName, sessionData } = req.body;

            console.log('Получены данные сессии:', sessionData);
            console.log('Имя файла для сохранения:', fileName);

            if (!fileName || !sessionData) {
                console.error('Ошибка: нет данных или имени файла');
                return res.status(400).json({ error: 'Неверные данные' });
            }

            const sessionsDir = path.join(process.cwd(), 'resources', 'sessions');
            console.log('Папка с сессиями:', sessionsDir);

            if (!fs.existsSync(sessionsDir)) {
                console.log('Папка с сессиями не существует, создаем...');
                fs.mkdirSync(sessionsDir, { recursive: true });
            }

            const filePath = path.join(sessionsDir, fileName);
            console.log('Путь к файлу сессии:', filePath);

            console.log('Сохраняем данные в файл...');
            fs.writeFileSync(filePath, JSON.stringify(sessionData, null, 2));

            console.log('Данные успешно сохранены в файл');
            return res.status(200).json({ message: 'Сессия успешно сохранена' });
        } catch (error) {
            console.error('Ошибка при сохранении сессии:', error);
            return res.status(500).json({ error: 'Ошибка при сохранении сессии' });
        }
    } else {
        console.error('Метод не поддерживается');
        return res.status(405).json({ error: 'Метод не поддерживается' });
    }
}
