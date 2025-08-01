import banana_desktop from "../assets/projects/banana/banana-desktop.png";
import banana_mobile from "../assets/projects/banana/banana-mobile.png";

import banshee_banshee from "../assets/projects/banshee/Banshee.png";
import banshee_collection from "../assets/projects/banshee/Collection.png";
import banshee_orbit from "../assets/projects/banshee/Orbit.png";
import banshee_sounds from "../assets/projects/banshee/Sounds.png";
import banshee_trials from "../assets/projects/banshee/Trials.png";
import banshee_triumphs from "../assets/projects/banshee/Triumphs.png";
import banshee_weapons from "../assets/projects/banshee/Weapons.png";
import banshee_winner from "../assets/projects/banshee/Winner.png";

import dowfiles_arch from "../assets/projects/dowfiles/arch.png";

import event_es from "../assets/projects/event/es.png";

import hubble_main from "../assets/projects/hubble/main.png";
import hubble_hand from "../assets/projects/hubble/hand.png";
import hubble_voice from "../assets/projects/hubble/voice.png";

import spider_title from "../assets/projects/spider/title.png";
import spider_difficulty from "../assets/projects/spider/difficulty.png";
import spider_game from "../assets/projects/spider/game.png";
import spider_pgcr from "../assets/projects/spider/pgcr.png";

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
    date: "2025-04",
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
    date: "2024-04",
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
    date: "2023-01",
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
  {
    name: "Event Sonar",
    description:
      "Find music events around you by artist, place or event planners.",
    date: "2019-07",
    images: [event_es],
    links: [
      {
        name: "GitHub Organization",
        link: "https://github.com/Event-Sonar-Archive",
      },
    ],
  },
  {
    name: "Destiny Builder",
    description:
      "A simple tool for Destiny 2 vanilla to create the perfect stats build.",
    date: "2017-12",
    images: [],
    links: [
      {
        name: "GitHub",
        link: "https://github.com/Dowdow/destiny-builder",
      },
    ],
  },
  {
    name: "El Puer Bot",
    description:
      "Discord bot written in JS used to fetch ranking infos throught many game apis.",
    date: "2016-11",
    images: [],
    links: [
      {
        name: "GitHub",
        link: "https://github.com/Dowdow/ElPuerBot",
      },
    ],
  },
  {
    name: "Hubble Player",
    description:
      "Android MP3 Player with Proximity Sensor. Change music with hand gesture and voice.",
    date: "2016-08",
    images: [hubble_main, hubble_hand, hubble_voice],
    links: [
      {
        name: "GitHub",
        link: "https://github.com/Dowdow/HubblePlayer",
      },
    ],
  },
  {
    name: "Bio Feedback",
    description:
      "Android application for Biofeedback with a Bluetooth Zephyr Bioharness 3 belt. Part of university project.",
    date: "2015-05",
    images: [],
    links: [
      {
        name: "GitHub",
        link: "https://github.com/Dowdow/BioFeedback",
      },
    ],
  },
  {
    name: "Othello",
    description:
      "The Othello board game written in Java with different levels of AI. Part of university project.",
    date: "2014-11",
    images: [],
    links: [
      {
        name: "GitHub",
        link: "https://github.com/Dowdow/Othello",
      },
    ],
  },
  {
    name: "Banana Station",
    description:
      "My first portfolio with authentication and likes and comment on posts.",
    date: "2013-09",
    images: [banana_desktop, banana_mobile],
    links: [
      {
        name: "GitHub",
        link: "https://github.com/Dowdow/BananaStation",
      },
    ],
  },
  {
    name: "Spider Game",
    description:
      "A C# video game using the XNA game engine and playable throught a Kinect. Part of university project.",
    date: "2013-02",
    images: [spider_title, spider_difficulty, spider_game, spider_pgcr],
    links: [
      {
        name: "GitHub",
        link: "https://github.com/Dowdow/Spider-Game",
      },
    ],
  },
];
