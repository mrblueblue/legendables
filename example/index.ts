import Legend from "../src/legend"

const nominal = new Legend(document.getElementById("nominal-legend-container"))
nominal.on('filter', (a, b) => console.log(a, b))
nominal.setState({
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
})

const gradient = new Legend(document.getElementById("gradient-legend-container"))
gradient.setState({
  title: "Legend",
  type: "gradient",
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
})

gradient.on("blur", (...value) => {
  console.log(value)
  gradient.setState({
    title: "Legend",
    type: "gradient",
    width: 50,
    height: 100,
    domain: [value, 100],
    range: [
      "#ea5545",
      "#f46a9b",
      "#ef9b20",
      "#edbf33",
      "#ede15b",
      "#bdcf32"
    ]
  })
})
