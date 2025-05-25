import { IsNotEmpty, IsString, IsNumber, IsEmail, MinLength, IsOptional } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, {message: 'Please  enter a valid email!'})
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  readonly role: string[]
}
