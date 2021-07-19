import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import {useReducer} from 'react';
function App() {
  const HeaderText = styled.h1`
    text-align: center;
  `
  return (
    <div>
      <header>
        <HeaderText>Tic tac toe in React</HeaderText>
      </header>
      <Game
        />
    </div>
  );
}

export default App;

function generateGrid(rows, colums, mapper) {
  return Array(rows).fill().map(() => {
    return Array(colums).fill().map(mapper);
  })
}
const newTicTacToe = () => generateGrid(3,3, () => null);
const initialState = {
  grid: newTicTacToe(),
  turn: 'X',
  status: 'InProgress'
}
const NEXT_TURN = {
  'O': 'X',
  'X': 'O'
}
const clone = x => JSON.parse(JSON.stringify(x));

function checkThree(a, b, c) {
  if(!a || !b || !c) return false;
  return a == b && b== c;
}

function flattenArray(arr) {
  return arr.reduce((acc, curr) => [...acc,...curr], [])
}
function checkForDraw(grid) {
  let flatGrid =flattenArray(grid);
  return !checkForWin(grid) && 
    flatGrid.filter(Boolean).length === flatGrid.length
}
function checkForWin(grid) {
  const [ne, n , nw, e, c, w, se, s, sw] =flattenArray(grid);
  return (
    checkThree(nw, n, ne) ||
    checkThree(w, c, e) ||
    checkThree(sw, s, se) ||
    checkThree(nw, w, sw) ||
    checkThree(n, c, s) ||
    checkThree(ne, e, se) ||
    checkThree(nw, c, se) ||
    checkThree(ne, c, sw)
  )
}
const reducer = (state, action) => {
  if(state.status == "success" && action.type!= "RESET") {
    return state;
  }
  switch(action.type) {
    case 'RESET': 
      return initialState;
    case 'CLICK':
      const {x,y } = action.payload;
      const {turn, grid} = state;
      if(grid[y][x]) {
        return state;
      }
      const nextState = clone(state);
      nextState.grid[y][x] =  turn;
      if(checkForWin(nextState.grid)) {
       nextState.status = 'success';
       return nextState;
      }
      if(checkForDraw(nextState.grid) ){
        return initialState;
      }
      nextState.turn = NEXT_TURN[turn];
      return nextState;
    default: 
      return state;
  }
}



function Game() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {grid, status, turn} = state;
  const onHandleClick = (x ,y) => {
    dispatch({type: "CLICK", payload: {x, y}})
  }
  const onHandleReset = () => {
    dispatch({type: "RESET"})
  }
  const Heading = styled.h1`
    text-align: center;
  `
  const PageHeader = styled.div`
    display: grid;
    max-width: 300px;
    margin: 0 auto;
    margin-bottom: 20px;
    
  `
  const HeadText = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
  `;
  return <div>
    <Heading>Game</Heading>
    <div>
      <PageHeader>
        <HeadText>
          <div>
            <div> Next Turn {turn} </div>
            <div>status : {status == "success" ? `${turn} won`: 'Playing'}</div>
          </div>
          <button type="button" onClick={onHandleReset}>Reset</button>
        </HeadText>
      </PageHeader>
      <Grid 
        grid={grid}
        onHandleClick= {onHandleClick} />
    </div>
  </div>
}
function Grid({grid , onHandleClick}) {
  const GridContainer = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
  `
  const Grid = styled.div`
    background: #444;
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2px;
  `

  return(<GridContainer>
    <Grid >
      {grid.map((row, rowIdx) => 
        row.map((value, colIdx) => {
          return <Cell 
            onClick={() => {
              onHandleClick(colIdx, rowIdx)
            }}
            key={`${colIdx}-${rowIdx}`} 
            value ={value}/>
        })
      )}
    </Grid>
  </GridContainer>

  )
}
function Cell({onClick, value}) {
  const Cell = styled.div`
    background: white;
    width: 100px;
    height: 100px;
  `
  const Button = styled.button`
    width: 100%;
    height: 100%
  `
  return (<Cell>
      <Button type="button" onClick={onClick}>
        {value}
      </Button>
    </Cell>)
}
