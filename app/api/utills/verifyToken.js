import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export function verifyToken(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return { error: "No token provided", status: 401 };

    const token = authHeader.split(" ")[1];
    if (!token) return { error: "Invalid token format", status: 401 };

    const decoded = jwt.verify(token, SECRET_KEY);
    return { decoded, status: 200 };
  } catch (error) {
    return { error: "Invalid or expired token", status: 401 };
  }
}
