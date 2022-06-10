import './LoadingSpinner.css'
const LoadingSpinner = ()=>{
    return <div className='loading-backdrop'>
        <div className="lds-facebook"><div></div><div></div><div></div></div>
    </div>
}

export default LoadingSpinner;