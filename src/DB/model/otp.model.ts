import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OtpEnum } from 'src/common';

@Schema({ timestamps: true })
export class Otp {
  @Prop({
    required: true,
    type: String,
  })
  code: string;

  @Prop({
    required: true,
    type: Date,
  })
  expiredAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    required: true,
    enum: OtpEnum,
    type: String,
  })
  type: OtpEnum;
}

export type OtpDocument = HydratedDocument<Otp>;
const otpSchema = SchemaFactory.createForClass(Otp);

otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel = MongooseModule.forFeature([
  { name: Otp.name, schema: otpSchema },
]);
