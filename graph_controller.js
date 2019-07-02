gv = require('./graph_visualizer').GraphVisualizer;
viz = new gv()

class GraphVizController{

	build_graph(workflow_blueprint) {
		return viz.print_from_json(workflow_blueprint)
	}

}

module.exports = {
  GraphVizController: GraphVizController
};