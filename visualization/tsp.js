(function (d3, _) {
	'use strict';

    const colors = ['Blue', 'Black', 'BlueViolet', 'Chartreuse', 'Gold',
                    'Gray', 'Magenta', 'Red', 'Snow', 'Indigo', 'GreenYellow']
	var width = 500,
	    height = 500,
	    dotscale = 3,
	    citiesList = [];

	var svg = d3.select("#tsp").append("svg")
        .attr("display", "inline")
        .attr("float", 'left')
	    .attr("width", width)
	    .attr("height", height)
        .attr("fill", "#5b702a");

	// Arrows
	svg.append("svg:defs")
	  .append("svg:marker")
	    .attr("id", "directed-line")
	    .attr("viewBox", "0 -5 10 10")
	    .attr("refX", 15)
	    .attr("refY", -1.5)
	    .attr("markerWidth", 6)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto")
	  .append("svg:path")
	    .attr("d", "M0,-5L10,0L0,5");

	svg.append("rect")
	    .attr("width", width)
	    .attr("height", height)
        .attr("fill", "#ad744e");

	function drawCities() {
        svg.selectAll('circle').data(citiesList).enter()
            .append('circle')
                .attr('cx', function (d) { return d.x; })
                .attr('cy', function (d) { return d.y; })
                .attr('r', dotscale)
                .attr('class', 'city');
	}
    
    function drawInfo(data) {
        d3.select('#problem-name').node().innerHTML = data.info.name;
        d3.select('#problem-dim').node().innerHTML = data.info.dimension;
        d3.select('#solution-cost').node().innerHTML = data.solution.cost;
    }

	function drawPath(ipath, index, drawnPaths) {
		var paths = _.map(_.zip(ipath.slice(0,ipath.length-1), ipath.slice(1)), function (pair) {
			return [citiesList[pair[0]], citiesList[pair[1]]]
		}).slice();
        
        drawnPaths = drawnPaths.concat(paths);
        svg.selectAll('path.connection').data(drawnPaths).enter()
			.append('path')
				.attr('d', function(d) {
			    var dx = d[1].x - d[0].x,
			        dy = d[1].y - d[0].y,
			        dr = Math.sqrt(dx * dx + dy * dy);
			    return "M" + d[0].x + "," + d[0].y + "A" + dr + "," + dr + " 0 0,1 " + d[1].x + "," + d[1].y;
			  })
				.attr('class', 'connection')
				.attr('stroke', colors[index])
    		.attr("marker-end", "url(#directed-line)");

        return drawnPaths;
	}

    const ws = new WebSocket("ws://localhost:5678/")
    ws.onmessage = function (event) {
        const data = jQuery.parseJSON(event.data);
        drawInfo(data);
        if (data.cities.length > 0 && citiesList.length == 0) {
            citiesList = data.cities
            drawCities()
        }

        svg.selectAll('path.connection').remove();
        var drawnPaths = [];
        data.solution.paths.forEach((path, index) => {
            drawnPaths = drawPath(path, index, drawnPaths)
        })
        
    };
})(d3, _);
