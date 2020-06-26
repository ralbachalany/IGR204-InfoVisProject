bound_by_country = d3.select("#by_country").node().getBoundingClientRect();
const width_by_country = bound_by_country.width;
const height_by_country = bound_by_country.height;
const margin_by_country = 50;

let radius = Math.min(width_by_country, height_by_country) / 2 - margin_by_country;

let svg = d3.select("#by_country")
  .append("svg")
    .attr("width", width_by_country)
    .attr("height", height_by_country)
  .append("g")
    .attr("transform", "translate(" + width_by_country / 2 + "," + height_by_country / 2 + ") scale(1.85,1.85)");

svg.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("id", "title")
  .attr("text-anchor", "middle")
  .style("fill","white")
  .style("font-size",15)
  .style("font-family","sans-serif")
  .style("dominant-baseline","middle");

svg.append("text")
  .attr("x", 0)
  .attr("y", -23)
  .attr("id", "happinessLabel")
  .attr("text-anchor", "middle")
  .style("fill","white")
  .style("font-size",9)
  .style("font-family","sans-serif")
  .style("dominant-baseline","middle");

svg.append("text")
   .attr("x", 0)
   .attr("y", 0)
   .attr("id", "happiness")
   .attr("text-anchor", "middle")
   .style("fill","white")
   .style("font-size",23)
   .style("font-family","sans-serif")
   .style("dominant-baseline","middle");

svg.append("text")
   .attr("x", 0)
   .attr("y", 37)
   .attr("id", "gender")
   .attr("text-anchor", "middle")
   .style("fill","white")
   .style("font-size", 9)
   .style("font-family","sans-serif")
   .style("dominant-baseline","middle");

function convertStringToMinutes(string){
  return parseInt(string.slice(0,2))*60 + parseInt(string.slice(3,5));
}

z = d3.scaleOrdinal()
    .range(["#a9c5fd", "#fbfd52", "#fda899", "#06f6a4", "#f9dc56",
            "#eba6ff", "#f9feae", "#b1fb27", "#9ccfbe", "#f1e9e6",
            "#ebb678", "#fec0df", "#cac2fc", "#fee5d4", "#6fdf6e",
            "#d3fe94", "#ffba6e", "#c7ecf9", "#72dbf2", "#cedbd8"]);


function getPieChartByCountry(country){
  str = "data/PieChartData/" + country + ".csv";
  d3.csv(str)
  .row( (d, i) => {
      return {
          Personal_Care : convertStringToMinutes(d["Personal care"]),
          Sleeping: convertStringToMinutes(d["Sleeping & Resting"]),
          Eating: convertStringToMinutes(d["Eating"]),
          Work: convertStringToMinutes(d["Work"]),
          Studying: convertStringToMinutes(d["Studying"]),
          Household: convertStringToMinutes(d["Household"]),
          "Food management": convertStringToMinutes(d["Food management"]),
          Chores: convertStringToMinutes(d["Chores"]),
          "Handicraft & Construction": convertStringToMinutes(d["Handicraft & Construction"]),
          "Gardening & Pet care": convertStringToMinutes(d["Gardening & Pet care"]),
          Shopping: convertStringToMinutes(d["Shopping"]),
          Childcare: convertStringToMinutes(d["Childcare"]),
          "Social life & Leisure": convertStringToMinutes(d["Social life & Leisure"]),
          Sports: convertStringToMinutes(d["Sports"]),
          Hobbies: convertStringToMinutes(d["Hobbies"]),
          Computing: convertStringToMinutes(d["Computing"]),
          Reading: convertStringToMinutes(d["Reading"]),
          "TV, Radio & Entertainment": convertStringToMinutes(d["TV, Radio & Entertainment"]),
          Travel: convertStringToMinutes(d["Travel"]),
          Unspecified: convertStringToMinutes(d["Unspecified"])
      };
  })
  .get( (error, rows) => {

      dataM = rows[0];
      dataF = rows[1];

      svg.select("#title")
         .text(country);

      svg.select("#happinessLabel")
         .text("Happiness");

      d3.csv("data/PieChartData/happiness.csv")
         .row( (d, i) => {
           return {
             country : d["Country"],
             happiness : d["Happiness"]
           };
         })
         .get( (error2, rows2) => {
           rows2.forEach(function(d) {
             if(d.country == country){
               svg.select("#happiness")
                  .text(d.happiness+"/10")
             }
           });
         });

      function update(data,gender){

        d3.select("#gender").text(gender);

        let pie = d3.pie()
                    .sort(null)
                    .value(function(d) { return d.value; });

        let dataTest = pie(d3.entries(data));

        let arc = d3.arc().innerRadius(radius*0.4)
                          .outerRadius(radius*0.7);

        let outerArc = d3.arc().innerRadius(radius * 0.9)
                              .outerRadius(radius * 0.9);

        let slices = svg.selectAll("path")
                        .data(dataTest);

        let polylines = svg.selectAll("polyline")
                           .data(dataTest);

        let labels = svg.selectAll("text")
                        .data(dataTest);

        let div = d3.select("body").append("div").attr("class", "tooltip")
            .style("position", "absolute")
            .style("z-index", 10)
            .style("visibility", "hidden")
            .style("background-color", "black")
            .style("color", "white")
            .style("padding", "15px")
            .style("border-radius", "10px")
            .style("border","0px solid black")
            .style("opacity", 0.8)
            .style("font-family", "sans-serif")
            .style("font-size", 12)
            .style("text-align", "center");

        slices
          .enter()
          .append("path")
          .on("mouseenter",function(d){
            div.html("<h4>" + d.data.key + "</h4>"+ "Time spent: " + Math.trunc(d.data.value/60) + " h " + d.data.value%60 + " min")
              .style("visibility", "visible")
              .style("font-size",12)
              .style("top", (d3.event.pageY+15)+"px").style("left",(d3.event.pageX+15)+"px");
          })
          .on("mouseout", function(d) {
            div.style("visibility", "hidden");
          })
          .on("mousemove", function(d) {
            div.style("top", (d3.event.pageY+15)+"px").style("left",(d3.event.pageX+15)+"px");
          })
          .merge(slices)
          .transition()
          .duration(700)
          .attr("d", arc)
          .attr("fill", function(d) { return(z(d.data.key)) })
          .attr("stroke", "white")
          .style("stroke-width", 0.5)
          .style("opacity", 1);

        slices
          .exit()
          .remove();

      }

      d3.select("#maleGraph")
        .on("click", function(){
          update(dataM,"Males");
        });

      d3.select("#femaleGraph")
        .on("click", function(){
          update(dataF,"Females");
        });

      update(dataM,"Males");

  });

}
