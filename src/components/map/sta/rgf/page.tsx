// import { useSearchParams } from 'next/navigation';
import bbox from '@turf/bbox';
import { useEffect, useRef } from 'react';
import maplibregl, { AddLayerObject, MapGeoJSONFeature } from 'maplibre-gl';
import {FullscreenControl, GeolocateControl, Layer, LayerProps, Map, MapInstance, MapRef, NavigationControl, ScaleControl, Source} from '@vis.gl/react-maplibre'; //AttributionControl
import 'maplibre-gl/dist/maplibre-gl.css'; // Не забудьте импортировать стили
import { layer_name_sta, layer_name_stl, sta_Layer, sta_Source, stl_Layer, stl_Source } from '../../layers';
import { gdx2_cfg } from '@/config/cfg';
import { useSearchParams } from 'react-router-dom';
// import { LIGHT_MAP_STYLE } from '../../basemaps';
// import { useSearchParams } from 'react-router-dom';
import { AllGeoJSON } from '@turf/helpers';

const layer_sta = `${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`
const layer_stl = `${gdx2_cfg.gdx2_map_db}.${layer_name_stl}`


let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;


export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null); // Указываем тип для контейнера
  const map = useRef<maplibregl.Map | null>(null); // Указываем тип для карты

  // console.log(window.location)

  let [searchParams, setSearchParams] = useSearchParams()
  // const term = searchParams.get("term")
  const sta_rgf_SearchParam = searchParams.get("stargf")
  const stl_rgf_SearchParam = searchParams.get("stlrgf")
  // console.log(stargfSearchParam)
  // searchParams.
  const sta_source_id:string = sta_Source?.id!;
  const stl_source_id:string = stl_Source?.id!;


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

      // let filteredFeatures: GeoJSONFeature[] | undefined

      console.log(`${sta_source_id} loaded!!!`)
      if (sta_rgf_SearchParam) {
        const filteredFeatures = map.current?.querySourceFeatures(sta_source_id, {
          sourceLayer: layer_sta, // Имя слоя в PBF
          filter: ['==', ['get', 'in_n_rosg'], sta_rgf_SearchParam] // Фильтр для поиска объекта
        });
        console.log(`Found ${filteredFeatures?.length} features`)
        if (filteredFeatures && filteredFeatures?.length > 0 ) {
          // Calculate the bounding box of the filtered features
          const featureCollection = {
            type: 'FeatureCollection',
            features: filteredFeatures,
          };
          // const boundingBox = bbox(featureCollection); // Returns [minX, minY, maxX, maxY]
          filteredFeatures.forEach(feature => {
            const geometry = feature.geometry;
            if (geometry.type === 'Point') {
              const [x, y] = geometry.coordinates as [number, number]; // Explicit type assertion
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
              geometry.coordinates.forEach(ring => {
                ring.forEach(coord => {
                  if (Array.isArray(coord) && coord.length === 2) { // Type guard
                    const [x, y] = coord as [number, number]; // Explicit type assertion
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                  }
                });
              });
            }
          });
          
          map?.current?.fitBounds(
            [
              [minX, minY], // Southwest coordinates
              [maxX, maxY], // Northeast coordinates
            ],
            {
              padding: 20, // Optional padding
              maxZoom: 15, // Optional maximum zoom level
            }
          );
        }
      } //if (stargfSearchParam) {
      else //если отчеты линейные 
      if (stl_rgf_SearchParam) {
        const filteredFeatures = map.current?.querySourceFeatures(stl_source_id, {
          sourceLayer: layer_stl, // Имя слоя в PBF
          filter: ['==', ['get', 'in_n_rosg'], stl_rgf_SearchParam] // Фильтр для поиска объекта
        });
        console.log(`Found ${filteredFeatures?.length} features`)
        filteredFeatures?.forEach(feature => {
          const geometry = feature.geometry;
        
        if (geometry.type === 'LineString') {
            // Handle LineString geometry
            geometry.coordinates.forEach(coord => {
              if (Array.isArray(coord) && coord.length === 2) {
                const [x, y] = coord as [number, number];
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
              }
            });
          } else if (geometry.type === 'MultiLineString') {
            // Handle MultiLineString geometry
            geometry.coordinates.forEach(line => {
              line.forEach(coord => {
                if (Array.isArray(coord) && coord.length === 2) {
                  const [x, y] = coord as [number, number];
                  if (x < minX) minX = x;
                  if (y < minY) minY = y;
                  if (x > maxX) maxX = x;
                  if (y > maxY) maxY = y;
                }
              });
            });
          } 
      
          map?.current?.fitBounds(
            [
              [minX, minY], // Southwest coordinates
              [maxX, maxY], // Northeast coordinates
            ],
            {
              padding: 20, // Optional padding
              maxZoom: 15, // Optional maximum zoom level
            }
          );


        });
  


      }

      // filteredFeatures.forEach(feature => {
      //   const geometry = feature.geometry;
      
      //   if (geometry.type === 'Point') {
      //     // Handle Point geometry
      //     const [x, y] = geometry.coordinates as [number, number];
      //     if (x < minX) minX = x;
      //     if (y < minY) minY = y;
      //     if (x > maxX) maxX = x;
      //     if (y > maxY) maxY = y;
      //   } else if (geometry.type === 'LineString') {
      //     // Handle LineString geometry
      //     geometry.coordinates.forEach(coord => {
      //       if (Array.isArray(coord) && coord.length === 2) {
      //         const [x, y] = coord as [number, number];
      //         if (x < minX) minX = x;
      //         if (y < minY) minY = y;
      //         if (x > maxX) maxX = x;
      //         if (y > maxY) maxY = y;
      //       }
      //     });
      //   } else if (geometry.type === 'MultiLineString') {
      //     // Handle MultiLineString geometry
      //     geometry.coordinates.forEach(line => {
      //       line.forEach(coord => {
      //         if (Array.isArray(coord) && coord.length === 2) {
      //           const [x, y] = coord as [number, number];
      //           if (x < minX) minX = x;
      //           if (y < minY) minY = y;
      //           if (x > maxX) maxX = x;
      //           if (y > maxY) maxY = y;
      //         }
      //       });
      //     });
      //   } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
      //     // Handle Polygon and MultiPolygon geometries
      //     geometry.coordinates.forEach(ring => {
      //       ring.forEach(coord => {
      //         if (Array.isArray(coord) && coord.length === 2) {
      //           const [x, y] = coord as [number, number];
      //           if (x < minX) minX = x;
      //           if (y < minY) minY = y;
      //           if (x > maxX) maxX = x;
      //           if (y > maxY) maxY = y;
      //         }
      //       });
      //     });
      //   }
      // });
      
      // map.fitBounds(
      //   [
      //     [minX, minY], // Southwest coordinates
      //     [maxX, maxY], // Northeast coordinates
      //   ],
      //   {
      //     padding: 20, // Optional padding
      //     maxZoom: 15, // Optional maximum zoom level
      //   }
      // );



    });


    map.current.on('load', () => {
    // Add zoom and rotation controls to the map.
      map.current?.addControl(new maplibregl.NavigationControl({
        visualizePitch: true,
        visualizeRoll: true,
        showZoom: true,
        showCompass: true,

      }));
    
      if (sta_rgf_SearchParam && map.current) {
        // Применение фильтра к слою
        // map.current?.setFilter('your-layer-id', ['==', ['get', 'in_n_rosg'], filterParam ]) ;//"271433"
        map.current?.addSource(sta_source_id, sta_Source); // Добавляем слой  
        const sta_Layer1: LayerProps = sta_Layer! 
        map.current?.addLayer(sta_Layer1 as AddLayerObject); // Add the layer
        console.log(sta_rgf_SearchParam)
        map.current?.setFilter(layer_sta, ['==', ['get', 'in_n_rosg'], sta_rgf_SearchParam ]) ;//"http://localhost:5173/map2?stargf=271433"        
        }else //Если Отчеты линейные
        if (stl_rgf_SearchParam && map.current) {
          // Применение фильтра к слою
          // map.current?.setFilter('your-layer-id', ['==', ['get', 'in_n_rosg'], filterParam ]) ;//"271433"
          map.current?.addSource(stl_source_id, stl_Source); // Добавляем слой  
          const stl_Layer1: LayerProps = stl_Layer! 
          map.current?.addLayer(stl_Layer1 as AddLayerObject); // Add the layer
          console.log(stl_rgf_SearchParam)
          map.current?.setFilter(layer_stl, ['==', ['get', 'in_n_rosg'], stl_rgf_SearchParam ]) ;//"http://localhost:5173/map2?stargf=271433"        
          }



      });
      

    return () => {
      if (map?.current) {
        map.current.remove(); // Удаляем карту
        map.current = null; // Сбрасываем ссылку
      }
    };
  }, [sta_rgf_SearchParam, stl_rgf_SearchParam]);

  return <div ref={mapContainer} style={{ width: "100vw", height: "100vh", left:0, position:"absolute"  }} />;
}

