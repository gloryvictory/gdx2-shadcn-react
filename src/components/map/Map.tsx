// 'use client'

// /* global document */
// import * as React from 'react';
// import {createRoot} from 'react-dom/client';
// // import Map, {Marker} from 'react-map-gl/maplibre';


// import { useCallback, useRef, useState } from "react";
// // import Map, { Marker } from 'react-map-gl/maplibre'; // <- mind the updated import
// // import ReactMapGL, {FullscreenControl} from 'react-map-gl';

// import type {FillLayer, MapInstance, MapRef} from 'react-map-gl/maplibre';
// // import Map, { AttributionControl, NavigationControl, ScaleControl } from "react-map-gl/maplibre";
// import Map, {Layer, Marker} from 'react-map-gl/maplibre';

// // import {Source, Layer, MapMouseEvent, MapLib, FullscreenControl} from 'react-map-gl';
// // import {Source, Layer, FullscreenControl, GeolocateControl, NavigationControl, ScaleControl, AttributionControl,  MapMouseEvent,  IControl} from 'react-map-gl';
// import { fieldLayer, fieldSource, luLayer, luSource, sta_Layer, sta_Source } from "./layers";
// // import maplibregl from 'maplibre-gl';

// // import '@watergis/maplibre-gl-legend/dist/maplibre-gl-legend.css';
// import 'maplibre-gl/dist/maplibre-gl.css';

// // import './gMap.css';
// import { LIGHT_MAP_STYLE } from "./basemaps";


// const initialValueLocation = {
//   latitude: 61.86,
//   longitude: 74.08,
//   zoom: 2,
//   bearing: 0,
//   pitch: 0
// };

// // var nav = new maplibregl.NavigationControl({
// //   showCompass: true,
// //   showZoom: true,
// //   visualizePitch: true,
// // });


// // var nav = new maplibregl.NavigationControl({ })

// export default function MapLibreGL_Map() {
  
//   // const [lat, setLat] = useState<number>(74.08);
//   // const [lng, setLng] = useState<number>(61.86);
//   const mapRef = useRef<MapRef| null>(null); 
//   // const fullscreenControlStyle= {
//   //   right: 10,
//   //   top: 10
//   // };
//   // const [viewport, setViewport] = React.useState({
//   //   longitude: -122.45,
//   //   latitude: 37.78,
//   //   zoom: 14
//   // });

//   const parkLayer: FillLayer = {
//     id: 'landuse_park',
//     type: 'fill',
//     source: 'mapbox',
//     'source-layer': 'landuse',
//     filter: ['==', 'class', 'park'],
//     paint: {
//       'fill-color': '#4E3FC8'
//     }
//   };

//   const onMapLoad = useCallback(() => {
//     console.log(fieldSource )
//     console.log(luSource )

//     if (mapRef) {
//       // const map = mapRef.current
//       // map?.addControl(nav);
//         // // map.addControl(new maplibregl.NavigationControl());
//     }

    
//   }, []);
//   return (

    
//   <Map
//       initialViewState={{
//         latitude: 66,
//         longitude: 66,
//         zoom: 3
//       }}
//       style={{width: 800, height: 600}}
//       mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
//     >
//     <Marker longitude={-122.4} latitude={37.8} color="red" />
    
//     {/* <Source {...fieldSource}   >
//       <Layer {...fieldLayer} />
//     </Source> */}
//     <Layer {...parkLayer} />
//     {console.log(parkLayer)}  
//   </Map>

//   //   <div id="map" className="h-full w-screen border-solid border-gray-600">
//   //     <Map
//   //       id="mymap"
//   //       initialViewState={initialValueLocation}
//   //       maplibreLogo
//   //       mapStyle={LIGHT_MAP_STYLE}
//   //       attributionControl={true}
//   //       onLoad={onMapLoad}
//   //       ref={mapRef}

//   //       style={{ width: "100vw", height: "100vh", left:0, position:"absolute" }}

//   //     >
//   //       <Marker longitude={61.86} latitude={74.08} color="red" />
//   //       <FullscreenControl style={fullscreenControlStyle} />

//   //       <Source {...fieldSource}   >
//   //           <Layer {...fieldLayer} />
//   //       </Source>  
//   //     </Map>    
//   // </div>
//   );
// }



