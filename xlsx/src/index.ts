import XLSX from "xlsx";
import XLSXSTYLE from "xlsx-style";

// 1. make Virtual excel file
const book = XLSX.utils.book_new();

// MAKE 2. aoa_to_sheet 방식의 데이터 생성
const students = XLSX.utils.aoa_to_sheet([
  ["이름", "나이", "역할"],
  ["formegusto", "26", "admin"],
  ["no th", "25", "user"],
]);

// 2 - 1. Cell 넓이 지정
students["!cols"] = [{ wpx: 130 }, { wpx: 100 }, { wpx: 80 }];
XLSX.utils.book_append_sheet(book, students, "STUDENT");

// MAKE 3. json_to_shhet 방식의 데이터 생성
const department = XLSX.utils.json_to_sheet(
  [
    { 부서명: "에너지IT융합연구센터", 위치: "4층" },
    {
      부서명: "북카페",
      위치: "1층",
    },
  ],
  { header: ["부서명", "위치"], skipHeader: false }
);
department["!cols"] = [{ wpx: 130 }, { wpx: 100 }];
XLSX.utils.book_append_sheet(book, department, "DEPARTMENT");

const mergeDatas = [
  {
    id: "1",
    name: "noth",
  },
  {
    name: "formegusto",
  },
  {
    id: "2",
    name: "any",
  },
  {
    name: "some",
  },
];
const mergeTest = XLSX.utils.json_to_sheet(mergeDatas, {
  header: ["id", "name"],
});
XLSX.utils.book_append_sheet(book, mergeTest, "MERGES");

// merge
// 아래깔리는 문제때문에 보류
const itsMerge = [
  { s: { r: 2, c: 0 }, e: { r: 1, c: 0 } },
  { s: { r: 4, c: 0 }, e: { r: 3, c: 0 } },
];
mergeTest["!merges"] = itsMerge;
const wb = book;
wb.Sheets["MERGES"]["A1"] = {
  v: "id",
  s: {
    font: {
      bold: true,
      sz: "14",
    },
  },
};
wb.Sheets["MERGES"]["A2"] = {
  v: "1",
  s: {
    alignment: {
      vertical: "top",
    },
  },
};

XLSXSTYLE.writeFile(book, "user_department.xlsx");
