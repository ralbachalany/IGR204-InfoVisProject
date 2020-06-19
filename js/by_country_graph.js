bound_by_country = d3.select("#by_country").node().getBoundingClientRect();
const width_by_country = bound_by_country.width;
const height_by_country = bound_by_country.height;
const margin_by_county = 150;

let radius = Math.min(width_by_country, height_by_country) / 2 - margin_by_county;

let svg = d3.select("#by_country")
  .append("svg")
    .attr("width", width_by_country)
    .attr("height", height_by_country)
  .append("g")
    .attr("transform", "translate(" + width_by_country / 2 + "," + height_by_country / 2 + ")");

let data = [];

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
          Food_Management: convertStringToMinutes(d["Food management"]),
          Handicraft: convertStringToMinutes(d["Handicraft & Construction"]),
          Gardening: convertStringToMinutes(d["Gardening & Pet care"]),
          Shopping: convertStringToMinutes(d["Shopping"]),
          Childcare: convertStringToMinutes(d["Childcare"]),
          Social_Life: convertStringToMinutes(d["Social life & Leisure"]),
          Sports: convertStringToMinutes(d["Sports"]),
          Hobbies: convertStringToMinutes(d["Hobbies"]),
          Computing: convertStringToMinutes(d["Computing"]),
          Reading: convertStringToMinutes(d["Reading"]),
          TV_or_Radio: convertStringToMinutes(d["TV, Radio & Entertainment"]),
          Traveling: convertStringToMinutes(d["Travel"])
      };
  })
  .get( (error, rows) => {
      console.log("Loaded " + rows.length + " rows");
      if (rows.length > 0) {
          console.log("First row: ", rows[0]);
          console.log("Last row: ", rows[rows.length-1]);
      }
      data = rows;
      let pie = d3.pie()
                  .sort(null)
                  .value(function(d) { return d.value; });
      let dataTest = pie(d3.entries(data[0]));

      let arc = d3.arc().innerRadius(radius*0.5)
                        .outerRadius(radius*0.8);

      let outerArc = d3.arc().innerRadius(radius * 1)
                             .outerRadius(radius * 1);

      svg.selectAll("allSlices")
         .data(dataTest)
         .enter()
         .append("path")
         .attr("d", arc)
         .attr("fill", function(d) { return(z(d.data.key)) })
         .attr("stroke", "white")
         .style("stroke-width", "2px")
         .style("opacity", 0.7)

      svg.selectAll("allPolylines")
         .data(dataTest)
         .enter()
         .append("polyline")
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr("points", function(d) {
              var posA = arc.centroid(d);
              var posB = outerArc.centroid(d);
              var posC = outerArc.centroid(d);
              var midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
              posC[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
              return [posA, posB, posC]
            })

      svg.selectAll("allLabels")
         .data(dataTest)
         .enter()
         .append("text")
           .text( function(d) { console.log(d.data.key) ; return d.data.key } )
           .attr("transform", function(d) {
             var pos = outerArc.centroid(d);
             var midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
             pos[0] = radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
             return "translate(" + pos + ")";
           })
           .style("text-anchor", function(d) {
             var midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
             return (midAngle < Math.PI ? "start" : "end");
           })
           .style("font-family", "sans serif")
           .style("font-size", 15)
       });

}

getPieChartByCountry("Belgium");
