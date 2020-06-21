// DEFINE VARIABLES
// Define size of map group
bound_map = d3.select("#container").node().getBoundingClientRect();
var w_map = bound_map.width;
var h_map = bound_map.height;

bound_map_bis = d3.select("#map").node().getBoundingClientRect();
var w_map_bis = bound_map_bis.width;
var h_map_bis = bound_map_bis.height;
var offset_x = 880;
var new_offset_x = 12;
const scale_w = w_map_bis/(1380-offset_x);
const scale_h = h_map_bis/820;
var offset_y = 37;
// Define map projection
var projection = d3
   .geoMercator()
   .center([423, 57]) // set centre to further North
   .scale([1.2*w_map/Math.PI]) // scale to fit group width
   .translate([w_map/2,h_map/2]) // ensure centred in group
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


var svg_map = d3
  .select("#map-holder")
  .append("svg")
  // set to the same size as the "map-holder" div
  .attr("width", $("#container").width())
  .attr("height", $("#container").height());

var max

//var legend_map = d3.select("#legend").append("svg").attr("width",$("#legend").width()).attr("height", $("#legend").height());
var legend_map = d3.select("#map_legend").append("svg");
var smiley_legend = d3.select("#smiley_legend").append("svg");
var smileys = [6,6.5,7,7.5,8,8.5];
var scale_legend = d3.scaleLinear()
.range([0,100])
.domain([6,8.5]);
smileys.forEach(d => {
	var center_x = 15;
	var center_y = 20+scale_legend(d);
	smiley_legend.append("path")
		.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale_legend(d) +" 0 0 0 "+ (center_x+5) +","+center_y)
		.attr("stroke-width",1)
		.attr("stroke",'black')
		.attr("fill", 'none');
	smiley_legend.append("circle")
		.attr("cx",center_x-3)
		.attr("cy",center_y-5)
		.attr("r",1);
	smiley_legend.append("circle")
		.attr("cx",center_x+3)
		.attr("cy",center_y-5)
		.attr("r",1);
	smiley_legend.append("text").attr("x",center_x+15).attr("y",center_y).text(d).style("dominant-baseline","middle").style("font-size",10);
});

var updateColorLegend = function(min,max) {
	d3.selectAll("#map_legend > svg > *").remove();
  var color = d3.scaleLinear()
	.domain([min,max])
	.range([0,120]);

  var getColor = function(d) {
		   return 'hsl('+color(d)+',100%,65%)';}

  var aS = d3.scaleLinear()
	.range([0, 120])
	.domain([min, max]);

  var yA = d3.axisRight()
	.scale(aS)
	.tickPadding(8);

  var aG = legend_map.append("g")
	.attr("class","y-axis")
	.attr("height",120)
	.attr("transform","translate(10,10)")
	.call(yA);

  var iR = d3.range(min, max, (max - min)/120);
  iR.forEach(function(d){
	aG.append('rect')
	  .style('fill', getColor(d))
	  .style('stroke-width',0)
	  .style('stroke','none')
	  .attr('height', 2)
	  .attr('width', 10)
	  .attr('x',0)
	  .attr('y', aS(d))
  });
}
/*
var updateColorLegendGDP = function(min,max) {
	d3.selectAll("#map_legend > svg > *").remove();
  var color = d3.scaleLinear()
	.domain([min,max])
	.range([0,180]);

  var getColor = function(d) {
		   return 'hsl('+color(d)+',100%,65%)';}

  var aS = d3.scaleLinear()
	.range([0, 120])
	.domain([min, max]);

  var yA = d3.axisRight()
	.scale(aS)
	.tickPadding(8);

  var aG = legend_map.append("g")
	.attr("class","y-axis")
	.attr("height",120)
	.attr("transform","translate(10,10)")
	.call(yA);

  var iR = d3.range(min, max, (max - min)/120);
  iR.forEach(function(d){
	aG.append('rect')
	  .style('fill', getColor(d))
	  .style('stroke-width',0)
	  .style('stroke','none')
	  .attr('height', 2)
	  .attr('width', 10)
	  .attr('x',0)
	  .attr('y', aS(d))
  });
}*/

