import { elements } from '../../theme/elements';

const AuthPanel = ({ children, className = elements.modalWrapper }) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

export default AuthPanel;
