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
  console.log(window.location)

  let [searchParams, setSearchParams] = useSearchParams()
  // const term = searchParams.get("term")
  const filterParam = searchParams.get("stargf")
  console.log(filterParam)
  // searchParams.
  const sta_source_id:string = sta_Source?.id!;


  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      // style: 'https://demotiles.maplibre.org/style.json', // Пример стиля
      center: [66, 66],
      zoom: 3
    });

    map.current.on('idle', () => {

      console.log(`loaded!!!`)
      // let features = map.current?.querySourceFeatures(sta_source_id, { sourceLayer: sta_Layer.id  });
      // console.log(`Found ${features?.length} features`)

      if (filterParam) {
        const features = map.current?.querySourceFeatures(sta_source_id, {
          sourceLayer: layer_sta, // Имя слоя в PBF
          filter: ['==', ['get', 'in_n_rosg'], filterParam] // Фильтр для поиска объекта
        });
        console.log(`Found ${features?.length} features`)
        if (features && features?.length > 0 ) {
          const boundingBox = bbox(features[0] )
          map.current?.flyTo({
                    center: [boundingBox[0], boundingBox[1]],
                    zoom: 5, // Уровень масштабирования
                    speed: 1.2, // Скорость анимации
                    curve: 1.42 // Кривизна траектории
                });
        }
      }
      
      // if (features?.length > 0) {

      //     // Получение координат первого найденного объекта
      //     // const coordinates = features[0].geometry?.coordinates;

      //     const boundingBox = bbox(features[0] )
      //     // map.current?.fitBounds(
      //     //   [
      //     //     [boundingBox[0], boundingBox[1]], // Southwest coordinates
      //     //     [boundingBox[2], boundingBox[3]], // Northeast coordinates
      //     //   ],
      //     //   {
      //     //     padding: 20, // Optional padding
      //     //     maxZoom: 15, // Optional maximum zoom level
      //     //   }
      //     // );
      //     map.current?.flyTo({
      //         center: [boundingBox[0], boundingBox[1]],
      //         zoom: 10, // Уровень масштабирования
      //         speed: 1.2, // Скорость анимации
      //         curve: 1.42 // Кривизна траектории
      //     });
      //   }
      // });
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
        map.current?.addSource(sta_source_id, sta_Source); // Добавляем слой  
        const sta_Layer1: LayerProps = sta_Layer! 
        map.current?.addLayer(sta_Layer1 as AddLayerObject); // Add the layer
        console.log(filterParam)
        map.current?.setFilter(layer_sta, ['==', ['get', 'in_n_rosg'], filterParam ]) ;//"271433"
        
        // Получение объектов, соответствующих фильтру
        // let features = map.current?.queryRenderedFeatures({ layers: [sta_Layer.id,] });
        let features = map.current?.querySourceFeatures(sta_source_id, { sourceLayer: sta_Layer.id  });
        // const features = map.current?.querySourceFeatures(sta_source_id, {
        //   sourceLayer: layer_sta, // Имя слоя в PBF
        //   filter: ['==', ['get', 'in_n_rosg'], filterParam] // Фильтр для поиска объекта
        // });
        console.log(`Found ${features.length} features`)
        if (features.length > 0) {

            // Получение координат первого найденного объекта
            // const coordinates = features[0].geometry?.coordinates;

            const boundingBox = bbox(features[0] )
            // map.current?.fitBounds(
            //   [
            //     [boundingBox[0], boundingBox[1]], // Southwest coordinates
            //     [boundingBox[2], boundingBox[3]], // Northeast coordinates
            //   ],
            //   {
            //     padding: 20, // Optional padding
            //     maxZoom: 15, // Optional maximum zoom level
            //   }
            // );
            map.current?.flyTo({
                center: [boundingBox[0], boundingBox[1]],
                zoom: 10, // Уровень масштабирования
                speed: 1.2, // Скорость анимации
                curve: 1.42 // Кривизна траектории
            });
            // const geometry = features[0].geometry as maplibregl.Point; // Приведение типа
            // const coordinates = geometry.coordinates; // Теперь TypeScript знает, что это Point
            // // Перемещение карты к объекту
            // map.current?.flyTo({
            //     center: coordinates,
            //     zoom: 10, // Уровень масштабирования
            //     speed: 1.2, // Скорость анимации
            //     curve: 1.42 // Кривизна траектории
            // });
        }
        // map.current?.setFilter(layer_sta, filterParam);
        // const filteredFeatures:MapGeoJSONFeature[] = map.current?.queryRenderedFeatures({layers:[layer_sta]})
        // console.log(filteredFeatures)  
        // {
          // layers: [sta_Layer],
          // filter: ['==', ['get', 'in_n_rosg'], filterParam],
          // });
        // Calculate the bounding box of the filtered features
        // const featureCollection = {
        //   type: 'FeatureCollection',
        //   features: filteredFeatures,
        // };
        // const boundingBox = bbox(featureCollection.features[0] ); // Returns [minX, minY, maxX, maxY]
        // map.current?.fitBounds(
        //   [
        //     [boundingBox[0], boundingBox[1]], // Southwest coordinates
        //     [boundingBox[2], boundingBox[3]], // Northeast coordinates
        //   ],
        //   {
        //     padding: 20, // Optional padding
        //     maxZoom: 15, // Optional maximum zoom level
        //   }
        // );
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
