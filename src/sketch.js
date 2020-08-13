let blinker = [
    [1,1,1]
]

let beacon = [
    [1,1,0,0],
    [1,1,0,0],
    [0,0,1,1],
    [0,0,1,1]
]

let pulsar = [
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,0,1,1,1,0,0]
]

let grid
let nextState
let width = 400
let height = 400
let resolution = 10
let running = false
let sizeFactor = 0.8
let speed = 5

function setup() {
  width = Math.floor(windowWidth * sizeFactor)
  height = Math.floor(windowHeight * sizeFactor)
  const canvas = createCanvas(width, height) // this is hard coded
  canvas.parent('canvas')

  grid = createCellGrid(
    Math.floor(width / resolution),
    Math.floor(height / resolution),
    resolution
  )
    setInitialState(grid, pulsar)

  nextState = createCellGrid(
    Math.floor(width / resolution),
    Math.floor(height / resolution),
    resolution
  )
  frameRate(speed)

  buttonPlay = select('#play')
  buttonPlay.mousePressed(() => {
    if (running) {
      buttonPlay.html('Start')
      running = false
      noLoop()
    } else {
      buttonPlay.html('Stop')
      running = true
      loop()
    }
  })

  buttonStep = select('#step')
  buttonStep.mousePressed(() => {
    if (!running) {
      step()
    }
  })

  buttonSpeedup = select('#speedup')
  buttonSpeedup.mousePressed(() => {
    speed *= 2
    frameRate(speed)
  })

  buttonSpeeddown = select('#speeddown')
  buttonSpeeddown.mousePressed(() => {
    speed /= 2
    frameRate(speed)
  })

  noLoop()
  redraw()
}

function draw() {
  background(0)
  grid.forEach(row => {
    row.forEach(cell => {
      cell.show()
    })
  })
  if (running) {
    step()
  }
}

function step() {
  computeNextState(grid, nextState)
  temp = grid
  grid = nextState
  nextState = temp
  redraw()
}

function computeNextState(grid, next) {
  let rows = grid.length
  let cols = grid[0].length
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let count = countNeighbor(i, j, grid)
      if (grid[i][j].isAlive == 1) {
        if (count < 2) {
          next[i][j].setLife(0)
        } else if (count < 4) {
          next[i][j].setLife(1)
        } else {
          next[i][j].setLife(0)
        }
      } else {
        if (count == 3) {
          next[i][j].setLife(1)
        } else {
          next[i][j].setLife(0)
        }
      }
    }
  }
}

function countNeighbor(i, j, grid) {
  let rows = grid.length
  let cols = grid[0].length
  let x_dir = [0, -1, -1, 0, 1, 1, -1, 1]
  let y_dir = [-1, 0, -1, 1, 0, 1, 1, -1]
  let result = 0
  for (let k = 0; k < 8; k++) {
    let x = i + x_dir[k]
    let y = j + y_dir[k]
    x = (x + rows) % rows
    y = (y + cols) % cols
    result += grid[x][y].isAlive
  }
  return result
}

function createCellGrid(rows, cols, dim) {
  let result = new Array(rows)

  for (let i = 0; i < rows; i++) {
    result[i] = new Array(cols)
  }

  //setting up empty objects
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i][j] = new Cell(0, { x: i * dim, y: j * dim }, dim)
    }
  }
  return result
}

function mousePressed() {
  if (running) return
  grid.forEach(row => {
    row.forEach(cell => {
      cell.clicked(mouseX, mouseY)
    })
  })
  redraw()
}

function mouseDragged() {
  if (running) return
  grid.forEach(row => {
    row.forEach(cell => {
      cell.dragged(mouseX, mouseY)
    })
  })
  redraw()
}

function windowResized() {
  resizeCanvas(windowWidth * sizeFactor, windowHeight * sizeFactor)
}

function setInitialState(grid, state){
    //clear grid
    grid.forEach(row => {
        row.forEach( cell => {
            cell.setLife(0)
        })
    })
    let stateRow = state.length
    let stateCol = state[0].length
    let gridRowStart = Math.floor(grid.length/2 - stateRow/2)
    let gridColStart = Math.floor(grid[0].length/2 - stateCol/2)
    for(let i = 0; i < stateRow; i++){
        for(let j = 0; j < stateCol; j++){
            grid[gridRowStart + i][gridColStart + j].setLife(state[i][j])
        }
    }
}
