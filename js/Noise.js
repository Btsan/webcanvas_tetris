function Noise(c) {
		this.complexity = c;
		this.noise = new Array(this.complexity);
		this.initialize = function() {
			for (var i = 0; i < this.complexity; ++i) {
				this.noise[i] = new Array(this.complexity);
				for (var j = 0; j < this.complexity; ++j) {
					this.noise[i][j] = new Array(this.complexity);
					for (var k = 0; k < this.complexity; ++k) {
						this.noise[i][j][k] = Math.random();
					}
				}
			}
		};
		this.initialize();
		this.lerp = function(a, b, t) {
			return (1.0 - t) * a + b * t;
		};
		this.sample = function(x, y, z) {
			if (x < 0) x = 0;
			if (y < 0) y = 0;
			if (z < 0) z = 0;
			var dx = (this.complexity - 1) * x / 1.0;
			var dy = (this.complexity - 1) * y / 1.0;
			var dz = (this.complexity - 1) * z / 1.0;
			const x_index = Math.floor(Math.abs(dx - 0.0001));
			const y_index = Math.floor(Math.abs(dy - 0.0001));
			const z_index = Math.floor(Math.abs(dz - 0.0001));
			dx = Math.abs(dx - x_index);
			dy = Math.abs(dy - y_index);
			dz = Math.abs(dz - z_index);
			const cube = { // [front/back][left/right][top/bot]
				top_front_left: this.noise[z_index][y_index][x_index],
				top_front_right: this.noise[z_index][y_index + 1][x_index],
				bot_front_left: this.noise[z_index][y_index][x_index + 1],
				bot_front_right: this.noise[z_index][y_index + 1][x_index + 1],

				top_back_left: this.noise[z_index + 1][y_index][x_index],
				top_back_right: this.noise[z_index + 1][y_index + 1][x_index],
				bot_back_left: this.noise[z_index + 1][y_index][x_index + 1],
				bot_back_right: this.noise[z_index + 1][y_index + 1][x_index + 1]
			};
			const top_front = this.lerp(cube.top_front_left, cube.top_front_right, dy);
			const bot_front = this.lerp(cube.bot_front_left, cube.bot_front_right, dy);
			const front = this.lerp(top_front, bot_front, dx);
			const top_back = this.lerp(cube.top_back_left, cube.top_back_right, dy);
			const bot_back = this.lerp(cube.bot_back_left, cube.bot_back_right, dy);
			const back = this.lerp(top_back, bot_back, dx);
			return this.lerp(front, back, dz);
		};
		this.wrapz = function() {
			const temp = this.noise.pop();
			this.noise.splice(0, 0, temp);
		};
}