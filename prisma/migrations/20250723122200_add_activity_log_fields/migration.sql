-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "isp" TEXT NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
