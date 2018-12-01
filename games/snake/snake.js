var
    COLS = 26,
    ROWS = 26,
    EMPTY = 0,
    SNAKE = 1,
    FRUIT = 2,
    LEFT = 0,
    UP = 1,
    RIGHT = 2,
    DOWN = 3,
    KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_RIGHT = 39,
    KEY_DOWN = 40,
    /**
     * Game objects
     */
    canvas, /* HTMLCanvas */
    ctx, /* CanvasRenderingContext2d */
    keystate, /* Object, used for keyboard inputs */
    frames, /* number, used for animation */
    score; /* number, keep track of the player score */

grid = {
    /*This holds the number of columns, rows, and array data representation*/

    width: null,
    height: null,
    _grid: null,
    /*Initiates and fills an c, x, r, grid with the value of d */
    init: function(d, c, r) {
        this.width = c;
        this.height = r;
        this._grid = [];

        for (var x = 0; x < c; x++){
            this._grid.push([]);
            for (var y = 0; y <r; y++) {
                this._grid[x].push(d);
            }
        }
    },

    set: function(val, x, y) {
        this._grid[x][y] = val;
    },

    get: function(x,y) {
        return this._grid[x][y];
    }
}
snake = {
    direction: null,
    /* number, the direction */
    last: null,
    /* Object, pointer to the last element in
                      the queue */
    _queue: null,
    /* Array<number>, data representation*/
    /**
     * Clears the queue and sets the start position and direction
     * 
     * @param  {number} d start direction
     * @param  {number} x start x-coordinate
     * @param  {number} y start y-coordinate
     */
    init: function(d, x, y) {
      this.direction = d;
      this._queue = [];
      this.insert(x, y);
    },
    /**
     * Adds an element to the queue
     * 
     * @param  {number} x x-coordinate
     * @param  {number} y y-coordinate
     */
    insert: function(x, y) {
      // unshift prepends an element to an array
      this._queue.unshift({
        x: x,
        y: y
      });
      this.last = this._queue[0];
    },
    /**
     * Removes and returns the first element in the queue.
     * 
     * @return {Object} the first element
     */
    remove: function() {
      // pop returns the last element of an array
      return this._queue.pop();
    }
  };

  /* set the food at random points in the grid unoccupied by the snake */
  function setFood() {
      var empty = [];
      //iterate through the grid to find all the empty cells
      for (var x = 0; x < grid.width; x++) {
        for (var y = 0; y < grid.height; y++) {
          if (grid.get(x, y) === EMPTY) {
            empty.push({
              x: x,
              y: y
            });
          }
        }
      }
      //choose an empty cell out of what was returned
      var randpos = empty[Math.round(Math.random() * (empty.length -1))];
  }
  /*Created the main function to start the game */

  function main() {
      // create and initate the canvas for the game
      canvas = document.createElement("canvas");
      canvas.width = COLS *20;
      canvas.height = ROWS *20;
      ctx = canvas.getContext("2d");
      //adds canvas element to the body of the document
      document.body.appendChild(canvas);
      ctx.font = "12px Arial";
      frames = 0;
      keystate{};
      //tracks keyboard input
      document.addEventListener("keydown", function(evt) {
          keystate[evt.keyCode] = true;
      });
      document.addEventListener("keyup", function(evt){
          delete keystate[evt.keyCode];
      });
      //initate the game objects and starts the game
      init();
      loop();
  }
