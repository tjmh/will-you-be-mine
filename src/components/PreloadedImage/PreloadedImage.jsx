import { useEffect } from "react";

export default function PreloadedImage(props) {
    const { imageUrl } = props;

    useEffect(() => {
        if (!imageUrl) return;

        // Create a new Image object to preload
        const img = new Image();

        // Setting src triggers the browser to load/cache the image
        img.src = imageUrl;

        // Cleanup function
        return () => {
            // Abort loading if component unmounts before image loads
            img.src = "";
            img.onload = null;
            img.onerror = null;
        };
    }, [imageUrl]);

    return (
        <img src={imageUrl} alt="Will you be my Valentine?" />
    );
}