import { Mapper, MappingProfile, createMap } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { LoginRequestDto } from "src/auth/dto/login-requestdto";
import { RegisterUserDto } from "src/auth/dto/register-user.dto";

@Injectable()
export class AuthProfile extends AutomapperProfile {
    constructor( @InjectMapper() mapper: Mapper ) { 
        super(mapper) 
    }

    override get profile(): MappingProfile {
        return( mapper ) => {
            createMap(mapper, LoginRequestDto, RegisterUserDto)
        }
    }
}