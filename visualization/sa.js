
	// SAN TSP:
	// Everything below here is simulated annealling for the
	// Traveling Salesman Problem.

	function ccCost(c1, c2) {
		return Math.sqrt(Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2));
	}
	function sum(arr) {
		return _.reduce(arr, function (x,y){ return x+y; }, 0);
	}
	function pathCost(path) {
		var zipped = _.zip(path.slice(0,path.length-1), path.slice(1));
		return sum(_.map(zipped, function (pair) {
			return ccCost(cities[pair[0]], cities[pair[1]]);
		}));
	}
	function randomPath() {
		var n = cities.length
			,	path = [0] // wlog, begin with 0
			, rest = _.range(1, n);

		while (rest.length > 0) {
			var i = Math.floor(Math.random() * rest.length);
			path.push(rest[i]);
			rest.splice(i, 1);
		}
		return path.concat([0]);
	}
	function inversion(path, a, b) {
		return path.slice(0, a)
			.concat(path.slice(a, b).reverse())
			.concat(path.slice(b));
	}
	function translation(path, a, b) {
		return path.slice(0, a)
			.concat(path.slice(b, b+1))
			.concat(path.slice(a, b))
			.concat(path.slice(b+1));
	}
	function switching(path, a, b) {
		return path.slice(0, a)
			.concat(path.slice(b-1, b))
			.concat(path.slice(a+1, b-1))
			.concat(path.slice(a, a+1))
			.concat(path.slice(b));
	}

	var ops = [
		[.75, inversion],
		[.125, translation],
		[.125, switching]
	];

	function createNewPath(path) {
		var roll = Math.random(),
				a = Math.floor(Math.random()*(path.length - 4)+1),
				b = Math.floor(Math.random()*(path.length - 4)) + 3,
				op = null;
		_.each(ops, function (pair) {
			if (roll < pair[0]) {
				op = pair[1];
				roll = 1000;
			} else {
				roll -= pair[0];
			}
		});

		return op(path, a, b);
	}
	function metropolis(c1, c2, T) {
		return Math.random() <= Math.exp((c1 - c2) / T);
	}
	function doRound(cur, T) {
		var newpath = createNewPath(cur.path),
				newcost = pathCost(newpath);

		if ((newcost < cur.cost) || metropolis(newcost, cur.cost)) {
			return {
				path: newpath,
				cost: newcost
			};
		} else {
			return cur;
		}
	}
	function anneal(T, lambda) {
		return T * lambda;
	}
	function san(opts) {
		var T = opts.T,
			path = randomPath(),
			cur = {
				path: path,
				cost: pathCost(path)
			},
			answer = {
				initial: cur
			},
			i;

		if (opts.onRound) opts.onRound(cur.path);
		console.log('Starting SAN-TPS', cur);

		for (i = 1; i < opts.N; i++) {
			cur = doRound(cur, T);

			if (i % opts.round) {
				T = anneal(T, opts.lambda);
				if (ops.onRound) {
					opts.onRound(cur.path);
				}
				console.log('Iteration ' + i, cur);
			}
		}
		console.log('Finished SAN-TPS', cur);
		answer.final = cur;
		return answer;
	}

	function sanTsp(cities, opts) {
		opts = opts || {};
		opts.N = opts.N || 10000; // Max Loss measurements
		opts.T = opts.T || 70;
		opts.lambda = opts.lambda || 0.95;
		opts.round = opts.round || 100;

		return san(opts);
	}
