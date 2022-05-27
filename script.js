// dimensions du graphique
var width = 600
var height = 450

// ajout de l'objet svg au corps de la page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

// Fichier à lire
d3.csv("Cantons.csv", function(data) {

  // Palette de couleur pour les régions linguistiques
  var color = d3.scaleOrdinal()
    .domain(["All", "Fr", "It"])
    .range(d3.schemeDark2);

  // Echelle de la taille des cercles
  var size = d3.scaleLinear()
    .domain([0, 1000])
    .range([5,55])  // cercles entre 5 et 55 px

  // Création de la bulle d'information
  var Tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Trois fonctions qui modifient l'infobulle lorsque l'utilisateur survole / déplace / quitte une cellule.
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .html('<u>' + d.key + '</u>' + "<br>" + d.value + " milliers d'habitants")
      .style("left", (d3.mouse(this)[0]+20) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
  }

  // Initialisation des cercles au centre de la zone svg
  var node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
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
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction au centre de la zone svg
      .force("charge", d3.forceManyBody().strength(.1)) // Les neouds sont attirés les uns par les autres si la valeur est > 0.
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.value)+3) }).iterations(1)) // Force qui évite le chevauchement des cercles

  // Appliquer ces forces aux neouds et mettez à jour leurs positions.
  // Une fois que la valeur 'alpha' est suffisamment basse, les simulations s'arrêtent.  
  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
      });

  // Fonction qui se lance lorsqu'un noeud est traîné
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(.03);
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
