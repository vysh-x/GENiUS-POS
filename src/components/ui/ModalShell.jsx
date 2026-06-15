import { elements } from '../../theme/elements';

const ModalShell = ({
    children,
    onClose,
    overlayClassName = elements.modalOverlay,
    panelClassName = elements.modalWrapper,
    panelStyle,
    stopPropagation = true,
}) => {
    const handleOverlayClick = () => {
        if (onClose) onClose();
    };

    const handlePanelClick = (event) => {
        if (stopPropagation) event.stopPropagation();
    };

    return (
        <div className={overlayClassName} onClick={handleOverlayClick}>
            <div className={panelClassName} style={panelStyle} onClick={handlePanelClick}>
                {children}
            </div>
        </div>
    );
};

export default ModalShell;
