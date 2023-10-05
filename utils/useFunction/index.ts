import { useState } from "react";

export const formatPhone = (code: any, val: any) => {
  // val.replace(/\D+/g, '')
  if (val == undefined || !val) {
    return;
  }
  let replace = val.replace(/\D+/g, "");
  let result =
    replace.substr(0, 2) +
    "-" +
    replace.substr(2, 3) +
    "-" +
    replace.substr(5, 4) +
    "-" +
    replace.substr(9, 4);
  return code + result;
};

export const useRandomColor = (num: any) => {
  if (num) return Math.floor(Math.random() * 16777215).toString(16);
  else "#fff";
};

export type FormatMoneyProps = {
  amount: number | string | any;
  decimalCount?: number;
  decimal?: string;
  thousands?: string;
};

export const formatMoney = ({
  amount,
  decimalCount = 0,
  decimal = ".",
  thousands = ",",
}: FormatMoneyProps) => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i: any = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
};

export const sortByArr = (fn: any, sortBy: boolean) => {
  // console.log(sortBy, 'sort')
  function cmp(a: any, b: any) {
    if (sortBy) return -(a < b) || +(a > b);
    else return -(a > b) || +(a < b);
  }
  return function (a: any, b: any) {
    return cmp(fn(a), fn(b));
  };
};

export const convertBytes = ({ bytes, decimals = 2 }: any) => {
  let units = ["B", "KB", "MB", "GB", "TB", "PB"];

  let i = 0;

  for (i; bytes > 1024; i++) {
    bytes /= 1024;
  }

  return parseFloat(bytes.toFixed(decimals)) + " " + units[i];
};

export const toBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve({
        size: file.size,
        name: file.name,
        images: reader.result,
      });
    reader.onerror = (error) => reject(error);
  });
};

export const multiBase64 = (images: any, setFiles: any) => {
  const filePathsPromises: any[] = [];
  const fileObj = images;
  const totalFiles = images.length;
  const preview = async () => {
    if (!images || images.length == 0) {
      setFiles(undefined);
      return;
    } else {
      for (let i = 0; i < totalFiles; i++) {
        const img = fileObj[i];
        // console.log(img, 'image obj')
        filePathsPromises.push(toBase64(img));
        const filePaths = await Promise.all(filePathsPromises);
        const mappedFiles = filePaths.map((base64File) => ({
          name: base64File?.name,
          size: base64File?.size,
          source: base64File?.images,
        }));
        setFiles(mappedFiles);
        return mappedFiles;
      }
    }
  };
  preview();
};

export const isBase64 = (str: any) => {
  let res = str?.includes("base64");
  return res;
};

export const isPDFFiles = (value: any) => {
  const pdfRegex = /^.+\.(([pP][dD][fF]))$/;
  let result = pdfRegex.test(value);
  return result;
};

export const exportDataToJSON = (data: any) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "data.json";

  link.click();
};

export const getWebString = (value: any) => {
  let condition = value?.slice(0, 8) === "https://";
  if (!value) {
    return {
      website: null,
      url: null,
    };
  } else {
    if (condition) {
      return {
        website: value?.slice(8),
        url: { value: value?.slice(0, 8), label: value?.slice(0, 8) },
      };
    } else {
      return {
        website: value?.slice(7),
        url: { value: value?.slice(0, 7), label: value?.slice(0, 7) },
      };
    }
  }
};
