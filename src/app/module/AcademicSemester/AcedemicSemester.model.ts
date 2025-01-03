import { Schema, model, models } from 'mongoose';
import { TAcademicSemester } from './AcademicSemester.interface';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './AcademicSemesterConstants';

const AcedemicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: { type: String, required: true, enum: AcademicSemesterName },
    year: { type: String, required: true },
    code: { type: String, required: true, enum: AcademicSemesterCode },
    startMonth: {
      type: String,
      enum: Months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Months,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
AcedemicSemesterSchema.pre('save', async function (next) {
  const isSemesterExist = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });
  if (isSemesterExist) {
    throw new Error('Semester is already exist');
  }
  next();
});

export const AcademicSemester =
  models.AcademicSemester ||
  model<TAcademicSemester>('AcademicSemester', AcedemicSemesterSchema);
