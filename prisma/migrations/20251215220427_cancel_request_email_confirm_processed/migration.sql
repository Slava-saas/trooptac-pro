-- Add email + confirmation/processing timestamps to cancel_request
ALTER TABLE "cancel_request"
  ADD COLUMN "email" TEXT NOT NULL,
  ADD COLUMN "confirmed_at" TIMESTAMP(3),
  ADD COLUMN "processed_at" TIMESTAMP(3);
