var game_interval = 0;

const canvas = document.getElementById("playfield");
const width = canvas.width, height = canvas.height, main = canvas.getContext("2d"), bg = document.getElementById("background").getContext("2d");
main.fillStyle = "rgba(255, 0, 0, 0.6)";
bg.lineWidth = 5;

const square_img = document.getElementById("square");

var playfield = new Array(22), dirty_rows = new Array(20), dirty = false, t = 0;

const set_field = function(){
	for (let i = 0; i < playfield.length; ++i){ playfield[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];}
	for (let i = 0; i < dirty_rows.length; ++i){ dirty_rows[i] = true;}
	dirty = true;
};
set_field();

const R = new Noise(10), G = new Noise(10), B = new Noise(10), A = new Noise(10);

var falling = {
	shape: [],
	rot: 0,
	loc: [],
	color: "",
	width: 0
};

const check_clear = function(max){ // todo: check and clear up to max
	for (var row = 0; row <= max && row < playfield.length; ++row){
		if (playfield[row][0] > 0 &&
			playfield[row][1] > 0 &&
			playfield[row][2] > 0 &&
			playfield[row][3] > 0 &&
			playfield[row][4] > 0 &&
			playfield[row][5] > 0 &&
			playfield[row][6] > 0 &&
			playfield[row][7] > 0 &&
			playfield[row][8] > 0 &&
			playfield[row][9] > 0){
			playfield.splice(row, 1);
			playfield.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
			for (var i = 0; i <= row; ++i){
				if (i > 1 && !dirty_rows[i-2]){
					dirty_rows[i-2] = true;
					if (!dirty) dirty = true;
				}
			}
		}
	}
}

const draw = function(){
	bg.clearRect(0,0,width,height);
	for (var i = 0; i < 10; ++i){
		for (var j = 19; j < 40; ++j){
			const x = i*width/10 + 10, y = (j-20)*(height)/20 + 10;
			bg.strokeStyle = "rgba(" + (255*R.sample((x + 40)/width, (y + 40)/height, t)).toString() + "," + (255*G.sample((x + 40)/width, (y + 40)/height, t)).toString() + "," + (255*B.sample((x + 40)/width, (y + 40)/height, t)).toString() + "," + Math.pow(A.sample((x + 40)/width, (y + 40)/height, t), 3).toString() + ")";
			bg.strokeRect(x, y, 80, 80);
		}
	}
	t += 0.0015;
	if (t > 1){t -= 1;R.wrapz();G.wrapz();B.wrapz();A.wrapz();}
	if (dirty){
		for (var i = 0; i < 20; ++i){
			if (dirty_rows[i]){
				main.clearRect(0, i * 100, width, 100);
				for (var j = 0; j < 10; ++j){
					if (playfield[i+2][j] > 0){
						main.drawImage(square_img, j * 100, i * 100);
						switch(playfield[i+2][j]){ // note: static colors looks dull
							case(1): // cyan
							main.fillStyle = "rgba(0, 255, 255, 0.65)"
							break;
							case(2): // blue
							main.fillStyle = "rgba(0, 0, 255, 0.65)"
							break;
							case(3): // orange
							main.fillStyle = "rgba(255, 165, 0, 0.65)"
							break;
							case(4): // yellow
							main.fillStyle = "rgba(255, 255, 0, 0.65)"
							break;
							case(5): // green
							main.fillStyle = "rgba(0, 255, 0, 0.65)"
							break;
							case(6): // purple
							main.fillStyle = "rgba(128, 0, 128, 0.65)"
							break;
							case(7): // red
							main.fillStyle = "rgba(255, 0, 0, 0.65)"
							break;
						}
						main.fillRect(j*100, i*100, 100, 100);
					}
				}
				dirty_rows[i] = false;
			}
		}
		dirty = false;
	}
	window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);


