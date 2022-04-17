import { useEffect, useState } from 'react';
import Block from './Block';
import Level from './Level';
import localStyles from './Screen.module.css';

const Screen = () => {
    const totalLevels = 9;
    const playerInitHp = 5;
    const initLive = 3;

    const initialState = {
        hp: playerInitHp,
        position: '0-0',
        level: 0,
        live: initLive
    }

    const [player, setPlayer] = useState(initialState);
    const { hp: playerHp, position: playerPosition, level: playerLevel, live} = player;
    
    const [enemyList, setEnemyList] = useState({});
    const [eliminatedEnemyList, setEliminatedEnemyList] = useState([]);
    const [hasWin, setHasWin] = useState(false);

    useEffect(() => {
        generateEnemyHp();
    }, [])

    useEffect(() => {
        if (eliminatedEnemyList.length > 0 &&
            Object.keys(enemyList).length> 0 &&
            eliminatedEnemyList.length === Object.keys(enemyList).length) {
            setHasWin(true);
        }
    }, [eliminatedEnemyList.length])

    const generateEnemyHp = () => {
        let enemys = {};
        let accuminatePlayerHp = playerInitHp;
        (Array.from(Array(totalLevels).keys())).forEach((level) => {
            let levelEnemyTotalHp = accuminatePlayerHp - 1;

            for(let index = 0; index < level; index++) {
                let enemyHp = Math.floor(Math.random() * (levelEnemyTotalHp - 1) + 1 * level);
                enemys[level + '-' + index] = enemyHp;
                accuminatePlayerHp += enemyHp;
            }
        })
        
        setEnemyList(enemys);
    }

    const playerStatusonChange = (data) => {
        const { hp, position, level } = data;
        setPlayer(prevState => ({
            ...prevState,
            hp: hp,
            position: position,
            level: level < prevState.level ? prevState.level : level
        }))
        setEliminatedEnemyList(prevState => ([ ...prevState, position ]))
    }

    const liveOnChange = (live) => {
        setPlayer(prevState => ({ ...prevState, live: prevState.live + live}))
    }

    const generateBlock = (levelNum) => {
        // Player initial location
        if (levelNum === 0 && playerPosition === '0-0') {
            return <Block type='player' hp={playerHp} />
        }

        return (Array.from(Array(levelNum).keys())).map((item, index) => {
            let enemyPosition = levelNum + '-' + index;

            // Replace enemy with player when player moved
            if (playerPosition === enemyPosition) {
                return <Block key={index} type='player' hp={playerHp} />
            }

            return <Block id={enemyPosition} key={index} 
                type={eliminatedEnemyList.includes(enemyPosition) ? 'empty' : 'enemy'}
                hp={enemyList[enemyPosition]}
                allowDrop={playerLevel + 1 >= levelNum}
                playerOnChange={playerStatusonChange}
                liveOnChange={liveOnChange}
            />
        })
    }

    const restartGame = () => {
        setPlayer(initialState);
        generateEnemyHp();
        setEliminatedEnemyList([]);
        setHasWin(false);
    }

    return <div className={localStyles.container}>
        {
            (live > 0 && !hasWin)
            ? <>
                <div className={localStyles.displayLive}>{live} / {initLive}</div>
                <div style={{gridTemplateColumns: `repeat(${totalLevels}, 1fr)`}} className={localStyles.gameScreen}>
                {
                    (Array.from(Array(totalLevels).keys())).map((item, index) => {
                        return <Level key={index} level={index}>
                            {generateBlock(index)}
                        </Level>    
                    })
                }
                </div>
            </>
            : <div className={localStyles.msgContainer}>
                <div>{hasWin ? 'You has win' : 'Game Over'}</div>
                <button onClick={restartGame}>{hasWin ? 'Restart' : 'Retry'}</button>
            </div>  
        }
    </div>
}
 
export default Screen;