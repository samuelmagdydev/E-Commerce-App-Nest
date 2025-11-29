import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum, ProviderEnum } from 'src/common';

@Schema({
  strictQuery: true,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    trim: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    trim: true,
  })
  lastName: string;

  @Virtual({
    get: function (this: User) {
      return this.firstName + ' ' + this.lastName;
    },
    set: function (value: string) {
      const [firstName, lastName] = value.split(' ') || [];
      this.set({ firstName, lastName });
    },
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: Date,
    required: false,
  })
  confirmemail: Date;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.provider === ProviderEnum.GOOGLE ? false : true;
    },
  })
  password: string;

  @Prop({
    type: String,
    enum: ProviderEnum,
    default: ProviderEnum.SYSTEM,
  })
  provider: ProviderEnum;

  @Prop({
    type: String,
    enum: GenderEnum,
    default: GenderEnum.Male,
  })
  gender: GenderEnum;

  @Prop({
    type: Date,
    required: false,
  })
  changeCredentials: Date;
}

const userSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);
