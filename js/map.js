// DEFINE VARIABLES
// Define size of map group
bound_map = d3.select("#container").node().getBoundingClientRect();
var w_map = bound_map.width;
var h_map = bound_map.height;

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
var legend_map = d3.select("#legend").append("svg");
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
	d3.selectAll("#legend > svg > *").remove();
  var color = d3.scaleLinear()
	.domain([min,max])
	.range([0,120]);

  var getColor = function(d) {
		   return 'hsl('+color(d)+',100%,50%)';}

  var aS = d3.scaleLinear()
	.range([0, 120])
	.domain([min, max]);

  var yA = d3.axisRight()
	.scale(aS)
	.tickPadding(10);

  var aG = legend_map.append("g")
	.attr("class","y axis")
	.attr("transform","translate(10,10)")
	.call(yA);

  var iR = d3.range(min, max, (max - min)/100);
  iR.forEach(function(d){
	aG.append('rect')
	  .style('fill', getColor(d))
	  .style('stroke-width',0)
	  .style('stoke','none')
	  .attr('height', 3)
	  .attr('width', 10)
	  .attr('x',0)
	  .attr('y', aS(d))
  });
}

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
		      	animate(d3.select(this));
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
		d3.selectAll(".countryNull").style("fill",'white');
		d3.selectAll(".countryNull").style("stroke",'black');
		d3.selectAll(".countryNull").style("stroke-width",0.8);

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
		   		return 'hsl('+tempH+',100%,50%)';
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
		   		return 'hsl('+tempH+',100%,50%)';
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
		   		return 'hsl('+tempH+',100%,50%)';
			});
		}
/*		//Happiness////////////////////////////////////////////////////
		var scale = d3.scaleLinear()
			.domain([5.8,8.5])
			.range([0,100]);
		var center_x = 1163;
		var center_y = 543;
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

		center_x = 1052;
		center_y = 491;
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

		center_x = 1280;
		center_y = 620;
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

		center_x = 1165;
		center_y = 505;
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

		center_x = 1115;
		center_y = 480;
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

		center_x = 1101;
		center_y = 390;
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

		center_x = 1285;
		center_y = 335;
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

		center_x = 1240;
		center_y = 665;
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

		center_x = 960;
		center_y = 660;
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

		center_x = 1290;
		center_y = 250;
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

		center_x = 1030;
		center_y = 560;
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

		center_x = 1183;
		center_y = 574;
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

		center_x = 1210;
		center_y = 555;
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

		center_x = 915;
		center_y = 445;
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

		center_x = 1139;
		center_y = 619;
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

		center_x = 1266;
		center_y = 405;
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

		center_x = 1285;
		center_y = 375;
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

		center_x = 1240;
		center_y = 639;
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

		center_x = 1061;
		center_y = 461;
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

		center_x = 1110;
		center_y = 280;
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

		center_x = 1215;
		center_y = 465;
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

		center_x = 912;
		center_y = 655;
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

		center_x = 1275;
		center_y = 570;
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

		center_x = 1170;
		center_y = 315;
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

		center_x = 1162;
		center_y = 569;
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

		center_x = 1210;
		center_y = 525;
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

		center_x = 1365;
		center_y = 675;
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

		center_x = 980;
		center_y = 457;
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
*/
		// label part/////////////////////////////////////
		countryLabels = countriesGroup
		   .selectAll("g")
		   .data(json.features)
		   .enter()
		   .append("g")
		   .attr("class", "countryLabel")
		   .attr("id", function(d) {
		      return "countryLabel" + d.properties.iso_a2;
		   });

		countryLabels.append("rect")
			.attr("class","countryBg")
			.attr("width", 180)
			.attr("height", 100)
			.style("fill", "black")
			.style("opacity",0.8)
			.style("rx",10)
			.attr("id", function(d) {
				return "countryBg" + d.properties.iso_a2;
			});

		window.addEventListener('mousemove', e => {
			d3.selectAll(".countryBg").attr("x",e.pageX + 5);
			d3.selectAll(".countryBg").attr("y",e.pageY - 100);
			d3.selectAll(".countryName").attr("x",e.pageX);
			d3.selectAll(".countryName").attr("y",e.pageY - 80);
			d3.selectAll(".happiness").attr("x",e.pageX + 15);
			d3.selectAll(".happiness").attr("y",e.pageY - 60);
			d3.selectAll(".GDPLabel").attr("x",e.pageX + 15);
			d3.selectAll(".GDPLabel").attr("y",e.pageY - 45);
			d3.selectAll(".URLabel").attr("x",e.pageX + 15);
			d3.selectAll(".URLabel").attr("y",e.pageY - 30);
			d3.selectAll(".PDLabel").attr("x",e.pageX + 15);
			d3.selectAll(".PDLabel").attr("y",e.pageY - 15);

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
		   		return "GDP: "+data2[indice].GDP;}
		   		else{return "GDP";}
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
		  return 'hsl('+tempH+',100%,50%)';
	  });
	}
	else if (radioValue()=="Unemployment"){
	  max = d3.max(data2, function(d) { return +d.Unemployment; });
	  var min = d3.min(data2, function(d) { return +d.Unemployment; });
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
		  let tempH = color_scale(max - data2[indice].Unemployment);
		  return 'hsl('+tempH+',100%,50%)';
	  });
	}else if (radioValue()=="Public debt"){
	  max = d3.max(data2, function(d) { return +d.Public_debt; });
	  var min = d3.min(data2, function(d) { return +d.Public_debt; });
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
		  let tempH = color_scale(max - data2[indice].Public_debt);
		  return 'hsl('+tempH+',100%,50%)';
	  });
	}
  });
  }
