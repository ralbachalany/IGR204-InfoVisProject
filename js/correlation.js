d3.csv("data/correlation.csv", function(error, rows) {
    var data = [];
    var label_y_length = 120;
    var label_x_length = 80;
    for(attribute in rows[0]){
      var y = attribute;
      data.push({
        x:"",
        y:y,
        value:0,
        add_width:label_x_length,
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
        add_height:label_y_length
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
      top: 180,
      right: 70,
      bottom: 20,
      left: 130
    },
    bound = d3.select("#correlation").node().getBoundingClientRect();
    svg_width = bound.width,
    svg_height = bound.height,
    width = svg_width-margin.left-margin.right,
    height = svg_height-margin.top-margin.bottom,
    domainX = d3.set(data.map(function(d) {
        return d.x
    })).values(),
    domainY = d3.set(data.map(function(d) {
        return d.y
    })).values(),
    color = d3.scaleLinear()
      .domain([-1,0,1])
      .range(["#B22222", "#fff", "#000080"]);

    xSpace = width/(domainX.length-1),
    ySpace = height/(domainY.length-1);

    var x = d3.scalePoint()
      .range([0, width])
      .domain(domainX);
    y = d3.scalePoint()
      .range([0, height])
      .domain(domainY);

    var rect_border = xSpace*0.1;
    var rect_radius = 3;

    cell_size = Math.min(xSpace-rect_border,ySpace-rect_border);

    var svg = d3.select("#correlation")
      .append("svg")
      .attr("width", svg_width)
      .attr("height", svg_height)
      .append("g");

    var cor = svg.selectAll(".cor")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "cor")
      .attr("transform", function(d) {
        return "translate(" + (x(d.x)-xSpace+margin.left-d.add_width+cell_size/2) + "," + (y(d.y)-ySpace+margin.top-d.add_height+cell_size/2) + ")";
      });
    console.debug("test : "+Math.min(xSpace,ySpace));


    var color_label = d3.scaleOrdinal()
    .range(["#cedbd8","#a9c5fd", "#fbfd52", "#fda899", "#06f6a4", "#f9dc56",
            "#eba6ff", "#f9feae", "#b1fb27", "#9ccfbe", "#f1e9e6",
            "#ebb678", "#fec0df", "#cac2fc", "#fee5d4", "#6fdf6e",
            "#d3fe94", "#ffba6e", "#c7ecf9", "#72dbf2"])
    .domain(domainX);

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
        .attr("y", function(d){
          return -(ySpace-rect_border+d.add_height) / 2
        })

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
        .attr("x", function(d){
          return -(xSpace-rect_border+d.add_width) / 2
        })
        .attr("y", rect_border/2 -ySpace / 2);

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
        //.style("font-family", "sans-serif")
        .style("font-size", 12)
        .style("text-align", "center");

      cor.filter(function(d){
              if((d.x!="")&&(d.y!="")) return true;
              return false;
            })
          .append("rect")
          .attr("width", function(d){
            return xSpace-rect_border+d.add_width;
          })
          .attr("height", function(d){
            return ySpace-rect_border+d.add_height;
          })
          .attr("rx",rect_radius)
          .attr("ry",rect_radius)
          .attr("x", function(d){
            return -(xSpace-rect_border+d.add_width) / 2
          })
          .attr("y", function(d){
            return -(ySpace-rect_border+d.add_height) / 2
          })
          .on("mouseenter",function(d){
            div.html(d.value.toFixed(3))
              .style("visibility", "visible")
              .style("font-size",12)
              .style("top", (d3.event.pageY+15)+"px").style("left",(d3.event.pageX+15)+"px");
          })
          .on("mouseout", function(d) {
            div.style("visibility", "hidden");
          })
          .on("mousemove", function(d) {
            div.style("top", (d3.event.pageY+15)+"px").style("left",(d3.event.pageX+15)+"px");
          });

      cor.filter(function(d){
              if(d.x=="") return false;
              return true;
            })
            .append("circle")
            .attr("r", function(d){
              rayon = Math.min((xSpace-rect_border),(ySpace-rect_border))*0.8*Math.abs(d.value) + 0.1;
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
            .append("text")
            .attr("x",label_x_length/2)
            .attr("y",5)
            .text(function(d){
              return d.y;
            });

      cor.filter(function(d){
                if(d.y=="") return true;
                  return false;
              })
            .append("text")
            .attr("x",-label_y_length/2)
            .attr("y",5)
            .text(function(d){
              return d.x;
            })
            .attr("transform","rotate(-90)");

    var aS = d3.scaleLinear()
      .range([0, height-rect_border-10])
      .domain([1, -1]);

    var yA = d3.axisRight()
      .scale(aS)
      .tickPadding(8);

    var aG = svg.append("g")
      .attr("class","y axis")
      .call(yA)
      // .attr("transform", "translate(" + (label_length+width + margin.right / 2) + " ,"+label_length+")")
      .attr("transform", "translate(" + (svg_width-label_x_length+20) + " ,"+(5+margin.top+rect_border/2+cell_size/2-ySpace/2)+")");

    var iR = d3.range(-1, 1.01, 0.01);
    var h = height/ iR.length +3;
    iR.forEach(function(d){
      aG.append('rect')
        .style('fill',color(d))
        .style('stroke-width',0)
        .style('stoke','none')
        .attr('height', h)
        .attr('width', 10)
        .attr('x',0)
        .attr('y', aS(d))
    });

});
