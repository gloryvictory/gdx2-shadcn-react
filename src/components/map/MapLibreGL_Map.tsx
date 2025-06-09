import * as React from 'react';
import {FullscreenControl, GeolocateControl, Layer, Map, MapRef, NavigationControl, ScaleControl, Source} from '@vis.gl/react-maplibre'; //AttributionControl
import 'maplibre-gl/dist/maplibre-gl.css';
import { fieldLayer, fieldSource, layer_name_stl, layer_name_stp, luLayer, luSource, sta_Layer, sta_Source, stl_Layer, stl_Source, stp_Layer, stp_Source } from './layers';

import { LIGHT_MAP_STYLE } from "./basemaps";

import maplibregl, { IControl, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl'; //MapLayerMouseEvent
import { IDataMap} from '@/types/models';
import { gdx2_cfg } from '@/config/cfg';
import TableDrawer from './TableDrawer';
import '@watergis/maplibre-gl-legend/dist/maplibre-gl-legend.css';
import { legend } from './legend';

let dataSource:IDataMap[] = []

const popup = new maplibregl.Popup({
  closeButton: true,
  closeOnClick: false,
  offset: 15
});

const popup_table_info = new maplibregl.Popup({
  closeButton: true,
  closeOnClick: false,
  offset: 45
});

// const marker_table_info = new maplibregl.Marker()
const layer_stp = `${gdx2_cfg.gdx2_map_db}.${layer_name_stp}`
const layer_stl = `${gdx2_cfg.gdx2_map_db}.${layer_name_stl}`


export default function MapLibreGL_Map() {

  // const mapRef = React.useRef<maplibregl.Map| null>(null); 
  const mapRef = React.useRef<MapRef| null>(null); 
  // const map = useRef<maplibregl.Map | null>(null); // Указываем тип для карты
  const [showTable, setShowTable] = React.useState<boolean>(false);
  const [lon, setLng]             = React.useState<number>(66);
  const [lat, setLat]             = React.useState<number>(66);
  const [zoom, setZoom]           = React.useState<number>(3.5);
  
  
  const onTableClose = () => {
    setShowTable(false);
  };

  

  const onMapLoad = React.useCallback(() => {
    // if (typeof window !== "undefined" && window.localStorage) {

    // if (typeof window !== "undefined" && window.localStorage) {

    if (mapRef) {
       // Переменная для хранения ID текущей точки под курсором
      // let hoveredPointId:number | null = null;

      const map = mapRef?.current
      const marker_table_info = new maplibregl.Marker()
      // console.log('onMapLoad')
      // map?.addControl(new MaplibreStyleSwitcherControl(basemaps_styles, basemaps_options));
       map?.addControl( legend as unknown as IControl, 'top-right');

      map?.on('mouseenter', layer_stp, function (e:  MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined; } & Object) {
        // console.log(e)
        // Изменение стиля точки при наведении
        // const map2 = mapRef?.current?.getMap()
        // map2?.setPaintProperty(layer_stp, 'circle-color', '#00FF00');
        // map2?.setPaintProperty(layer_stp, 'circle-radius', 8);

        map.getCanvas().style.cursor = 'pointer';      
        const features = e?.features
        if(features && features?.length){
          popup.setLngLat(e.lngLat.wrap()).setHTML(`<h1>Отчетов: ${features?.length}</h1>`).addTo(map.getMap());   //map.getMap()
        }
      // console.log(e)
      });
      
      // reset cursor to default when user is no longer hovering over a clickable feature
      map?.on('mouseleave', layer_stp, function (e:  MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined; } & Object) {
        // const map2 = mapRef?.current?.getMap()
        // map2?.setPaintProperty(layer_stp, 'circle-color', 'blue');
        // map2?.setPaintProperty(layer_stp, 'circle-radius', 4);
        
        // // Сбрасываем фильтр и стиль
        // if (hoveredPointId !== null) {
        //   mapRef?.current?.getMap().setFilter(layer_stp, ['!=', 'id', hoveredPointId]);
        //   mapRef?.current?.getMap().setPaintProperty(layer_stp, 'circle-color', 'blue');
        //   mapRef?.current?.getMap().setPaintProperty(layer_stp, 'circle-radius', 4);
        //   hoveredPointId = null;
        // }

        map.getCanvas().style.cursor = '';       
        popup.remove();
      })    
      
      // // Линии
      // map?.on('mouseenter', layer_stl, function (e:  MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined; } & Object) {
      //   map.getCanvas().style.cursor = 'pointer';      
      //   const features = e?.features
      //   if(features && features?.length){
      //     popup.setLngLat(e.lngLat.wrap()).setHTML(`<h1>Отчетов: ${features?.length}</h1>`).addTo(map.getMap());  
      //   }
      // // console.log(e)
      // });

      // // reset cursor to default when user is no longer hovering over a clickable feature
      // map?.on('mouseleave', layer_stl, function (e:  MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined; } & Object) {
      //   map.getCanvas().style.cursor = '';       
      //   popup.remove();
      // })    
      

      map?.on('mousemove', function ( e:  MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined; } & Object) {
        const ll = e.lngLat.wrap()        
        setLng(  (prev:number) => parseFloat(ll.lng.toFixed(4)));
        setLat(  (prev:number) => parseFloat(ll.lat.toFixed(4)));
        setZoom( (prev:number) => parseFloat(map.getZoom().toFixed(2)));
      });
      
        
      map?.on('click', layer_stp, function (e:any) {
        const features = e?.features
        if(features && features?.length){
          
          popup_table_info.setLngLat(e.lngLat.wrap()).setHTML(`<h1>"Отчетов": ${features?.length}</h1>`).addTo(map.getMap());
          marker_table_info.setLngLat(e.lngLat.wrap()).addTo(map.getMap()); // add the marker to the map;
          dataSource = []
          features.map(
            (feature:any)=>{
              const newReport:IDataMap =  {
                id: feature?.properties?.id ,
                avts:  feature.properties.avts,
                god_nach:  feature.properties.god_nach,
                god_end:  feature.properties.god_end,
                in_n_rosg:  feature.properties.in_n_rosg,
                in_n_tgf:  feature.properties.in_n_tgf,
                method:  feature.properties.method,
                n_uk_rosg:  feature.properties.n_uk_rosg,
                n_uk_tgf:  feature.properties.n_uk_tgf,
                name_otch:  feature.properties.name_otch,
                nom_1000:  feature.properties.nom_1000,
                org_isp:  feature.properties.org_isp,
                scale:  feature.properties.scale,
                tgf:  feature.properties.tgf,
                vid_iz:  feature.properties.vid_iz,
                web_uk_id:  feature.properties.web_uk_id,
              }
              dataSource.push(newReport) 

            }
          );
          setShowTable(true)

        }
      });
    
    }
    // } //if...  
  }, []); //const onMapLoad 





  return(
    <>
      <Map
        initialViewState={{
          longitude: lon,
          latitude: lat,
          zoom: zoom,
          bearing: 0,
          pitch: 0
        }}

        // style={{width: 600, height: 400}}
        style={{ width: "100vw", height: "100vh", left:0, position:"absolute" }}
        // style={{ width: '51vw', height: '80vh' }}
        // mapStyle="https://demotiles.maplibre.org/style.json"
        mapStyle={LIGHT_MAP_STYLE}
        ref={mapRef}
        onLoad={onMapLoad}
        
      >
      <Source {...fieldSource}   >
        <Layer {...fieldLayer} />
      </Source>  
      
      <Source {...luSource}   >
        <Layer {...luLayer} />
      </Source>   

      {/* <Source {...luSource}   >
        <Layer {...lu_labels_Layer} />
      </Source>   */}

      <Source {...sta_Source}   >
        <Layer {...sta_Layer} />
      </Source>   

      <Source {...stl_Source}   >
        <Layer {...stl_Layer} />
      </Source>   

      <Source {...stp_Source}   >
        <Layer {...stp_Layer} />
      </Source>   


      <FullscreenControl  position="top-right"    style={{ marginRight: 10 }} />
      <GeolocateControl   position="top-right"    style={{ marginRight: 10 }}/>
      <NavigationControl  position="top-right"    style={{ marginRight: 10 }}/>
      <ScaleControl       position="bottom-right" style={{ marginRight: 10 }}/>
      {/* <AttributionControl customAttribution="vzam" /> */}

      </Map>

      {/* <Button className='absolute bottom -z-100' variant="outline" size="icon" onClick={()=>setShowTable(true)} >
        <TableIcon/>
      </Button> */}
      {showTable && <TableDrawer  open={showTable} dataSource={dataSource} onClose={onTableClose} showDrawer={()=>setShowTable(true)} />}

    </>
  )
  
  
}


// export default function MapLibreGL_Map() {
//   return(
//   )
// }
