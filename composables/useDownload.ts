export const useDownload = (value: any, filename: string) => {
  const data = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(value)
  )}`;

  const anchor = document.createElement('a');
  anchor.href = data;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};
