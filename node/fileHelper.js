import fs from 'fs';

const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const initFile = (filePath, data) => {
  if (!fileExists(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(data));
  }
}

export const resetFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data));
}

export const readFile = (filePath) => {
  return fs.readFileSync(filePath);
}

export const writeFile = (filePath, data) => {
  const dataJson = JSON.stringify(data, null, 2);
  fs.writeFile(filePath, dataJson, (err) => {
    if (err) {
      throw 'Error writing to file.';
    }
  });
}
