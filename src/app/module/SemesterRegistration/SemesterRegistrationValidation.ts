import { z } from 'zod';
import { SemesterRegistrationStatus } from './SemesterRegistration.constants';

const createSemesterRegistrationValidation = z.object({
  body: z.object({
    status: z.enum([...SemesterRegistrationStatus] as [string, ...string[]]),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    academicSemester: z.string({
      required_error: 'Academic semester id is required',
    }),
    minCredit: z.number(),
    maxCredit: z.number(),
    // 2023-01-24T17:59:59Z
    // 2023-01-10T04:00:01Z
  }),
});

export const SemesterRegistrationValidation = {
  createSemesterRegistrationValidation,
};
