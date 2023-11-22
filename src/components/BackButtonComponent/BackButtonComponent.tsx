import React, { Children, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router';

interface BackButtonComponentProps extends PropsWithChildren {
    isToolbarShown: boolean;
}

const BackButtonComponent: React.FC<BackButtonComponentProps> = (props) => {
    const navigate = useNavigate();
    
    const navigateBack = (): void => {
        navigate('/');
    };

    return <div className={`bottom-toolbar ${!props.isToolbarShown && 'hidden'}`}>
        <button onClick={navigateBack}>Exit</button>
        {props.children}
    </div>
};

export default BackButtonComponent;