// get map data
d3.json("./data/custom.geo.json",function(json) {

  	d3.csv("./data/happiness.csv",conversor,function(data){

	  var tooltip = svg_map
		.append("g")
		.style("opacity", 0);

	    countriesGroup = svg_map
	   	.append("g")
	   	.attr("id", "map")
		;
		// add a background rectangle
		countriesGroup
		   .append("rect")
		   .attr("x", 0)
		   .attr("y", 0)
		   .attr("width", w_map)
		   .attr("height", h_map)
       .style("fill","#4C8FCA")
		;

		// draw a path for each feature/country
		countries = countriesGroup
		   .selectAll("path")
		   .data(json.features)
		   .enter()
		   .append("path")
		   .attr("d", path)
		   .attr("id", function(d, i) {
		      return "country" + d.properties.iso_a2;
		   })
		   .attr("class", function(d, i) {
		   		if (d.properties.iso_a2 != "ZZ"){
		      		return "country";}
		      	else{
		      		return "countryNull";}
		   })
		   // add a mouseover action to show name label for feature/country
		   .on("mouseover", function(d, i) {
		      if (d.properties.iso_a2 != "ZZ"){
		      	if (d.properties.iso_a3 != "ZZ"){
		      		d3.select(this).style("cursor",'pointer');
		      		animate(d3.select(this));
		      	}
		      			      	
		      	d3.select("#countryLabel" + d.properties.iso_a2).style("display", "block");
		      }
		   })
		   .on("mouseout", function(d, i) {
		   		if (d.properties.iso_a2 != "ZZ"){
		   			clearInterval(id);
		      		d3.select(this).style("opacity", 1);
		      		d3.select("#countryLabel" + d.properties.iso_a2).style("display", "none");
		      	}
		   })
		   .on("click", function(d, i) {
		   		if (d.properties.iso_a2 != "ZZ"){getPieChartByCountry(d.properties.sovereignt);}
		   })
		;
		d3.selectAll(".countryNull").style("fill",'lightgray');
		d3.selectAll(".countryNull").style("stroke",'lightslategray');
		d3.selectAll(".countryNull").style("stroke-width",0.5);

		//Color//////////////////////////
		d3.csv("./data/factbook.csv",function(data2){

		if (radioValue()=="GDP"){
			max = d3.max(data2, function(d) { return +d.GDP; });
			var min = d3.min(data2, function(d) { return +d.GDP; });
			var color_scale = d3.scaleLinear()
			.domain([min,max])
			.range([0,120]);

			d3.selectAll(".country")
			.style("fill", function(d){
				let iso = d.properties.iso_a2;
		   		let array = d3.map(data2, function(d){return(d.Country)}).keys();
		   		var indice = Number(array.indexOf(iso));
		   		let tempH = color_scale(data2[indice].GDP);
		   		return 'hsl('+tempH+',100%,65%)';
			})
			updateColorLegend(min,max);

		}
    else if (radioValue()=="Unemployment"){
			max = d3.max(data2, function(d) { return +d.Unemployment; });
			var min = d3.min(data2, function(d) { return +d.Unemployment; });
			var color_scale = d3.scaleLinear()
			.domain([min,max])
			.range([0,120]);

			d3.selectAll(".country")
			.style("fill", function(d){
				let iso = d.properties.iso_a2;
		   		let array = d3.map(data2, function(d){return(d.Country)}).keys();
		   		var indice = Number(array.indexOf(iso));
		   		let tempH = color_scale(max - data2[indice].Unemployment);
		   		return 'hsl('+tempH+',100%,65%)';
			});
		}else if (radioValue()=="Public debt"){
			max = d3.max(data2, function(d) { return +d.Public_debt; });
			var min = d3.min(data2, function(d) { return +d.Public_debt; });
			var color_scale = d3.scaleLinear()
			.domain([min,max])
			.range([0,120]);

			d3.selectAll(".country")
			.style("fill", function(d){
				let iso = d.properties.iso_a2;
		   		let array = d3.map(data2, function(d){return(d.Country)}).keys();
		   		var indice = Number(array.indexOf(iso));
		   		let tempH = color_scale(max - data2[indice].Public_debt);
		   		return 'hsl('+tempH+',100%,65%)';
			});
		}
		//Happiness////////////////////////////////////////////////////
		var scale = d3.scaleLinear()
			.domain([5.8,8.5])
			.range([0,100]);
		var center_x = new_offset_x+(1163-offset_x)*scale_w;
		var center_y = 543*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[2].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1052-offset_x)*scale_w;
		center_y = 491*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[5].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1280-offset_x)*scale_w;
		center_y = 620*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[8].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		// Chypre

		center_x = new_offset_x+(1165-offset_x)*scale_w;
		center_y = 505*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[14].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1115-offset_x)*scale_w;
		center_y = 480*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[17].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1101-offset_x)*scale_w;
		center_y = 390*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[20].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1285-offset_x)*scale_w;
		center_y = 335*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[23].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1240-offset_x)*scale_w;
		center_y = 665*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[26].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(960-offset_x)*scale_w;
		center_y = 660*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[29].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1290-offset_x)*scale_w;
		center_y = 250*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[32].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1030-offset_x)*scale_w;
		center_y = 560*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[35].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1183-offset_x)*scale_w;
		center_y = 574*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[38].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1210-offset_x)*scale_w;
		center_y = 555*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[41].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(915-offset_x)*scale_w;
		center_y = 445*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[44].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1139-offset_x)*scale_w;
		center_y = 619*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[47].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1266-offset_x)*scale_w;
		center_y = 405*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[50].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		//Luxembourg

		center_x = new_offset_x+(1285-offset_x)*scale_w;
		center_y = 375*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[56].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1240-offset_x)*scale_w;
		center_y = 639*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[59].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		// Malte

		center_x = new_offset_x+(1061-offset_x)*scale_w;
		center_y = 461*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[65].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1110-offset_x)*scale_w;
		center_y = 280*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[68].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1215-offset_x)*scale_w;
		center_y = 465*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[71].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(912-offset_x)*scale_w;
		center_y = 655*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[74].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1275-offset_x)*scale_w;
		center_y = 570*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[77].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1170-offset_x)*scale_w;
		center_y = 315*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[80].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1162-offset_x)*scale_w;
		center_y = 569*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+(center_y-1)+" A 15 "+ scale(data[83].Mean) +" 0 0 0 "+ (center_x+5) +","+(center_y-1))
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1210-offset_x)*scale_w;
		center_y = 525*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[86].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(1365-offset_x)*scale_w;
		center_y = 675*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[89].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		center_x = new_offset_x+(980-offset_x)*scale_w;
		center_y = 457*scale_h+offset_y;
		countriesGroup.append("path")
			.attr("d","M "+(center_x-5)+","+center_y+" A 15 "+ scale(data[92].Mean) +" 0 0 0 "+ (center_x+5) +","+center_y)
			.attr("stroke-width",1)
			.attr("stroke",'black')
			.attr("fill", 'none');
		countriesGroup.append("circle")
			.attr("cx",center_x-3)
			.attr("cy",center_y-5)
			.attr("r",1);
		countriesGroup.append("circle")
			.attr("cx",center_x+3)
			.attr("cy",center_y-5)
			.attr("r",1);

		// label part/////////////////////////////////////
		countryLabels = countriesGroup
		   .selectAll("g")
		   .data(json.features)
		   .enter()
		   .append("g")
		   .attr("class", "countryLabel")
		   .attr("id", function(d) {
		   		if(d.properties.iso_a2!="ZZ"){
		      	return "countryLabel" + d.properties.iso_a2;}
		      	else{
		      	return "countryLabel" + d.properties.iso_a3;}
		   });

		countryLabels.append("rect")
			.attr("class","countryBg")
			.attr("width", 180)
			.attr("height", 100)
			.style("fill", "black")
			.style("opacity",0.85)
			.attr("rx",10)
			.attr("id", function(d) {
				if(d.properties.iso_a2!="ZZ"){
		      	return "countryBg" + d.properties.iso_a2;}
		      	else{
		      	return "countryBg" + d.properties.iso_a3;}
			});

		window.addEventListener('mousemove', (e,d) => {
			d3.selectAll(".countryBg").attr("x",e.pageX + 5);
			d3.selectAll(".countryBg").attr("y",e.pageY - 100);
			d3.selectAll(".countryName").attr("x",e.pageX);
			d3.selectAll(".countryName").attr("y",e.pageY - 80);
			d3.selectAll(".happiness").attr("x",e.pageX + 15);
			d3.selectAll(".happiness").attr("y",e.pageY - 60);
			d3.selectAll(".GDPLabel").attr("x",e.pageX + 15);
			d3.selectAll(".GDPLabel").attr("y",e.pageY - 45);
			d3.selectAll(".PDLabel").attr("x",e.pageX + 15);
			d3.selectAll(".PDLabel").attr("y",e.pageY - 30);
			d3.selectAll(".URLabel").attr("x",e.pageX + 15);
			d3.selectAll(".URLabel").attr("y",e.pageY - 15);
			d3.select("#countryBgFI").attr("x",e.pageX -185);
			d3.select("#countryBgEE").attr("x",e.pageX -185);
			d3.select("#countryBgLV").attr("x",e.pageX -185);
			d3.select("#countryBgLT").attr("x",e.pageX -185);
			d3.select("#countryNameFI").attr("x",e.pageX -185);
			d3.select("#countryNameEE").attr("x",e.pageX -185);
			d3.select("#countryNameLV").attr("x",e.pageX -185);
			d3.select("#countryNameLT").attr("x",e.pageX -185);
			d3.select("#happinessFI").attr("x",e.pageX -175);
			d3.select("#happinessEE").attr("x",e.pageX -175);
			d3.select("#happinessLV").attr("x",e.pageX -175);
			d3.select("#happinessLT").attr("x",e.pageX -175);
			d3.select("#GDPLabelFI").attr("x",e.pageX -175);
			d3.select("#GDPLabelEE").attr("x",e.pageX -175);
			d3.select("#GDPLabelLV").attr("x",e.pageX -175);
			d3.select("#GDPLabelLT").attr("x",e.pageX -175);
			d3.select("#PDLabelFI").attr("x",e.pageX -175);
			d3.select("#PDLabelEE").attr("x",e.pageX -175);
			d3.select("#PDLabelLV").attr("x",e.pageX -175);
			d3.select("#PDLabelLT").attr("x",e.pageX -175);
			d3.select("#URLabelFI").attr("x",e.pageX -175);
			d3.select("#URLabelEE").attr("x",e.pageX -175);
			d3.select("#URLabelLV").attr("x",e.pageX -175);
			d3.select("#URLabelLT").attr("x",e.pageX -175);
			});

		// add the text to the label group showing country name
		countryLabels
		   .append("text")
		   .attr("class", "countryName")
		   .attr("dx",90)
		   .attr("text-anchor","middle")
		   .text(function(d) {
		      return d.properties.name.toUpperCase();
		   })
		   .attr("id", function(d) {
				if(d.properties.iso_a2!="ZZ"){
		      	return "countryName" + d.properties.iso_a2;}
		      	else{
		      	return "countryName" + d.properties.iso_a3;}
			})
		   .style("font-size",12)
		   .call(getTextBox);

		countryLabels
		   .append("text")
		   .attr("class", "happiness")
		   .text(function(d) {
		   		let iso = d.properties.iso_a2;
		   		if (d.properties.iso_a2!="ZZ"){
		   		let array = d3.map(data, function(d){return(d.Country)}).keys();
		   		var indice = Number(array.indexOf(iso));
		   		return "Happiness: "+ data[3*indice+2].Mean +"/10";}
		   		else{return "Happiness";}
		   })
		   .attr("id", function(d) {
				if(d.properties.iso_a2!="ZZ"){
		      	return "happiness" + d.properties.iso_a2;}
		      	else{
		      	return "happiness" + d.properties.iso_a3;}
			})
		   .style("fill",'white')
		   .style("font-size",12)
		   .call(getTextBox);

		countryLabels
		   .append("text")
		   .attr("class", "GDPLabel")
		   .text(function(d) {
		   		let iso = d.properties.iso_a2;
		   		if (d.properties.iso_a2!="ZZ"){
		   		let array = d3.map(data2, function(d){return(d.Country)}).keys();
		   		var indice = Number(array.indexOf(iso));
		   		return "GDP per capita: "+data2[indice].GDP;}
		   		else{return "GDP";}
		   		})
		   .attr("id", function(d) {
				if(d.properties.iso_a2!="ZZ"){
		      	return "GDPLabel" + d.properties.iso_a2;}
		      	else{
		      	return "GDPLabel" + d.properties.iso_a3;}
			})
		   .style("fill",'white')
		   .style("font-size",12)
		   .call(getTextBox);

		   countryLabels
		   .append("text")
		   .attr("class", "PDLabel")
		   .text(function(d) {
		   		let iso = d.properties.iso_a2;
		   		if (d.properties.iso_a2!="ZZ"){
		   		let array = d3.map(data2, function(d){return(d.Country)}).keys();
		   		var indice = Number(array.indexOf(iso));
		   		return "Public debt: "+data2[indice].Public_debt +"% of GDP";}
		   		else{return "Public debt";}
		   		})
		   .attr("id", function(d) {
				if(d.properties.iso_a2!="ZZ"){
		      	return "PDLabel" + d.properties.iso_a2;}
		      	else{
		      	return "PDLabel" + d.properties.iso_a3;}
			})
		   .style("fill",'white')
		   .style("font-size",12)
		   .call(getTextBox);

		   countryLabels
		   .append("text")
		   .attr("class", "URLabel")
		   .text(function(d) {
		   		let iso = d.properties.iso_a2;
		   		if (d.properties.iso_a2!="ZZ"){
		   		let array = d3.map(data2, function(d){return(d.Country)}).keys();
		   		var indice = Number(array.indexOf(iso));
		   		return "Unemployment: "+data2[indice].Unemployment + "%";}
		   		else{return "Unemployment";}
		   		})
		   .attr("id", function(d) {
				if(d.properties.iso_a2!="ZZ"){
		      	return "URLabel" + d.properties.iso_a2;}
		      	else{
		      	return "URLabel" + d.properties.iso_a3;}
			})
		   .style("fill",'white')
		   .style("font-size",12)
		   .call(getTextBox);
		});

	});
});

