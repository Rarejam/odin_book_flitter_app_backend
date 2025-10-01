const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const main = async () => {
  // Create two users
  //   const user1 = await prisma.user.create({
  //     data: {
  //       username: "jamal",
  //       email: "jamal@example.com",
  //       password: "hashedpassword123",
  //       profileImage: "https://via.placeholder.com/150",
  //     },
  //   });
  //   const user2 = await prisma.user.create({
  //     data: {
  //       username: "rarejam",
  //       email: "rarejam@example.com",
  //       password: "anotherhashedpassword",
  //       profileImage: "https://via.placeholder.com/150",
  //     },
  //   });
  //   // Create a post by user1
  //   const post = await prisma.post.create({
  //     data: {
  //       content: "This is my first post 🚀",
  //       postImage: "https://via.placeholder.com/400",
  //       authorId: user1.id,
  //     },
  //   });
  //   // Create a comment on the post by user2
  //   const comment = await prisma.comment.create({
  //     data: {
  //       content: "Nice post!",
  //       postId: post.id,
  //       authorId: user2.id,
  //     },
  //   });
  //   // Create a follow (user2 follows user1)
  //   const follow = await prisma.follows.create({
  //     data: {
  //       followerId: user2.id,
  //       followingId: user1.id,
  //     },
  //   });
  //   // Fetch all users with their posts, comments, and followers/following
  //   const users = await prisma.user.findMany({
  //     include: {
  //       posts: true, // all posts by the user
  //       comments: true, // all comments by the user
  //       followers: true, // who follows this user
  //       following: true, // who this user follows
  //     },
  //   });
  //   console.dir(users, { depth: null });
  //   console.log(users);
  //   console.log({ user1, user2, post, comment, follow });

  // Delete all records in the right order to avoid foreign key constraint errors
  //   await prisma.comment.deleteMany({});
  //   await prisma.post.deleteMany({});
  //   await prisma.follows.deleteMany({});
  //   await prisma.user.deleteMany({});

  console.log(await prisma.post.findMany());
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
