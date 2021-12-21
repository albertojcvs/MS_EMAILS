import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.SERVER_PORT;

import { app } from "./app";
import { Consumer } from "./kafka/Consumer";

const consumer = new Consumer({groupId:'MS_EMAILS_consumer'})
consumer.consume()
app.listen(PORT);
