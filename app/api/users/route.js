import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * 🔹 add user
 */

export async function POST(req) {
  const data = await req.json();
  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
    },
  });
  return Response.json(newUser);
}
/**
 * 🔹 Get single user by ID
 */
export async function GET(req) {
  try {
    // URL ke query params nikal lo (e.g. ?id=1)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // 🔹 agar id di hai → ek user lao
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }
      return Response.json(user);
    } else {
      // 🔹 agar id nahi di → sab users lao
      const users = await prisma.user.findMany({
        orderBy: { id: "desc" },
      });
      return Response.json(users);
    }
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * 🔹 Update user by ID (PUT)
 */
export async function PUT(req, { params }) {
  const id = parseInt(params.id);
  const data = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
      },
    });
    return Response.json(updatedUser);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * 🔹 Delete user by ID (DELETE)
 */
export async function DELETE(req, { params }) {
  const id = parseInt(params.id);

  try {
    await prisma.user.delete({ where: { id } });
    return Response.json({ message: `User ${id} deleted successfully` });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}