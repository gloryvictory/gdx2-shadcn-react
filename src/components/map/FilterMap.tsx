import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import maplibregl, { AddLayerObject, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { gdx2_cfg } from '@/config/cfg';
import 'maplibre-gl/dist/maplibre-gl.css';
import { layer_name_sta, layer_name_stl, layer_name_stp, sta_Layer, sta_Source, stl_Layer, stl_Source, stp_Layer, stp_Source } from './layers';
import { tableFeature } from './FeatureTablePopup';
import { useFilteredFeaturesStore } from '@/store/filterStore';
import { LayerProps } from '@vis.gl/react-maplibre';
import React from 'react';

const layer_sta = `${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`;
const layer_stl = `${gdx2_cfg.gdx2_map_db}.${layer_name_stl}`;
const layer_stp = `${gdx2_cfg.gdx2_map_db}.${layer_name_stp}`;

const sta_source_id: string = layer_sta;
const stl_source_id: string = layer_stl;
const stp_source_id: string = layer_stp;

interface FilterMapProps {
  selectFilter: string;
  selectList: string;
  onRefresh?: () => void;
  onMarkerSet?: () => void;
}

export interface FilterMapRef {
  refreshTables: () => void;
}

const FilterMap = forwardRef<FilterMapRef, FilterMapProps>(function FilterMap(
  { selectFilter, selectList, onMarkerSet },
  ref
) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { setFilteredFeatures, setStp, setStl, setSta } = useFilteredFeaturesStore();
  const isStyleLoaded = useRef(false);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isMapLoading, setIsMapLoading] = React.useState(true);

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
  });

  const mapMouseEnter = (e: MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined; } & Object) => {
    const mystyle: CSSStyleDeclaration = map.current?.getCanvas().style!;
    mystyle.cursor = 'pointer';
    const features = e?.features;
    if (features && features?.length) {
      popup.setLngLat(e.lngLat.wrap()).setHTML(tableFeature(features)).addTo(map?.current!);
    }
  };

  const mapMouseLeave = () => {
    const mystyle: CSSStyleDeclaration = map.current?.getCanvas().style!;
    mystyle.cursor = '';
    popup.remove();
  };

  const handleMapClick = (e: maplibregl.MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined; } & Object) => {
    if (!map.current) return;

    // Удаляем предыдущий маркер, если он есть
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Создаем новый маркер
    const marker = new maplibregl.Marker({
      color: "#FF0000",
      draggable: false
    })
      .setLngLat(e.lngLat)
      .addTo(map.current);

    markerRef.current = marker;

    // Сообщаем родителю, что маркер был поставлен
    if (typeof onMarkerSet === 'function') {
      onMarkerSet();
    }

    // Получаем все объекты под точкой клика
    const features = map.current.queryRenderedFeatures(e.point, {
      layers: [layer_sta, layer_stl, layer_stp]
    });

    // Разделяем объекты по слоям
    const staFeatures = features.filter(f => f.layer.id === layer_sta);
    const stlFeatures = features.filter(f => f.layer.id === layer_stl);
    const stpFeatures = features.filter(f => f.layer.id === layer_stp);

    // Преобразуем объекты в нужный формат
    const staData = staFeatures.map(f => ({
      id: f.id ?? f.properties?.id ?? Math.random(),
      properties: f.properties,
      geometry: f.geometry,
      source: 'sta',
    }));
    const stlData = stlFeatures.map(f => ({
      id: f.id ?? f.properties?.id ?? Math.random(),
      properties: f.properties,
      geometry: f.geometry,
      source: 'stl',
    }));
    const stpData = stpFeatures.map(f => ({
      id: f.id ?? f.properties?.id ?? Math.random(),
      properties: f.properties,
      geometry: f.geometry,
      source: 'stp',
    }));

    // Обновляем данные в сторе
    setSta(staData);
    setStl(stlData);
    setStp(stpData);
    setFilteredFeatures([...staData, ...stlData, ...stpData]);
  };

  // Инициализация карты
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [66, 66],
      zoom: 3
    });

    setIsMapLoading(true);

    map.current.on('load', () => {
      // Добавляем контролы
      map.current?.addControl(nav, 'bottom-right');

      // Добавляем источники и слои
      map.current?.addSource(sta_source_id, sta_Source);
      const sta_Layer1: LayerProps = sta_Layer!;
      map.current?.addLayer(sta_Layer1 as AddLayerObject);

      map.current?.addSource(stl_source_id, stl_Source);
      const stl_Layer1: LayerProps = stl_Layer!;
      map.current?.addLayer(stl_Layer1 as AddLayerObject);

      map.current?.addSource(stp_source_id, stp_Source);
      const stp_Layer1: LayerProps = stp_Layer!;
      map.current?.addLayer(stp_Layer1 as AddLayerObject);

      // Добавляем обработчики событий
    map.current?.on('mouseenter', layer_sta, mapMouseEnter);
    map.current?.on('mouseenter', layer_stl, mapMouseEnter);
    map.current?.on('mouseenter', layer_stp, mapMouseEnter);
    map.current?.on('mouseleave', layer_sta, mapMouseLeave);
    map.current?.on('mouseleave', layer_stl, mapMouseLeave);
    map.current?.on('mouseleave', layer_stp, mapMouseLeave);
      map.current?.on('click', handleMapClick);

      isStyleLoaded.current = true;
      setIsMapLoading(false);
    });

    return () => {
      if (map?.current) {
        map.current.remove();
        map.current = null;
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, []);

  // Обработка фильтров
  useEffect(() => {
    if (!map?.current || !isStyleLoaded.current) return;

    // Сбросить маркер при смене фильтра
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Если фильтр не выбран или значение явно пустое — сбросить store и выйти
    if (!selectFilter || selectList === '' || selectList === null || typeof selectList === 'undefined') {
      setSta([]);
      setStp([]);
      setStl([]);
      setFilteredFeatures([]);
      return;
    }

    // Очищаем все фильтры
    map.current.setFilter(layer_sta, null);
    map.current.setFilter(layer_stp, null);
    map.current.setFilter(layer_stl, null);

    if (selectFilter && selectList) {
      // Применяем новые фильтры
      const filterValue: maplibregl.FilterSpecification = ['==', ['get', selectFilter], selectList];
      map.current.setFilter(layer_sta, filterValue);
      map.current.setFilter(layer_stp, filterValue);
      map.current.setFilter(layer_stl, filterValue);

      // Обновляем данные после применения фильтров
      setTimeout(() => {
        const staFeatures = map.current?.queryRenderedFeatures({ layers: [layer_sta] }) || [];
        const stpFeatures = map.current?.queryRenderedFeatures({ layers: [layer_stp] }) || [];
        const stlFeatures = map.current?.queryRenderedFeatures({ layers: [layer_stl] }) || [];

        const staData = staFeatures.map(f => ({
          id: f.id ?? f.properties?.id ?? Math.random(),
          properties: f.properties,
          geometry: f.geometry,
          source: 'sta',
        }));
        const stpData = stpFeatures.map(f => ({
          id: f.id ?? f.properties?.id ?? Math.random(),
          properties: f.properties,
          geometry: f.geometry,
          source: 'stp',
        }));
        const stlData = stlFeatures.map(f => ({
          id: f.id ?? f.properties?.id ?? Math.random(),
          properties: f.properties,
          geometry: f.geometry,
          source: 'stl',
        }));

        setSta(staData);
        setStp(stpData);
        setStl(stlData);
        setFilteredFeatures([...staData, ...stpData, ...stlData]);
      }, 100);
    }
  }, [selectFilter, selectList]);

  const refreshTables = useCallback(() => {
    if (!map.current || !isStyleLoaded.current || !selectFilter || selectList === '' || selectList === null || typeof selectList === 'undefined') {
      setSta([]);
      setStp([]);
      setStl([]);
      setFilteredFeatures([]);
      return;
    }
    const staFeatures = map.current?.queryRenderedFeatures({ layers: [layer_sta] }) || [];
    const stpFeatures = map.current?.queryRenderedFeatures({ layers: [layer_stp] }) || [];
    const stlFeatures = map.current?.queryRenderedFeatures({ layers: [layer_stl] }) || [];

    const staData = staFeatures.map(f => ({
      id: f.id ?? f.properties?.id ?? Math.random(),
      properties: f.properties,
      geometry: f.geometry,
      source: 'sta',
    }));
    const stpData = stpFeatures.map(f => ({
      id: f.id ?? f.properties?.id ?? Math.random(),
      properties: f.properties,
      geometry: f.geometry,
      source: 'stp',
    }));
    const stlData = stlFeatures.map(f => ({
      id: f.id ?? f.properties?.id ?? Math.random(),
      properties: f.properties,
      geometry: f.geometry,
      source: 'stl',
    }));

    setSta(staData);
    setStp(stpData);
    setStl(stlData);
    setFilteredFeatures([...staData, ...stpData, ...stlData]);
  }, [map, isStyleLoaded, selectFilter, selectList, setSta, setStp, setStl, setFilteredFeatures]);

  useImperativeHandle(ref, () => ({
    refreshTables,
  }));

  return (
    <div style={{ width: "100%", height: "100%", left: 0, position: 'relative' }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      {(isMapLoading || loading) && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255,255,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      )}
    </div>
  );
});

export default FilterMap;
