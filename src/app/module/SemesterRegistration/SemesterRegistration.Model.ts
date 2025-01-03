import mongoose from 'mongoose';
import { TSemesterRegistration } from './SemesterRegistration.interface';
const semesterRegistrationSchema = new mongoose.Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      required: true,
    },
    status: {
      type: String,
      enum: ['UPCOMING', 'ONGOING', 'ENDED'],
      default: 'UPCOMING',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    minCredit: {
      type: Number,
      required: true,
      default: 3,
    },
    maxCredit: {
      type: Number,
      required: true,
      default: 15,
    },
  },
  {
    timestamps: true,
  },
);

export const SemesterRegistration = mongoose.model<TSemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
);
