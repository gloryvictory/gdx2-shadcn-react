import { useEffect, useRef } from 'react';
import maplibregl, { AddLayerObject, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl'; //

import { gdx2_cfg } from '@/config/cfg';
// import { layer_name_sta, layer_name_stl, layer_name_stp, sta_Layer, sta_Source, stl_Layer, stl_Source, stp_Layer, stp_Source } from '../../layers';

import 'maplibre-gl/dist/maplibre-gl.css'; // Не забудьте импортировать стили
import { layer_name_sta, layer_name_stl, layer_name_stp } from './layers';

const layer_sta = `${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`
const layer_stl = `${gdx2_cfg.gdx2_map_db}.${layer_name_stl}`
const layer_stp = `${gdx2_cfg.gdx2_map_db}.${layer_name_stp}`

function FilterMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null); // Указываем тип для контейнера
  const map = useRef<maplibregl.Map | null>(null); // Указываем тип для карты


  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      // style: 'https://demotiles.maplibre.org/style.json', // Пример стиля
      center: [66, 66],
      zoom: 3
    });

    return () => {
      if (map?.current) {
        // map.current.off('idle', handleIdle); // Отписка от события
        map.current.remove(); // Удаляем карту
        map.current = null; // Сбрасываем ссылку
      }
    };
  }, []);

  
    return <div ref={mapContainer} style={{ width: "100%", height: "100%", left:0  }} />;
  
}

export default FilterMap;
// width: "100vw", height: "100vh", , position:"absolute"
