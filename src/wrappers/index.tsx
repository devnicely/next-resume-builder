import FontWrapper from './FontWrapper';

const WrapperRegistry: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => (
    <FontWrapper>
        <>{children}</>
    </FontWrapper>
);

export default WrapperRegistry;
