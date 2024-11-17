import {NextApiRequest, NextApiResponse} from 'next';
import path from 'path';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("API роут вызван", req.method); // Просто для отладки

    if (req.method === 'GET') {
        const {fileName} = req.query;

        if (!fileName) return res.status(400).json({error: 'Не указан файл'});

        const filePath = path.join(process.cwd(), 'resources/sessions', `${fileName}`);

        console.log("Пытаюсь прочитать файл", filePath); // Логируем путь к файлу

        try {
            if (!fs.existsSync(filePath)) {
                return res.status(200).json({});
            }

            const fileData = fs.readFileSync(filePath, 'utf-8');
            const sessionData = JSON.parse(fileData);

            res.status(200).json({sessionData});
        } catch (error: any) {
            console.error(error);
            res.status(500).json({error: 'Ошибка при загрузке данных сессии'});
        }
    } else {
        res.status(405).json({error: 'Метод не разрешён'});
    }
}
