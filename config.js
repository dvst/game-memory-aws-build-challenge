// Configuración centralizada del proyecto AWS Memory Game
const CONFIG = {
  // Información del proyecto
  project: {
    name: "AWS Memory Game",
    description: "Juego Educativo de Servicios Amazon Web Services",
    version: "1.0.0",
    author: "DVST",
  },

  // Repositorio de GitHub
  github: {
    owner: "dvst",
    repo: "game-memory-aws-build-challenge",
    url: "https://github.com/dvst/game-memory-aws-build-challenge",
    apiUrl: "https://api.github.com/repos/dvst/game-memory-aws-build-challenge",
  },

  // Enlaces sociales
  social: {
    website: {
      name: "JaviTech.co",
      url: "https://javitech.co",
      displayName: "JAVITECH.CO",
    },
    github: {
      name: "GitHub",
      url: "https://github.com/dvst",
      profile: "@dvst",
      displayName: "GITHUB",
    },
    blog: {
      name: "Blog",
      url: "https://dev.to/javitech_co",
      displayName: "BLOG",
    },
    linkedin: {
      name: "LinkedIn",
      url: "https://linkedin.com/in/javierperezp",
      displayName: "LINKEDIN",
    },
    youtube: {
      name: "YouTube",
      url: "https://youtube.com/@javitech_co?sub_confirmation=1",
      displayName: "YOUTUBE",
    },
  },

  // URLs del juego
  game: {
    liveUrl: "http://aws-memory-game-javitech.s3-website-us-east-1.amazonaws.com",
    demoUrl: "http://aws-memory-game-javitech.s3-website-us-east-1.amazonaws.com",
  },

  // Textos de la interfaz
  ui: {
    es: {
      websiteLink: "JAVITECH.CO",
      githubLink: "GITHUB",
      blogLink: "BLOG",
      youtubeLink: "YOUTUBE",
      linkedinLink: "LINKEDIN",
    },
    en: {
      websiteLink: "WEBSITE",
      githubLink: "GITHUB",
      blogLink: "BLOG",
      youtubeLink: "YOUTUBE",
      linkedinLink: "LINKEDIN",
    },
  },
};

// Exportar configuración para uso en otros archivos
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
}
