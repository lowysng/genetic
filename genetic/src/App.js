import React, { useState } from 'react';
import { Agent, genetic_algorithm, get_ancestors } from './util';
import './App.css';

function App() {


  const [input, setInput] = useState('');
  const [agentReady, setAgentReady] = useState(false);
  const [agentGoal, setAgentGoal] = useState('');
  const [solution, setSolution] = useState(null);
  const [history, setHistory] = useState(null);

  const handleChange = event => setInput(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();
    setAgentGoal(input);
    setAgentReady(true);
    setInput('');
    setSolution(null);
    setHistory(null);
    console.log(input);
  }

  const runGenetic = e => {
    const agent = new Agent();
    agent.set_goal(agentGoal);
    console.log(agent.goal_state)
    const initial_population = agent.get_successors(agent.initial_state);
    const { solution, step, history } = genetic_algorithm(initial_population, agent.fitness, 100);
    setSolution(solution);
    setHistory(history);
  }

  return (
    
    <div className="App">
      <h3>Searching for Words using a Genetic Algorithm</h3>
      <p>
        Starting from an initial "population" of randomly generated strings (of equal length to target 
        word), the algorithm searches for the target word by repeatedly generating new populations that 
        are increasingly fit with time. A string is fit if it is similar to the target word in terms of 
        the sum of the distances of the corresponding letters, according to the alphabet. For instance, 
        <i> a</i> is more similar to <i>c</i> than it is to <i>z</i>. 
      </p>
      <br/>
      <b>Algorithm.</b>
      <p>
        Repeat for <i>k</i> generations, or until the target word is found. Steps for producing each 
        population generation: 
        <ol>
          <li>
            Randomly select two individuals from the current generation, weighted by their fitness (fitter 
            individuals are more likely to be selected). These are the parents.
          </li>
          <li>
            Split both parents based on a randomly determined split point. Then, combine the left half 
            of parent A with the right half of parent B, yielding the child. 
          </li>
          <li>
            Randomly mutate the child based on some independent probability. To mutate a child, replace 
            one symbol of the child with another randomly selected symbol. 
          </li>
          <li>
            Add child to the current generation pool. Repeat steps 1 - 3 until population count reaches a 
            reasonable number. 
          </li>
        </ol>
      </p>
      <br/>
      <form onSubmit={handleSubmit}>
        <label>
          Target word (max 12 chars, chars allowed: <code>aZ., -?!</code>): 
          <input type="text" value={input} pattern="[A-Za-z .,!?-]*" onChange={handleChange} maxLength="12"/>
        </label>
        <input type="submit" value="Submit"/>
      </form>
      {agentReady && 
      <>
        <br/>
        <p>Agent ready (Goal: <code>{agentGoal}</code>)</p>
        <button onClick={runGenetic}>Run genetic algorithm</button>
      </>}
      {solution && history &&  
        <div>
          <br/>
          <p><u>Results:</u></p>
          <p>{`Best fit solution found in generation ${history.length} (fitness score: ${solution.value})`}</p>
          <p>{`Immediate parents: ${solution.parent_one.state.join('')} and ${solution.parent_two.state.join('')} (with mutation: ${solution.is_mutated})`}</p>
          <br/>
          <p><u>Genetic history</u></p>
          <table>
            <tr>
              <th>Generation count</th>
              <th>Generation elite (fitness score)</th>
              <th>Parent 1</th>
              <th>Parent 2</th>
              <th>Mutated</th>
            </tr>
            {history.map((gen, idx) => {
              const gen_copy = [...gen];
              gen_copy.sort((a, b) => a.value - b.value);
              const elite = gen_copy[0];
              return (
                <tr>
                  <th>{idx + 1}</th>
                  <th>{`${elite.state.join('')} (${elite.value})`}</th>
                  <th>{idx !== 0 ? `${elite.parent_one.state.join('')} (${elite.parent_one.value})` : 'None' }</th>
                  <th>{idx !== 0 ? `${elite.parent_two.state.join('')} (${elite.parent_two.value})` : 'None' }</th>
                  <th>{`${elite.is_mutated}`}</th>
                </tr>
              )
            })}
          </table>
        </div>}
    </div>
  );
}

export default App;
