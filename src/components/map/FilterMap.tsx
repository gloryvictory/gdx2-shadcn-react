import { useEffect, useRef } from 'react';
import maplibregl, { AddLayerObject, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl'; //

import { gdx2_cfg } from '@/config/cfg';
// import { layer_name_sta, layer_name_stl, layer_name_stp, sta_Layer, sta_Source, stl_Layer, stl_Source, stp_Layer, stp_Source } from '../../layers';

import 'maplibre-gl/dist/maplibre-gl.css'; // Не забудьте импортировать стили
import { layer_name_sta, layer_name_stl, layer_name_stp, sta_Layer, sta_Source, stl_Layer, stl_Source, stp_Layer, stp_Source } from './layers';
import { Console } from 'console';
import { LayerProps } from '@vis.gl/react-maplibre';
import { tableFeature } from './FeatureTablePopup';

const layer_sta = `${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`
const layer_stl = `${gdx2_cfg.gdx2_map_db}.${layer_name_stl}`
const layer_stp = `${gdx2_cfg.gdx2_map_db}.${layer_name_stp}`
console.log("layer_sta", layer_sta)

// const sta_source_id:string = sta_Source?.url!;
// const stl_source_id:string = stl_Source?.url!;
// const stp_source_id:string = stp_Source?.url!;
const sta_source_id:string = layer_sta;
const stl_source_id:string = layer_stl;
const stp_source_id:string = layer_stp;



interface FilterMapProps {
  // onChange: (value: string) => void;
  selectFilter: string
  selectList:string
}



function FilterMap({selectFilter, selectList}: FilterMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null); // Указываем тип для контейнера
  const map = useRef<maplibregl.Map | null>(null); // Указываем тип для карты

  const popup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: false,
    offset: 15
  });
  
  const nav = new maplibregl.NavigationControl({
    visualizePitch: true,
    visualizeRoll: true,
    showZoom: true,
    showCompass: true,
  })

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

    map?.current?.on('load', handleOnMapLoad) // Подписываемся на событие загрузки карты
    
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
  }, []);

  // Вызывается, когда происходит изменение выбранных значений в выпадающем списке и выбирается элемент списка
  useEffect(() => {
    if (!map?.current) return;
    // console.log(`selectFilter: ${selectFilter}, selectList: ${selectList}`)
    if (selectFilter.length && selectList.length ) {
      handleOnSelectFilterAndList(selectFilter, selectList)  
    }    
  }, [selectFilter, selectList]);  


  const handleOnMapLoad = () => {

    map?.current?.addControl(nav, 'bottom-right');
    // console.log("map?.current?.on('load', handleOnMapLoad)")
    console.log("sta_source_id", sta_source_id)

    map.current?.addSource(sta_source_id, sta_Source); // Добавляем слой  
    const sta_Layer1: LayerProps = sta_Layer! 
    map.current?.addLayer(sta_Layer1 as AddLayerObject); // Add the layer

    map.current?.addSource(stl_source_id, stl_Source); // Добавляем слой  
    const stl_Layer1: LayerProps = stl_Layer! 
    map.current?.addLayer(stl_Layer1 as AddLayerObject); // Add the layer

    map.current?.addSource(stp_source_id, stp_Source); // Добавляем слой  
    const stp_Layer1: LayerProps = stp_Layer! 
    map.current?.addLayer(stp_Layer1 as AddLayerObject); // Add the layer

    
  }

  const handleOnSelectFilterAndList = (filterValue:string, listValue:string) => {
    if (!map?.current) return;
    // console.log(`handleOnSelectFilterAndList: ${filterValue}, ${listValue}`)

    if (filterValue === 'method') {

      // console.log(`filterValue === 'sta': ${filterValue}, ${listValue}`)
      map.current.setFilter(layer_sta, ['==', ['get', 'method'], listValue]);  
      map.current.setFilter(layer_stp, ['==', ['get', 'method'], listValue]);  
      map.current.setFilter(layer_stl, ['==', ['get', 'method'], listValue]);  
      // console.log(`handleOnSelectFilterAndList: ${filterValue}, ${listValue}`)
    }
    if (filterValue === 'vid_iz') {
      map.current.setFilter(layer_sta, ['==', ['get', 'vid_iz'], listValue]);  
      map.current.setFilter(layer_stp, ['==', ['get', 'vid_iz'], listValue]);  
      map.current.setFilter(layer_stl, ['==', ['get', 'vid_iz'], listValue]);  
    }
    if (filterValue === 'god_nach') {
      map.current.setFilter(layer_sta, ['==', ['get', 'god_nach'], listValue]);  
      map.current.setFilter(layer_stp, ['==', ['get', 'god_nach'], listValue]);  
      map.current.setFilter(layer_stl, ['==', ['get', 'god_nach'], listValue]);  
    }
    if (filterValue === 'god_end') {
      map.current.setFilter(layer_sta, ['==', ['get', 'god_end'], listValue]);  
      map.current.setFilter(layer_stp, ['==', ['get', 'god_end'], listValue]);  
      map.current.setFilter(layer_stl, ['==', ['get', 'god_end'], listValue]);  
    }
    if (filterValue === 'tgf') {
      map.current.setFilter(layer_sta, ['==', ['get', 'tgf'], listValue]);  
      map.current.setFilter(layer_stp, ['==', ['get', 'tgf'], listValue]);  
      map.current.setFilter(layer_stl, ['==', ['get', 'tgf'], listValue]);  
    }
    if (filterValue === 'nom_1000') {
      map.current.setFilter(layer_sta, ['==', ['get', 'nom_1000'], listValue]);  
      map.current.setFilter(layer_stp, ['==', ['get', 'nom_1000'], listValue]);  
      map.current.setFilter(layer_stl, ['==', ['get', 'nom_1000'], listValue]);  
    }
    if (filterValue === 'scale') {
      map.current.setFilter(layer_sta, ['==', ['get', 'scale'], listValue]);  
      map.current.setFilter(layer_stp, ['==', ['get', 'scale'], listValue]);  
      map.current.setFilter(layer_stl, ['==', ['get', 'scale'], listValue]);  
    }

  }

  
    return <div ref={mapContainer} style={{ width: "100%", height: "100%", left:0  }} />;
  
}

export default FilterMap;
// width: "100vw", height: "100vh", , position:"absolute"
