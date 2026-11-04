import { IsString, IsNotEmpty, MinLength, Matches, MaxLength } from "class-validator";
export class CreateUserDto {
    @IsString({ message: 'Логин должен быть строкой' })
    @IsNotEmpty({ message: 'Введите логин' })
    @Matches(/^\S+$/, {
    message: 'Логин не должен содержать пробелы',
  })
    login!: string;

     @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(8, {
    message: 'Пароль должен содержать минимум 8 символов',
     })
    @MaxLength(128, {
    message: 'Пароль не должен превышать 128 символов',
    })
     @Matches(/[0-9]/, {
    message: 'Пароль должен содержать хотя бы одну цифру',
     })
    password!: string;
}
