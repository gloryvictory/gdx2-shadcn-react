import * as React from 'react';
import { FullscreenControl, GeolocateControl, Layer, Map, MapRef, NavigationControl, ScaleControl, Source } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { layersConfig, layer_name_stp } from '../layers';
import { LIGHT_MAP_STYLE } from '../basemaps';
import maplibregl, { IControl, MapLayerMouseEvent, MapMouseEvent } from 'maplibre-gl';
import { IDataMap } from '@/types/models';
import { gdx2_cfg } from '@/config/cfg';
import TableDrawer from '../TableDrawer';
import '@watergis/maplibre-gl-legend/dist/maplibre-gl-legend.css';
import { legend } from '../legend';
import { debounce } from 'lodash';

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

const layerSTP = `${gdx2_cfg.gdx2_map_db}.${layer_name_stp}`;

const setupMapEvents = (
  map: MapRef,
  setDataSource: React.Dispatch<React.SetStateAction<IDataMap[]>>,
  setShowTable: React.Dispatch<React.SetStateAction<boolean>>,
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>,
  popup: maplibregl.Popup,
  popupTableInfo: maplibregl.Popup,
  markerTableInfo: maplibregl.Marker
) => {
  if (!map.getMap().isStyleLoaded()) {
    console.error('Map style not loaded');
    return () => {};
  }

  // console.log('Setting up events');
  // console.log('LayerSTP:', layerSTP);
  // console.log('STP source:', layersConfig.stp?.source);
  // console.log('STP layer:', layersConfig.stp?.layer);
  // console.log('gdx2_cfg:', gdx2_cfg);

  map.addControl(legend as unknown as IControl, 'top-right');

  const handleMouseEnter = (e: MapLayerMouseEvent) => {
    console.log('Mouse enter on', layerSTP, ':', e.features);
    map.getCanvas().style.cursor = 'pointer';
    const features = e.features;
    if (features?.length) {
      popup
        .setLngLat(e.lngLat.wrap())
        .setHTML(`<h3>Отчетов: ${features.length}</h3>`)
        .addTo(map.getMap());
    }
  };

  const handleMouseLeave = () => {
    console.log('Mouse leave on', layerSTP);
    map.getCanvas().style.cursor = '';
    popup.remove();
  };

  const handleClick = (e: MapLayerMouseEvent) => {
    console.log('Click on', layerSTP, ':', e.features);
    const features = e.features;
    if (features?.length) {
      const newDataSource: IDataMap[] = features.map((feature) => ({
        id: feature.properties.id,
        avts: feature.properties.avts,
        god_nach: feature.properties.god_nach,
        god_end: feature.properties.god_end,
        in_n_rosg: feature.properties.in_n_rosg,
        in_n_tgf: feature.properties.in_n_tgf,
        method: feature.properties.method,
        n_uk_rosg: feature.properties.n_uk_rosg,
        n_uk_tgf: feature.properties.n_uk_tgf,
        name_otch: feature.properties.name_otch,
        nom_1000: feature.properties.nom_1000,
        org_isp: feature.properties.org_isp,
        scale: feature.properties.scale,
        tgf: feature.properties.tgf,
        vid_iz: feature.properties.vid_iz,
        web_uk_id: feature.properties.web_uk_id,
      }));
      setDataSource(newDataSource);
      popupTableInfo
        .setLngLat(e.lngLat.wrap())
        .setHTML(`<h3>Отчетов: ${features.length}</h3>`)
        .addTo(map.getMap());
      markerTableInfo.setLngLat(e.lngLat.wrap()).addTo(map.getMap());
      setShowTable(true);
    }
  };

  const updateViewState = debounce((lng: number, lat: number, zoom: number) => {
    setViewState({ longitude: lng, latitude: lat, zoom });
  }, 200);

  const handleMouseMove = (e: MapMouseEvent) => {
    // console.log('mousemove:', e.lngLat);
    const lngLat = e.lngLat.wrap();
    updateViewState(
      parseFloat(lngLat.lng.toFixed(4)),
      parseFloat(lngLat.lat.toFixed(4)),
      parseFloat(map.getZoom().toFixed(2))
    );
  };

  const handleMapClick = (e: MapMouseEvent) => {
    console.log('Map clicked at:', e.lngLat);
  };

  const handleTestLayerClick = (e: MapLayerMouseEvent) => {
    console.log('Test layer clicked:', e.features);
  };

  const handleTestLayerMouseEnter = (e: MapLayerMouseEvent) => {
    console.log('Test layer mouseenter:', e.features);
  };

  const handleTestLayerMouseLeave = () => {
    console.log('Test layer mouseleave');
  };

  map.on('mousemove', handleMouseMove);
  map.on('click', handleMapClick);
  map.on('mouseenter', layerSTP, handleMouseEnter);
  map.on('mouseleave', layerSTP, handleMouseLeave);
  map.on('click', layerSTP, handleClick);
  map.on('click', 'test_layer', handleTestLayerClick);
  map.on('mouseenter', 'test_layer', handleTestLayerMouseEnter);
  map.on('mouseleave', 'test_layer', handleTestLayerMouseLeave);

  if (map.getLayer(layerSTP)) {
    map.moveLayer(layerSTP);
    console.log(`Moved ${layerSTP} to top`);
  } else {
    console.error(`Layer ${layerSTP} not found in map`);
  }

  // Проверка содержимого тайлов gdx2.stp
  if (layersConfig.stp?.source.tiles?.[0]) {
    const tileUrl = layersConfig.stp.source.tiles[0].replace('{z}/{x}/{y}', '0/0/0');
    fetch(tileUrl)
      .then((response) => {
        console.log('STP tiles response:', response.ok ? 'OK' : `Error ${response.status}`);
        if (response.ok) {
          return response.arrayBuffer();
        }
        throw new Error('Failed to fetch tile');
      })
      .then((arrayBuffer) => {
        console.log('STP tile data size:', arrayBuffer.byteLength, 'bytes');
        // Для проверки source-layer и геометрии требуется библиотека, например, @mapbox/vector-tile
        // Логируем размер как индикатор наличия данных
      })
      .catch((error) => console.error('Error fetching STP tiles:', error));
  }

  // Отладка: проверка объектов в слое gdx2.stp
  map.on('sourcedata', (e) => {
    if (e.sourceId === layerSTP && e.isSourceLoaded) {
      console.log('Source data loaded for', layerSTP);
      const features = map.querySourceFeatures(layerSTP, { sourceLayer: layersConfig.stp?.layer['source-layer'] });
      console.log('Features in gdx2.stp:', features);
    }
  });

  return () => {
    console.log('Cleaning up event listeners');
    map.off('mousemove', handleMouseMove);
    map.off('click', handleMapClick);
    map.off('mouseenter', layerSTP, handleMouseEnter);
    map.off('mouseleave', layerSTP, handleMouseLeave);
    map.off('click', layerSTP, handleClick);
    map.off('click', 'test_layer', handleTestLayerClick);
    map.off('mouseenter', 'test_layer', handleTestLayerMouseEnter);
    map.off('mouseleave', 'test_layer', handleTestLayerMouseLeave);
    map.off('sourcedata');
    if (map.getMap().hasControl(legend as unknown as IControl)) {
      map.removeControl(legend as unknown as IControl);
    }
    popup.remove();
    popupTableInfo.remove();
    markerTableInfo.remove();
  };
};

