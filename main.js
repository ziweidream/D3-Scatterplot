$(document).ready(function() {
  var dataset = [];
  function getData(getDataCallBack) {
    $.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(data) {
      dataset = data;
      getDataCallBack(dataset);
    });
  }
  f = function(dataset) {
    console.log(dataset);
    var margin = {
      top: 90,
      right: 40,
      bottom: 40,
      left: 40
    };
    //width and height
    var w = 800;
    var h = 550;
    var textFormat = function(str) {
      var arr = str.split(":");
      var s = Number(arr[1]) > 10
        ? arr[1]
        : arr[1].charAt(1);
      return arr[0] + "mins and " + s + "secs";
    }
    // the tooltip
    var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
    // x scale and y scale
    var xScale = d3.scaleLinear().domain([
      d3.min(dataset, function(d) {
        return d.Seconds;
      }),
      d3.max(dataset, function(d) {
        return d.Seconds;
      }) + 30
    ]).range([
      w - margin.left - margin.right,
      0
    ]);

    var yScale = d3.scaleLinear().domain([
      1,
      d3.max(dataset, function(d) {
        return d.Place;
      }) + 1
    ]).range([
      margin.top, h - margin.top - margin.bottom
    ]);
    //create SVG element
    var svg = d3.select("#root").append("svg").attr("class", "chart").attr("width", w).attr("height", h);
    d3.select("#root").attr("align", "center");
    svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "white").attr("opacity", "0.7");
    //create scateerplot
    svg.selectAll("circle").data(dataset).enter().append("circle").attr("class", "bar").attr("cx", function(d) {
      return xScale(d.Seconds) + margin.left;
    }).attr("cy", function(d) {
      return yScale(d.Place);
    }).attr("r", 5).attr("fill", function(d) {
      if (d.Doping === "") {
        return "green";
      } else {
        return "red";
      }
    }).on("mouseover", function(d) { //display tooltip on mouseover
      div.transition().duration(200).style("opacity", .9);
      div.html(d.Name + ": " + d.Nationality + "<br/>" + "Year: " + d.Year + "<br/>" + "  Time: " + textFormat(d.Time) + "<br/>" + "<br/>" + d.Doping).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
    }).on("mouseout", function(d) {
      div.transition().duration(500).style("opacity", 0)
    });
    // x axis and y axis
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale).ticks(7);
    svg.append("g").style("font", "14px").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (
    h - margin.top - margin.bottom) + ")").call(xAxis);
    svg.append("g").style("font", "14px").attr("class", "axis").attr("transform", "translate(" + margin.left + ", 0)").call(yAxis);
    // title
    svg.append("text").attr("x", (w / 2)).attr("y", margin.top - 20).attr("text-anchor", "middle").style("font-size", "28px").text("Doping in Professional Bicycle Racing");
    svg.append("text").attr("x", (w / 2)).attr("y", margin.top + 10).attr("text-anchor", "middle").style("font-size", "20px").text("35 Fastest times up Alpe d'Huez");
    // x axis text label
    svg.append("text").attr("x", (w / 2)).attr("y", h - margin.bottom - margin.top + 30).attr("dy", "1em").attr("text-anchor", "middle").text("Time (seconds normalized to 13.8km distance)");
    // y axis text label
    svg.append("text").attr("transform", "rotate(-90)").attr("y", margin.left - 35).attr("x", 0 - (h / 4) + 18).attr("dy", "1em").style("text-anchor", "middle").text("Ranking");
  }

  getData(f);
})
