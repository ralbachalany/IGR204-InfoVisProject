// DEFINE VARIABLES
// Define size of map group
w = 4000;
h = 2000;

// Define map projection
var projection = d3
   .geoMercator()
   .center([450, 13]) // set centre to further North
   .scale([w/(2*Math.PI)]) // scale to fit group width
   .translate([w/2,h/2]) // ensure centred in group
;

// Define map path
var path = d3
   .geoPath()
   .projection(projection)
;

function getTextBox(selection) {
  selection.each(function(d) {
    d.bbox = this.getBBox();
  });
}

var svg = d3
  .select("#map-holder")
  .append("svg")
  // set to the same size as the "map-holder" div
  .attr("width", $("#map-holder").width())
  .attr("height", $("#map-holder").height())


// get map data
d3.json(
  "./data/custom.geo.json",
  function(json) {

    countriesGroup = svg
   	.append("g")
   	.attr("id", "map")
	;
	// add a background rectangle
	countriesGroup
	   .append("rect")
	   .attr("x", 0)
	   .attr("y", 0)
	   .attr("width", w)
	   .attr("height", h)
	;

	// draw a path for each feature/country
	countries = countriesGroup
	   .selectAll("path")
	   .data(json.features)
	   .enter()
	   .append("path")
	   .attr("d", path)
	   .attr("id", function(d, i) {
	      return "country" + d.properties.iso_a3;
	   })
	   .attr("class", "country")
	   // add a mouseover action to show name label for feature/country
	   .on("mouseover", function(d, i) {
	      d3.select(this).style("fill", 'rgba(255,0,0,0.5)');
	      d3.select("#countryLabel" + d.properties.iso_a3).style("display", "block");
	   })
	   .on("mouseout", function(d, i) {
	      d3.select(this).style("fill", 'white');
	      d3.select("#countryLabel" + d.properties.iso_a3).style("display", "none");
	   })
	;
	d3.selectAll(".country").style("fill",'white');

	// label part
	countryLabels = countriesGroup
	   .selectAll("g")
	   .data(json.features)
	   .enter()
	   .append("g")
	   .attr("class", "countryLabel")
	   .attr("id", function(d) {
	      return "countryLabel" + d.properties.iso_a3;
	   })
	   .attr("transform", function(d) {
	      return (
	         "translate(" + path.centroid(d)[0] + "," + path.centroid(d)[1] + ")"
	      );
	   })
	   // add mouseover functionality to the label
	   .on("mouseover", function(d, i) {
	      d3.select(this).style("display", "block");
	   })
	   .on("mouseout", function(d, i) {
	       d3.select(this).style("display", "none");
	   })   
	;

	// add the text to the label group showing country name
	countryLabels
	   .append("text")
	   .attr("class", "countryName")
	   .style("text-anchor", "middle")
	   .attr("dx", 0)
	   .attr("dy", 0)
	   .text(function(d) {
	      return d.properties.name;
	   })
	   .call(getTextBox)
	;
	// add a background rectangle the same size as the text
	countryLabels
	   .insert("rect", "text")
	   .attr("class", "countryBg")
	   .attr("fill",'green')
	   .attr("transform", function(d) {
	      return "translate(" + (d.bbox.x - 2) + "," + d.bbox.y + ")";
	   })
	   .attr("width", function(d) {
	      return d.bbox.width + 4;
	   })
	   .attr("height", function(d) {
	      return d.bbox.height;
	   })
	;

  }
);