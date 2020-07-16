import React from 'react';
import Tree from 'react-tree-graph';
import './App.css';

function TreeVisualizer({ data, handleClick }) {
    return (
        <div className="custom-container">
            <Tree
            data={data}
            height={300}
            width={1000}
            keyProp="id"
            gProps={{
                onClick: handleClick
            }}
            svgProps={{
                className: 'custom',
            }}/>
        </div>
    )
}

export default TreeVisualizer;