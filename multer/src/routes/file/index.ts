import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import path from "path";

const FileRoutes = Router();
const uploads = multer({ dest: "src/uploads" });
const ds = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/diskStorage");
  },
  filename: (req, file, db) => {
    db(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const uploadsByDS = multer({ storage: ds });

FileRoutes.get("/", (req: Request, res: Response) => {
  return res.status(200).send("<h1>File Routes Active :)</h1>");
});

FileRoutes.post(
  "/single",
  uploads.single("singleFile"),
  (req: Request, res: Response) => {
    console.log(req.body);
    // [Object: null prototype] { text: '안녕하세요.' }
    console.log(req.file);
    /*
    {
      fieldname: 'singleFile',
      originalname: '9x��34.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: 'src/uploads',
      filename: '6c1856fa7f636385a7c7dae282aa1b4c',
      path: 'src/uploads/6c1856fa7f636385a7c7dae282aa1b4c',
      size: 151023
    }
    */

    return res.status(201).send("Hello! It's Single");
  }
);

FileRoutes.post(
  "/array",
  uploads.array("arrayFiles", 3),
  (req: Request, res: Response) => {
    console.log(req.body);
    // [Object: null prototype] { text: '안녕하세요.' }
    console.log(req.files);
    /*
      [
        {
          fieldname: 'arrayFiles',
          originalname: '9x��34.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          destination: 'src/uploads',
          filename: 'bd8ebc614ccce2f7e5638605bdce4872',
          path: 'src/uploads/bd8ebc614ccce2f7e5638605bdce4872',
          size: 151023
        },
        ...
        {
          fieldname: 'arrayFiles',
          originalname: 'apple_rainbow.png',
          encoding: '7bit',
          mimetype: 'image/png',
          destination: 'src/uploads',
          filename: '46921239e0d3e5c132a0eb7e73d2b869',
          path: 'src/uploads/46921239e0d3e5c132a0eb7e73d2b869',
          size: 39243
        }
      ]
    */

    return res.status(201).send("Hello! It's Array");
  }
);

FileRoutes.post(
  "/fields",
  uploads.fields([
    { name: "singleFile", maxCount: 1 },
    { name: "multipleFiles", maxCount: 3 },
  ]),
  (req: Request, res: Response) => {
    console.log(req.body);
    // [Object: null prototype] { text: '안녕하세요.' }
    console.log((req.files as any)["singleFile"][0]);
    console.log((req.files as any)["multipleFiles"]);

    return res.status(201).send("Hello! It's Fields");
  }
);

FileRoutes.post(
  "/ds",
  uploadsByDS.single("singleFile"),
  (req: Request, res: Response) => {
    console.log(req.body);
    console.log(req.file);
    /*
    [Object: null prototype] { text: '안녕하세요.' }
    {
      fieldname: 'singleFile',
      originalname: 'bg3.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: 'src/uploads/diskStorage',
      filename: 'singleFile_1640917592732.png',
      path: 'src/uploads/diskStorage/singleFile_1640917592732.png',
      size: 648180
    }
    */

    return res.status(201).send("Hello! It's Disk Storage Test");
  }
);

function fileUploadWithError(req: Request, res: Response, next: NextFunction) {
  const onlySingle = uploads.single("singleFile");

  onlySingle(req, res, function (err: any) {
    if (err) {
      return next();
    }
  });

  return next();
}

function uploadErrorHandling(err: any) {}
FileRoutes.post(
  "/error-handling",
  uploads.single("singleFile"),
  (req: Request, res: Response) => {
    return res.status(201).send("Hello! It's Error Handling");
  }
);

export default FileRoutes;
