-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "diagnosis" TEXT,
ADD COLUMN     "followUpDate" TIMESTAMP(3),
ADD COLUMN     "prescription" TEXT,
ADD COLUMN     "tests" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
