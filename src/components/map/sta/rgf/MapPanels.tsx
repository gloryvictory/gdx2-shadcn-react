import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { useEffect, useRef, useState } from 'react';
import maplibregl, { AddLayerObject, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl'; //
import { LayerProps} from '@vis.gl/react-maplibre'; //AttributionControl, FullscreenControl, GeolocateControl, Layer, Map, MapInstance, MapRef, NavigationControl, ScaleControl, Source
import 'maplibre-gl/dist/maplibre-gl.css'; // Не забудьте импортировать стили
import { layer_name_sta, layer_name_stl, layer_name_stp, sta_Layer, sta_Source, stl_Layer, stl_Source, stp_Layer, stp_Source } from '../../layers';
import { gdx2_cfg } from '@/config/cfg';
import { useSearchParams } from 'react-router-dom';
// import { tableFeature } from "../tableFeature";
import { FeatureTable } from './FeatureTable';
import { tableFeature } from "../../FeatureTablePopup";


// import { tableFeature } from '../../tableFeature';
// import { LIGHT_MAP_STYLE } from '../../basemaps';

const layer_sta = `${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`
const layer_stl = `${gdx2_cfg.gdx2_map_db}.${layer_name_stl}`
const layer_stp = `${gdx2_cfg.gdx2_map_db}.${layer_name_stp}`

const popup = new maplibregl.Popup({
  closeButton: true,
  closeOnClick: false,
  closeOnMove: false,
  offset: 15
});


let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
export function MapPanels() {
  const mapContainer = useRef<HTMLDivElement | null>(null); // Указываем тип для контейнера
  const map = useRef<maplibregl.Map | null>(null); // Указываем тип для карты
  const [selectedFeatures, setSelectedFeatures] = useState<MapGeoJSONFeature[]>([]); // Инициализация пустым массивом

  let [searchParams, ] = useSearchParams()
  const sta_rgf_SearchParam = searchParams.get("stargf")
  const stl_rgf_SearchParam = searchParams.get("stlrgf")
  const stp_rgf_SearchParam = searchParams.get("stprgf")
  const sta_source_id:string = sta_Source?.id!;
  const stl_source_id:string = stl_Source?.id!;
  const stp_source_id:string = stp_Source?.id!;


  const mapMouseEnter = ( e:  MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined; } & Object) => {
    const mystyle:CSSStyleDeclaration = map.current?.getCanvas().style!
          mystyle.cursor = 'pointer';      
        const features = e?.features
        if(features && features?.length){
          popup.setLngLat(e.lngLat.wrap()).setHTML(tableFeature(features)).addTo( map?.current!);  
          if (e.features && e.features.length > 0) {
            setSelectedFeatures(e.features || []); // Всегда устанавливаем массив (даже пустой)
          }
        }
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

  const handleMapClick = (e:  MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined; } & Object) => {
    
    console.log("clicked")
    console.log(e.features)

    if (e.features && e.features.length > 0) {
      setSelectedFeatures(e.features || []); // Всегда устанавливаем массив (даже пустой)
    }
  };


  
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      // style: 'https://demotiles.maplibre.org/style.json', // Пример стиля
      center: [66, 66],
      zoom: 3
    });

    map.current.on('data', () => {
      if (sta_rgf_SearchParam) {
        const filteredFeatures = map.current?.querySourceFeatures(sta_source_id, {
          sourceLayer: layer_sta, // Имя слоя в PBF
          filter: ['==', ['get', 'in_n_rosg'], sta_rgf_SearchParam] // Фильтр для поиска объекта
        });
        // console.log(`Found ${filteredFeatures?.length} features`)
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
        // console.log(`Found ${filteredFeatures?.length} features`)
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
        // console.log(`Found ${filteredFeatures?.length} features`)
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
    map.current?.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        visualizeRoll: true,
        showZoom: true,
        showCompass: true,
      }), 
      'bottom-right', // Позиционирование
    );
    
      if (sta_rgf_SearchParam && map.current) {
        map.current?.addSource(sta_source_id, sta_Source); // Добавляем слой  
        const sta_Layer1: LayerProps = sta_Layer! 
        map.current?.addLayer(sta_Layer1 as AddLayerObject); // Add the layer
        // console.log(sta_rgf_SearchParam)
        map.current?.setFilter(layer_sta, ['==', ['get', 'in_n_rosg'], sta_rgf_SearchParam ]) ;//"http://localhost:5173/map2?stargf=271433"        
        }else //Если Отчеты линейные
        if (stl_rgf_SearchParam && map.current) {
          map.current?.addSource(stl_source_id, stl_Source); // Добавляем слой  
          const stl_Layer1: LayerProps = stl_Layer! 
          map.current?.addLayer(stl_Layer1 as AddLayerObject); // Add the layer
          // console.log(stl_rgf_SearchParam)
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
      map.current.on('click', handleMapClick);

      
    return () => {
      if (map?.current) {
        map.current.remove(); // Удаляем карту
        map.current = null; // Сбрасываем ссылку
      }
    };
  }, [sta_rgf_SearchParam, stl_rgf_SearchParam, stp_rgf_SearchParam]);




  return (
    // rounded-lg border overflow-hidden
    <div className="fixed inset-0 mt-20"> 
    <ResizablePanelGroup direction="horizontal" className="w-full h-full">
      {/* Content слева (75%) */}
      <ResizablePanel defaultSize={60} minSize={60}>
        <div className="flex h-full items-center justify-center bg-gray-200">
          <div ref={mapContainer} style={{ width: "100vw", height: "100vh", left:0,   }} />;
          {/* <span className="font-semibold">Content (75%)</span> */}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Sidebar справа (25%) */}
      <ResizablePanel defaultSize={40} minSize={25}>
      <div className="flex flex-col h-full p-4 bg-gray-100 overflow-auto dark:bg-slate-800">
            <h2 className="font-semibold text-lg mb-4 dark:text-slate-200">
              Атрибуты отчетов ({selectedFeatures.length})
            </h2>
            
            {selectedFeatures.length > 0 ? (
              <div className="space-y-4">
                {selectedFeatures.map((feature, index) => (
                  <FeatureTable 
                    key={index} 
                    feature={feature} 
                    index={index} 
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-slate-400">
                Выберите объект на карте для отображения атрибутов
              </p>
            )}
          </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
  )
}


{/* {tableFeature(features)} */}
