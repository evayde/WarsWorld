import type { COProperties } from "../../../co";

export const maxAW2: COProperties = {
  displayName: "Max",
  gameVersion: "AW2",
  dayToDay: {
    description: "Non-footsoldier direct units have +20% firepower, but indirect units have -10% firepower and -1 range.",
    hooks: {
      attack: ({ attacker }) => {
        if (attacker.isIndirect()) {
          return 90;
        }

        if (!attacker.isInfantryOrMech()) {
          return 120;
        }
      },
      attackRange(value, attacker) {
        if (attacker.isIndirect()) {
          return value - 1;
        }
      },
    }
  },
  powers: {
    COPower: {
      name: "Max Force",
      description: "Non-footsoldier direct units gain 1 movement and +20% firepower.",
      stars: 3,
      hooks: {
        movementPoints: (value, unit) => {
          if (!unit.isIndirect() && !unit.isInfantryOrMech() && "attackRange" in unit.properties) {
            return value + 1;
          }
        },
        attack: ({ attacker }) => {
          if (attacker.isIndirect()) {
            return 90;
          }

          if (!attacker.isInfantryOrMech()) {
            return 140;
          }
        },
      },
    },
    superCOPower: {
      name: "Max Blast",
      description: "Non-footsoldier direct units gain 2 movement and +40% firepower.",
      stars: 6,
      hooks: {
        movementPoints: (value, unit) => {
          if (!unit.isIndirect() && !unit.isInfantryOrMech() && "attackRange" in unit.properties) {
            return value + 2;
          }
        },
        attack: ({ attacker }) => {
          if (attacker.isIndirect()) {
            return 90;
          }

          if (!attacker.isInfantryOrMech()) {
            return 160;
          }
        },
      },
    }
  },
};
