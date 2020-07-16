import React, { useState } from 'react';
import { Agent, genetic_algorithm, get_ancestors } from './util';
import HighlightNode from './HighlightNode';
import FitnessMatrix from './FitnessMatrix';
import './App.css';

function App() {

  const CHAR_LIMIT = 12;

  const [input, setInput] = useState('');
  const [agentReady, setAgentReady] = useState(false);
  const [agentGoal, setAgentGoal] = useState('');
  const [solution, setSolution] = useState(null);
  const [history, setHistory] = useState(null);
  const [currentHighlightNode, setCurrentHighlightNode] = useState(null);

  const handleChange = event => setInput(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();
    setAgentGoal(input);
    setAgentReady(true);
    setInput('');
    setSolution(null);
    setHistory(null);
  }

  const runGenetic = e => {
    const agent = new Agent();
    agent.set_goal(agentGoal);
    const initial_population = agent.get_successors(agent.initial_state);
    const { solution, step, history } = genetic_algorithm(initial_population, agent.fitness, 100);
    setSolution(solution);
    setCurrentHighlightNode(solution);
    setHistory(history);
  }

  const highlightNode = (id, node_generation) => {
    const node = history[node_generation - 1].find(node => node.id === id);
    setCurrentHighlightNode(node);
  }

  return (
    
    <div className="App">
      <div className="instructions">
        <h3>Optimization with Genetic Algorithm</h3>
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
        </p>
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
            Add child to the current generation pool. Repeat steps 1 - 3 until new population count reaches 
            the previous population count.
          </li>
        </ol>
        <br/>
        <form onSubmit={handleSubmit}>
          <label>
            Target word (max {CHAR_LIMIT} chars, chars allowed: <code>aZ., -?!</code>): 
            <input type="text" value={input} pattern="[A-Za-z .,!?-]*" onChange={handleChange} maxLength={CHAR_LIMIT}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
      </div>

      {agentReady && 
      <>
        <br/>
        <p>Agent ready (Goal: <code>{agentGoal}</code>)</p>
        <button onClick={runGenetic}>Run genetic algorithm</button>
        <br />
      </>}

      {solution && history &&  
        <div className="results">
          <div>
            <b>
            <p>{`Best fit solution found in generation ${history.length} (fitness score: ${solution.value})`}</p>
            <p>{`Immediate parents: [${solution.parent_one.state.join('')}] and [${solution.parent_two.state.join('')}] (with mutation: ${solution.is_mutated})`}</p>
            </b>
            <br/>
            <h3>Genetic history</h3>
            <i>Click on table entry to show more information.</i>
            <table>
              <thead>
                <tr>
                  <th>Generation count</th>
                  <th>Generation elite (fitness score)</th>
                  <th>Parent 1</th>
                  <th>Parent 2</th>
                  <th>Mutated</th>
                </tr>
              </thead>
              <tbody>
                {history.map((gen, idx) => {
                  const gen_copy = [...gen];
                  gen_copy.sort((a, b) => a.value - b.value);
                  const elite = gen_copy[0];
                  return (
                    <tr key={idx}>
                      <th>{idx + 1}</th>
                      <th onClick={() => highlightNode(elite.id, elite.generation)}>{`${elite.state.join('')} (${elite.value})`}</th>
                      {idx !== 0 ? 
                        <th onClick={() => highlightNode(elite.parent_one.id, elite.parent_one.generation)}>{`${elite.parent_one.state.join('')} (${elite.parent_one.value})`}</th> : 
                        <th>{`None`}</th>}
                      {idx !== 0 ? 
                        <th onClick={() => highlightNode(elite.parent_two.id, elite.parent_two.generation)}>{`${elite.parent_two.state.join('')} (${elite.parent_two.value})`}</th> : 
                        <th>{`None`}</th>}
                      <th>{`${elite.is_mutated}`}</th>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="highlight">
            <HighlightNode node={currentHighlightNode} />
            <FitnessMatrix history={history} currentHighlightNode={currentHighlightNode} updateHighlightNode={highlightNode}/>
          </div>
        </div>}
    </div>
  );
}

export default App;
