import React from 'react';
import ReactDOM from 'react-dom';

export default function wait_init(root) {
  ReactDOM.render(<div className="waiting">Waiting For Other Player</div>, root);
}
