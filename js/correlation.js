d3.csv("/data/correlation.csv", function(error, rows) {
    var data = [];
    var label_length = 100;
    for(attribute in rows[0]){
      var y = attribute;
      data.push({
        x:"",
        y:y,
        value:0,
        add_width:label_length,
        add_height:0
      })
    }

    rows.forEach(function(d){
      var x = d[""];
      delete d[""];
      data.push({
        x:x,
        y:"",
        value:0,
        add_width:0,
        add_height:label_length
      });
      for(attribute in d) {
        var y = attribute,
        value = d[attribute];
        data.push({
          x:x,
          y:y,
          value: +value,
          add_width:0,
          add_height:0
        });
      }
    });

    var margin = {
      top: 50,
      right: 20,
      bottom: 0,
      left: 0
    },
    bound = d3.select("#correlation").node().getBoundingClientRect();
    svg_width = bound.width,
    svg_height = bound.height,
    width = svg_width*0.8,
    height = (svg_height-label_length)*0.7,
    domainX = d3.set(data.map(function(d) {
        return d.x
    })).values(),
    domainY = d3.set(data.map(function(d) {
        return d.y
    })).values(),
    color = d3.scaleLinear()
      .domain([-1,0,1])
      .range(["#B22222", "#fff", "#000080"]);

    domainX.unshift("");
    domainY.unshift("");

    var x = d3.scalePoint()
      .range([0, width-width/domainX.length])
      .domain(domainX),
    y = d3.scalePoint()
      .range([0, height-height/domainY.length])
      .domain(domainY),
    xSpace = 32,
    ySpace = 32;

    var svg = d3.select("#correlation")
      .append("svg")
      .attr("width", svg_width)
      .attr("height", svg_height)
      .append("g")
      .attr("transform", "translate("+ margin.left+","+margin.top+")");

    var cor = svg.selectAll(".cor")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "cor")
      .attr("transform", function(d) {
        return "translate(" + (x(d.x)+xSpace/2+label_length-d.add_width) + "," + (y(d.y)+ySpace/2+label_length-d.add_height) + ")";
      });

    var rect_border = 8;
    var rect_radius = 4;

    var color_label = d3.scaleOrdinal()
    .range(["#cedbd8","#a9c5fd", "#fbfd52", "#fda899", "#06f6a4", "#f9dc56",
            "#eba6ff", "#f9feae", "#b1fb27", "#9ccfbe", "#f1e9e6",
            "#ebb678", "#fec0df", "#cac2fc", "#fee5d4", "#6fdf6e",
            "#d3fe94", "#ffba6e", "#c7ecf9", "#72dbf2"])
    .domain(domainX);

    cor.filter(function(d){
        if(d.x=="") return false;
        return true;
      })
      .append("circle")
      .attr("r", function(d){
        rayon = Math.min(xSpace-15,ySpace-15)*Math.abs(d.value) + 0.1;
        return rayon
      })
      .style("fill", function(d){
        if(d.value ===1){
          return "#000";
        } else{
          return color(d.value)
        }
      });

      cor.filter(function(d){
            if((d.x=="")&&(d.y!="")) return true;
            return false;
          })
        .append("rect")
        .attr("width", function(d){
          return xSpace-rect_border+d.add_width;
        })
        .attr("height", function(d){
          return ySpace-rect_border+d.add_height;
        })
        .attr("rx",4)
        .attr("ry",4)
        .attr("x", rect_border/2 -xSpace / 2)
        .attr("y", rect_border/2 -ySpace / 2);

      cor.filter(function(d){
            if((d.x!="")&&(d.y=="")) return true;
            return false;
          })
        .append("rect")
        .style('stroke-width',0)
        .attr("width", function(d){
          return xSpace-rect_border+d.add_width;
        })
        .attr("height", function(d){
          return ySpace-rect_border+d.add_height;
        })
        .style("fill",function(d){
          return color_label(d.x);
        })
        .attr("rx",rect_radius)
        .attr("ry",rect_radius)
        .attr("x", rect_border/2 -xSpace / 2)
        .attr("y", rect_border/2 -ySpace / 2);

      cor.filter(function(d){
              if((d.x!="")&&(d.y!="")) return true;
              return false;
            })
          .append("rect")
          .style("fill","white")
          .style("fill-opacity","0")
          .attr("width", function(d){
            return xSpace-rect_border+d.add_width;
          })
          .attr("height", function(d){
            return ySpace-rect_border+d.add_height;
          })
          .attr("rx",rect_radius)
          .attr("ry",rect_radius)
          .attr("x", rect_border/2 -xSpace / 2)
          .attr("y", rect_border/2 -ySpace / 2)
          .on("mouseenter",function(d){
            tooltip.style("opacity",0.8)
              .attr("transform", "translate(" + (x(d.x)+label_length+xSpace) + " ,"+(y(d.y)+label_length-10)+")");
            tool_text.text(d.value.toFixed(3));
          })
          .on("mouseout",function(d){
            tooltip.style("opacity",0);
          });

      cor.filter(function(d){
                if((d.x=="")&&(d.y!="")) return true;
                return false;
              })
            .append("text")
            .attr("x",label_length/2)
            .attr("y",5)
            .text(function(d){
              return d.y;
            });

      cor.filter(function(d){
                if(d.y=="") return true;
                  return false;
              })
            .append("text")
            .attr("x",-label_length/2)
            .attr("y",5)
            .text(function(d){
              return d.x;
            })
            .attr("transform","rotate(-90)");

    var aS = d3.scaleLinear()
      .range([35, height])
      .domain([1, -1]);

    var yA = d3.axisRight()
      .scale(aS)
      .tickPadding(7)

    var aG = svg.append("g")
      .attr("class","y axis")
      .call(yA)
      .attr("transform", "translate(" + (label_length+width + margin.right / 2) + " ,"+label_length+")")
      //.attr("transform", "translate(-30,125) rotate(-90)")

    var iR = d3.range(-1, 1.01, 0.01);
    var h = height/ iR.length +3;
    iR.forEach(function(d){
      aG.append('rect')
        .style('fill',color(d))
        .style('stroke-width',0)
        .style('stroke','none')
        .attr('height', h)
        .attr('width', 10)
        .attr('x',0)
        .attr('y', aS(d))
    });

    var tooltip = svg
      .append("g")
      .style("opacity", 0);

    tooltip.append("rect")
      .style("fill", "black")
	  .style("rx", "5px")
	  .style("stroke", "black")
      .attr("width",50)
      .attr("height",25);


    var tool_text = tooltip.append("text")
      .attr("transform", "translate(25,12.5)")
	  .attr("alignment-baseline", "middle")
      .style("fill","white");
});
