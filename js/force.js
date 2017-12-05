// Source modified from Mike Bostock's examples.

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory10);

var node_radius = 10

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("er-graph.json", function (error, graph) {
    if (error) throw error;

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", node_radius)
        .attr("fill", function (d) { return color(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))

    node.on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    node.append("title")
        .text(function (d) { return d.id; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    }
});

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    
}

// Create Event Handlers for mouse
function handleMouseOver(d) {  // Add interactivity

    // Use D3 to select element, change color and size
    d3.select(this)
        .attr("r", node_radius * 2);

    // Specify where to put label of text
    svg.append("text")
        .attr("id", "text-" + d.id)  // Create an id for text so we can select it later for removing on mouseout
        .attr("x", function () { return d.x + node_radius * 1.5; })
        .attr("y", function () { return d.y + node_radius * 1.5; })
        .attr("font-family", "Arial")
        .attr("font-size", "22")
        .text(displayInterests(d))
}

function displayInterests(d) {
    text = d.id + ", "
    for (i in d.interests) {
        text += d.interests[i] + " "
    }
    return text
}

function handleMouseOut(d) {
    // Use D3 to select element, change color back to normal
    d3.select(this)
        .attr("fill", function (d) { return color(d.group); })
        .attr("r", node_radius);

    // Select text by id and then remove
    d3.select("#text-" + d.id).remove();  // Remove text location
}
