"use client"

import { useEffect } from 'react';


// interface ChampionDetailsProps {
//     name: string;
// }

function ChampionInfo( {
    params,
}: {
    params: {name: string};
} ) {
    // Use name to fetch and display champion details
    // useEffect(() => {
    //     // Fetch champion details using name
    // }, [name]);

    return (
        <div>
            {/* Display champion details */}
            <h1>Champion Details for {params.name}</h1>
        </div>
    );
}

export default ChampionInfo;