const spawn = function(type){
	switch (type){
		case "I":
			falling.shape = [[	[0, 0, 0, 0],
								[1, 1, 1, 1],
								[0, 0, 0, 0],
								[0, 0, 0, 0]],
							[	[0, 0, 1, 0],
								[0, 0, 1, 0],
								[0, 0, 1, 0],
								[0, 0, 1, 0]],
							[	[0, 0, 0, 0],
								[0, 0, 0, 0],
								[1, 1, 1, 1],
								[0, 0, 0, 0]],
							[	[0, 1, 0, 0],
								[0, 1, 0, 0],
								[0, 1, 0, 0],
								[0, 1, 0, 0]]];
			falling.rot = 0;
			falling.loc = [0, 3];
			falling.color = "cyan";
			falling.width = 4;
			// playfield[1][3] = playfield[1][4] = playfield[1][5] = playfield[1][6] = 1; // add checks for collision -> fail
			break;
		case "J":
			falling.shape = [[	[2, 0, 0],
								[2, 2, 2],
								[0, 0, 0]],
							[	[0, 2, 2],
								[0, 2, 0],
								[0, 2, 0]],
							[	[0, 0, 0],
								[2, 2, 2],
								[0, 0, 2]],
							[	[0, 2, 0],
								[0, 2, 0],
								[2, 2, 0]]];
			falling.rot = 0;
			falling.loc = [0, 3];
			falling.color = "blue";
			falling.width = 3;
			break;
		case "L":
			falling.shape = [[	[0, 0, 3],
								[3, 3, 3],
								[0, 0, 0]],
							[	[0, 3, 0],
								[0, 3, 0],
								[0, 3, 3]],
							[	[0, 0, 0],
								[3, 3, 3],
								[3, 0, 0]],
							[	[3, 3, 0],
								[0, 3, 0],
								[0, 3, 0]]];
			falling.rot = 0;
			falling.loc = [0, 3];
			falling.color = "orange";
			falling.width = 3;
			break;
		case "O":
			falling.shape = [[	[4, 4],
								[4, 4]],
							[	[4, 4],
								[4, 4]],
							[	[4, 4],
								[4, 4]],
							[	[4, 4],
								[4, 4]]];
			falling.rot = 0;
			falling.loc = [0, 4];
			falling.color = "yellow";
			falling.width = 2;
			break;
		case "S":
			falling.shape = [[	[0, 5, 5],
								[5, 5, 0],
								[0, 0, 0]],
							[	[0, 5, 0],
								[0, 5, 5],
								[0, 0, 5]],
							[	[0, 0, 0],
								[0, 5, 5],
								[5, 5, 0]],
							[	[5, 0, 0],
								[5, 5, 0],
								[0, 5, 0]]];
			falling.rot = 0;
			falling.loc = [0, 3];
			falling.color = "green";
			falling.width = 3;
			break;
		case "T":
			falling.shape = [[	[0, 6, 0],
								[6, 6, 6],
								[0, 0, 0]],
							[	[0, 6, 0],
								[0, 6, 6],
								[0, 6, 0]],
							[	[0, 0, 0],
								[6, 6, 6],
								[0, 6, 0]],
							[	[0, 6, 0],
								[6, 6, 0],
								[0, 6, 0]]];
			falling.rot = 0;
			falling.loc = [0, 3];
			falling.color = "purple";
			falling.width = 3;
			break;
		case "Z":
			falling.shape = [[	[7, 7, 0],
								[0, 7, 7],
								[0, 0, 0]],
							[	[0, 0, 7],
								[0, 7, 7],
								[0, 7, 0]],
							[	[0, 0, 0],
								[7, 7, 0],
								[0, 7, 7]],
							[	[0, 7, 0],
								[7, 7, 0],
								[7, 0, 0]]];
			falling.rot = 0;
			falling.loc = [0, 3];
			falling.color = "red";
			falling.width = 3;
			break;
	}
	for (var i = 0; i < falling.shape[0].length; ++i){
		const row = falling.loc[0] + i;
		for (var j = 0; j < falling.shape[0][i].length; ++j){
			const col = falling.loc[1] + j;
			if (falling.shape[0][i][j] > 0){
				if (playfield[row][col] > 0){
					clearInterval(game_interval);
					started = false;
					set_field();
					break;
				}
				else if (falling.shape[0][i][j] > 0){
					playfield[row][col] = falling.shape[0][i][j];
					if (row > 1 && !dirty_rows[row - 2]){
						dirty_rows[row - 2] = true;
						dirty = true;
					}
				}
			}
		}
	}
}

var spawn_rand = function(){
	const type = Math.random() * 7; // [0, 7) = ijlostz
	if (type < 1){
		spawn("I");
	}
	else if (type < 2){
		spawn("J");
	}
	else if (type < 3){
		spawn("L");
	}
	else if (type < 4){
		spawn("O");
	}
	else if (type < 5){
		spawn("S");
	}
	else if (type < 6){
		spawn("T");
	}
	else{
		spawn("Z");
	}
}

var test = function(row, col){
	dirty_rows[row] = true;
	playfield[row+2][col] = 1;
	dirty = true;
}

