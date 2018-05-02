### Multiple Traveling Salesman Problem

#### Visualizer

#### Solver

#### Socket Communication

```javascript
{
	info: {
		name: "eil51",
		comment: "51-city problem (Christofides/Eilon)",
		type: "TSP",
		dimension: 51,
		edge_weight_type: "EUC_2D"
	},
	cities: [{
		id: 0
		x: 37,
		y: 52,
		isDepot: True
	},
	.
	.
	.
	{
		id: 50
		x: 30,
		y: 40,
		isDepot: False
	}],
	solution: {
		cost: 8000,
		numAgents: 2,
		paths: [
            [0,4,6,7,10,15,19, ..., 47, 0],
            [0,12,31,45,...,22,29,0]
		]
	}
}

```
