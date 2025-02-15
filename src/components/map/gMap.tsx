// import React, { useRef, useState, useCallback } from 'react';
// import { nanoid } from 'nanoid'
// // import maplibregl, { AddLayerObject, LayerSpecification, MapOptions, NavigationOptions, VectorSourceSpecification } from 'maplibre-gl';
// // import Map, { Marker } from "react-map-gl/maplibre";
// import Map  from "react-map-gl/maplibre";
// import {Source, Layer, FullscreenControl, GeolocateControl, NavigationControl, ScaleControl, AttributionControl, MapLayerMouseEvent, MapMouseEvent, MapGeoJSONFeature} from 'react-map-gl';
// import maplibregl from 'maplibre-gl';
// import type {MapRef} from 'react-map-gl/maplibre';
// import MyButton from '../myButton/myButton';
// import {partial} from "filesize";

// import '@watergis/maplibre-gl-legend/dist/maplibre-gl-legend.css';
// import 'maplibre-gl/dist/maplibre-gl.css';
// import './gMap.css';

// import { MaplibreStyleSwitcherControl } from "maplibre-gl-style-switcher";


// // import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
// // import mapboxgl from "mapbox-gl";
// // import "mapbox-gl-style-switcher/styles.css";
// import "maplibre-gl-style-switcher/styles.css"

// import { Drawer, FloatButton, Table } from 'antd';
// import { CustomerServiceOutlined } from '@ant-design/icons';
// import ButtonTable from '../ButtonTable/ButtonTable';
// import Coords from '../Coords/Coords'

// import IFile from './types';
// import { LIGHT_MAP_STYLE, basemaps_options, basemaps_styles } from './basemaps';
// import { fileLayer, fileSource, fieldLayer, fieldSource, luLayer, luSource, lu_labels_Layer } from './layers';
// // import { fileLayer, fileSource } from './layers';
// import { legend } from './legend';


// let dataSource:IFile[] = []


// const columns = [
//   {
//     title: 'Имя файла',
//     dataIndex: 'f_name',
//     key: 'f_name',
//   },
//   {
//     title: 'Размер',
//     dataIndex: 'f_size',
//     key: 'f_size',
//   },
//   {
//     title: 'Расширение',
//     dataIndex: 'f_ext',
//     key: 'f_ext',
//   },
//   {
//     title: 'Площадь',
//     dataIndex: 'areaoil',
//     key: 'areaoil',
//   },
//   {
//     title: 'Скважина',
//     dataIndex: 'well',
//     key: 'well',
//   },
//   {
//     title: 'Месторождение',
//     dataIndex: 'field',
//     key: 'field',
//   },
//   {
//     title: 'Полный путь',
//     dataIndex: 'f_path',
//     key: 'f_path',  
//   },
// ];


// const initialValueLocation = {
//   latitude: 61.86,
//   longitude: 74.08,
//   zoom: 2,
//   bearing: 0,
//   pitch: 0
// };


// export default function GlobalMap() {
// //   useEffect(() => {
// // }, []);
//   // const [showPopup, setShowPopup] = useState<boolean>(true);
//   // const markerRef = useRef<maplibregl.Marker>();
//   // const mapRef = React.useRef<MapRef | null>(null)

//   const mapRef = useRef<MapRef| null>(null); 
//   const [showTable, setShowTable] = useState<boolean>(false);
//   const marker_table_info = new maplibregl.Marker()
//   const size = partial({standard: "jedec"});

//   const [lng, setLng] = useState<number>(61.86);
//   const [lat, setLat] = useState<number>(74.08);
//   const [zoom, setZoom] = useState<number>(2.0);

//   const onTableClose = () => {
//     setShowTable(false);
//   };

  
//   const popup = new maplibregl.Popup({
//     closeButton: true,
//     closeOnClick: false,
//     offset: 15
//   });

//   const popup_table_info = new maplibregl.Popup({
//     closeButton: true,
//     closeOnClick: false,
//     offset: 45
//   });


//   // const onMapLoad = useCallback(() => {  }, []);
//     const onMapLoad = useCallback(() => {
//     if (mapRef) {

//       const map = mapRef.current
//       // console.log(map)
//       map?.addControl(new MaplibreStyleSwitcherControl(basemaps_styles, basemaps_options));
//       map?.addControl(legend, 'top-right');

