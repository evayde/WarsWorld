import type { COProperties } from "../../../co";

export const drakeAW1: COProperties = {
  displayName: "Drake",
  gameVersion: "AW1",
  dayToDay: {
    description:
      "Naval units have +1 movement range and +2 terrain stars. Air units have -20% firepower. Drake has clear weather movement costs in rain and raises the chance of rain by +7% in random weather.",
    hooks: {
      movementPoints: (value, unit) => {
        if (unit.properties.facility === "port") {
          return value + 1;
        }
      },
      terrainStars: ( value, { defender }) => {
        if (defender.properties.facility === "port") {
          return value + 2;
        }
      },
      attack: ({ attacker }) => {
        if (attacker.properties.facility === "airport") {
          return 80;
        }
      }
    }
  },
  powers: {
    COPower: {
      name: "Tsunami",
      description:
        "All enemy units lose 1 HP (to a minimum of 0.1HP).",
      stars: 4,
      instantEffect(player) {
        const enemyUnits = player.team.getEnemyUnits();
        enemyUnits.forEach(unit => unit.damageUntil1HP(1));
      }
    },
  }
};
