// import React from 'react';

// import bbox from '@turf/bbox';
import { useEffect, useRef } from 'react';
import maplibregl, { AddLayerObject, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl'; //
import { LayerProps} from '@vis.gl/react-maplibre'; //AttributionControl, FullscreenControl, GeolocateControl, Layer, Map, MapInstance, MapRef, NavigationControl, ScaleControl, Source
import 'maplibre-gl/dist/maplibre-gl.css'; // Не забудьте импортировать стили
import { layer_name_sta, layer_name_stl, layer_name_stp, sta_Layer, sta_Source, stl_Layer, stl_Source, stp_Layer, stp_Source } from '../../layers';
import { gdx2_cfg } from '@/config/cfg';
import { useSearchParams } from 'react-router-dom';
// import { LIGHT_MAP_STYLE } from '../../basemaps';

const layer_sta = `${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`
const layer_stl = `${gdx2_cfg.gdx2_map_db}.${layer_name_stl}`
const layer_stp = `${gdx2_cfg.gdx2_map_db}.${layer_name_stp}`

const popup = new maplibregl.Popup({
  closeButton: true,
  closeOnClick: false,
  offset: 15
});


let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;


export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null); // Указываем тип для контейнера
  const map = useRef<maplibregl.Map | null>(null); // Указываем тип для карты

  // console.log(window.location)

  let [searchParams, ] = useSearchParams()
  // const term = searchParams.get("term")
  const sta_rgf_SearchParam = searchParams.get("stargf")
  const stl_rgf_SearchParam = searchParams.get("stlrgf")
  const stp_rgf_SearchParam = searchParams.get("stprgf")
  // console.log(stargfSearchParam)
  // searchParams.
  const sta_source_id:string = sta_Source?.id!;
  const stl_source_id:string = stl_Source?.id!;
  const stp_source_id:string = stp_Source?.id!;

  // const [showTable, setShowTable] = React.useState<boolean>(false);
  // const [lon, setLng]             = React.useState<number>(66);
  // const [lat, setLat]             = React.useState<number>(66);
  // const [zoom, setZoom]           = React.useState<number>(3.5);
 
 
  // const handleIdle = () => {
  //   console.log('Карта полностью прогрузилась!');
  // };

  
