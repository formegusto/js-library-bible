import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import multer from "multer";
import Routes from "./routes";

class App {
  server: express.Application;

  constructor() {
    this.server = express();
    this.SettingMW();
    this.Router();
    this.Start();
  }

  SettingMW() {
    this.server.use(morgan("dev"));
  }

  Router() {
    this.server.use(Routes);

    // Error Handling
    this.server.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        console.log("여기는 올 것이다.");

        if (error instanceof multer.MulterError) {
          if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json("너무 많아요. 파일이,,");
          }
        }

        return res.status(500).json("시스템 오류입니다.");
      }
    );
  }

  Start() {
    const PORT = process.env.PORT || "8000";
    this.server.listen(parseInt(PORT), () => {
      console.log(`[Express] Server Listening To PORT: ${PORT} :)`);
    });
  }
}

export default App;
