import { diskStorage } from "multer";
import { extname } from "path";
import  * as fs from 'fs';

/* 각 파일들의 옵션 지정 */
export const storage = diskStorage({
    /* 파일들 저장위치( 비디오와 이미지 월별로 따로 ) */
    destination: async (req, file, callback) => {
        const month = new Date().toLocaleString('en-EU', { month: '2-digit' });
        let path = file.fieldname === 'video'
            ? process.env.VIDEO_DEST : process.env.IMAGE_DEST;
        path += month;
        /* 하위 디렉토리가 없으면 계속해서 생성 */
        fs.mkdirSync(path, { recursive: true });
        callback(null, path);
    },
    /* 파일들 저장 이름 */
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