const simpleGraph = {
  "A": {
    title: "Node A",
    children: [
      ["B", 1],
      ["C", 1],
    ],
  },

  "B": {
    title: "Node B",
    children: [
      ["D", 1],
    ],
  },

  "C": {
    title: "Node C",
    children: [],
  },

  "D": {
    title: "Node D",
    children: [],
  },
};




const output = {
  name: "Node A",
  url: "A",
  children: [
    {
      name: "Node B",
      url: "B",

      children: [
        {
          name: "Node D",
          url: "D",
          children: undefined
        }
      ]
    },

    {
      name: "Node C",
      url: "C",
      children: undefined
    }
  ]
}