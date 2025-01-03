import { TSchedule } from './OfferedCourse.interface';

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  console.log({ assignedSchedules, newSchedule });
  for (const schedule of assignedSchedules) {
    const existingStartTime = new Date(`2021-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`2021-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`2021-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`2021-01-01T${newSchedule.endTime}`);
    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }
  return false;
};
