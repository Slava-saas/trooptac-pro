-- AlterTable
ALTER TABLE "user_settings" ADD COLUMN     "stripe_cancel_at" TIMESTAMP(3),
ADD COLUMN     "stripe_cancel_at_period_end" BOOLEAN,
ADD COLUMN     "stripe_canceled_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "cancel_request" (
    "id" TEXT NOT NULL,
    "email_hash" TEXT NOT NULL,
    "ip_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cancel_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cancel_request_email_hash_created_at_idx" ON "cancel_request"("email_hash", "created_at");

-- CreateIndex
CREATE INDEX "cancel_request_ip_hash_created_at_idx" ON "cancel_request"("ip_hash", "created_at");
