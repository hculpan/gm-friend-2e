const calcFinalInitiative = (monster) => {
  if (
    monster.action === "full_attack" ||
    monster.action === "move_attack" ||
    monster.action === "ready" ||
    monster.action === "charge"
  ) {
    return monster.initModifier + monster.initiative;
  } else if (monster.action === "set-for-charge") {
    return monster.initModifier - 2 + monster.initiative;
  }

  return monster.initiative;
};

export default calcFinalInitiative;
