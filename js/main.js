window.onload = setMap();

function setMap() {
  //set width, height
  var width=1050,
      height=550;
  //append map svg container to body
  var map=d3.select("body")
        .append("svg")
        .attr("class","map")
        .attr("width", width)
        .attr("height",height);

  //create natural earth projection of world
  var projection=d3.geo.naturalEarth()
      .scale(167)
      .translate([width/2,height/2])
      .precision(.1);

//apply path generator to apply projection to spatial data
  var path=d3.geo.path()
      .projection(projection);

//load data asynchronously
  var q=d3_queue.queue();
      q.defer(d3.csv, "data/internet_censorship.csv")//csv data
      q.defer(d3.json, "data/ne_50m_admin_0_countries_lakes.topojson")//spatial data
      q.await(callback);

  function callback(error, csvData, world){
    //apply graticule with lines 5 units apart in both dimensions--lat,lon
    var graticule=d3.geo.graticule()
        .step([5,5]);

    //apply background to graticule
    var gratBackground=map.append("path")
        .datum(graticule.outline())
        .attr("class","gratBackground")
        .attr("d",path)

    //add graticule lines
    var gratLines=map.selectAll(".gratLines")
        .data(graticule.lines())
        .enter() //create an element for each datum
        .append("path")//append each element to the svg as path element
        .attr("class", "gratLines")//assign class equal to gratLines
        .attr("d",path);

    //translate topojson to geojson
    var worldCountries=topojson.feature(world, world.objects.ne_50m_admin_0_countries_lakes).features;
    //add countries to map
    var selectCountries=map.selectAll(".selectCountries")
        .data(worldCountries)
        .enter()
        .append("path")
        .attr("class", function(d){
          return "selectCountries " + d.properties.adm0_a3;

        })
        .attr("d",path);//assign d with attribute path
  }
};
