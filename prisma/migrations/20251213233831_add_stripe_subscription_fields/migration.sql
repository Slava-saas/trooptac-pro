/*
  Warnings:

  - A unique constraint covering the columns `[stripe_subscription_id]` on the table `user_settings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_settings" ADD COLUMN     "stripe_current_period_end" TIMESTAMP(3),
ADD COLUMN     "stripe_subscription_id" TEXT,
ADD COLUMN     "stripe_subscription_status" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_stripe_subscription_id_key" ON "user_settings"("stripe_subscription_id");
