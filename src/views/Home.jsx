import { useState, useRef, useEffect } from "react";

export default function homeView(props) {
    const { setAgreed } = props;
    const [noButtonPos, setNoButtonPos] = useState(null);
    const [isInitiallyPositioned, setIsInitiallyPositioned] = useState(false);
    const noButtonRef = useRef(null);

    const resetToInitialPosition = (isFirstTime = false) => {
        if (!noButtonRef.current) return;

        if (isFirstTime) {
            // On first mount, directly capture position without delay
            const rect = noButtonRef.current.getBoundingClientRect();
            setNoButtonPos({
                x: rect.left,
                y: rect.top
            });
            // Enable transitions after a brief delay to ensure position is set
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsInitiallyPositioned(true);
                });
            });
        } else {
            // On resize, temporarily remove fixed positioning to get natural position
            setNoButtonPos(null);
            setIsInitiallyPositioned(false);

            requestAnimationFrame(() => {
                if (noButtonRef.current) {
                    const rect = noButtonRef.current.getBoundingClientRect();
                    setNoButtonPos({
                        x: rect.left,
                        y: rect.top
                    });
                    requestAnimationFrame(() => {
                        setIsInitiallyPositioned(true);
                    });
                }
            });
        }
    };

    // Capture initial position on mount and set button to fixed positioning
    useEffect(() => {
        resetToInitialPosition(true);
    }, []);

    const moveToRandomPosition = () => {
        if (!noButtonRef.current) return;

        const buttonRect = noButtonRef.current.getBoundingClientRect();
        const padding = 20;

        // Generate random position within viewport bounds
        const randomX = Math.random() * (window.innerWidth - buttonRect.width - padding * 2) + padding;
        const randomY = Math.random() * (window.innerHeight - buttonRect.height - padding * 2) + padding;

        setNoButtonPos({ x: randomX, y: randomY });
    };

    useEffect(() => {
        let rafId = null;
        let lastMouseEvent = null;

        const updateButtonPosition = () => {
            if (!lastMouseEvent || !noButtonRef.current || !noButtonPos) {
                rafId = null;
                return;
            }

            const e = lastMouseEvent;
            const buttonRect = noButtonRef.current.getBoundingClientRect();
            const buttonCenterX = buttonRect.left + buttonRect.width / 2;
            const buttonCenterY = buttonRect.top + buttonRect.height / 2;

            // Calculate distance between mouse and button center
            const deltaX = e.clientX - buttonCenterX;
            const deltaY = e.clientY - buttonCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Proximity threshold in pixels
            const proximityThreshold = 100;

            if (distance < proximityThreshold) {
                // Calculate direction to move away from mouse
                const angle = Math.atan2(deltaY, deltaX);
                const moveDistance = 150;

                // Calculate new absolute position (moving away from mouse)
                let newX = buttonCenterX - Math.cos(angle) * moveDistance;
                let newY = buttonCenterY - Math.sin(angle) * moveDistance;

                // Keep button within viewport bounds (with padding)
                const padding = 20;
                newX = Math.max(padding, Math.min(newX, window.innerWidth - buttonRect.width - padding));
                newY = Math.max(padding, Math.min(newY, window.innerHeight - buttonRect.height - padding));

                setNoButtonPos({ x: newX, y: newY });
            }

            rafId = null;
        };

        const handleMouseMove = (e) => {
            lastMouseEvent = e;

            // Only schedule a new frame if one isn't already scheduled
            if (rafId === null) {
                rafId = requestAnimationFrame(updateButtonPosition);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
        };
    }, [noButtonPos]);

    // Handle window resize - reset to initial position
    useEffect(() => {
        const handleResize = () => {
            resetToInitialPosition();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="julia-view home-view">
            <h1>Hello Julia Zhu</h1>
            <p>Will you be my valentine?</p>
            <div className="button-container">
                <div className="button-cell">
                    <button className="julia-btn yes-btn" onClick={() => setAgreed(true)}>Yes 😊</button>
                </div>
                <div className="button-cell">
                    <button
                        ref={noButtonRef}
                        className="julia-btn no-btn"
                        onClick={moveToRandomPosition}
                        style={noButtonPos ? {
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                            transition: isInitiallyPositioned ? 'transform 0.2s ease-out' : 'none',
                            willChange: 'transform'
                        } : {
                            visibility: 'hidden'
                        }}
                    >
                        No 😔
                    </button>
                </div>
            </div>
        </div>
    )
}
