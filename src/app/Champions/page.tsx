"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';

import ChampionImage from '../../components/championImage';

import '../../styles/champion.css';

export default function Champions() {
    // Define the Champion interface
    interface Champion {
        id: string;
        name: string;
    }
    
    // Define the ChampionInfo interface that is from data from api
    interface ChampionInfo {
        
        version: string;
        data: Record<string, Champion>; // Represents an object with string keys and Champion values
    }

    // Declare the state variable with its type
    const [championData, setChampionData] = useState<{ id: string; name: string }[]>([]);
    const [baseVersion, setBaseVersion] = useState<string>("");

    useEffect(() => {
        // Fetch champion data from api 
        fetch('https://ddragon.leagueoflegends.com/cdn/14.7.1/data/en_US/champion.json') 
            .then(response => response.json())
            .then((data: ChampionInfo) => {
                const champions: { id: string; name: string }[] = [];
                for (const championId in data.data) {
                    const champion = data.data[championId];
                    champions.push({
                        id: champion.id,
                        name: champion.name
                    });
                }
                setChampionData(champions); // Set championData state
                setBaseVersion(data.version); // Set baseVersion state
            })
            .catch(error => console.error('Error fetching champion data:', error));
    }, []);

    return (
        <div>
            <div className='header'>
                <input className="search-input-box" type="text" />
                <button className='search-button'>Search</button>
            </div>
            <div>
                <div className='all-champions'>
                    <div className='champion-header'>
                        <h1 className="champion-info-header">Champions</h1>
                        <div className='champion-header-mini'>
                            <div>
                                Click Champion for More Info 
                            </div>
                            <div>
                                Patch: {baseVersion}
                            </div>
                        </div>
                    </div>
                    <div className='champion-container'>
                        {championData.map(champion => (
                            <Link
                              key={champion.name}
                              href={{
                                pathname: `/Champions/${encodeURIComponent(champion.name)}`,
                                query: { name: champion.name } // Pass the name prop here
                              }}
                            >
                                <div className='champ-name-icon'>
                                    <div className='champ-name'>
                                        {champion.name}
                                    </div>
                                    <div className="champion-face">
                                        <ChampionImage champion={champion} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}