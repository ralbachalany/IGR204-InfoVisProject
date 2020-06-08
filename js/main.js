const w = 1200;
const h = 600;

let margin = {top: 100, right: 200, bottom: 0, left: 100};

let dataset = [];
let keys = [];
let x = [];
let y = [];
let z = [];
let legend = [];

let svg = d3.select(".box").append("svg").attr("width", w).attr("height", h);
let div = d3.select("body").append("div").attr("class", "tooltip")
.style("position", "absolute")
.style("z-index", 10)
.style("visibility", "hidden")
.style("background-color", "black")
.style("color", "white")
.style("padding", "20px")
.style("border-radius", "10px")
.style("border","0px solid black")
.style("opacity", 0.8)
.style("font-family", "sans-serif")
.style("font-size", 12)
.style("text-align", "center");

function convertToMinutes(timestring) {
    var temp = timestring.split(':'); // split it at the colons
    // Hours are worth 60 minutes.
    var minutes = (+temp[0]) * 60 + (+temp[1]);
    return minutes;
}

function convertToTimeString(m) {
  var hours = m / 60;
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return (rhours < 10 ? "0" + rhours : rhours) + ":" + (rminutes < 10 ? "0" + rminutes : rminutes);
}

d3.csv("data/TimeUse.csv").row( (d, i, columns) => {
    var row = {}; 

    row["Sex"] = d[columns[0]];

    row["Country"] = d[columns[1]];

    row["Happiness"] = +d[columns[3]];

    for (i = 4; i < columns.length; i++) {
        row[columns[i]] = convertToMinutes(d[columns[i]]);
    }

    return row;
}).get((error, rows) => {
    if (error) throw error;
    console.log("Loaded " + rows.length + " rows");
    if (rows.length > 0) {
        console.log("First row: ", rows[0]);
        console.log("Last row: ", rows[rows.length-1]);
    }

    keys = rows.columns.slice(4);

    legend[0] = keys.slice(0,5);
    legend[1] = keys.slice(5,10);
    legend[2] = keys.slice(10,15);
    legend[3] = keys.slice(15,20);

    y = d3.scaleBand()
    .rangeRound([margin.top, h])
    .paddingInner(0.2);

    x = d3.scaleLinear()
    .rangeRound([margin.left, w-margin.right]);

    z = d3.scaleOrdinal()
    .range(["#a9c5fd", "#fbfd52", "#fda899", "#06f6a4", "#f9dc56", 
            "#eba6ff", "#f9feae", "#b1fb27", "#9ccfbe", "#f1e9e6", 
            "#ebb678", "#fec0df", "#cac2fc", "#fee5d4", "#6fdf6e", 
            "#d3fe94", "#ffba6e", "#c7ecf9", "#72dbf2", "#cedbd8"]);
    
    y.domain(rows.map(function(d) { return d.Country; }));
    x.domain([0, 2880]);
    z.domain(keys);

    dataset = rows;
    draw();
});
	  	  
function draw() {
    svg.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(dataset))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("y", function(d) { return y(d.data.Country); })
      .attr("x", function(d) { return x(d[0]); })
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })
      .attr("height", y.bandwidth()/2)
      .attr("transform", function(d) { 
        if(d.data.Sex == "Females") return "translate(0,"+ (0.5 + y.bandwidth()/2)+")";
        else if(d.data.Sex == "Males") return "translate(0,0)"; 
      })
      .on("mouseover", function(d) {
        var key = d3.select(this.parentNode).datum().key;
        div.html(d.data.Country.toUpperCase() + "<br>" + d.data.Sex + "<br>-<br>" + key + ": " + convertToTimeString(d.data[key]) + "<br>" + "Happiness level: " + d.data.Happiness)
        .style("visibility", "visible")
        .style("top", (d3.event.pageY+15)+"px").style("left",(d3.event.pageX+15)+"px");
      })
      .on("mouseout", function(d) {
        div.style("visibility", "hidden");
      })
      .on("mousemove", function(d) { 
        div.style("top", (d3.event.pageY+15)+"px").style("left",(d3.event.pageX+15)+"px"); 
      });

    svg.append("g")
    .selectAll("rect")
    .data(dataset)
    .enter().append("rect")
      .attr("y", function(d) { return  y(d.Country); })
      .attr("x", w - margin.right)
      .attr("width", function(d) { return margin.right/10*d.Happiness; })
      .attr("height", 1)
      .attr("transform", function(d) { 
        if(d.Sex == "Females") return "translate(0,"+0.75*y.bandwidth()+")";
        else if(d.Sex == "Males") return "translate(0,"+0.25*y.bandwidth()+")"; 
      })
      .attr("fill", function(d) { 
        if(d.Sex == "Females") return "Crimson";
        else if(d.Sex == "Males") return "Blue"; 
      });

    svg.append("text")
        .attr("y", margin.top)
        .attr("x", w - margin.right + 60)
        .text("Happiness")
        .style("fill", "black")
        .style("font-family", "sans-serif")
        .style("font-size", 10)

    svg.append("g")
      .attr("fill", "black")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("dominant-baseline", "middle")
    .selectAll("text")
    .data(dataset)
    .enter().append("text")
      .attr("x", function(d) { return w - margin.right + margin.right/10*d.Happiness; })
      .attr("y", function(d) { return  y(d.Country); })
      .attr("transform", function(d) { 
        if(d.Sex == "Females") return "translate(0,"+0.75*y.bandwidth()+")";
        else if(d.Sex == "Males") return "translate(0,"+0.25*y.bandwidth()+")"; 
      })
      .text(d => d.Happiness);

    svg.append("g")
      .attr("transform", "translate("+margin.left+",0)")
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call(g => g.selectAll(".domain").remove());

    svg.append("g")
      .attr("transform", "translate(0,"+margin.top+")")
      .call(d3.axisTop(d3.scaleLinear().rangeRound([margin.left, w-margin.right]).domain([0,48])).ticks(24))
      .call(g => g.selectAll(".domain").remove());

    var j = 10;
    legend.forEach(l => {
      svg.selectAll("circles")
        .data(l)
        .enter()
        .append("circle")
          .attr("cy", j)
          .attr("cx", function(d,i){ return margin.left + 10 + i*180}) // 180 is the distance between dots
          .attr("r", 5)
          .style("fill", function(d){ return z(d)})
      
      svg.selectAll("labels")
        .data(l)
        .enter()
        .append("text")
          .attr("y", j)
          .attr("x", function(d,i){ return margin.left + 20 + i*180})
          .text(function(d){ return d})
          .style("alignment-baseline", "middle")
          .style("fill", "black")
          .style("font-family", "sans-serif")
          .style("font-size", 10)

      j = j + 15;
    });
}