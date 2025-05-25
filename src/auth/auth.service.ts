import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { name, email, password, role } = signUpDto;

    const hashPassword = await bcrypt.hash(password, 12);

    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashPassword,
        role
      });
  
      // generate token here
      const token = this.jwtService.sign({ id: user._id, email: user.email });
      return { token };
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictException("Duplicate email Entered")
      }
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({
      email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Password dose not match!');
    }
    
    // generate token here
    const token = this.jwtService.sign({ id: user._id, email: user.email });
    return { token };
  }
}
