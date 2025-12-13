-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "user_settings" (
    "user_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "is_pro" BOOLEAN NOT NULL DEFAULT false,
    "default_troops" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "march_plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "my_march_payload" JSONB NOT NULL,
    "enemy_march_payload" JSONB NOT NULL,
    "result_score" DOUBLE PRECISION NOT NULL,
    "result_win_prob" DOUBLE PRECISION NOT NULL,
    "engine_version" TEXT NOT NULL DEFAULT '6.4',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "march_plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_stripe_customer_id_key" ON "user_settings"("stripe_customer_id");

-- CreateIndex
CREATE INDEX "march_plan_user_id_idx" ON "march_plan"("user_id");

-- AddForeignKey
ALTER TABLE "march_plan" ADD CONSTRAINT "march_plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_settings"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

