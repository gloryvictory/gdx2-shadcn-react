import { useEffect, useRef } from 'react';
import maplibregl, { AddLayerObject, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { LayerProps } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { layer_name_sta, layer_name_stl, layer_name_stp, sta_Layer, sta_Source, stl_Layer, stl_Source, stp_Layer, stp_Source } from '../../layers';
import { gdx2_cfg } from '@/config/cfg';
import { useSearchParams } from 'react-router-dom';
import { tableFeature } from '../../tableFeature';

const layer_sta = `${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`;
const layer_stl = `${gdx2_cfg.gdx2_map_db}.${layer_name_stl}`;
const layer_stp = `${gdx2_cfg.gdx2_map_db}.${layer_name_stp}`;

let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const isPopupOpen = useRef<boolean>(false);

  let [searchParams] = useSearchParams();
  const sta_rgf_SearchParam = searchParams.get("stargf");
  const stl_rgf_SearchParam = searchParams.get("stlrgf");
  const stp_rgf_SearchParam = searchParams.get("stprgf");

  const sta_source_id: string = sta_Source?.id!;
  const stl_source_id: string = stl_Source?.id!;
  const stp_source_id: string = stp_Source?.id!;

  const mapClick = (e: MapMouseEvent) => {
    e.preventDefault(); // Prevent default behavior to avoid event conflicts
    console.log('Map clicked at:', e.lngLat);

    // Only create a new marker if no popup is open
    if (isPopupOpen.current) {
      console.log('Popup is open, skipping marker creation');
      return;
    }

    // Remove existing marker if it exists
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
      console.log('Removed existing marker');
    }

    // Create a new marker
    marker.current = new maplibregl.Marker({
      color: '#FF0000', // Red for visibility
      draggable: false,
    })
      .setLngLat(e.lngLat)
      .addTo(map.current!);
    console.log('Marker created at:', e.lngLat);

    // Create a new popup
    const popupContent = `
      <div>
        <h3>Clicked Location</h3>
        <p>Latitude: ${e.lngLat.lat.toFixed(4)}</p>
        <p>Longitude: ${e.lngLat.lng.toFixed(4)}</p>
      </div>
    `;
    const clickPopup = new maplibregl.Popup({
      closeButton: true,
      closeOnClick: false, // Only close via the close button
      closeOnMove: false, // Prevent closing on map movement
      offset: 15,
    })
      .setLngLat(e.lngLat)
      .setHTML(popupContent)
      .on('close', () => {
        isPopupOpen.current = false;
        if (marker.current) {
          marker.current.remove();
          marker.current = null;
          console.log('Popup closed, marker removed');
        }
      });

    // Attach popup to marker and open it
    marker.current.setPopup(clickPopup);
    marker.current.togglePopup(); // Explicitly open the popup
    isPopupOpen.current = true;
    console.log('Popup opened for marker at:', e.lngLat);
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [66, 66],
      zoom: 3,
    });

    map.current.on('data', () => {
      console.log(`${sta_source_id} loaded!!!`);
      if (sta_rgf_SearchParam) {
        const filteredFeatures = map.current?.querySourceFeatures(sta_source_id, {
          sourceLayer: layer_sta,
          filter: ['==', ['get', 'in_n_rosg'], sta_rgf_SearchParam],
        });
        if (filteredFeatures && filteredFeatures?.length > 0) {
          filteredFeatures.forEach(feature => {
            const geometry = feature.geometry;
            if (geometry.type === 'Point') {
              const [x, y] = geometry.coordinates as [number, number];
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
              geometry.coordinates.forEach(ring => {
                ring.forEach(coord => {
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
          });

          map?.current?.fitBounds(
            [
              [minX, minY],
              [maxX, maxY],
            ],
            {
              padding: 20,
              maxZoom: 15,
            }
          );
        }
      } else if (stl_rgf_SearchParam) {
        const filteredFeatures = map.current?.querySourceFeatures(stl_source_id, {
          sourceLayer: layer_stl,
          filter: ['==', ['get', 'in_n_rosg'], stl_rgf_SearchParam],
        });
        filteredFeatures?.forEach(feature => {
          const geometry = feature.geometry;
          if (geometry.type === 'LineString') {
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
              [minX, minY],
              [maxX, maxY],
            ],
            {
              padding: 20,
              maxZoom: 15,
            }
          );
        });
      } else if (stp_rgf_SearchParam) {
        const filteredFeatures = map.current?.querySourceFeatures(stp_source_id, {
          sourceLayer: layer_stp,
          filter: ['==', ['get', 'in_n_rosg'], stp_rgf_SearchParam],
        });
        filteredFeatures?.forEach(feature => {
          const geometry = feature.geometry;
          if (geometry.type === 'Point') {
            const [x, y] = geometry.coordinates as [number, number];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        });

        map?.current?.fitBounds(
          [
            [minX, minY],
            [maxX, maxY],
          ],
          {
            padding: 20,
            maxZoom: 10,
          }
        );
      }
    });

    map.current.on('load', () => {
      map.current?.addControl(
        new maplibregl.NavigationControl({
          visualizePitch: true,
          visualizeRoll: true,
          showZoom: true,
          showCompass: true,
        })
      );

      if (sta_rgf_SearchParam && map.current) {
        map.current?.addSource(sta_source_id, sta_Source);
        const sta_Layer1: LayerProps = sta_Layer!;
        map.current?.addLayer(sta_Layer1 as AddLayerObject);
        map.current?.setFilter(layer_sta, ['==', ['get', 'in_n_rosg'], sta_rgf_SearchParam]);
      } else if (stl_rgf_SearchParam && map.current) {
        map.current?.addSource(stl_source_id, stl_Source);
        const stl_Layer1: LayerProps = stl_Layer!;
        map.current?.addLayer(stl_Layer1 as AddLayerObject);
        map.current?.setFilter(layer_stl, ['==', ['get', 'in_n_rosg'], stl_rgf_SearchParam]);
      } else if (stp_rgf_SearchParam && map.current) {
        map.current?.addSource(stp_source_id, stp_Source);
        const stp_Layer1: LayerProps = stp_Layer!;
        map.current?.addLayer(stp_Layer1 as AddLayerObject);
        map.current?.setFilter(layer_stp, ['==', ['get', 'in_n_rosg'], stp_rgf_SearchParam]);
      }
    });

    map.current?.on('click', mapClick);

    return () => {
      if (map.current) {
        map.current.off('click', mapClick);

        if (marker.current) {
          marker.current.remove();
          marker.current = null;
        }
        isPopupOpen.current = false;

        map.current.remove();
        map.current = null;
      }
    };
  }, [sta_rgf_SearchParam, stl_rgf_SearchParam, stp_rgf_SearchParam]);

  return <div ref={mapContainer} style={{ width: "100vw", height: "100vh", left: 0, position: "absolute" }} />;
}
