import { diskStorage } from "multer";
import { ConfigService } from "@nestjs/config";
import { extname } from "path";

let configService: ConfigService = new ConfigService()

export const storage = diskStorage({
    destination: (req, file, callback) => {
        const month = new Date().toLocaleString('en-EU', { month: '2-digit' });
        const dest = configService.get('video.dest');
        callback(null, `${dest}${month}`);
    },
    filename: (req, file, callback) => {
        const now = new Date();
        
        const [year, month, date] = now.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/ /g, '').split('.');

        const ext = extname(file.originalname);
        const fileName = `${year}-${month}-${date}-${now.getTime()}${ext}`;
        callback(null, fileName);
    }
})