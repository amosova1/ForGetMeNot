import React, { useEffect, useRef } from 'react';

export const Modal = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Close modal if click is outside the modal content
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose(); // Close modal when clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Cleanup
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-10">
            <div
                ref={modalRef} // Reference to modal content
                className="p-10 bg-[var(--clr-surface-a10)] rounded-xl"
            >
                {/*<button className="close-btn" onClick={onClose}>*/}
                {/*    X*/}
                {/*</button>*/}
                {children}
            </div>
        </div>
    );
};