import { DocumentBuilder } from '@nestjs/swagger'
export class CreateApiDocument {
    public doc = new DocumentBuilder();
    
    public initializeOptions() {
        return this.doc
            .setTitle('Adot-Project')
            .setDescription('Adot-Project-Api-Document')
            .setVersion('1.0')
            .setContact('Hagi', '', 'wndbsgkr@naver.com')
            .build()
    }
}