function conversor(d){
	d.Mean = +d.Mean;
    return d;
}

var id;
updateColor();

function animate(el){
	var timer=1;
	var direc=0;
	id = setInterval(opac, 10);
	function opac(){
		if ((timer<0.5)||(timer>1)){
			direc = 1 - direc;
		}
		if (direc==0){
			timer+=0.01;
		}else{
			timer-=0.01;
		}
		el.style("opacity",timer);
	}
}

function radioValue() {
	var ele = document.getElementsByTagName('input');
    for(i = 0; i < ele.length; i++) {
        if(ele[i].type="radio") {
            if(ele[i].checked){
                return ele[i].value;
            }
        }
    }
}
function updateColor(){
	d3.csv("./data/factbook.csv",function(data2){
	if (radioValue()=="GDP"){
	  max = d3.max(data2, function(d) { return +d.GDP; });
	  var min = d3.min(data2, function(d) { return +d.GDP; });
	  var color_scale = d3.scaleLinear()
	  .domain([min,max])
	  .range([0,120]);
	  updateColorLegend(min,max);
	  console.log(min);
	  console.log(max);

	  d3.selectAll(".country")
	  .style("fill", function(d){
		let iso = d.properties.iso_a2;
		  let array = d3.map(data2, function(d){return(d.Country)}).keys();
		  var indice = Number(array.indexOf(iso));
		  let tempH = color_scale(data2[indice].GDP);
		  return 'hsl('+tempH+',100%,65%)';
	  });
	}
	else if (radioValue()=="Unemployment"){
	  max = d3.max(data2, function(d) { return +d.Unemployment; });
	  var min = d3.min(data2, function(d) { return +d.Unemployment; });
	  var color_scale = d3.scaleLinear()
	  .domain([min,max])
	  .range([0,120]);
	  updateColorLegend(max,min);
	  console.log(min);
	  console.log(max);

	  d3.selectAll(".country")
	  .style("fill", function(d){
		let iso = d.properties.iso_a2;
		  let array = d3.map(data2, function(d){return(d.Country)}).keys();
		  var indice = Number(array.indexOf(iso));
		  let tempH = color_scale(max - data2[indice].Unemployment);
		  return 'hsl('+tempH+',100%,65%)';
	  });
	}else if (radioValue()=="Public debt"){
	  max = d3.max(data2, function(d) { return +d.Public_debt; });
	  var min = d3.min(data2, function(d) { return +d.Public_debt; });
	  var color_scale = d3.scaleLinear()
	  .domain([min,max])
	  .range([0,120]);
	  updateColorLegend(max,min);
	  console.log(min);
	  console.log(max);

	  d3.selectAll(".country")
	  .style("fill", function(d){
		let iso = d.properties.iso_a2;
		  let array = d3.map(data2, function(d){return(d.Country)}).keys();
		  var indice = Number(array.indexOf(iso));
		  let tempH = color_scale(max - data2[indice].Public_debt);
		  return 'hsl('+tempH+',100%,65%)';
	  });
	}
  });
  }
