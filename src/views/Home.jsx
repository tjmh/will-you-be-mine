import { useState, useRef, useEffect } from "react";
import PreloadedImage from "../components/PreloadedImage/PreloadedImage.jsx";

import millieUrl from "../assets/millie.png";

import "./Home.css";

export default function homeView(props) {
    const { setAgreed } = props;
    const [noButtonPos, setNoButtonPos] = useState(null);
    const [isInitiallyPositioned, setIsInitiallyPositioned] = useState(false);
    const noButtonRef = useRef(null);
    const yesButtonRef = useRef(null);

    // Check if two rectangles overlap
    const checkOverlap = (rect1, rect2) => {
        return !(rect1.right < rect2.left ||
                 rect1.left > rect2.right ||
                 rect1.bottom < rect2.top ||
                 rect1.top > rect2.bottom);
    };

    // Get a safe position that doesn't overlap the Yes button
    const getSafePosition = (x, y, noButtonRect) => {
        if (!yesButtonRef.current) return { x, y };

        const yesRect = yesButtonRef.current.getBoundingClientRect();
        const potentialNoRect = {
            left: x,
            top: y,
            right: x + noButtonRect.width,
            bottom: y + noButtonRect.height
        };

        // If no overlap, position is safe
        if (!checkOverlap(potentialNoRect, yesRect)) {
            return { x, y };
        }

        // If overlap detected, try to move away from Yes button
        const padding = 20;
        const minDistance = 20; // Minimum gap between buttons

        // Calculate center of Yes button
        const yesCenterX = yesRect.left + yesRect.width / 2;
        const yesCenterY = yesRect.top + yesRect.height / 2;
        const noCenterX = x + noButtonRect.width / 2;
        const noCenterY = y + noButtonRect.height / 2;

        // Calculate angle from Yes to No button
        const angle = Math.atan2(noCenterY - yesCenterY, noCenterX - yesCenterX);

        // Move No button away from Yes button
        const distance = Math.max(yesRect.width, yesRect.height) + minDistance;
        let newX = yesCenterX + Math.cos(angle) * distance - noButtonRect.width / 2;
        let newY = yesCenterY + Math.sin(angle) * distance - noButtonRect.height / 2;

        // Keep within viewport bounds
        newX = Math.max(padding, Math.min(newX, window.innerWidth - noButtonRect.width - padding));
        newY = Math.max(padding, Math.min(newY, window.innerHeight - noButtonRect.height - padding));

        return { x: newX, y: newY };
    };

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

        // Try multiple times to find a non-overlapping position
        let attempts = 0;
        let safePos = null;

        while (attempts < 10) {
            const randomX = Math.random() * (window.innerWidth - buttonRect.width - padding * 2) + padding;
            const randomY = Math.random() * (window.innerHeight - buttonRect.height - padding * 2) + padding;

            safePos = getSafePosition(randomX, randomY, buttonRect);

            // Check if the safe position is actually safe
            if (!yesButtonRef.current) break;

            const yesRect = yesButtonRef.current.getBoundingClientRect();
            const finalRect = {
                left: safePos.x,
                top: safePos.y,
                right: safePos.x + buttonRect.width,
                bottom: safePos.y + buttonRect.height
            };

            if (!checkOverlap(finalRect, yesRect)) break;
            attempts++;
        }

        if (safePos) {
            setNoButtonPos(safePos);
        }
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

                // Make sure the new position doesn't overlap the Yes button
                const safePos = getSafePosition(newX, newY, buttonRect);
                setNoButtonPos(safePos);
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

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
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

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="julia-view home-view">
            <h1>Hello Julia Zhu</h1>
            <PreloadedImage imageUrl={millieUrl} />
            <p className="julia-medium-text">Will you be my Valentine ? 🌹</p>
            <p className="julia-small-text">From Michael not Millie</p>
            <div className="button-container">
                <div className="button-cell">
                    <button ref={yesButtonRef} className="julia-btn julia-medium-text yes-btn" onClick={() => setAgreed(true)}>Yes 😊</button>
                </div>
                <div className="button-cell">
                    <button
                        ref={noButtonRef}
                        className="julia-btn julia-medium-text no-btn"
                        onMouseDown={moveToRandomPosition}
                        onTouchStart={moveToRandomPosition}
                        style={noButtonPos ? {
                            position: "fixed",
                            left: 0,
                            top: 0,
                            transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                            transition: isInitiallyPositioned ? "transform 0.2s ease-out" : "none",
                            willChange: "transform"
                        } : {
                            visibility: "hidden"
                        }}
                    >
                        No 😔
                    </button>
                </div>
            </div>
        </div>
    )
}
