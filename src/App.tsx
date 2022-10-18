import './App.css';

function App() {
    return (
        <div className="App">
            <h1>Graph Traversal Visualizer</h1>
            <div className="flex">
                <button>PLAY</button>
                <button className="danger">RESET</button>
            </div>
            <div className="grid">
                {Array.from(Array(400).keys()).map((value) => (
                    <div key={value} className="item" />
                ))}
            </div>
        </div>
    );
}

export default App;
