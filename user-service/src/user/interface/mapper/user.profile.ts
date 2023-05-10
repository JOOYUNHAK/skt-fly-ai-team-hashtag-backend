import { Mapper, MappingProfile, createMap } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { LoginRequest } from "src/auth/domain/login-request";
import { LoginRequestDto } from "src/auth/interface/dto/login-requestdto";
import { User } from "src/user/domain/entity/user.entity";
import { UserDto } from "src/user/interface/dto/user.dto";

@Injectable()
export class UserProfile extends AutomapperProfile {
    constructor( @InjectMapper() mapper: Mapper ) { 
        super(mapper) 
    }

    override get profile(): MappingProfile {
        return( mapper ) => {
            createMap(mapper, LoginRequestDto, LoginRequest),
            createMap(mapper, LoginRequest, User),
            createMap(mapper, User, UserDto)
        }
    }
}