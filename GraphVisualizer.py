import json

from graphviz import Digraph


class GraphVisualizer(object):

	data = None
	
	graph = None

	def print_from_json(self, json_blueprint, 
						output_name="output", output_format="png"):

		self.set_graph(output_name, output_format)
		self.data = json.load(json_blueprint)
		self.set_nodes()
		self.set_edges()
		self.graph.view()

	def set_graph(self, output_name, output_format):
		
		self.graph = Digraph(
		'blueprint_example', 
		filename=output_name,
		format=output_format
		)

		self.graph.attr(
			rankdir='LR',
			size='9,5',
		)

	def set_nodes(self):

		for node in self.data['nodes']:
			label = node['type'] + '\n id: ' + str(node['id'])
			style, shape, color = self.find_shape(node)
			self.graph.node(
				str(node['id']), 
				style=style, 
				shape=shape,
				fillcolor=color, 
				label=label
				)

	@staticmethod
	def find_shape(node):

		if node['type']=="Start":
			return "filled", "circle", "lightsalmon"

		elif node['type']=="Finish":
			return "bold, filled", "doublecircle", "indianred1"
		
		elif node['type']=="IdentityUserTask":
			return "rounded, filled", "box", "goldenrod"

		return "rounded, filled", "box", "gold"

	def set_edges(self):

		for node in self.data['nodes']:
			next_nodes = self.find_next_node(node)
			if next_nodes:
				self.link_nodes(node, next_nodes)

	def find_next_node(self, node):
		
		next_node = node['next']
		
		if type(next_node) is dict:
			return next_node

		elif type(next_node) is int:
			return {"unused": next_node}
		
		return None

	def link_nodes(self, node, next_nodes):

		for link in next_nodes:
			label = self.find_edge_label(link)
			next_node = next_nodes[link]
			self.graph.edge(
				str(node['id']),
				str(next_node),
				label=label
				)

	def find_edge_label(self, link):
		if link is not "unused":
			return link
		return None
