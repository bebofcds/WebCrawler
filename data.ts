const exampleCrawlResult= {
  _id: "123abc",

  result: {
    title: "Google",
    graph: {
      "https://google.com": {
        title: "Google Home",
        data: "Google Search Page",
        children: [
          ["https://mail.google.com", 1],
          ["https://youtube.com", 1],
          ["https://maps.google.com", 1],
        ],
      },

      "https://mail.google.com": {
        title: "Gmail",
        data: "Gmail Login Page",
        children: [
          ["https://accounts.google.com", 2],
        ],
      },

      "https://youtube.com": {
        title: "YouTube",
        data: "YouTube Homepage",
        children: [
          ["https://studio.youtube.com", 2],
          ["https://accounts.google.com", 2],
        ],
      },

      "https://maps.google.com": {
        title: "Google Maps",
        data: "Maps Page",
        children: [],
      },

      "https://accounts.google.com": {
        title: "Google Account",
        data: "Login Page",
        children: [],
      },

      "https://studio.youtube.com": {
        title: "YouTube Studio",
        data: "Creator Dashboard",
        children: [],
      },
    },
  },

  failed_links: [
    "https://unknown.google.com",
  ],
};