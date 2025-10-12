-- CreateTable
CREATE TABLE "ResharedPost" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResharedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResharedComment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResharedComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResharedPost_userId_postId_key" ON "ResharedPost"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "ResharedComment_userId_commentId_key" ON "ResharedComment"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "ResharedPost" ADD CONSTRAINT "ResharedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResharedPost" ADD CONSTRAINT "ResharedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResharedComment" ADD CONSTRAINT "ResharedComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResharedComment" ADD CONSTRAINT "ResharedComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
