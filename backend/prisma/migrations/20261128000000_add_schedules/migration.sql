-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "weekday" "Weekday" NOT NULL,
    "startTime" TIME(0) NOT NULL,
    "endTime" TIME(0) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "schedules_groupId_weekday_idx" ON "schedules"("groupId", "weekday");

-- CreateIndex
CREATE INDEX "schedules_trainerId_weekday_idx" ON "schedules"("trainerId", "weekday");

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
