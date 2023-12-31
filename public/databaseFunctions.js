const fs = require("fs");

const fileName = "database.json";

const fetchAll = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", (err, data) => {
      if (err) {
        reject(new Error("Error reading JSON file: " + err.message));
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (parseError) {
          reject(new Error("Error parsing JSON data: " + parseError.message));
        }
      }
    });
  });
};

const fetchOne = (key) => {
  return new Promise(async (resolve, reject) => {
    const data = await fetchAll();
    if (data.hasOwnProperty(key)) {
      resolve(data[key]);
    } else {
      resolve(null);
    }
  });
};

const writeJson = async (json) => {
  fs.writeFile(fileName, JSON.stringify(json, null, 2), "utf8", () => {});
};

const writeData = async (newData) => {
  const data = await fetchAll();
  writeJson({ ...data, ...newData });
};

const deleteData = async (key) => {
  const data = await fetchAll();
  delete data[key];
  console.log(key, "deleted");
  writeJson(data);
};

exports.fetchAll = fetchAll;
exports.fetchOne = fetchOne;
exports.writeData = writeData;
exports.deleteData = deleteData;