function tableFeature(features: maplibregl.MapGeoJSONFeature[] | undefined) {
  const tableHTML = `
    <h1>Отчетов: ${features?.length}</h1>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px;">Параметр</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Значение</th>
          
        </tr>
      </thead>
      <tbody>
        ${features?.map((feature) => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Автор</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.avts}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Отчет</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.name_otch}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Организация</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.org_isp}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Год начала</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.god_nach}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Год начала</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.god_end}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Метод</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.method}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Лист</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.nom_1000}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Масштаб</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.scale}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">ТГФ</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.tgf}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Вид</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.vid_iz}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">№</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.web_uk_id}</td>
          </tr>


        `
          )
          .join('')}
      </tbody>
    </table>
  `;
  
  return( tableHTML ) 
}
  
const mapMouseEnter = ( e:  MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined; } & Object) => {
  const mystyle:CSSStyleDeclaration = map.current?.getCanvas().style!
        mystyle.cursor = 'pointer';      
      const features = e?.features
      if(features && features?.length){
        // const mymap = map.current.getMap() as maplibregl.Map
        popup.setLngLat(e.lngLat.wrap()).setHTML(tableFeature(features)).addTo( map?.current!);  
      }
      console.log(features)
}
const mapMouseLeave = ( e:  MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined; } & Object) => {
      const mystyle:CSSStyleDeclaration = map.current?.getCanvas().style!
      mystyle.cursor = '';
      popup.remove();
}
const mapMouseMove = ( e:  MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined; } & Object) => {
  // const ll = e.lngLat.wrap()        
  // setLng(  (prev:number) => parseFloat(ll.lng.toFixed(4)));
  // setLat(  (prev:number) => parseFloat(ll.lat.toFixed(4)));
  // setZoom( (prev:number) => parseFloat(map?.current?.getZoom().toFixed(2)!));
}


  useEffect(() => {
    if (map.current || !mapContainer.current) return;


    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      // style: 'https://demotiles.maplibre.org/style.json', // Пример стиля
      center: [66, 66],
      zoom: 3
    });

    // map.current.on('idle', () => {
    map.current.on('data', () => {

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
  


      }else //if (stl_rgf_SearchParam) {
      if (stp_rgf_SearchParam) {
        const filteredFeatures = map.current?.querySourceFeatures(stp_source_id, {
          sourceLayer: layer_stp, // Имя слоя в PBF
          filter: ['==', ['get', 'in_n_rosg'], stp_rgf_SearchParam] // Фильтр для поиска объекта
        });
        console.log(`Found ${filteredFeatures?.length} features`)
        filteredFeatures?.forEach(feature => {
          const geometry = feature.geometry;
          if (geometry.type === 'Point') {
            const [x, y] = geometry.coordinates as [number, number]; // Explicit type assertion
            if (x < minX) minX = x ;
            if (y < minY) minY = y ;
            if (x > maxX) maxX = x ;
            if (y > maxY) maxY = y ;
          } 
        });
        
        map?.current?.fitBounds(
          [
            [minX, minY], // Southwest coordinates
            [maxX, maxY], // Northeast coordinates
          ],
          {
            padding: 20, // Optional padding
            maxZoom: 10, // Optional maximum zoom level
          }
        );

      }//if (stp_rgf_SearchParam) {
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
        map.current?.addSource(sta_source_id, sta_Source); // Добавляем слой  
        const sta_Layer1: LayerProps = sta_Layer! 
        map.current?.addLayer(sta_Layer1 as AddLayerObject); // Add the layer
        console.log(sta_rgf_SearchParam)
        map.current?.setFilter(layer_sta, ['==', ['get', 'in_n_rosg'], sta_rgf_SearchParam ]) ;//"http://localhost:5173/map2?stargf=271433"        
        }else //Если Отчеты линейные
        if (stl_rgf_SearchParam && map.current) {
          map.current?.addSource(stl_source_id, stl_Source); // Добавляем слой  
          const stl_Layer1: LayerProps = stl_Layer! 
          map.current?.addLayer(stl_Layer1 as AddLayerObject); // Add the layer
          console.log(stl_rgf_SearchParam)
          map.current?.setFilter(layer_stl, ['==', ['get', 'in_n_rosg'], stl_rgf_SearchParam ]) ;//"http://localhost:5173/map2?stlrgf=374225"        
          }else
            if (stp_rgf_SearchParam && map.current) {
              map.current?.addSource(stp_source_id, stp_Source); // Добавляем слой  
              const stp_Layer1: LayerProps = stp_Layer! 
              map.current?.addLayer(stp_Layer1 as AddLayerObject); // Add the layer
              console.log(stp_rgf_SearchParam)
              map.current?.setFilter(layer_stp, ['==', ['get', 'in_n_rosg'], stp_rgf_SearchParam ]) ;//"http://localhost:5173/map2?stprgf=510430"        
              }

      });
      
      map.current?.on('mouseenter', layer_sta, mapMouseEnter);  
      map.current?.on('mouseenter', layer_stl, mapMouseEnter);  
      map.current?.on('mouseenter', layer_stp, mapMouseEnter);  

      map?.current?.on('mouseleave', layer_sta, mapMouseLeave )
      map?.current?.on('mouseleave', layer_stl, mapMouseLeave )
      map?.current?.on('mouseleave', layer_stp, mapMouseLeave )

      map?.current?.on('mousemove', mapMouseMove);

      
    return () => {
      if (map?.current) {
        // map.current.off('idle', handleIdle); // Отписка от события
        map.current.remove(); // Удаляем карту
        map.current = null; // Сбрасываем ссылку
      }
    };
  }, [sta_rgf_SearchParam, stl_rgf_SearchParam, stp_rgf_SearchParam]);

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

// Применение фильтра к слою
// map.current?.setFilter('your-layer-id', ['==', ['get', 'in_n_rosg'], filterParam ]) ;//"271433"


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
