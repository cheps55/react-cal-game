const Block = ({
    id, type = 'enemy', hp, allowDrop = false, 
    playerOnChange
}) => {
    const commonStyle={
        border:'1px solid black',
        width: '50px',
        height: '50px',
        background: type === 'player' ? 'blue' : 'red',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white', 
        fontSize: '30px'
    }

    const drag = (e) => {
        e.dataTransfer.setData('player', e.target.innerText);
    }

    const drop = (e) => {
        e.preventDefault();
        var data = e.dataTransfer.getData('player');
        let finalPlayerHp = Number(data) + Number(e.target.innerText)
        e.target.innerText = finalPlayerHp;
        if (typeof playerOnChange === 'function') playerOnChange({
            hp: finalPlayerHp,
            position: id,
            level: Number(id.split('-')[0])
        });
    }

    const setAllowDrop = (e) => {
        e.preventDefault();
    }

    if (type === 'empty') {
        return <div id={id} style={{...commonStyle, background: 'rgba(0,0,0,0)'}}></div>
    }

    return <div id={id} style={commonStyle} draggable={type === 'player'} 
        onDragStart={drag} onDrop={drop} onDragOver={allowDrop ? setAllowDrop : null}
    >
        {hp}
    </div>
}
 
export default Block;