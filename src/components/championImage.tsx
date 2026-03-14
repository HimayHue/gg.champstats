import React from 'react';
import Image from 'next/image';

interface Champion {
    id: string;
    name: string;
    // Add other properties if needed
}

interface ChampionImageProps {
    champion: Champion;
}

const ChampionImage: React.FC<ChampionImageProps> = ({ champion }) => {
  return (
    <Image
      src={`https://static.bigbrain.gg/assets/lol/riot_static/14.7.1/img/champion/${champion.id}.png`}
      alt={`${champion.name} from League of Legends`}
      width={100}
      height={100}
      className='champion-image'
    />
  );
};

export default ChampionImage;