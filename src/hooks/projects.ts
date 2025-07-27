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
];
