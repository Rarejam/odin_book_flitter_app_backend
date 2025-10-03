const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs"); // import bcrypt
const prisma = new PrismaClient();

const main = async () => {
  // Clean up tables first (avoid unique constraint issues)
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.follows.deleteMany({});
  await prisma.user.deleteMany({});

  // Hash passwords before inserting
  const hashedPassword1 = await bcrypt.hash("hashedpassword123", 10);
  const hashedPassword2 = await bcrypt.hash("anotherhashedpassword", 10);

  // Create two users
  const user1 = await prisma.user.create({
    data: {
      username: "jamal",
      email: "jamale@example.com",
      password: hashedPassword1,
      profileImage:
        "https://sp.yimg.com/ib/th/id/OIP.t7BZK524_FjK_vIz9TaMWwHaJ4?pid=Api&w=148&h=148&c=7&dpr=2&rs=1",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "rarejam",
      email: "rarejame@example.com",
      password: hashedPassword2,
      profileImage:
        "https://s.yimg.com/fz/api/res/1.2/wvmqYl2H.PXsxAhnhukBYw--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpbGw7aD00MTI7cHhvZmY9NTA7cHlvZmY9MTAwO3E9ODA7c3M9MTt3PTM4OA--/https://i.pinimg.com/736x/fc/a7/ff/fca7ff632132784f627fc2905701e204.jpg",
    },
  });

  // Create a post by user1
  const post = await prisma.post.create({
    data: {
      content: "This is my first post 🚀",
      postImage:
        "https://sp.yimg.com/ib/th/id/OIP._a3GB-MUxF3xob6dHI5HrgHaJh?pid=Api&w=148&h=148&c=7&dpr=2&rs=1",
      authorId: user1.id,
    },
  });

  // Create a comment on the post by user2
  const comment = await prisma.comment.create({
    data: {
      content: "Nice post!",
      postId: post.id,
      authorId: user2.id,
    },
  });

  // Create a follow (user2 follows user1)
  const follow = await prisma.follows.create({
    data: {
      followerId: user2.id,
      followingId: user1.id,
    },
  });

  // Fetch all users with their posts, comments, and followers/following
  const users = await prisma.user.findMany({
    include: {
      posts: true,
      comments: true,
      followers: true,
      following: true,
    },
  });

  console.dir(users, { depth: null });
  console.log({ user1, user2, post, comment, follow });
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
