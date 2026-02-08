import "./EmbeddedMap.css";

export default function EmbeddedMap() {
    const apiKey = import.meta.env.VITE_GOOGLE_EMBED_API_KEY;

    return (
        <iframe
            className={`embedded-map`}
            loading="lazy"
            allowFullScreen={false}
            allowTransparency={true}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Portabella+Ocean+Ave,Carmel+By+The+Sea,+WA`}>
        </iframe>
    )
}
