// visualize_graph.js

// Load the JSON data
d3.json('exported_graph.json').then(function(graphData) {
    // Set up D3.js code to render the graph
    var width = 800;
    var height = 600;

    var svg = d3.select('#graph-container')
        .attr('width', width)
        .attr('height', height);

    // Use D3.js force simulation to position nodes and links
    var simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(function(d) { return d.id; }))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2));

    // Render links
    var link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(graphData.links)
        .enter().append('line')
        .attr('stroke-width', function(d) { return d.weight; }); // Set link thickness based on the 'weight' property

    // Render nodes
    var node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(graphData.nodes)
        .enter().append('circle')
        .attr('r', 5)
        .attr('fill', function(d) { return getColorForNodeType(d.type); }); // Set node color based on the 'type' property

    // Add labels to nodes (optional)
    var labels = svg.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(graphData.nodes)
        .enter().append('text')
        .text(function(d) { return d.id; });

    // Update node and link positions on each tick of the simulation
    simulation
        .nodes(graphData.nodes)
        .on('tick', ticked);

    simulation.force('link')
        .links(graphData.links);

    // Function to update node and link positions
    function ticked() {
        link
            .attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

        node
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });

        // Update labels' positions (optional)
        labels
            .attr('x', function(d) { return d.x + 8; })
            .attr('y', function(d) { return d.y - 8; });
    }

    // Functions for node dragging
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

    // Function to get color based on node type
    function getColorForNodeType(nodeType) {
        // Add logic to assign colors based on node type
        // For example, you can use a switch statement or a color scale
        // Here, we are using a simple example with two types: 'A' and 'B'
        return nodeType === 'A' ? 'red' : 'blue';
    }
});
