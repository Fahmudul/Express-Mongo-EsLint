import { z } from 'zod';
const createAcademicDepartmentValidation = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic department must be string',
      required_error: 'Faculty is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic faculty must be string',
      required_error: 'Faculty is required',
    }),
  }),
});

const UpdateAcademicDepartmentValidation = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic department must be string',
        required_error: 'Faculty is required',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic faculty must be string',
        required_error: 'Faculty is required',
      })
      .optional(),
  }),
});
export const AcademicDepartmentValidationSchemas = {
  UpdateAcademicDepartmentValidation,
  createAcademicDepartmentValidation,
};
