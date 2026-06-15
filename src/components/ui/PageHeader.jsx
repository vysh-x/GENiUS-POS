import { elements } from '../../theme/elements';
import IconBadge from './IconBadge';

const PageHeader = ({
    icon,
    title,
    subtitle,
    actions,
    iconClassName,
    iconSize = 26,
    titleClassName = "text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white",
    className = elements.pageHeader,
    children,
}) => {
    return (
        <header className={className}>
            <div className="flex items-center gap-4">
                <IconBadge icon={icon} className={iconClassName} size={iconSize} />
                <div>
                    <h1 className={titleClassName}>{title}</h1>
                    {subtitle && <p className={elements.statSubtitle}>{subtitle}</p>}
                    {children}
                </div>
            </div>
            {actions}
        </header>
    );
};

export default PageHeader;
