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
  .attr("y", +75)
  .attr("id", "title")
  .attr("text-anchor", "middle")  
  .style("fill","white")
  .style("font-size",12)
  .style("font-family","sans-serif")
  .style("dominant-baseline","middle");

svg.append("text")
  .attr("x", 0)
  .attr("y", -15)
  .attr("id", "happinessLabel")
  .attr("text-anchor", "middle")
  .style("fill","white")
  .style("font-size",8)
  .style("font-family","sans-serif")
  .style("dominant-baseline","middle");

svg.append("text")
   .attr("x", 0)
   .attr("y", 0)
   .attr("id", "happiness")
   .attr("text-anchor", "middle")
   .style("fill","white")
   .style("font-size",12)
   .style("font-family","sans-serif")
   .style("dominant-baseline","middle");

svg.append("text")
   .attr("x", 0)
   .attr("y", +15)
   .attr("id", "gender")
   .attr("text-anchor", "middle")
   .style("fill","white")
   .style("font-size", 8)
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
          Working: convertStringToMinutes(d["Work"]),
          Studying: convertStringToMinutes(d["Studying"]),
          Household: convertStringToMinutes(d["Household"]),
          Gardening: convertStringToMinutes(d["Gardening & Pet care"]),
          Shopping: convertStringToMinutes(d["Shopping"]),
          Social_Life: convertStringToMinutes(d["Social life & Leisure"]),
          Sports: convertStringToMinutes(d["Sports"]),
          TV_or_Radio: convertStringToMinutes(d["TV, Radio & Entertainment"]),
          Traveling: convertStringToMinutes(d["Travel"])
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

        slices
          .enter()
          .append("path")
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