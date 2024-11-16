
import fs from 'fs';
import path from 'path';
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { originalFileName, duplicateFileName, sessionData } = req.body;

        if (!originalFileName || !duplicateFileName) {
            return res.status(400).json({ error: 'Необходимо указать имя текущего файла и новое имя' });
        }

        const originalFilePath = path.resolve('src', 'sessions', originalFileName);
        const newFilePath = path.resolve('src', 'sessions', duplicateFileName + '.json');

        console.log('Пытаемся читать файл сессии из:', originalFilePath);
        console.log('Пытаемся сохранить новый файл сессии в:', newFilePath);

        try {
            if (!fs.existsSync(originalFilePath)) {
                return res.status(404).json({ error: `Файл ${originalFileName} не найден` });
            }

            const data = await fs.promises.readFile(originalFilePath, 'utf-8');
            console.log('Данные файла:', data);

            await fs.promises.writeFile(newFilePath, JSON.stringify(sessionData || JSON.parse(data)));
            return res.status(200).json({ message: 'Сессия успешно дублирована' });
        } catch (error) {
            console.error('Ошибка при дублировании сессии:', error);
            return res.status(500).json({ error: 'Ошибка при сохранении дубликата', details: error.message });
        }
    } else {
        return res.status(405).json({ error: 'Метод не разрешен' });
    }
}
