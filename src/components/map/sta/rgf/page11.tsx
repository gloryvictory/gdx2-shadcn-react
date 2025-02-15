
// import { layer_name_sta, sta_Layer, sta_Source } from '@/app/map/layers';
import { gdx2_cfg } from '@/config/cfg';
// import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {FullscreenControl, GeolocateControl, LayerProps, Map, MapInstance, MapRef, NavigationControl, ScaleControl, } from '@vis.gl/react-maplibre'; //AttributionControl  Source
import 'maplibre-gl/dist/maplibre-gl.css';
// import { LIGHT_MAP_STYLE } from '@/app/map/basemaps';
import { Spinner } from '@/components/ui/spinner';
import { LIGHT_MAP_STYLE } from '../../basemaps';
import { layer_name_sta, sta_Layer, sta_Source } from '../../layers';
import { ExpressionSpecification, AddLayerObject } from 'maplibre-gl';


const layer_sta = `${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`


export default function StaByRGF() {
  const mapRef = React.useRef<MapRef| null>(null); 
  const [isLoading, setLoading] = useState<boolean>(false)
  const [stargf,    setStargf ] = useState<string>("")
  // const [searchParams, setSearchParams] = useSearchParams();

  
  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const rgf_num1 = searchParams.get('stargf');
    
    // const rgf_num = searchParams?.get('stargf') || ''

    if (rgf_num1) {
      console.log(rgf_num1)
      setStargf(rgf_num1)
    }
  }, []);
  

  // const params = useParams();
  // const { slug } = params;
  // const rgf_num = slug?.toString();

  const onMapLoad = React.useCallback(() => {
    // if (typeof window !== "undefined" && window.localStorage) {
      
      if (!mapRef.current) return;

    if (mapRef) {
      const mapref:MapRef = mapRef.current
      
      const map:MapInstance = mapref.getMap()
      const filter: ExpressionSpecification = [       // Define the filter expression
        '==', ['get', 'in_n_rosg'],  `${stargf}`//"271433"
      ];
      
      setLoading(true)
      const sta_id:string = sta_Source?.id!;
      map?.addSource(sta_id, sta_Source); // Добавляем слой  
      const sta_Layer1: LayerProps = sta_Layer! 
      map?.addLayer(sta_Layer1 as AddLayerObject); // Add the layer
      console.log(filter)

      map?.setFilter(layer_sta, filter);
      setLoading(false)
      
    
    }
    // } //if...  
  }, []); //const onMapLoad 


  // const onMapClick = (e: MapMouseEvent & {features?: MapGeoJSONFeature[] | undefined;} & Object) => {
    // if (mapRef) {
    //   const mapref:MapRef = mapRef.current!      
    //   const map:MapInstance = mapref.getMap()
    //   // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
    //   map.on('click', layer_sta, (e) => {
    //     map.flyTo({
    //         center: e?.features[0]?.geometry?.coordinates,
    //     });
    //   });
    // }
  // }

  return (
    <>
      {isLoading && <Spinner size="lg" className="bg-black dark:bg-white -z-100" /> 
        // : <h1 className="mt-50  h-5 w-5 absolute right-[50%] left-[50%] top-5 bg-black dark:bg-white -z-100">Blog Post: {slug}</h1>
      }
      <Map
        initialViewState={{
          longitude: 66,
          latitude: 66,
          zoom: 3.5,
          bearing: 0,
          pitch: 0
        }}

        style={{ width: "100vw", height: "100vh", left:0, position:"absolute" }}
        mapStyle={LIGHT_MAP_STYLE}
        ref={mapRef}
        onLoad={onMapLoad}
        // onClick={onMapClick}
        
      >
      {/* <Source {...sta_Source}   >
        <Layer {...sta_Layer} />
      </Source>    */}

      <FullscreenControl  position="top-right"    style={{ marginRight: 10 }} />
      <GeolocateControl   position="top-right"    style={{ marginRight: 10 }}/>
      <NavigationControl  position="top-right"    style={{ marginRight: 10 }}/>
      <ScaleControl       position="bottom-right" style={{ marginRight: 10 }}/>

      </Map>


    </>
    
  );
}

      // const filteredFeatures = map.querySourceFeatures('your-source-id', {
      //   sourceLayer: 'your-source-layer-id',
      //   filter: ['==', 'property-name', 'value'],
      // });
      
      // const filteredFeatures:MapGeoJSONFeature[] = map.queryRenderedFeatures({
      //   layers: [sta_Layer],
      //   filter: ['==', ['get', 'in_n_rosg'],  `${rgf_num}`],
      // });
      // // Calculate the bounding box of the filtered features
      // const featureCollection = {
      //   type: 'FeatureCollection',
      //   features: filteredFeatures,
      // };
      // const boundingBox = bbox(featureCollection); // Returns [minX, minY, maxX, maxY]
      // map.fitBounds(
      //   [
      //     [boundingBox[0], boundingBox[1]], // Southwest coordinates
      //     [boundingBox[2], boundingBox[3]], // Northeast coordinates
      //   ],
      //   {
      //     padding: 20, // Optional padding
      //     maxZoom: 15, // Optional maximum zoom level
      //   }
      // );


      // map.addLayer( {...sta_Layer, source: {...sta_Source} });
    //   {
            
    //     source: {
    //     },
    //     paint: {
    //         'fill-color': '#888888',
    //         'fill-opacity': 0.5
    //     }
    // }
      // map?.setFilter(layer_sta, ['==', ['get', 'in_n_rosg'], slug]);
      
      // setFilter(layer_sta, ['==', ['get', 'in_n_rosg'], slug]);
      
      // const marker_table_info = new maplibregl.Marker()
      // console.log('onMapLoad')
      // map?.addControl(new MaplibreStyleSwitcherControl(basemaps_styles, basemaps_options));
      // map?.addControl(legend, 'top-right');

      // map?.on('mouseenter', layer_stp, function (e:any) {
      //   map.getCanvas().style.cursor = 'pointer';      
      //   const features = e?.features
      //   if(features && features?.length){
      //     popup.setLngLat(e.lngLat.wrap()).setHTML(`<h1>Отчетов: ${features?.length}</h1>`).addTo(map.getMap());  
      //   }
      // });

      // map?.on('mouseleave', layer_stp, function (e:any) {
      //   map.getCanvas().style.cursor = '';       
      //   popup.remove();
      // })    
      

      // map?.on('mousemove', function (e: MapLayerMouseEvent) {
      //   const ll = e.lngLat.wrap()        
      //   // setLng(  (prev) => parseFloat(ll.lng.toFixed(4)));
      //   // setLat(  (prev) => parseFloat(ll.lat.toFixed(4)));
      //   // setZoom( (prev) => parseFloat(map.getZoom().toFixed(2)));
      // });
      
        
      // map?.on('click', layer_stp, function (e:any) {
      //   const features = e?.features
      //   if(features && features?.length){
      //   }
      // });
