import { IsNotEmpty, IsString } from "class-validator"

export class LoginDto{
    @IsNotEmpty({ message: 'Введите логин' })
    @IsString({ message: 'Логин должен быть строкой' })
    login!: string

    @IsNotEmpty({ message: 'Введите пароль' })
    @IsString({ message: 'Пароль должен быть строкой' })
    password!: string
}