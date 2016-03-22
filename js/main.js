window.onload = setMap();

function setMap() {

  var width=1050,
      height=550;

  var map=d3.select("body")
        .append("svg")
        .attr("class","map")
        .attr("width", width)
        .attr("height",height);

  var projection=d3.geo.naturalEarth()
      .scale(167)
      .translate([width/2,height/2])
      .precision(.1);

  var path=d3.geo.path()
      .projection(projection);

  var q=d3_queue.queue();
      q.defer(d3.csv, "data/internet_censorship.csv")
      q.defer(d3.json, "data/ne_50m_admin_0_countries_lakes.topojson")
      q.await(callback);

  function callback(error, csvData, world){
    var graticule=d3.geo.graticule()
        .step([5,5]);

    var gratBackground=map.append("path")
        .datum(graticule.outline())
        .attr("class","gratBackground")
        .attr("d",path)

    var gratLines=map.selectAll(".gratLines")
        .data(graticule.lines())
        .enter()
        .append("path")
        .attr("class", "gratLines")
        .attr("d",path);

    var worldCountries=topojson.feature(world, world.objects.ne_50m_admin_0_countries_lakes).features;
    var selectCountries=map.selectAll(".selectCountries")

        .data(worldCountries)
        .enter()
        .append("path")
        .attr("class", function(d){
          return "selectCountries " + d.properties.adm0_a3;

        })
        .attr("d",path);
  }
};
