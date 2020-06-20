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
    .attr("transform", "translate(" + width_by_country / 2 + "," + height_by_country / 2 + ") scale(1.8,1.8)")

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

      function update(data){

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
          .duration(1000)
          .attr("d", arc)
          .attr("fill", function(d) { return(z(d.data.key)) })
          .attr("stroke", "white")
          .style("stroke-width", 0.5)
          .style("opacity", 1);

        slices
          .exit()
          .remove();

        /*
        polylines
          .enter()
          .append("polyline")
          .merge(polylines)
          .transition()
          .duration(1000)
          .attr("stroke", "black")
          .style("fill", "none")
          .attr("stroke-width", 0.5)
          .attr("points", function(d) {
              var posA = arc.centroid(d);
              var posB = outerArc.centroid(d);
              var posC = outerArc.centroid(d);
              var midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
              posC[0] = radius * 0.8 * (midAngle < Math.PI ? 1 : -1);
              return [posA, posB, posC]
            });

        polylines
          .exit()
          .remove();

        labels
          .enter()
          .append("text")
          .merge(labels)
          .transition()
          .duration(1000)
          .text( function(d) { console.log(d.data.key) ; return d.data.key } )
          .attr("transform", function(d) {
            var pos = outerArc.centroid(d);
            var midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = radius * 0.85 * (midAngle < Math.PI ? 1 : -1);
            return "translate(" + pos + ")";
          })
          .style("text-anchor", function(d) {
            var midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return (midAngle < Math.PI ? "start" : "end");
          })
          .style("font-family", "sans serif")
          .style("font-size", 6)

          labels
            .exit()
            .remove();
        */

      }

      d3.select("#maleGraph")
        .on("click", function(){
          update(dataM);
        });

      d3.select("#femaleGraph")
        .on("click", function(){
          update(dataF);
        });

      update(dataM);

  });

}