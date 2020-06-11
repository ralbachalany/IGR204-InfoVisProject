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
  .attr("height", $("#map-holder").height());

//var mouse_coords = d3.mouse(this);
//var mouse_x = mouse_coords[0];
//var mouse_y = mouse_coords[1];

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
	      d3.select(this).style("fill", 'rgb(125,0,0)');
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
	   });

	countryLabels.append("rect")
		.attr("class","countryBg")
		.attr("width", 150)
		.attr("height", 80)
		.style("fill", '#2A2C39')
		.style("stroke-width",2)
		.style("stroke", 'rgb(125,0,0)')
		.attr("id", function(d) {
			return "countryBg" + d.properties.iso_a3;
		});

	window.addEventListener('mousemove', e => {
		d3.selectAll(".countryBg").attr("x",e.pageX + 5);
		d3.selectAll(".countryBg").attr("y",e.pageY - 85);
		d3.selectAll(".countryName").attr("x",e.pageX + 7);
		d3.selectAll(".countryName").attr("y",e.pageY - 70);
		});
	
	// add the text to the label group showing country name
	countryLabels
	   .append("text")
	   .attr("class", "countryName")
	   .attr("dx", 0)
	   .attr("dy", 0)
	   .text(function(d) {
	      return d.properties.name;
	   })
	   .call(getTextBox)
	   ;

  }
);