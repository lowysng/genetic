import React from 'react';

function HighlightNode({ node }) {

    return (
        <>
            <h3>Node Information</h3>
            <p>Generation: {node.generation}</p>
            <p>String: [{node.state.join('')}]</p>
            <p>Fitness: {node.value}</p>
            <p>
                Immediate parents: {
                node.generation !== 1 ? 
                `[${node.parent_one.state.join('')}] ⨉ [${node.parent_two.state.join('')}]` :
                `None`}
            </p>
            <p>
                Parent fitnesses: {
                node.generation !== 1 ?
                `${node.parent_one.value},  ${node.parent_two.value}` : 
                `None`}
            </p>
            <p>
                Parent crossover point: {
                node.generation !== 1 ?
                `${node.parent_split_point} => [${node.parent_one.state.slice(0, node.parent_split_point).join('')}] + [${node.parent_two.state.slice(node.parent_split_point).join('')}]` :
                `None`}
            </p>
            <p>
                Is mutated: {node.is_mutated ? `Yes` : 'No'}
            </p>
            <p>
                Mutation point: {node.is_mutated ? `${node.mutation_point} [${node.parent_one.state.slice(0, node.parent_split_point).concat(node.parent_two.state.slice(node.parent_split_point))[node.mutation_point]}] => [${node.state[node.mutation_point]}]` : ''}
            </p>
        </>
    )
}

export default HighlightNode;