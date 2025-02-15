import { gdx2_cfg } from '@/config/cfg';
// import type {LayerProps, SourceProps} from 'react-map-gl';
import type {LayerProps, SourceProps} from '@vis.gl/react-maplibre';


// Месторождения
export const layer_name_field:string = 'field';
export const fieldSource: SourceProps = {
  id:`${gdx2_cfg.gdx2_map_db}.${layer_name_field}`,
  type:"vector",
  tiles:[`${gdx2_cfg.gdx2_map_url}${layer_name_field}/{z}/{x}/{y}.pbf`],   // tiles:[`http://r48-vws03.zsniigg.local:7800/gdx2.field/{z}/{x}/{y}.pbf`],
  minzoom: 0,
  maxzoom: 22,
}

export const fieldLayer: LayerProps = {
  id: `${gdx2_cfg.gdx2_map_db}.${layer_name_field}`,
  type: 'fill',
  source: `${gdx2_cfg.gdx2_map_db}.${layer_name_field}`,
  // filter: ['has', 'point_count'],
  "source-layer": `${gdx2_cfg.gdx2_map_db}.${layer_name_field}`,
  paint: {
    'fill-color': '#693502',
    'fill-opacity': 0.2   
  }
};

// Лицензионные участки
export const layer_name_lu:string = 'lu';

export const luSource: SourceProps = {
  id:`${gdx2_cfg.gdx2_map_db}.${layer_name_lu}`,
  type:"vector",
  // tiles:["http://r48-vws03.zsniigg.local:7800/gdx2.lu/{z}/{x}/{y}.pbf"],
  tiles:[`${gdx2_cfg.gdx2_map_url}lu/{z}/{x}/{y}.pbf`],
  minzoom: 0,
  maxzoom: 22,
}

export const luLayer: LayerProps = {
  id: `${gdx2_cfg.gdx2_map_db}.${layer_name_lu}`,
  type: 'fill',
  source: `${gdx2_cfg.gdx2_map_db}.${layer_name_lu}`,
  // filter: ['has', 'point_count'],
  "source-layer": `${gdx2_cfg.gdx2_map_db}.${layer_name_lu}`,
  paint: {
    'fill-color': '#0a0171',
    'fill-opacity': 0.2   
  }
};

export const lu_labels_Layer: LayerProps = {
  'id': 'lu-labels',
  'type': 'symbol',
  'source': `${gdx2_cfg.gdx2_map_db}.${layer_name_lu}`,
  'layout': {
      'text-field': ['get', 'name_rus'],
      'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
      'text-radial-offset': 0.5,
      'text-justify': 'auto',
      // 'icon-image': ['concat', ['get', 'icon'], '_15']
  }
}

// sta
export const layer_name_sta:string = 'sta';

export const sta_Source: SourceProps = {
  id:`${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`,
  type:"vector",
  tiles:[`${gdx2_cfg.gdx2_map_url}${layer_name_sta}/{z}/{x}/{y}.pbf`],   // tiles:["http://r48-vws03.zsniigg.local:7800/gdx2.lu/{z}/{x}/{y}.pbf"],
  minzoom: 0,
  maxzoom: 22,
}

export const sta_Layer: LayerProps = {
  id: `${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`,
  type: 'fill',
  source: `${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`,
  "source-layer": `${gdx2_cfg.gdx2_map_db}.${layer_name_sta}`,
  paint: {
    // 'fill-color': '#c2e75b',
    'fill-color': '#EFCDB8',
    "fill-outline-color": '#CD9575', 
    'fill-opacity': 0.6   
  }
};

// stl
export const layer_name_stl:string = 'stl';

export const stl_Source: SourceProps = {
  id:`${gdx2_cfg.gdx2_map_db}.${layer_name_stl}`,
  type:"vector",
  tiles:[`${gdx2_cfg.gdx2_map_url}${layer_name_stl}/{z}/{x}/{y}.pbf`],
  minzoom: 0,
  maxzoom: 22,
}

export const stl_Layer: LayerProps = {
  id: `${gdx2_cfg.gdx2_map_db}.${layer_name_stl}`,
  source: `${gdx2_cfg.gdx2_map_db}.${layer_name_stl}`,
  "source-layer": `${gdx2_cfg.gdx2_map_db}.${layer_name_stl}`,
  "type": "line",
  "paint": {"line-color": "#198EC8"}
};


// stp
export const layer_name_stp:string = 'stp';
export const stp_Source: SourceProps = {
  id:`${gdx2_cfg.gdx2_map_db}.${layer_name_stp}`,
  type:"vector",
  tiles:[`${gdx2_cfg.gdx2_map_url}${layer_name_stp}/{z}/{x}/{y}.pbf`],
  minzoom: 0,
  maxzoom: 22,
}

export const stp_Layer: LayerProps = {
  id: `${gdx2_cfg.gdx2_map_db}.${layer_name_stp}`,
  source: `${gdx2_cfg.gdx2_map_db}.${layer_name_stp}`,
  "source-layer": `${gdx2_cfg.gdx2_map_db}.${layer_name_stp}`,
  "type": "circle",
  paint: {
    'circle-color': 'blue',
    'circle-radius': 4
  }
};

// console.log(`${gdx2_cfg.gdx2_map_url}${layer_name}/{z}/{x}/{y}.pbf`)
// надо доделать линейный слой
// console.log(`${gdx2_cfg.gdx2_map_url}sta/{z}/{x}/{y}.pbf`)
// console.log(`${gdx2_cfg.gdx2_map_url}lu/{z}/{x}/{y}.pbf`)

