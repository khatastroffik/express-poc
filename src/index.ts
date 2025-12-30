import app from "./app";
import { env } from "./lib/environment";

app.listen(env.PORT, () => {
  console.warn(`API server is running at: ${env.HOST}:${env.PORT}`);
  console.warn("Current Environment Configuration:", env);
});
