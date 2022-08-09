// Quatrième visualisation
// Dimensions du graphique
// const margin = {top: 200, right: 30, bottom: 50, left: 0},
width_bar = 1000 
height_bar = 800 

// Ajout de l'objet svg au corps de la page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width_bar)
    .attr("height", height_bar)

// Lecture du fichier.csv
d3.csv("Cantons.csv").then( function(data) {

// Ajout de l'axe X
const x = d3.scaleBand()
  .range([0, width_bar])
  .domain(data.map(d => d.key))
  .padding(0.2);
svg.append("g")
  .attr("transform", `translate(${height_bar}, 0,  )`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-15,25)rotate(-90)")
    .style("text-anchor", "end");

// Ajout de l'axe Y 
const y = d3.scaleLinear()
  .domain([0, 1800])
  .range([height_bar, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Création du tool pour survoler les barres
  const Tooltip = d3.select("#my_dataviz")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 1)
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")

// Fonctions pour survoler
  const mouseover = function(event, d) {
    Tooltip.style("opacity", 1)
  }
  var mousemove = function(event, d) {
    Tooltip
      .html(d.key + "<br>" + "Langue parlée majoritairement : " + d.region + "<br>" + "Région : " + d.subregion + "<br>" + "Habitants en milliers du canton: " + d.value)
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2 - 30 + "px")
  }
  var mouseleave = function(event, d) {
    Tooltip.style("opacity", 0)
  }

// Barres
svg
    .selectAll("mybar")
    .data(data)
    .join("rect")
        .attr("x", d => x(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("class","rect")
        .attr("height", d => height_bar - y(d.value))
        .attr("fill", "#69b3a2")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("fill-opacity", 0.7)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    
})