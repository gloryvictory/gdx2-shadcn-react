// import { useSearchParams } from 'next/navigation';
import bbox from '@turf/bbox';
import { useEffect, useRef } from 'react';
import maplibregl, { AddLayerObject, MapGeoJSONFeature } from 'maplibre-gl';
import {FullscreenControl, GeolocateControl, Layer, LayerProps, Map, MapInstance, MapRef, NavigationControl, ScaleControl, Source} from '@vis.gl/react-maplibre'; //AttributionControl
import 'maplibre-gl/dist/maplibre-gl.css'; // Не забудьте импортировать стили
import { layer_name_sta, sta_Layer, sta_Source } from '../../layers';
import { gdx2_cfg } from '@/config/cfg';
import { useSearchParams } from 'react-router-dom';
// import { LIGHT_MAP_STYLE } from '../../basemaps';
// import { useSearchParams } from 'react-router-dom';

const layer_sta = `${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`


export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null); // Указываем тип для контейнера
  const map = useRef<maplibregl.Map | null>(null); // Указываем тип для карты

  // const urlSearchString = window.location.search;
  // const params = new URLSearchParams(urlSearchString);
  // const filterParam = params.get('stargf');
  // console.log(filterParam)

  let [searchParams, setSearchParams] = useSearchParams()
  // const term = searchParams.get("term")
  const filterParam = searchParams.get("stargf")
  console.log(filterParam)
  // searchParams.
  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      // style: 'https://demotiles.maplibre.org/style.json', // Пример стиля
      center: [66, 66],
      zoom: 3
    });

    map.current.on('load', () => {
    // Add zoom and rotation controls to the map.
      map.current?.addControl(new maplibregl.NavigationControl({
        visualizePitch: true,
        visualizeRoll: true,
        showZoom: true,
        showCompass: true,

      }));
    
      if (filterParam && map.current) {
        // Применение фильтра к слою
        // map.current?.setFilter('your-layer-id', ['==', ['get', 'in_n_rosg'], filterParam ]) ;//"271433"
        const sta_id:string = sta_Source?.id!;
        map.current?.addSource(sta_id, sta_Source); // Добавляем слой  
        const sta_Layer1: LayerProps = sta_Layer! 
        map.current?.addLayer(sta_Layer1 as AddLayerObject); // Add the layer
        console.log(filterParam)
        map.current?.setFilter(layer_sta, ['==', ['get', 'in_n_rosg'], filterParam ]) ;//"271433"
        // map.current?.setFilter(layer_sta, filterParam);
        const filteredFeatures:MapGeoJSONFeature[] = map.current?.queryRenderedFeatures({layers:[layer_sta]})
        console.log(filteredFeatures)  
        // {
          // layers: [sta_Layer],
          // filter: ['==', ['get', 'in_n_rosg'], filterParam],
          // });
        // Calculate the bounding box of the filtered features
        const featureCollection = {
          type: 'FeatureCollection',
          features: filteredFeatures,
        };
        const boundingBox = bbox(featureCollection.features[0] ); // Returns [minX, minY, maxX, maxY]
        map.current?.fitBounds(
          [
            [boundingBox[0], boundingBox[1]], // Southwest coordinates
            [boundingBox[2], boundingBox[3]], // Northeast coordinates
          ],
          {
            padding: 20, // Optional padding
            maxZoom: 15, // Optional maximum zoom level
          }
        );
        }
      });

    return () => {
      if (map?.current) {
        map.current.remove(); // Удаляем карту
        map.current = null; // Сбрасываем ссылку
      }
    };
  }, [filterParam]);

  return <div ref={mapContainer} style={{ width: "100vw", height: "100vh", left:0, position:"absolute"  }} />;
}