export default function Map3() {
  const mapRef = React.useRef<MapRef>(null);
  const [showTable, setShowTable] = React.useState<boolean>(false);
  const [dataSource, setDataSource] = React.useState<IDataMap[]>([]);
  const [viewState, setViewState] = React.useState<ViewState>({
    longitude: 66,
    latitude: 66,
    zoom: 3.5,
  });

  const popup = React.useMemo(
    () => new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 15 }),
    []
  );

  const popupTableInfo = React.useMemo(
    () => new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 45 }),
    []
  );

  const markerTableInfo = React.useMemo(() => new maplibregl.Marker(), []);

  React.useEffect(() => {
    console.log('Map3 mounted');
    if (mapRef.current) {
      console.log('Map ref set');
    }
    return () => console.log('Map3 unmounted');
  }, []);

  const handleMapLoad = React.useCallback(() => {
    console.log('Map component loaded');
    if (!mapRef.current) {
      console.error('Map ref not set on load');
      return;
    }
    console.log('Map style:', mapRef.current.getMap().getStyle());
    const cleanup = setupMapEvents(mapRef.current, setDataSource, setShowTable, setViewState, popup, popupTableInfo, markerTableInfo);
    return cleanup;
  }, [setDataSource, setShowTable, setViewState, popup, popupTableInfo, markerTableInfo]);

  const onTableClose = () => {
    setShowTable(false);
  };

  return (
    <>
      <Map
        initialViewState={{
          longitude: viewState.longitude,
          latitude: viewState.latitude,
          zoom: viewState.zoom,
          bearing: 0,
          pitch: 0,
        }}
        style={{ width: '100vw', height: '100vh', left: 0, position: 'absolute' }}
        mapStyle={LIGHT_MAP_STYLE}
        ref={mapRef}
        aria-label="Интерактивная географическая карта"
        onLoad={handleMapLoad}
        onError={(e) => console.error('Map component error:', e.error)}
      >
        {Object.values(layersConfig).map(({ source, layer }, index) => {
          console.log('Rendering layer:', layer.id);
          return (
            <Source key={index} id={layer.source as string} {...source}>
              <Layer {...layer} />
            </Source>
          );
        })}
        {/* <Source
          id="test-source"
          type="geojson"
          data={{
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [66, 66] },
                properties: { id: 1, name_otch: 'Test' },
              },
            ],
          }}
        >
          <Layer
            id="test_layer"
            type="circle"
            source="test-source"
            paint={{ 'circle-radius': 5, 'circle-color': 'red' }}
          />
        </Source> */}
        <FullscreenControl position="top-right" style={{ marginRight: 10 }} />
        <GeolocateControl position="top-right" style={{ marginRight: 10 }} />
        <NavigationControl position="top-right" style={{ marginRight: 10 }} />
        <ScaleControl position="bottom-right" style={{ marginRight: 10 }} />
      </Map>
      {showTable && (
        <TableDrawer
          open={showTable}
          dataSource={dataSource}
          onClose={onTableClose}
          showDrawer={() => setShowTable(true)}
        />
      )}
    </>
  );
}
