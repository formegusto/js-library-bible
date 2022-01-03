# multer

# 1. References

[multer/README-ko.md at master · expressjs/multer](https://github.com/expressjs/multer/blob/master/doc/README-ko.md)

# 2. Usage

- Multer는 **body 객체**와 **한 개의 file 혹은 여러개의 files 객체**를 **request 객체에 추가**한다. **body 객체는 폼 텍스트 필드의 값을 포함**하고, **한 개 혹은 여러개의 파일 객체는 폼을 통해 업로드된 파일들을 포함**하고 있다.

> **Construct**

```tsx
const uploads = multer({ dest: "src/uploads" });
```

- dest를 통해 해당 naming을 가지고 들어오는 파일을 어떤 폴더에 저장할 것인지 명시한다. 상대경로로 지정시, 해당 서버를 실행시킨 위치로 부터 상대경로에 해당 폴더가 생성된다.

> **Main Method**

- 해당 문서에서는 multer의 3가지 메서드들을 소개해주고 있다.

  1. `**single**`

     ```tsx
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
     ```

     - **single 메서드의 주요특성은 단 하나의 파일만 업로드 한다. (req.file)**
     - req.body에는 파일 정보를 제외한 나머지 form-data가 담겨져 있다.

  2. `**array**`

     ```tsx
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
     ```

     - **array 메서드는 여러개의 파일을 업로드 할 때 이용한다. ( req.files )**
     - 두 번째 인자로 maxLength를 넘겨주게 되는데, 해당 수를 초과하는 file의 개수가 들어오면 에러가 발생한다.

  3. `**fields**`

     ```tsx
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
     ```

     - fields 메서드는 여러개의 네이밍을 지정해줄 수 있다.
     - req.files는 [key:string]:File[] 형태의 타입을 가지게 된다.

> **그 외 메서드**

1. `.none()`
   - 오직 텍스트 필드만 허용한다.
2. `.any()`
   - 전달된 모든 파일을 허용한다.

> **DiskStorage**

- 디스크 스토리지 엔진은 파일을 디스크에 저장하기 위한 제어 기능을 제공한다.
- 여기서 제어기능이란 upload folder 지정, filename 지정을 이야기 한다.

```tsx
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
```

```tsx
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
```

> **Error Handling**

- **DiskStorage에서 파일명 등을 제어하는 모습을 봤듯이, multer는 request 객체를 직접 받아서 이를 처리한다.**

인지 알았으나 제대로 처리도 못한다. 그래서 직접 에러 핸들러를 꾸며주는 것이 좋을듯 하다.

```tsx
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
```

- 이와 같이 구성해주면 에러가 발생할 때, 해당 라우터가 동작하고, instanceof로 타입체크까지 해주면 자동생성이 가능해진다
