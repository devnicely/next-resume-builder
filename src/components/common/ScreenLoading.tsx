import LoadingSpinner from "./LoadingSpinner"

type Props = {
    title?: string
}

const ScreenLoading: React.FC<Props> = ({title}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
            <span>{title}</span>
            <LoadingSpinner />
        </div>
    )
}

export default LoadingSpinner;