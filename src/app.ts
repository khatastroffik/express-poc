import type { Express } from "express";
import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const app: Express = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.json());

app.get("/", (req: express.Request, res: express.Response) => {
  // Sample Request/Response for demo purpose
  res.send(`
    <h1>Bonjour!</h1>
    <p>This is a <span style="font-weight: bold;">khatastroffik service</span>!</p>
    <p>
      The full URL of this request is: <pre><code>${req.protocol}://${req.host}${req.url}</code></pre>
    </p>
    <style>
      pre {
          background-color: #f4f4f4;
          padding: 1em;
          border: 1px solid #ccc;
          display: inline;
      }
    </style>    
    `);
});

export default app;
