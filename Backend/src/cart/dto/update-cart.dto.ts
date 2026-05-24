import { PartialType } from '@nestjs/mapped-types';
import { AddToCartDto} from './add-to-cart';

export class UpdateCartDto extends PartialType(AddToCartDto) {}
