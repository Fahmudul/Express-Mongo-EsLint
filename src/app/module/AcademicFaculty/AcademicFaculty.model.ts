import { Schema, model, models } from 'mongoose';
import { TAcademicFaculty } from './AcademicFaculty.interface';

const AcademicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);
const AcademicFaculty =
  models.AcamdemicFaculty ||
  model<TAcademicFaculty>('AcademicFaculty', AcademicFacultySchema);
export default AcademicFaculty;
