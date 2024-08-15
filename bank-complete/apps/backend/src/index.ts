import { Hono } from "hono";
import { cors } from "hono/cors";
import { userRouter } from "./routes/user";
import { paymentRouter } from "./routes/paymentRouter";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    ALLOWED_ORIGINS: string;
  };
}>();

app.use("/*", (c, next) => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS.split(",");

  return cors({
    origin: (origin) => {
      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      return null;
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })(c, next);
});

app.route("/api/v1/user", userRouter);
app.route("/api/v1/pay", paymentRouter);

export default app;
