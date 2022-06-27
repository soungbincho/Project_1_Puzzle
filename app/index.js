//

const closing = document.querySelector('#close')
const reset  = document.querySelector('#reset')
const li = document.querySelector('ul')

let ul = document.querySelectorAll('li');

const letters= ["A", "B", "C", "D", "E", "F", "G", "H", ""]


const isCorrect = (solution, content) => {
    if(JSON.stringify(solution) == JSON.stringify(content)) return true;
    return false;
}


const dragstart_handler = (event) => {
    event.dataTransfer.setData("text/plain", event.target.id)
    event.dataTransfer.dropEffect = "move";
}
const dragover_handler = (event) => {
    event.preventDefault();
}


const drop_handler = (event) => {
    event.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const data = event.dataTransfer.getData("text/plain");
    event.target.innerText = document.getElementById(data).innerText;
    
    // once dropped, unempty the cell :)
    event.target.classList.remove("empty")
    event.target.setAttribute("ondrop", "");
    event.target.setAttribute("ondragover", "");
    document.getElementById(data).innerText = "";

    // get new state after dropping
    state.content = getState(ul);
    // get new dimention from the state after dropping
    state.dimension = getDimension(state);
}

const removeDroppable = (items) => {
    items.forEach((item) => {
        item.setAttribute("ondrop", "");
        item.setAttribute("ondragover", "");
        item.setAttribute("draggable", "false");
        item.setAttribute("ondragstart", "");
        item.setAttribute("ondragend", "");
    })
}

const dragend_handler = ev => {
    // Remove all of the drag data
    ev.dataTransfer.clearData();
    // remove all droppable attributes
    removeDroppable(document.querySelectorAll('li'));
  
    // set new droppable and draggable attributes
    setDroppable(document.querySelectorAll('li'));
    setDraggable(document.querySelectorAll('li'))

    if(isCorrect(letters, state.content)) {
        showModal();
    }
  }

  const showModal = () => {
    document.getElementById('message').innerText = "You Won!";
    document.getElementById('log').classList.remove("hide");

}

const hideWin = () => {
    document.getElementById('log').classList.add("hide");
}


//


//
const getEmptyCell = () => {
    const emptyCellNumber = state.emptyCellIndex+1;
    const emptyCellRow = Math.ceil(emptyCellNumber/3);
    const emptyCellCol = 3 - (3 * emptyCellRow - emptyCellNumber);
    // emptyCellRow holds the actual row number the empty tile falls into in a 9-cell grid
    // the array index will be one less than its value. Same goes for emptyCellCol
    return [emptyCellRow-1, emptyCellCol-1]
}

//


function setUp() {

    //empty out if there exists


    let shuffled = shuffle(letters);

    ul.forEach((ul, i) => {
        ul.innerText = shuffled[i];
    })
    for(let i = 0; i < ul.length; i++) {
        ul[i].setAttribute("id", `li${i}`)
    }

    state.content = getState(ul);
    state.dimension = getDimension(state);

 // set up the droppable and dragabble contents
    setDroppable(ul) ;
    setDraggable(ul);
    
}

const state = {}
state.content = letters;


/**
 * Getters
 */
 const getState = (cells) => {
    const content = [];
    cells.forEach((item, i) => {
        content.push(item.innerText)
    });
    return content;
}

const getDimension = (state) => {
    let j = 0;
    let arr = [];
    const content = state.content
    for(let i = 0; i < 3; i++) {
        arr.push(content.slice(j, j+3));
        j+=3;
    }
 
    return arr;
}

/**
 * setters
*/
const setDroppable = (items) => {
    items.forEach((item, i) => {
        if(!item.innerText) {
            state.emptyCellIndex = i;
            item.setAttribute("ondrop", "drop_handler(event);");
            item.setAttribute("ondragover", "dragover_handler(event);");
            item.setAttribute("class", "empty");
        }
        return;
    })
}
//able to move only the empty cell

const setDraggable = (cells) => {
    const [row, col] = getEmptyCell();

    let L,R,B,T = null;
    if(state.dimension[row][col-1]) L = state.dimension[row][col-1];
    if(state.dimension[row][col+1]) R = state.dimension[row][col+1];

    if(state.dimension[row-1] != undefined) T = state.dimension[row-1][col];
    if(state.dimension[row+1] != undefined) B = state.dimension[row+1][col];


    // make its right and left dragabble
    cells.forEach(item => {
        if(item.innerText == L || 
            item.innerText == R || 
            item.innerText == B ||
            item.innerText == T) {
                item.setAttribute("draggable", "true");
                item.setAttribute("ondragstart", "dragstart_handler(event)");
                item.setAttribute("ondragend", "dragend_handler(event)")
            }
        
    })
}


//helper function to shuffle
const shuffle = (arr) => {
    const copy = arr;
    // loop over the array
    for(let i = 0; i < copy.length; i++) {
        // for each index,i pick a random index j 
        let j = parseInt(Math.random()*copy.length);
        // swap elements at i and j
        let temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }   
    return copy;
 }

 //to check whether it's solvable
 const isSolvable = (arr) => {
    let inv = 0;
    // get the number of inversions
    for(let i =0; i<arr.length; i++){
        // i picks the first element
        for(let j = i+1; j < arr.length; j++) {
            // check that an element exist at index i and j, then check that element at i > at j
            if((arr[i] && arr[j]) && arr[i] > arr[j]) inv++;
        }
    }
    // if the number of inversions is even
    // the puzzle is solvable
    return (inv % 2 == 0);
}







document.addEventListener('DOMContentLoaded', ()=>{
    setUp();
})

closing.addEventListener('click', hideWin )
reset.addEventListener('click', setUp)