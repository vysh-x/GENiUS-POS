const defaultClassName = "w-13 h-13 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-lg shadow-blue-600/30";

const IconBadge = ({ icon: Icon, className = defaultClassName, size = 26 }) => {
    if (!Icon) return null;

    return (
        <div className={className}>
            <Icon size={size} />
        </div>
    );
};

export default IconBadge;
