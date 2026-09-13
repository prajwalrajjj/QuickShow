import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";
import { inngest, functions } from "./inngest/index.js";

const app = express();
const port = process.env.PORT || 3000;

await connectDB();

app.use("/api/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

app.use(express.json());
app.use(cors());

if (process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY) {
  const { clerkMiddleware } = await import("@clerk/express");
  app.use(clerkMiddleware());
}

if (process.env.INNGEST_EVENT_KEY) {
  const { serve } = await import("inngest/express");
  app.use("/api/inngest", serve({ client: inngest, functions }));
}

app.get("/", (req, res) => res.send("Server is Live!"));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
