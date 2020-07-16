import React from 'react';
import { alphabet_max, alphabet_min } from './util';

function FitnessMatrix({ history, currentHighlightNode, updateHighlightNode }) {

    const fitness_worst_score = (alphabet_max - alphabet_min) * history[0][0].state.length;
    const getStyles = node => {
        const style= {
            width: '7px', 
            height: '7px',
            backgroundColor: `rgba(0, 0, 0, ${node.value ** 2/ fitness_worst_score})`,
            borderCollapse: 'collapse'
        }

        if (currentHighlightNode.id === node.id) {
            style.backgroundColor = 'red';
        } 
        
        if (currentHighlightNode.generation !== 1) {
            if (currentHighlightNode.parent_one.id === node.id || currentHighlightNode.parent_two.id === node.id) {
                style.backgroundColor = 'orange';
            }
        }

        return style
    }

    return (
        <>
            <h3 style={{ marginTop: '10px' }}>Fitness Matrix</h3>
            <p>Horizontal axis denotes generation (left side of matrix shows earlier generations)</p>
            <p>Vertical axis denotes individuals (nodes within the same column are from the same generation)</p>
            <p>Lighter color denotes higher fitness score</p>
            <p><div style={{ height: '7px', width: '7px', backgroundColor: 'red', display: 'inline-block' }}></div> denotes currently selected node</p>
            <p><div style={{ height: '7px', width: '7px', backgroundColor: 'orange', display: 'inline-block' }}></div> denotes parents of currently selected node</p>
            <div className="fitness-matrix" style={{ border: '1px solid black', display: 'inline-block' }}>
                {history[0].map((_, colIndex) => history.map(row => row[colIndex])).map(gen => (
                    <div className="row" style={{ display: 'flex' }}>
                        {gen.map(node => <div className="node" onClick={() => updateHighlightNode(node.id, node.generation)} style={getStyles(node)}></div>)}
                    </div>
                ))}
            </div>
        </>
    )
}

export default FitnessMatrix;