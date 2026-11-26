import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateTrainerDto {
@IsNotEmpty({ message: 'Введите фамилию' })
@IsString()
lastName!: string;

@IsNotEmpty({ message: 'Введите имя' })
@IsString()
firstName!: string;

@IsOptional()
@IsString()
middleName?: string;

@IsPhoneNumber('RU', {
  message: 'Введите корректный номер телефона',
})
phone!: string;

@IsNotEmpty({ message: 'Введите специализацию' })
@IsString()
specialization!: string

}
