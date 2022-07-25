const fs = require("fs");

try {
  console.log("Starting converter");
  const data = fs.readFileSync("../SBLaxman's AD&D Monster List 2.csv", "utf8");
  var lines = data.split(/\r?\n/);

  let terrainSet = new Set();
  for (let i = 0; i < lines.length; i++) {
    var arr = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    if (arr[28].includes("Monstrous Manual (Second Edition)")) {
      var terrains = arr[1]
        .replace(" and ", ",")
        .replace(/"/gi, "")
        .split(",");
      for (let i = 0; i < terrains.length; i++) {
        if (terrains[i].length > 0) {
          terrainSet.add(terrains[i].trim());
        }
      }
    }
  }

  let terrainArray = Array.from(terrainSet.values()).sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });

  try {
    const data = fs.writeFileSync("./monstertypes.json", JSON.stringify(terrainArray));
    //file written successfully
  } catch (err) {
    console.error(err);
  }

  console.log("Import complete, found", terrainSet.size, "unique terrain types");
} catch (err) {
  console.error(err);
}
