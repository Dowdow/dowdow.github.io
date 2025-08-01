import banshee_banshee from "../assets/projects/banshee/Banshee.png";
import banshee_collection from "../assets/projects/banshee/Collection.png";
import banshee_orbit from "../assets/projects/banshee/Orbit.png";
import banshee_sounds from "../assets/projects/banshee/Sounds.png";
import banshee_trials from "../assets/projects/banshee/Trials.png";
import banshee_triumphs from "../assets/projects/banshee/Triumphs.png";
import banshee_weapons from "../assets/projects/banshee/Weapons.png";
import banshee_winner from "../assets/projects/banshee/Winner.png";

import dowfiles_arch from "../assets/projects/dowfiles/arch.png";

import steelseries_progress from "../assets/projects/steelseries/progress.jpg";
import steelseries_scanning from "../assets/projects/steelseries/scanning.jpg";
import steelseries_sse from "../assets/projects/steelseries/sse.png";
import steelseries_tray from "../assets/projects/steelseries/tray.png";
import steelseries_tray_click from "../assets/projects/steelseries/tray-click.png";

export const projects = [
  {
    name: "SteelSeries Arctis Battery",
    description:
      "See your SteelSeries Arctis battery level on your other SteelSeries screened equipments.",
    images: [
      steelseries_progress,
      steelseries_scanning,
      steelseries_sse,
      steelseries_tray,
      steelseries_tray_click,
    ],
    links: [
      {
        name: "GitHub",
        link: "https://github.com/Dowdow/steelseries-arctis-battery",
      },
    ],
  },
  {
    name: "dowfiles",
    description:
      "My dotfiles and tools configuration (zsh, fzf, etc...) + Arch Linux scripts and configuration.",
    images: [dowfiles_arch],
    links: [
      {
        name: "GitHub",
        link: "https://github.com/Dowdow/dowfiles",
      },
    ],
  },
  {
    name: "Trials of Banshee",
    description:
      "Daily type game where you have to find weapons by their sound effect, based on the Destiny 2 video game.",
    images: [
      banshee_orbit,
      banshee_banshee,
      banshee_trials,
      banshee_winner,
      banshee_triumphs,
      banshee_collection,
      banshee_weapons,
      banshee_sounds,
    ],
    links: [
      {
        name: "GitHub",
        link: "https://github.com/Dowdow/trials-of-banshee",
      },
      {
        name: "GitHub Translations",
        link: "https://github.com/Dowdow/trials-of-banshee-translations",
      },
    ],
  },
];
