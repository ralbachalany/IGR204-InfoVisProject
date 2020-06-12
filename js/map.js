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

var max
// get map data
d3.json("./data/custom.geo.json",function(json) {

  	d3.csv("./data/happiness.csv",conversor,function(data){
	
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
		      return "country" + d.properties.iso_a2;
		   })
		   .attr("class", "country")
		   // add a mouseover action to show name label for feature/country
		   .on("mouseover", function(d, i) {
		      //d3.select(this).style("opacity", 0.35);
		      animate(d3.select(this));
		      d3.select("#countryLabel" + d.properties.iso_a2).style("display", "block");
		   })
		   .on("mouseout", function(d, i) {
		   	clearInterval(id);
		      d3.select(this).style("opacity", 1);
		      d3.select("#countryLabel" + d.properties.iso_a2).style("display", "none");
		   })
		;
		d3.selectAll(".country").style("fill",'white');

		//Color//////////////////////////
		d3.csv("./data/factbook.csv",function(data2){

			max = d3.max(data2, function(d) { return +d.GDP; });
			var min = d3.min(data2, function(d) { return +d.GDP; });
			var color_scale = d3.scaleLinear()
			.domain([min,max])
			.range([0,180]);

			let tempH = color_scale(data2[1].GDP);
			d3.select("#countryAT").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[2].GDP);
			d3.select("#countryBE").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[3].GDP);
			d3.select("#countryBG").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[4].GDP);
			d3.select("#countryHR").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[5].GDP);
			d3.select("#countryCY").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[6].GDP);
			d3.select("#countryCZ").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[7].GDP);
			d3.select("#countryDK").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[8].GDP);
			d3.select("#countryEE").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[9].GDP);
			d3.select("#countryFI").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[10].GDP);
			d3.select("#countryFR").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[11].GDP);
			d3.select("#countryDE").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[12].GDP);
			d3.select("#countryGR").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[13].GDP);
			d3.select("#countryHU").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[14].GDP);
			d3.select("#countryIE").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[15].GDP);
			d3.select("#countryIT").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[16].GDP);
			d3.select("#countryLV").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[17].GDP);
			d3.select("#countryLT").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[18].GDP);
			d3.select("#countryLU").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[19].GDP);
			d3.select("#countryMK").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[20].GDP);
			d3.select("#countryMT").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[21].GDP);
			d3.select("#countryNL").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[22].GDP);
			d3.select("#countryNO").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[23].GDP);
			d3.select("#countryPL").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[24].GDP);
			d3.select("#countryPT").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[25].GDP);
			d3.select("#countryRO").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[26].GDP);
			d3.select("#countrySK").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[27].GDP);
			d3.select("#countrySI").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[28].GDP);
			d3.select("#countryES").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[29].GDP);
			d3.select("#countrySE").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[30].GDP);
			d3.select("#countryTR").style("fill",'hsl('+tempH+',100%,50%)');

			tempH = color_scale(data2[31].GDP);
			d3.select("#countryGB").style("fill",'hsl('+tempH+',100%,50%)');
		});
		//Happiness////////////////////////////////////////////////////		
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
			.attr("width", 150)
			.attr("height", 80)
			.style("fill", '#2A2C39')
			.style("stroke-width",2)
			.style("stroke", 'rgb(125,0,0)')
			.attr("id", function(d) {
				return "countryBg" + d.properties.iso_a2;
			});

		window.addEventListener('mousemove', e => {
			d3.selectAll(".countryBg").attr("x",e.pageX + 5);
			d3.selectAll(".countryBg").attr("y",e.pageY - 85);
			d3.selectAll(".countryName").attr("x",e.pageX + 7);
			d3.selectAll(".countryName").attr("y",e.pageY - 70);
			d3.selectAll(".happiness").attr("x",e.pageX + 7);
			d3.selectAll(".happiness").attr("y",e.pageY - 10);
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
		   .call(getTextBox);

		countryLabels
		   .append("text")
		   .attr("class", "happiness")
		   .attr("dx", 0)
		   .attr("dy", 0)
		   .text(function(d) {
		   		let iso = d.properties.iso_a2;
		   		let array = d3.map(data, function(d){return(d.Country)}).keys();
		   		indice = Number(array.indexOf(iso));
		   		return "Happiness: "+ data[3*indice+2].Mean +"/10";
		   })
		   .style("fill",'white')
		   .call(getTextBox);
	});
});

function conversor(d){
    d.Mean = +d.Mean;
    return d;
}

var indice = 0;
var id;

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