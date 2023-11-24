import React, { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router';

interface FooterComponentProps extends PropsWithChildren {
    isToolbarShown: boolean;
}

const FooterComponent: React.FC<FooterComponentProps> = (props) => {
    const navigate = useNavigate();
    
    const navigateBack = (): void => {
        navigate('/');
    };

    return <div className={`bottom-toolbar ${!props.isToolbarShown && 'hidden'}`}>
        <button className='btn btn-dark'
            onClick={navigateBack}>Exit</button>
        {props.children}
    </div>
};

export default FooterComponent;
