// 'use client';
// import { useSearchParams } from 'next/navigation';
// import { useEffect, useRef } from 'react';
// import maplibregl, { AddLayerObject } from 'maplibre-gl';
// import {FullscreenControl, GeolocateControl, Layer, LayerProps, Map, MapInstance, MapRef, NavigationControl, ScaleControl, Source} from '@vis.gl/react-maplibre'; //AttributionControl
// import 'maplibre-gl/dist/maplibre-gl.css'; // Не забудьте импортировать стили
// import { layer_name_sta, sta_Layer, sta_Source } from '../../layers';
// import { gdx2_cfg } from '@/config/cfg';
// import { LIGHT_MAP_STYLE } from '../../basemaps';

// const layer_sta = `${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`


// export default function MapComponent() {
//   const mapContainer = useRef<HTMLDivElement | null>(null); // Указываем тип для контейнера
//   const map = useRef<maplibregl.Map | null>(null); // Указываем тип для карты
//   const searchParams = useSearchParams();
//   const filterParam = searchParams.get('stargf');

//   useEffect(() => {
//     if (map.current || !mapContainer.current) return;
    
//     map.current = new maplibregl.Map({
//       container: mapContainer.current,
//       style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
//       // style: 'https://demotiles.maplibre.org/style.json', // Пример стиля
//       center: [0, 0],
//       zoom: 1
//     });

//     map.current.on('load', () => {
//       if (filterParam && map.current) {
//         // Применение фильтра к слою
//         // map.current?.setFilter('your-layer-id', ['==', ['get', 'in_n_rosg'], filterParam ]) ;//"271433"
//         const sta_id:string = sta_Source?.id!;
//         map.current?.addSource(sta_id, sta_Source); // Добавляем слой  
//         const sta_Layer1: LayerProps = sta_Layer! 
//         map.current?.addLayer(sta_Layer1 as AddLayerObject); // Add the layer
//         console.log(filterParam)
//         map.current?.setFilter(layer_sta, ['==', ['get', 'in_n_rosg'], filterParam ]) ;//"271433"
//         // map.current?.setFilter(layer_sta, filterParam);
  
//       }
//     });

//     return () => {
//       if (map?.current) {
//         map.current.remove(); // Удаляем карту
//         map.current = null; // Сбрасываем ссылку
//       }
//     };
//   }, [filterParam]);

//   return <div ref={mapContainer} style={{ width: "100vw", height: "100vh", left:0, position:"absolute"  }} />;
// }
