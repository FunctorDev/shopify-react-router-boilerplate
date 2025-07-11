import * as path from "path";
import pino from "pino";

const logDir = path.resolve(import.meta.dirname, "..", "..", "..", "logs");

const fileTransport = pino.transport({
  target: "pino/file",
  options: {
    fsync: true,
    destination: path.resolve(logDir, "app.log"),
  },
});

export const logger = pino(
  pino.destination({
    dest: path.resolve(logDir, "app.log"),
    periodicFlush: 250,
    fsync: true,
    sync: true
  }),
);
