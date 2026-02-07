export default function homeView(props) {
    const { setAgreed } = props;
    return (
        <div>
            <h1>Hello Julia Zhu</h1>
            <p>Will you be my valentine?</p>
            <button className="yes-btn" onClick={() => setAgreed(true)}>Yes</button>
            <button className="no-btn">No</button>
        </div>
    )
}
