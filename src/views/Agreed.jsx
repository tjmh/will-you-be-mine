import EmbeddedMap from "../components/EmbeddedMap/EmbeddedMap.jsx";

import "./Agreed.css";

export default function agreedView() {
    return (
        <div className="julia-view agreed-view">
            <h1>Yay!</h1>
            <p className="julia-medium-text">I'll see you at Portabella's in Carmel 😊</p>
            <p className="julia-small-text">Location: Ocean Ave, Carmel-By-The-Sea, CA 93921</p>
            <EmbeddedMap />
        </div>
    )
}