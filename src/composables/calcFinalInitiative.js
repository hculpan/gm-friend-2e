const calcFinalInitiative = (monster) => {
  if (monster.action === "full_attack" || monster.action === "move_attack" || monster.action === "ready") {
    return monster.initModifier + monster.initiative;
  } else if (monster.action === "charge") {
    return monster.initModifier - 2 + monster.initiative;
  }

  return monster.initiative;
};

export default calcFinalInitiative;
