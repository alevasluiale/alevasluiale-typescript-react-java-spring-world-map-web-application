import React from "react";
import TimezoneMapGL from './timezone-map-gl'
import {Provider} from './context'
import timezoneTopoJSON from '../data/timezoneTopo.json'

import {SizeMe} from 'react-sizeme';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiaHVodXJlem1hcml1cyIsImEiOiJja2hpajl1NGsxZDhtMnpvNHc5eG05b2Q0In0.5dmqX2D4zV0Xa1rW7TrCzg';

const Home: React.FC = () => {

    return (
      <div className="container" >
        <h3>Timezones Map</h3>
        <Provider value={timezoneTopoJSON}>
                        <SizeMe>
                          {({size}) => (<TimezoneMapGL
                          timezone={"Europe/Bucharest"}
                          mapboxApiAccessToken={MAPBOX_TOKEN}
                          defaultViewport={{
                            width: size.width,
                            height: 1000 / 27 * 14,
                            zoom: 1.3,
                          }}
                        />)}
                        </SizeMe>
        </Provider> 
      </div>
    );
}
export default Home
