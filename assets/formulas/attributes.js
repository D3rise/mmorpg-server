module.exports = {
  health: power => 100 + power * 10,
  evRate: agility => 10 + agility * 0.8,
  mana: intelligence => 100 + intelligence * 10,
  maxWeight: power => 60 + power * 5,
  minDamage: power => 4 * power,
  critRate: agility => {}
};