//   // <div id="map" className="map mt-20 lg:w-auto lg:h-auto h-full w-screen">
//   {/* <Map
//       {...viewport} 
//       <FullscreenControl style={fullscreenControlStyle} />
//     </Map> */}
//         // style={{ width: '51vw', height: '80vh' }}
//         // mapLib={maplibregl}
//         // onMouseEnter={onMouseEnter}       
//         // mapStyle={DARK_MAP_STYLE}
//   // const maplib1:MapLib<MapInstance> = {}
//   // maplib1.AttributionControl = AttributionControl;
//   // maplib1.FullscreenControl = FullscreenControl;
//   // maplib1.GeolocateControl = GeolocateControl;
//   // maplib1.NavigationControl = NavigationControl;
//   // maplib1.ScaleControl = ScaleControl;
//   // const ac = new maplibregl.AttributionControl();
  
//   // const onMapLoad = useCallback(() => {  }, []);

// {/* 

//         <Source {...fieldSource}   >
//             <Layer {...fieldLayer} />
//         </Source>  

//         <Source {...luSource}   >
//             <Layer {...luLayer} />
//         </Source>  

//         <Source {...sta_Source}   >
//             <Layer {...sta_Layer} />
//         </Source>   */}

//       // // map?.addControl(legend, 'top-right');

//       // map?.on('mouseenter', 'points-file', function (e) {
//       //   map.getCanvas().style.cursor = 'pointer';
//       //   const features = e?.features
//       //   // console.log(`features.length : ${features?.length}`)
//       //   if(features && features?.length){
//       //     // popup.setLngLat(e.lngLat.wrap()).setHTML(`<h1>Файлов: ${features?.length}</h1>`).addTo(map.getMap());  
//       //   }
//       //   console.log(e)
//       // });

//       // // reset cursor to default when user is no longer hovering over a clickable feature
//       // map?.on('mouseleave', 'points-file', function (e) {
//       //   map.getCanvas().style.cursor = '';       
//       //   // popup.remove();
//       // })    
      

//       // map?.on('mousemove', function (e: MapMouseEvent) {
//       //   const ll = e.lngLat.wrap()        
//       //   setLng(  (prev) => parseFloat(ll.lng.toFixed(4)));
//       //   setLat(  (prev) => parseFloat(ll.lat.toFixed(4)));
//       //   // setZoom( (prev) => parseFloat(map.getZoom().toFixed(2)));
//       // });



// {/* <AttributionControl customAttribution="Map design by me" />
// <NavigationControl />
// <ScaleControl /> */}
//       // map?.on('click', 'points-file', function (e) {
//       //   const features = e?.features
//       //   if(features && features?.length){
//       //     popup_table_info.setLngLat(e.lngLat.wrap()).setHTML(`<h1>"Файлов": ${features?.length}</h1>`).addTo(map.getMap());
//       //     marker_table_info.setLngLat(e.lngLat.wrap()).addTo(map.getMap()); // add the marker to the map;
//       //     dataSource = []
//       //     features.map(
//       //       (feature)=>{
//       //         const newfile:IFile =  {
//       //           key: nanoid(5),
//       //           f_name: feature.properties.f_name,
//       //           f_size: size( feature.properties.f_size ),
//       //           f_ext: feature.properties.f_ext,
//       //           areaoil: feature.properties.areaoil,
//       //           well: feature.properties.well,
//       //           field:  feature.properties.field,
//       //           f_path:  feature.properties.f_path,
//       //         }
//       //         dataSource.push(newfile) 

//       //       }
//       //     );
//       //     setShowTable(true)

//       //   }
//       // });

//     //   class HelloWorldControl: IControl {
//     //     onAdd(map) {
//     //         this._map = map;
//     //         this._container = document.createElement('div');
//     //         this._container.className = 'maplibregl-ctrl';
//     //         this._container.textContent = 'Hello, world';
//     //         return this._container;
//     //     }
    
//     //     onRemove() {
//     //         this._container.parentNode.removeChild(this._container);
//     //         this._map = undefined;
//     //     }
//     // }
//       // console.log(map)
//       // const sw_control:MaplibreStyleSwitcherControl =  new MaplibreStyleSwitcherControl(basemaps_styles, basemaps_options)
//       // map?.addControl(sw_control, 'top-right');
