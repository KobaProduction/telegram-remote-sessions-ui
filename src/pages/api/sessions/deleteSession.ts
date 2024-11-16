import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        try {
            const { fileName } = req.body;

            if (!fileName) {
                return res.status(400).json({ error: 'Неверные данные' });
            }

            const sessionsDir = path.join(process.cwd(), 'src', 'sessions');
            const filePath = path.join(sessionsDir, fileName);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'Файл не найден' });
            }

            // Удаляем файл
            fs.unlinkSync(filePath);

            return res.status(200).json({ message: 'Сессия успешно удалена' });
        } catch (error) {
            console.error('Ошибка при удалении сессии:', error);
            return res.status(500).json({ error: 'Ошибка при удалении сессии' });
        }
    } else {
        return res.status(405).json({ error: 'Метод не поддерживается' });
    }
}
