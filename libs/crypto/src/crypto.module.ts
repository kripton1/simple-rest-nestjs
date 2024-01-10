import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule { }
