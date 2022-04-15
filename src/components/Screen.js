import { useEffect, useState } from 'react';
import Block from './Block';
import Level from './Level';

const Screen = () => {
    const TotalLevels = 9;
    const playerInitHp = 5;

    const style={
        border:'1px solid black',
        width: '700px',
        height: '450px',
        margin: '28px auto',
        display: 'grid',
        gridTemplateColumns: `repeat(${TotalLevels}, 1fr)`
    }

    const initialState = {
        hp: playerInitHp,
        position: '0-0',
        level: 0
    }

    const [player, setPlayer] = useState(initialState);
    const { hp: playerHp, position: playerPosition, level: playerLevel} = player;
    
    const [enemyList, setEnemyList] = useState({});
    const [eliminatedEnemyList, setEliminatedEnemyList] = useState([]);

    useEffect(() => {
        generateEnemyHp();
    }, [])

    const generateEnemyHp = () => {
        let enemys = {};
        let accuminatePlayerHp = playerInitHp;
        (Array.from(Array(TotalLevels).keys())).forEach((level) => {
            let levelEnemyTotalHp = accuminatePlayerHp - 1;
            (Array.from(Array(level).keys())).forEach((item, index) => {

                
                let enemyHp = Math.floor(Math.random() * (levelEnemyTotalHp - 1) + 1);
                enemys[level+'-'+index] = enemyHp;
                accuminatePlayerHp += enemyHp;
            })
        })
        
        setEnemyList(enemys);
    }

    const playerStatusonChange = (data) => {
        const { hp, position, level } = data;
        setPlayer(prevState => ({
            hp: hp,
            position: position,
            level: level < prevState.level ? prevState.level : level
        }))
        setEliminatedEnemyList(prevState => ([
            ...prevState, position
        ]))
    }

    const generateBlock = (levelNum) => {
        let totalLevelHp = playerInitHp;

        // Player initial location
        if (levelNum === 0 && playerPosition === '0-0') {
            return <Block type='player' hp={playerHp} />
        }

        return (Array.from(Array(levelNum).keys())).map((item, index) => {
            let enemyPosition = levelNum + '-' + index;

            if (playerPosition === enemyPosition) {
                return <Block key={index} type='player' hp={playerHp} />
            }

            return <Block id={enemyPosition} key={index} 
                type={eliminatedEnemyList.includes(enemyPosition) ? 'empty' : 'enemy'}
                hp={enemyList[enemyPosition]}
                allowDrop={playerLevel + 1 >= levelNum}
                playerOnChange={playerStatusonChange}
            />
        })
    }

    return <div style={style}>
        {
            (Array.from(Array(TotalLevels).keys())).map((item, index) => {
                return <Level key={index} level={index}>
                    {generateBlock(index)}
                </Level>    
            })
        }
    </div>
}
 
export default Screen;