// так переходим по конкретной координате
//   const boundingBox = bbox(features[0] )
//   map.current?.flyTo({
//             center: [boundingBox[0], boundingBox[1]],
//             zoom: 5, // Уровень масштабирования
//             speed: 1.2, // Скорость анимации
//             curve: 1.42 // Кривизна траектории
//         });




    // const geometry = features[0].geometry as maplibregl.Point; // Приведение типа
    // const coordinates = geometry.coordinates; // Теперь TypeScript знает, что это Point
    // // Перемещение карты к объекту
    // map.current?.flyTo({
    //     center: coordinates,
    //     zoom: 10, // Уровень масштабирования
    //     speed: 1.2, // Скорость анимации
    //     curve: 1.42 // Кривизна траектории
    // });


// Получение объектов, соответствующих фильтру
// let features = map.current?.querySourceFeatures(sta_source_id, { sourceLayer: sta_Layer.id  });
// console.log(`Found ${features.length} features`)
// if (features.length > 0) {
//     const boundingBox = bbox(features[0] )
//     map.current?.flyTo({
//         center: [boundingBox[0], boundingBox[1]],
//         zoom: 10, // Уровень масштабирования
//         speed: 1.2, // Скорость анимации
//         curve: 1.42 // Кривизна траектории
//     });
// }
