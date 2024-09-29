-- CreateTable
CREATE TABLE "Session" (
    "sid" TEXT NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sid")
);

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