//       map?.on('mouseenter', 'points-file', function (e) {
//         map.getCanvas().style.cursor = 'pointer';
      
//       const features = e?.features
//       // console.log(`features.length : ${features?.length}`)
//       if(features && features?.length){
//         popup.setLngLat(e.lngLat.wrap()).setHTML(`<h1>Файлов: ${features?.length}</h1>`).addTo(map.getMap());  
//       }
//       console.log(e)
//         // do something
//       });

//       // reset cursor to default when user is no longer hovering over a clickable feature
//       map?.on('mouseleave', 'points-file', function (e) {
//         map.getCanvas().style.cursor = '';       
//         popup.remove();
//       })    
      

//       map?.on('mousemove', function (e: MapLayerMouseEvent) {
//         const ll = e.lngLat.wrap()        
//         setLng(  (prev) => parseFloat(ll.lng.toFixed(4)));
//         setLat(  (prev) => parseFloat(ll.lat.toFixed(4)));
//         setZoom( (prev) => parseFloat(map.getZoom().toFixed(2)));
//       });
      
        
//       map?.on('click', 'points-file', function (e) {
//         const features = e?.features
//         if(features && features?.length){
//           popup_table_info.setLngLat(e.lngLat.wrap()).setHTML(`<h1>"Файлов": ${features?.length}</h1>`).addTo(map.getMap());
//           marker_table_info.setLngLat(e.lngLat.wrap()).addTo(map.getMap()); // add the marker to the map;
//           dataSource = []
//           features.map(
//             (feature)=>{
//               const newfile:IFile =  {
//                 key: nanoid(5),
//                 f_name: feature.properties.f_name,
//                 f_size: size( feature.properties.f_size ),
//                 f_ext: feature.properties.f_ext,
//                 areaoil: feature.properties.areaoil,
//                 well: feature.properties.well,
//                 field:  feature.properties.field,
//                 f_path:  feature.properties.f_path,
//               }
//               dataSource.push(newfile) 

//             }
//           );
//           setShowTable(true)

//         }
//       });
//     }

    
//   }, []);


//   return (
  
//     <div id="map" className="map">
//       <Map
//         id="mymap"
//         initialViewState={initialValueLocation}
//         style={{ width: "100vw", height: "100vh" }}
//         mapLib={maplibregl}
//         mapStyle={LIGHT_MAP_STYLE}
//         attributionControl={false}
//         // ref={mapRef} 
//         onLoad={onMapLoad}
//         // onMouseEnter={onMouseEnter}
        
//         ref={mapRef}
//         // mapStyle={DARK_MAP_STYLE}
//       >
//         <Source {...fileSource}   >
//             <Layer {...fileLayer} />
//         </Source>  

//         <Source {...fieldSource}   >
//             <Layer {...fieldLayer} />
//         </Source>  

//         <Source {...luSource}   >
//             <Layer {...luLayer} />
//         </Source>  

//         {/* <Source {...luSource}   >
//             <Layer {...lu_labels_Layer} />
//         </Source>   */}
      
//         <FullscreenControl  position="top-right" style={{ marginRight: 10 }} />
//         <GeolocateControl   position="top-right" style={{ marginRight: 10 }}/>
//         <NavigationControl  position="top-right" style={{ marginRight: 10 }}/>
//         <ScaleControl />
//         <AttributionControl customAttribution="vzam" />
//         <Coords lng={lng} lat={lat} zoom={zoom}  /> 

//       </Map>    
      
//       <FloatButton.Group
//         open={true}
//         trigger="click"
//         style={{ right: 24 }}
//         icon={<CustomerServiceOutlined />}
//       >
//         <ButtonTable/>
//         <MyButton/>
//       </FloatButton.Group>

//           <Drawer
//             title="Информация"
//             placement={'bottom'}
//             closable={true}
//             onClose={onTableClose}
//             open={showTable}
//             size={'default'}
//             key={'bottom'}
//           >
//             <Table dataSource={dataSource} columns={columns} bordered pagination={{ pageSize: 50 }} scroll={{ y: 240 }} style={{ marginTop: 0 , top:0}}/>;

//           </Drawer>

//     {/* <div ref='map' className="map" /> */}
//   </div>
//   );
// }
