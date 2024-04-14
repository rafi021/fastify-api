import pino from "pino";

export const logger = pino({
  redact: ["DATABASE_CONNECTION"],
  level: "debug",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:HH:mm:ss.l",
      levelPrefix: " ",
      messageKey: "msg",
      messageKeyOverride: "msg",
    },
  },
});
