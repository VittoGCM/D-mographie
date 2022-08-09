// Dimensions du graphique
var width = 1500
var height = 500

// Ajout de l'objet svg au corps de la page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

// Fichier à lire
d3.csv("Cantons.csv").then( function(data) {

  // Palette de couleur pour les régions linguistiques
  const color = d3.scaleOrdinal()
    .domain(["All", "Fr", "It"])
    .range(d3.schemeDark2);

  // Echelle de la taille des cercles
  const size = d3.scaleLinear()
    .domain([0, 1000])
    .range([5,55])  // cercles entre 5 et 55 px

  // Création de la bulle d'information
  const Tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Trois fonctions qui modifient l'infobulle lorsque l'utilisateur survole / déplace / quitte une cellule.
  const mouseover = function(event, d) {
    Tooltip
      .style("opacity", 1)
  }
  const mousemove = function(event, d) {
    Tooltip
      .html('<u>' + d.key + '</u>' + "<br>" + d.value + " milliers d'habitants")
      .style("left", (event.x/2+20) + "px")
      .style("top", (event.y/2-30) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
  }

  // Initialisation des cercles au centre de la zone svg
  var node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("class", "node")
      .attr("r", function(d){ return size(d.value)})
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", function(d){ return color(d.region)})
      .style("fill-opacity", 0.8)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(d3.drag() // Fonction spécifique lorsque le cercle est traîné
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));

  // Caractéristiques des forces appliquées aux neouds :
  const simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction au centre de la zone svg
      .force("charge", d3.forceManyBody().strength(75)) // Les neouds sont attirés les uns par les autres si la valeur est > 0.
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.value)+3) }).iterations(1)) // Force qui évite le chevauchement des cercles

  // Appliquer ces forces aux neouds et mettez à jour leurs positions.
  // Une fois que la valeur 'alpha' est suffisamment basse, les simulations s'arrêtent.  
  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
      });

  // Fonction qui se lance lorsqu'un noeud est traîné
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

})

// Deuxième zone svg pour la description
var Svg = d3.select("#my_dataviz2")

var keys = ["Canton Germanophone", "Canton Francophone", "Canton Italophone"]

// Même couleurs que pour le svg précédent 
var color = d3.scaleOrdinal()
  .domain(keys)
  .range(d3.schemeDark2);

// Un point pour chaque key
Svg.selectAll("mydots")
  .data(keys)
  .enter()
  .append("circle")
    .attr("cx", 20)
    .attr("cy", function(d,i){ return 17 + i*25}) // Placement des points
    .attr("r", 7)
    .style("fill", function(d){ return color(d)})

// Ajout de labels à côté des points
Svg.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", 40)
    .attr("y", function(d,i){ return 20 + i*25})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")