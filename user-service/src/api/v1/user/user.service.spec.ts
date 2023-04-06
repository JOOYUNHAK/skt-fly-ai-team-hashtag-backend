import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from '../auth/dto/login.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

const mockUser = {
  seq: 1,
  id: '01011111111',
  nickname: 'wn',
  created_at: '2017-02-19'
}

const mockRepository = {
  save: jest.fn().mockReturnValue(mockUser)
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockRepository
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('findUser', () => {
    const loginDto: LoginDto = { id: '01011111111', nickname: 'wn' };

    it('신규 가입자는 DB에 새로 등록하고 등록 정보를 반환한다.', async () => {

      const newUser = mockRepository.save(User.registerNewUser(loginDto))
      delete newUser.created_at;

      expect(await service.registerUser(loginDto))
        .toStrictEqual<{
          statusCode: string,
          message: string,
          body: {
            user: {
              seq: number,
              id: string,
              nickname: string
            }
          }
        }>
    })
  })
});
