const util = require('util'),
graphviz = require('graphviz');


class GraphVisualizer{

	print_from_json(json_blueprint, 
					output_name="output",
					output_format="png") {

		this.data = require('./' + json_blueprint + '.json')
		
		this.set_graph();
		const node1 = this.set_nodes();
		this.set_edges(node1)

		console.log(this.g.to_dot())
		this.g.output(output_format, output_name + ".png" );
	}	

	set_graph() {
		this.g = graphviz.digraph("G");
		this.g.set("rankdir", "LR")	
	}

	set_nodes() {
		var gv_node;
		for (var node of this.data.nodes) {
			const label = node.type + '\n id: ' + node.id.toString();
			const style = this.get_shape(node);
			const node_id = node.id.toString()
			gv_node = this.g.addNode( 
								node_id,
	 						{
	 							"style" : style.style,
	 							"shape": style.shape,
	 							"fillcolor" : style.color,
	 							"label": label
	 						} );
		}
		return gv_node
	}

	get_shape(node) {
		if (node.type =="Start") {
			return {"style": "filled", "shape": "circle", "color": "lightsalmon"}
		}

		else if (node.type=="Finish") {
			return {"style": "bold, filled", "shape": "doublecircle", "color": "indianred1"}
		}
		
		else if (node.type=="IdentityUserTask") {
			return {"style": "rounded, filled", "shape": "box", "color": "goldenrod"}
		}

		return {"style": "rounded, filled", "shape": "box", "color": "gold"}

	}

	set_edges(n1) {
		for (var node of this.data.nodes) {
			const next_nodes = this.get_next_node(node);
			if (next_nodes != null) {
				this.link_nodes(node, next_nodes)
			}
		}
	}

	get_next_node(node) {
		const next_node = node.next
		if (typeof next_node === "object") {
			return next_node
		}
		else if (typeof next_node === "number") {
			return {"unused": next_node}
		}
		return null
	}

	link_nodes(node, next_nodes) {
		for (var link in next_nodes) {
			const next_node = next_nodes[link]
			const edge = this.g.addEdge(
								node.id.toString(), 
								next_node.toString());
			this.get_edge_label(edge, link)
			
		}
	}

	get_edge_label(edge, link) {
		if (link != "unused") {
			edge.set( "label", link );
		}
	}

}

module.exports = {
  GraphVisualizer: GraphVisualizer
};