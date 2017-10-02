import Legend from "../src/legend"

const gradient = new Legend(document.getElementById("gradient-legend-container"))
gradient.setState({
  type: "stacked",
  width: 50,
  height: 50,
  list: [
    {
      title: "Legend",
      type: "gradient",
      locked: true,
      width: 50,
      height: 100,
      domain: [
        0, 100
      ],
      range: [
        "#ea5545",
        "#f46a9b",
        "#ef9b20",
        "#edbf33",
        "#ede15b",
        "#bdcf32"
      ]
    },
    {
      title: "Legend",
      type: "nominal",
      width: 50,
      height: 100,
      domain: [
        "Manhattan",
        "Queens",
        "Bronx",
        "Brooklyn",
        "Staten Island",
        "Other"
      ],
      range: [
        "#ea5545",
        "#f46a9b",
        "#ef9b20",
        "#edbf33",
        "#ede15b",
        "#bdcf32"
      ]
    },
    {
      title: "Legend",
      type: "gradient",
      locked: false,
      width: 50,
      height: 100,
      domain: [
        0, 100
      ],
      range: [
        "#ea5545",
        "#f46a9b",
        "#ef9b20",
        "#edbf33",
        "#ede15b",
        "#bdcf32"
      ]
    },
    {
      title: "amount[contributions]",
      type: "nominal",
      open: true,
      width: 50,
      height: 100,
      domain: [
        "Manhattan",
        "Queens",
        "Bronx",
        "Brooklyn",
        "Staten Island",
        "Other"
      ],
      range: [
        "#ea5545",
        "#f46a9b",
        "#ef9b20",
        "#edbf33",
        "#ede15b",
        "#bdcf32"
      ]
    }
  ]
})

gradient.on("lock", function input ({locked, index}) {
  gradient.setState(state => {
    const list = state.list.slice()
    list[index].locked = !locked
    return {
      ...state,
      list
    }
  })
})


gradient.on("input", function input ({domain, index}) {
  gradient.setState(state => {
    const list = state.list.slice()
    list[index].domain = domain
    return {
      ...state,
      list
    }
  })
})

gradient.on("open", (index) => {
  gradient.setState(state => {
    const list = state.list.slice()
    list[index].open = !list[index].open
    return {
      ...state,
      list
    }
  })
})