var fall = function(field, piece, render){
	if (piece.shape.length != 4) return;
	var valid = true;
	for (var i = 0; i < piece.shape[piece.rot].length; ++i){
		const row = piece.loc[0] + i;
		for (var j = 0; j < piece.shape[piece.rot][i].length; ++j){
			const col = piece.loc[1] + j;
			if (col < 0 || col > 9){
				continue;
			}
			if (piece.shape[piece.rot][i][j] > 0){
				if (!((i+1 < piece.shape[piece.rot].length && piece.shape[piece.rot][i+1][j] > 0) ||
					(row+1 < field.length && field[row+1][col] == 0))){
					valid = false;
					piece.shape = [];
					break;
				}
			}
		}
		if (!valid) break;
	}
	if (valid){
		for (var i = piece.shape[piece.rot].length-1; i >= 0; i--){
			const row = piece.loc[0] + i;
			for (var j = 0; j < piece.shape[piece.rot][i].length; ++j){
				const col = piece.loc[1] + j;
				if (col < 0 || col > 9){
					continue;
				}
				if (piece.shape[piece.rot][i][j] > 0){
					field[row][col] = 0;
					field[row+1][col] = piece.shape[piece.rot][i][j];
					if (render && row > 1 && !dirty_rows[row-2]){
						dirty_rows[row - 2] = true;
					}
					if (render && row+1 > 1 && !dirty_rows[row-1]){
						dirty_rows[row - 1] = true;
					}
				}
			}
		}
		piece.loc[0] += 1;
		if (render) dirty = true;
	}
	else{
		check_clear(piece.loc[0] + piece.width - 1);
		spawn_rand();
	}
	return valid;
}

// rot 90deg clockwise
const rotate = function(field, piece, render){
	if (piece.shape.length != 4) return;
	var rot = 1;
	while (rot < 4){
		var check = piece.rot + rot;
		if (check > 3) check -= 4;
		var valid = true;
		for (var i = 0; i < piece.width; ++i){
			const row = piece.loc[0] + i;
			for (var j = 0; j < piece.width; ++j){
				if (piece.shape[check][i][j] > 0){
					const col = piece.loc[1] + j;
					if ((row >= field.length)){
						valid = false;
						break;
					}
					if (col < 0 || col > 9){
						valid = false;
						break;
					}
					if (piece.shape[piece.rot][i][j] == 0 && row < field.length && field[row][col] > 0){
						valid = false;
						break;
					}
				}
			}
			if (!valid) break;
		}
		if (!valid) rot++;
		else break;
	}
	if (rot < 4){
		for (var i = 0; i < piece.width; ++i){
			const row = piece.loc[0] + i;
			for (var j = 0; j < piece.width; ++j){
				const col = piece.loc[1] + j;
				if (col < 0 || col > 9){
					continue;
				}
				if (piece.shape[piece.rot][i][j] > 0 && piece.shape[check][i][j] == 0){
					field[row][col] = 0;
					if (render && row > 1 && !dirty_rows[row-2]){
						dirty_rows[row - 2] = true;
					}
				}
				else if (field[row][col] == 0 && piece.shape[check][i][j] > 0){
					field[row][col] = piece.shape[check][i][j];
					if (render && row > 1 && !dirty_rows[row-2]){
						dirty_rows[row - 2] = true;
					}
				}
			}
		}
		piece.rot = check;
		if (render) dirty = true;
	}
	return rot < 4;
}

const move = function(x, field, piece, render){ // input x: -1, 1
	if (piece.shape.length != 4) return;
	var valid = true;
	for (var i = 0; i < piece.width; ++i){
		const row = piece.loc[0] + i;
		for (var j = 0; j < piece.width; ++j){
			if (piece.shape[piece.rot][i][j] > 0){
				const col = piece.loc[1] + j + x;
				if (col < 0 || col > 9){
					valid = false;
					break;
				}
				else if (field[row][col] > 0){
					if ((j + x < piece.width && piece.shape[piece.rot][i][j + x] == 0) ||
						(j + x < 0 || j + x >= piece.width)){
						valid = false;
						break;
					}
				}
			}
		}
		if (!valid) break;
	}
	if (valid){
		for (var i = 0; i < piece.width; ++i){
			const row = piece.loc[0] + i;
			for (var j = 0; j < piece.width; ++j){
				const col = piece.loc[1] + j;
				if (piece.shape[piece.rot][i][j] > 0){
					field[row][col] =  0;
				}
			}
		}
		for (var i = 0; i < piece.width; ++i){
			const row = piece.loc[0] + i;
			for (var j = 0; j < piece.width; ++j){
				const col = piece.loc[1] + j + x;
				if (piece.shape[piece.rot][i][j] > 0){
					field[row][col] =  piece.shape[piece.rot][i][j];
					if (render && row > 1 && !dirty_rows[row - 2]){
						dirty_rows[row - 2] = true;
					}
				}
			}
		}
		piece.loc[1] += x;
		if (render) dirty = true;
	}
}

var started = false;
const start = function(){
	if (!started){
		spawn_rand();
		game_interval = setInterval(function(){fall(playfield, falling, true);}, 450);
		started = true;
	}
}