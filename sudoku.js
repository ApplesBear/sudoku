"use strict"

function s() {
  let head = document.querySelector("#header");
  let field = document.querySelector(".sudoku");
  let cells = document.querySelectorAll(".cell");
  let number = document.querySelector("#numbers");
  let rows = [];   
  let columns = [];
  let squares = [];
  let repeat = false;
  let zeroCells = [];
  let solution;
  let constZeroCells = [];
  let constFixedCells = [];
  let numbers = document.querySelectorAll(".number");
  let targetCell;


  head.addEventListener("click", function() {
    field.classList.toggle("hidden");
    number.classList.toggle("hidden");
   if(freeField()) {
     fillS();
   } else if(!freeField()) {
     for(let s = 0; s < cells.length; s++) {
       cells[s].innerHTML = "";
       cells[s].classList.remove("win", "zeroes", "selRow", "selCol", "selSqu", "selTarget", "error", "targetNumber");
     }  
   } 
  }) 

  //check start (free field)
  function freeField() {
    let zero = [];
    for(let i = 0; i < cells.length; i++) {
      if(cells[i].innerHTML === "") {
        zero.push(cells[i]);
      }
    }
    if(zero.length === cells.length) {
      return true;
    } else {
      return false;
    }
  }
  
  //style on click
  cells.forEach( function(cell) {
  cell.addEventListener('click', function(evt) {
      
      //define target cell
      for(let i = 0; i < cells.length; i++) {
        cells[i].index = i;
      }
      let current = evt.target.index; 
          
      //remove previous click effects
      cells.forEach( function(cell) {
          cell.classList.remove("selRow", "selCol", "selSqu", "selTarget");
      });  
       
      // square style
      function selectSquare() {
        let square = [];
        let sC = current + 1;
        if(sC % 3 === 1 % 3) {
            square.push(cells[sC], cells[sC+1]);
            letSquare(sC, sC+1);             
        } else if(sC % 3 === 2 % 3) {
            square.push(cells[sC-2], cells[sC]);
            letSquare(sC-2, sC);
        } else if(sC % 3 === 0) {
            square.push(cells[sC-3], cells[sC-2]);
            letSquare(sC-3, sC-2);
        }

        function letSquare(x, z) {
        let y = z - x;
        for(let res = x+9; res < 27 
          || (x > 26 && res < 54) 
          || (x > 53 && res < 81); res += 9) {
          square.push(cells[res], cells[res+y]);
        }
        for(let res = x-9; res >= 54
          || (x < 54 && res >= 27) 
          || (x < 27 && res >= 0); res -= 9) {
          square.push(cells[res], cells[res+y]);
        }
        }

        square.forEach( function(squ) {
          squ.classList.add("selSqu");
      });
      }
    selectSquare();

      //row style
      function selectRow() {
        let rows = [];
        for(let r = current-1; (r % 9 !== 8 % 9) && r >= 0; r--) {
            rows.push(cells[r]);
        }
        for(let r = current+1; r % 9 !== 0; r++) {
            rows.push(cells[r]);
        }
        rows.forEach( function(row) {
            row.classList.add("selRow");
        }); 
      }
      selectRow();
      
      //column style
      function selectColumn() {
        let column = [];
        for(let c = current+9; c <= 80; c += 9) {
            column.push(cells[c]);
        }
        for(let c = current-9; c >= 0; c -= 9) {
            column.push(cells[c]);
        }
        column.forEach( function(col) {
            col.classList.add("selCol");
        });
      }
      selectColumn();
      
      
      //target cell style
      evt.target.classList.add("selTarget");

      field.addEventListener('click', function(rep) {
        cells.forEach(function(cell) {
          cell.classList.remove("targetNumber");
        })
        for(let i = 0; i < cells.length; i++){
          if(rep.target.innerHTML !== "" && rep.target.innerHTML === cells[i].innerHTML) {
            cells[i].classList.add("targetNumber");
           }
         }
      })

  });
})
  //let arrays
  function letArrays() {
  function letRows() {
    for(let j = 0; j < 9; j++) {
      let x = [];
      for(let i = 0; i < 9; i++) {
        x.push(cells[i + 9*j]);
      }
      rows[j] = x;
    }
  }
  letRows();
  function letColumns() {
    for(let j = 0; j < 9; j++) {
      let x = [];
      for(let i = 0; i < 9; i++) {
        x.push(rows[i][j]);
      }
      columns[j] = x;
    }
  }
  letColumns();
  function letSquares() {
    for(let j = 0; j < 9; j++) {
      let x = [];
      for(let i = 0; i < 3; i++) {
        for(let n = 0; n < 3; n++) {
          if(j < 3){
            x.push(rows[0 + i][n + j*3]);
          } else if(j < 6) {
            x.push(rows[3 + i][n + (j-3)*3]);
          } else if(j < 9) {
            x.push(rows[6 + i][n + (j-6)*3]);
          }
        } 
      }
      squares[j] = x;
    }
  }
  letSquares();
  }
  letArrays();
  
  //no-repeat condition
  function noRepeats() {
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        for(let g = 0; g < 9; g++) {
          if(j !== g) {
            if((rows[i][j].innerHTML !== "") && (rows[i][j].innerHTML === rows[i][g].innerHTML)) {
              repeat = true;
              return true;
            } else if((columns[i][j].innerHTML !== "") && (columns[i][j].innerHTML === columns[i][g].innerHTML)) {
              repeat = true;
              return true;
            } else if((squares[i][j].innerHTML !== "") && (squares[i][j].innerHTML === squares[i][g].innerHTML)) {
              repeat = true;
              return true;
            } else {
              repeat = false;
            }
          } 
        }
      }
    }
  }

  // random
  function randomize(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random()*(max - min)) + min;
  }

  function fillSudoku() {
    for(let i = 1; i < 10; i++) {
      for(let j = 0; j < 9; j++) {
        let x = randomize(0, 9);
        let curr = rows[j][x];
        while(curr.innerHTML !== "") {
          x = randomize(0, 9);
          curr = rows[j][x];
        }
        curr.innerHTML = i;
        let loop = 0;
        while(noRepeats()) {
          curr.innerHTML = "";
          if(loop > 20) {
            break;
          }
          x = randomize(0, 9);
          curr = rows[j][x];
          while(curr.innerHTML !== "") {
            x = randomize(0, 9);
            curr = rows[j][x];
          }
          curr.innerHTML = i;
          loop++
        }
      }
    }
    
  }

  function checkFill() {
    for(let i = 0; i < cells.length; i++) {
      let x = cells[i]
      if(x.innerHTML === "") {
        cells.forEach(function(cell) {
          cell.innerHTML = "";
        })
        return true;
      } 
    }
  }

  function fillS() {
    while(checkFill()) {
      fillSudoku();
    }
    deleteNumbers();
    letConsts();
    forFixedCells();
    addNumbers();
  }

  function solve(inner) {
    solution = 0;
    for(let i = 0; i < zeroCells.length; i++) {
      zeroCells[i].innerHTML = inner;
      noRepeats();
      if(!repeat) {
        solution++;
      }
      zeroCells[i].innerHTML = "";
    }
    if(solution > 1) {
      return true;
    } else {
      return false;
    }
  }

  function deleteNumbers() {
    zeroCells.length = 0;
    let i;
    let inn;
    let loop = 0;
    while(loop < 25) {
      i = randomize(0, cells.length);
      inn = cells[i].innerHTML;
      if(cells[i].innerHTML !== "") {
        cells[i].innerHTML = "";
        for(let j = 0; j < cells.length; j++) {
          if(cells[j].innerHTML === "") {
            zeroCells.push(cells[j]);
          }
        }
        if(solve(inn)) {
          cells[i].innerHTML = inn;
        }
        loop++;
      }
    }
  }
  
  function letConsts() {
    for(let i = 0; i < cells.length; i++) {
      if(cells[i].innerHTML === "") {
        constZeroCells.push(cells[i]);
        cells[i].classList.add("zeroes");
      } else {
        constFixedCells.push(cells[i]);
      }
    }
  }


  function forFixedCells() {
    for(let i = 0; i < constFixedCells.length; i++) {
      constFixedCells[i].addEventListener("click", function() {
        targetCell = undefined;
      })
    }
  }

  function addNumbers() {
    for(let i = 0; i < constZeroCells.length; i++) {
      constZeroCells[i].addEventListener("click", function(addNum) {
        targetCell = addNum.target;
        win();
        useNumbers();
      })
    }
  }

  function useNumbers() {
    numbers.forEach(function(number) {
      number.addEventListener("click", function(getValue) {
        targetCell.innerHTML = getValue.target.innerHTML;
        if(getValue.target.innerHTML === "DEL") {
          targetCell.innerHTML = "";
        }
        if(noRepeats() !== true) {
          repeat = false;
        }
        for(let i = 0; i < cells.length; i++) {
          cells[i].classList.remove("error", "targetNumber");
          if(cells[i] !== targetCell) {
            if(cells[i].innerHTML !== "" && cells[i].innerHTML === targetCell.innerHTML) {
              cells[i].classList.add("targetNumber");
            }
          }
        }
        noRepeats2();
        win();
      })
    })
  }

  function noRepeats2() {
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        for(let g = 0; g < 9; g++) {
                    if(j !== g) {
            if((rows[i][j].innerHTML !== "") && (rows[i][j].innerHTML === rows[i][g].innerHTML)) {
              repeat = true;
              rows[i][j].classList.add("error");
              rows[i][g].classList.add("error");
            } 
            if((columns[i][j].innerHTML !== "") && (columns[i][j].innerHTML === columns[i][g].innerHTML)) {
              repeat = true;
              columns[i][j].classList.add("error");
              columns[i][g].classList.add("error");
            } 
            if((squares[i][j].innerHTML !== "") && (squares[i][j].innerHTML === squares[i][g].innerHTML)) {
              repeat = true;
              squares[i][j].classList.add("error");
              squares[i][g].classList.add("error");
            } else {repeat = false;}
          } 
        }
      }
    }
  }

  function winCheck() {
    for(let i = 0; i < cells.length; i++) {
      let x = cells[i];
      if(x.innerHTML === "") {
        return false;
      } 
    }
    if(!noRepeats()) {
      return true;
    }
  }

  function win() {
  if(!winCheck()) {
    for(let s = 0; s < cells.length; s++) {
      cells[s].classList.remove("win");
    }
    return false;
  }
  if(winCheck()) {
    letConsts();
    forFixedCells();
    for(let s = 0; s < cells.length; s++) {
      cells[s].classList.add("win");
    }
    return true;
  }
}
}
s();
