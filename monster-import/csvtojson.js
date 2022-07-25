const fs = require("fs");

try {
  console.log("Starting converter");
  const data = fs.readFileSync("../SBLaxman's AD&D Monster List 2.csv", "utf8");
  var lines = data.split(/\r?\n/);

  let monsters = [];
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    var arr = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    if (arr[28].includes("Monstrous Manual (Second Edition)")) {
      let monster = {
        name: cleanData(arr[0]),
        type: cleanData(arr[1]),
        climate: cleanData(arr[2]),
        terrain: cleanData(arr[3]),
        frequency: cleanData(arr[4]),
        organization: cleanData(arr[5]),
        activity: cleanData(arr[6]),
        diet: cleanData(arr[7]),
        intelligence: cleanData(arr[8]),
        in_lair: cleanData(arr[9]),
        treasure_type: cleanData(arr[10]),
        alignment: cleanData(arr[11]),
        no_appearing: cleanData(arr[12]),
        ac: cleanData(arr[13]),
        movement: cleanData(arr[14]),
        hit_dice: cleanData(arr[15]),
        thac0: cleanData(arr[16]),
        no_attacks: cleanData(arr[17]),
        damage: cleanData(arr[18]),
        special_attacks: cleanData(arr[19]),
        special_defense: cleanData(arr[20]),
        magic_resistance: cleanData(arr[21]),
        size: cleanData(arr[22]),
        morale: cleanData(arr[23]),
        psionics: cleanData(arr[24]),
        ad_modes: cleanData(arr[25]),
        level: cleanData(arr[26]),
        xp: cleanData(arr[27]),
        source: cleanData(arr[28]),
      };

      monsters.push(monster);

      count++;
    }
  }

  function cleanData(data) {
    return data.replace(/"/gi, "");
  }

  try {
    const data = fs.writeFileSync("./monsters.json", JSON.stringify(monsters));
    //file written successfully
  } catch (err) {
    console.error(err);
  }

  console.log("Import complete, found", count, "monsters");
} catch (err) {
  console.error(err);
}
