import { Schema, model, models } from 'mongoose';
import { TAcademicDepartment } from './AcademicDepartment.interface';

const academicDepartMentSchema = new Schema<TAcademicDepartment>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicFaculty',
  },
});

export const AcademicDepartMent =
  models.AcademicDepartMent ||
  model<TAcademicDepartment>('AcademicDepartMent', academicDepartMentSchema);
