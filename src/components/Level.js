const Level = ({
    children, level
}) => {
    const style={
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }

    return <div style={style}>
        {children}
    </div>
}
 
export default Level;